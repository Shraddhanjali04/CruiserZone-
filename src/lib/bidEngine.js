import { prisma } from "@/lib/db";
const ANTISNIPE_WINDOW_MS = 60_000;
const EXTEND_MS = 2 * 60_000;
export async function settleEndedAuctions() {
    const now = new Date();
    const overdue = await prisma.auction.findMany({
        where: { status: "LIVE", endsAt: { lte: now } },
        include: { bids: { orderBy: { amount: "desc" }, take: 1 } },
    });
    for (const auction of overdue) {
        const top = auction.bids[0];
        const sold = top && top.amount >= auction.reservePrice;
        await prisma.auction.update({
            where: { id: auction.id },
            data: {
                status: "ENDED",
                endedAt: now,
                published: true,
                currentPrice: top?.amount ?? auction.currentPrice,
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
                    message: `Congratulations on winning the ${auction.id} auction at ₹${top.amount.toLocaleString("en-IN")}.`,
                    link: "/dashboard/bids",
                },
            });
        }
    }
}
export async function withAntisnipe(auction) {
    const remaining = auction.endsAt.getTime() - Date.now();
    if (remaining > 0 && remaining <= ANTISNIPE_WINDOW_MS) {
        const endsAt = new Date(auction.endsAt.getTime() + EXTEND_MS);
        await prisma.auction.update({
            where: { id: auction.id },
            data: { endsAt },
        });
        return { endsAt, extended: true };
    }
    return { endsAt: auction.endsAt, extended: false };
}
export function nextIncrement(current, increment) {
    const base = current + increment;
    return Math.ceil(base / increment) * increment;
}
export function isRoundAmount(amount, increment) {
    return amount % increment === 0;
}
