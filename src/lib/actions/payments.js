"use server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { DEPOSIT_AMOUNT } from "@/lib/constants";
// Demo stand-in for a payment gateway (e.g. Razorpay).
// Swap this with a real gateway session creation + webhook verification in production.
export async function payDepositDemo() {
    const session = await getSession();
    if (!session)
        return { error: "Not signed in" };
    const existing = await prisma.transaction.findFirst({
        where: { userId: session.id, type: "DEPOSIT", status: "SUCCESS" },
    });
    if (existing)
        return { ok: true };
    await prisma.transaction.create({
        data: {
            userId: session.id,
            type: "DEPOSIT",
            amount: DEPOSIT_AMOUNT,
            status: "SUCCESS",
            gateway: "MANUAL",
            gatewayRef: `TXN-DEMO-${Date.now()}`,
            note: "Refundable bidding token (demo payment)",
            paidAt: new Date(),
        },
    });
    await prisma.notification.create({
        data: {
            userId: session.id,
            type: "PAYMENT",
            title: "Bidding token paid",
            message: `Your refundable ₹${DEPOSIT_AMOUNT.toLocaleString("en-IN")} token is active. You can now bid.`,
            link: "/dashboard/wallet",
        },
    });
    return { ok: true };
}
export async function requestRefund() {
    const session = await getSession();
    if (!session)
        return { error: "Not signed in" };
    const deposits = await prisma.transaction.findMany({
        where: { userId: session.id, type: "DEPOSIT", status: "SUCCESS" },
    });
    const activeBids = await prisma.bid.count({
        where: {
            userId: session.id,
            auction: { status: "LIVE", endsAt: { gt: new Date() } },
        },
    });
    if (deposits.length === 0)
        return { error: "No refundable token found." };
    if (activeBids > 0) {
        return {
            error: "You have active bids. Your token refunds only when your auctions end.",
        };
    }
    for (const d of deposits) {
        await prisma.transaction.create({
            data: {
                userId: session.id,
                type: "REFUND",
                amount: d.amount,
                status: "SUCCESS",
                gateway: "MANUAL",
                gatewayRef: `REF-DEMO-${Date.now()}`,
                note: "Token refunded",
                paidAt: new Date(),
            },
        });
        await prisma.transaction.update({
            where: { id: d.id },
            data: { status: "REFUNDED" },
        });
    }
    redirect("/dashboard/wallet");
}
export async function completeWinningPayment(auctionId) {
    const session = await getSession();
    if (!session)
        return { error: "Not signed in" };
    const auction = await prisma.auction.findFirst({
        where: { id: auctionId, status: "ENDED", winnerId: session.id },
    });
    if (!auction || !auction.soldPrice) {
        return { error: "No winning auction found." };
    }
    const paid = await prisma.transaction.create({
        data: {
            userId: session.id,
            type: "WINNING_PAYMENT",
            amount: auction.soldPrice,
            status: "SUCCESS",
            gateway: "MANUAL",
            gatewayRef: `WIN-DEMO-${Date.now()}`,
            note: "Full payment for won auction (demo)",
            paidAt: new Date(),
        },
    });
    redirect(`/dashboard/bids?paid=${paid.id}`);
}
