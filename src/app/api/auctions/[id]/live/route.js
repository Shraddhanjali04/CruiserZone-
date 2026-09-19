import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { settleEndedAuctions } from "@/lib/bidEngine";
export const dynamic = "force-dynamic";
export async function GET(_req, { params }) {
    const { id } = await params;
    await settleEndedAuctions();
    const auction = await prisma.auction.findUnique({
        where: { id },
        include: {
            bids: {
                orderBy: { amount: "desc" },
                take: 10,
                include: { user: { select: { id: true, name: true } } },
            },
            winner: { select: { name: true } },
            car: true,
        },
    });
    if (!auction) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const top = auction.bids[0] ?? null;
    const won = auction.status === "ENDED" && !!auction.winnerId;
    const bidCount = await prisma.bid.count({ where: { auctionId: id } });
    return NextResponse.json({
        id: auction.id,
        status: auction.status,
        currentPrice: auction.currentPrice,
        bidCount,
        endsAt: auction.endsAt.toISOString(),
        reserveMet: top ? top.amount >= auction.reservePrice : false,
        topBid: top
            ? { amount: top.amount, bidder: top.user.name, bidderId: top.user.id, at: top.createdAt }
            : null,
        winner: won ? auction.winner?.name ?? null : null,
        soldPrice: auction.soldPrice,
        bids: auction.bids.map((b) => ({
            amount: b.amount,
            bidder: b.user.name,
            bidderId: b.user.id,
            at: b.createdAt,
        })),
        carSlug: auction.car.slug,
    });
}
