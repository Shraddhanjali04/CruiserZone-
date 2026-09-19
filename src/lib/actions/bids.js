"use server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { settleEndedAuctions, withAntisnipe, nextIncrement, isRoundAmount, } from "@/lib/bidEngine";
export async function placeBid(auctionId, amount) {
    await settleEndedAuctions();
    const session = await getSession();
    if (!session) {
        return { error: "You must be signed in to bid. Please log in first." };
    }
    const hasDeposit = await prisma.transaction.findFirst({
        where: {
            userId: session.id,
            type: "DEPOSIT",
            status: "SUCCESS",
        },
    });
    if (!hasDeposit) {
        return {
            error: "Please pay the ₹10,000 refundable bidding token before placing a bid.",
        };
    }
    const auction = await prisma.auction.findUnique({
        where: { id: auctionId },
        include: {
            bids: { orderBy: { amount: "desc" }, take: 2, select: { userId: true, amount: true } },
        },
    });
    if (!auction)
        return { error: "Auction not found." };
    if (auction.status !== "LIVE")
        return { error: "This auction is no longer live." };
    if (new Date(auction.endsAt).getTime() <= Date.now()) {
        return { error: "This auction has ended." };
    }
    if (auction.createdBy === session.id) {
        return { error: "You cannot bid on your own auction listing." };
    }
    const minBid = auction.bids.length === 0
        ? auction.startBid
        : nextIncrement(auction.bids[0].amount, auction.increment);
    if (!isRoundAmount(amount, auction.increment)) {
        return { error: `Your bid must be a multiple of ₹${auction.increment.toLocaleString("en-IN")}.` };
    }
    if (amount < minBid) {
        return {
            error: `Minimum bid is ₹${minBid.toLocaleString("en-IN")} (current + one increment).`,
        };
    }
    const previousTop = auction.bids[0];
    if (previousTop?.userId === session.id) {
        return { error: "You are already the highest bidder." };
    }
    await prisma.bid.create({
        data: {
            auctionId,
            userId: session.id,
            amount,
            isAuto: false,
        },
    });
    await prisma.auction.update({
        where: { id: auctionId },
        data: { currentPrice: amount },
    });
    if (previousTop && previousTop.userId !== session.id) {
        await prisma.notification.create({
            data: {
                userId: previousTop.userId,
                type: "OUTBID",
                title: "You've been outbid",
                message: `Your bid was outbid. The new highest bid is ₹${amount.toLocaleString("en-IN")}.`,
                link: `/cars/${auctionId}`,
            },
        });
    }
    const { endsAt, extended } = await withAntisnipe({ id: auctionId, endsAt: auction.endsAt });
    return {
        ok: true,
        newPrice: amount,
        endsAt: endsAt.toISOString(),
        extended,
    };
}
export async function toggleWatchlist(carId) {
    const session = await getSession();
    if (!session)
        return { ok: false, watching: false };
    const existing = await prisma.watchlist.findUnique({
        where: { userId_carId: { userId: session.id, carId } },
    });
    if (existing) {
        await prisma.watchlist.delete({
            where: { userId_carId: { userId: session.id, carId } },
        });
        return { ok: true, watching: false };
    }
    await prisma.watchlist.create({
        data: { userId: session.id, carId },
    });
    return { ok: true, watching: true };
}
