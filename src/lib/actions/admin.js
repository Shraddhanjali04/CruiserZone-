"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { settleEndedAuctions } from "@/lib/bidEngine";
function slugify(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}
async function adminOnly() {
    const session = await getSession();
    return !!session && session.role === "ADMIN";
}
export async function createCarWithAuction(_prev, formData) {
    if (!(await adminOnly()))
        return { error: "Admin only." };
    const title = String(formData.get("title") ?? "").trim();
    const make = String(formData.get("make") ?? "").trim();
    const model = String(formData.get("model") ?? "").trim();
    const year = Number(formData.get("year"));
    const kmDriven = Number(formData.get("kmDriven"));
    if (!title || !make || !model || !year || !kmDriven) {
        return { error: "Fill in required fields: title, make, model, year, km." };
    }
    let slug = slugify(title);
    const clash = await prisma.car.findUnique({ where: { slug } });
    if (clash)
        slug = `${slug}-${year}`;
    const startBid = Math.max(5000, Number(formData.get("startBid")) || 0);
    const reservePrice = Math.max(0, Number(formData.get("reservePrice")) || 0);
    const increment = Math.max(1000, Number(formData.get("increment")) || 10000);
    const durationHours = Math.max(1, Number(formData.get("durationHours")) || 24);
    const startsAt = formData.get("startsAt")
        ? new Date(String(formData.get("startsAt")))
        : new Date();
    const car = await prisma.car.create({
        data: {
            title,
            slug,
            make,
            model,
            variant: String(formData.get("variant") ?? "") || null,
            year,
            fuel: String(formData.get("fuel") ?? "PETROL"),
            transmission: String(formData.get("transmission") ?? "MANUAL"),
            bodyType: String(formData.get("bodyType") ?? "HATCHBACK"),
            kmDriven,
            ownership: Number(formData.get("ownership")) || 1,
            colour: String(formData.get("colour") ?? "") || "—",
            rto: String(formData.get("rto") ?? "") || null,
            city: String(formData.get("city") ?? "") || null,
            registrationNumber: String(formData.get("registrationNumber") ?? "") || null,
            vin: String(formData.get("vin") ?? "") || null,
            engineCc: Number(formData.get("engineCc")) || null,
            seats: Number(formData.get("seats")) || 5,
            inspectionScore: Number(formData.get("inspectionScore")) || 0,
            certified: formData.get("certified") === "on",
            featured: formData.get("featured") === "on",
            status: "LIVE",
            images: JSON.stringify([String(formData.get("image") ?? "/cars/cz-001.svg")]),
        },
    });
    await prisma.auction.create({
        data: {
            carId: car.id,
            startBid,
            reservePrice,
            increment,
            currentPrice: startBid,
            startsAt,
            endsAt: new Date(startsAt.getTime() + durationHours * 3600 * 1000),
            status: "LIVE",
            createdBy: (await getSession())?.id ?? null,
        },
    });
    revalidatePath("/admin");
    revalidatePath("/listings");
    return { ok: true };
}
export async function toggleFeatured(carId, featured) {
    if (!(await adminOnly()))
        return { error: "Admin only." };
    await prisma.car.update({ where: { id: carId }, data: { featured } });
    revalidatePath("/");
    revalidatePath("/admin/cars");
    return { ok: true };
}
export async function updateAuctionControl(auctionId, action) {
    if (!(await adminOnly()))
        return { error: "Admin only." };
    if (action === "END") {
        await settleEndedAuctions();
        const auction = await prisma.auction.findUnique({
            where: { id: auctionId },
            include: { bids: { orderBy: { amount: "desc" }, take: 1 } },
        });
        if (!auction || auction.bids.length === 0) {
            return { error: "No bids to settle — cancel instead." };
        }
        const top = auction.bids[0];
        const sold = top.amount >= auction.reservePrice;
        await prisma.auction.update({
            where: { id: auctionId },
            data: {
                status: "ENDED",
                endedAt: new Date(),
                endsAt: new Date(),
                published: true,
                currentPrice: top.amount,
                winnerId: sold ? top.userId : null,
                winningBidId: sold ? top.id : null,
                soldPrice: sold ? top.amount : null,
            },
        });
        await prisma.car.update({
            where: { id: auction.carId },
            data: { status: sold ? "SOLD" : "UNSOLD" },
        });
        if (sold) {
            await prisma.notification.create({
                data: {
                    userId: top.userId,
                    type: "AUCTION_WON",
                    title: "You won the auction! 🎉",
                    message: "Your winning bid was confirmed by CruiserZone.",
                    link: "/dashboard/bids",
                },
            });
        }
    }
    else if (action === "CANCEL") {
        await prisma.auction.update({
            where: { id: auctionId },
            data: { status: "CANCELLED" },
        });
        await prisma.car.update({
            where: { id: (await prisma.auction.findUnique({ where: { id: auctionId } })).carId },
            data: { status: "UNSOLD" },
        });
    }
    else if (action === "START") {
        const now = new Date();
        await prisma.auction.update({
            where: { id: auctionId },
            data: { status: "LIVE", startsAt: now },
        });
        const a = await prisma.auction.findUnique({ where: { id: auctionId } });
        await prisma.car.update({ where: { id: a.carId }, data: { status: "LIVE" } });
    }
    revalidatePath("/admin");
    revalidatePath("/admin/auctions");
    return { ok: true };
}
export async function approveKyc(userId, approve) {
    if (!(await adminOnly()))
        return { error: "Admin only." };
    await prisma.user.update({
        where: { id: userId },
        data: { kycStatus: approve ? "APPROVED" : "REJECTED" },
    });
    await prisma.notification.create({
        data: {
            userId,
            type: "KYC",
            title: approve ? "KYC approved" : "KYC rejected",
            message: approve
                ? "Your identity is verified. You're all set to bid."
                : "Your KYC was rejected. Please resubmit valid documents.",
            link: "/dashboard/profile",
        },
    });
    revalidatePath("/admin/bidders");
    return { ok: true };
}
export async function markRefunded(txnId) {
    if (!(await adminOnly()))
        return { error: "Admin only." };
    await prisma.transaction.update({
        where: { id: txnId },
        data: { status: "REFUNDED" },
    });
    revalidatePath("/admin/payments");
    return { ok: true };
}
