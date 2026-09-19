import { prisma } from "@/lib/db";
import { readJsonArray } from "@/lib/utils";
const auctionWithCar = {
    include: {
        car: true,
    },
};
export async function getLiveAuctions(opts = {}) {
    const { make, fuel, bodyType, transmission, maxPrice, city, q, sort } = opts;
    const now = new Date();
    const where = {
        status: "LIVE",
        endsAt: { gt: now },
        ...(make ? { car: { make } } : {}),
        ...(fuel ? { car: { AND: [{ fuel }] } } : {}),
        ...(bodyType ? { car: { AND: [{ bodyType }] } } : {}),
        ...(transmission ? { car: { AND: [{ transmission }] } } : {}),
        ...(city ? { car: { AND: [{ city }] } } : {}),
        ...(maxPrice ? { currentPrice: { lte: Number(maxPrice) } } : {}),
        ...(q
            ? {
                car: {
                    OR: [
                        { title: { contains: q } },
                        { make: { contains: q } },
                        { model: { contains: q } },
                    ],
                },
            }
            : {}),
    };
    let orderBy = { endsAt: "asc" };
    if (sort === "price_asc")
        orderBy = { currentPrice: "asc" };
    if (sort === "price_desc")
        orderBy = { currentPrice: "desc" };
    if (sort === "newest")
        orderBy = { createdAt: "desc" };
    return prisma.auction.findMany({
        where: where,
        include: auctionWithCar.include,
        orderBy,
        take: opts.take ?? 100,
    });
}
export async function getFeaturedAuctions(take = 4) {
    const now = new Date();
    return prisma.auction.findMany({
        where: { status: "LIVE", endsAt: { gt: now }, car: { featured: true } },
        include: auctionWithCar.include,
        orderBy: { endsAt: "asc" },
        take,
    });
}
export function getAuctionBySlug(slug) {
    return prisma.car.findUnique({
        where: { slug },
        include: {
            auctions: {
                orderBy: { createdAt: "desc" },
                include: {
                    bids: {
                        orderBy: { amount: "desc" },
                        take: 12,
                        include: { user: { select: { id: true, name: true } } },
                    },
                    winner: { select: { id: true, name: true } },
                },
            },
        },
    });
}
export async function getEndedAuctions() {
    return prisma.auction.findMany({
        where: { status: "ENDED", published: true },
        include: {
            car: true,
            winner: { select: { name: true } },
            bids: { orderBy: { amount: "desc" }, take: 1 },
        },
        orderBy: { endedAt: "desc" },
        take: 50,
    });
}
export async function getLatestBids(auctionId, take = 12) {
    return prisma.bid.findMany({
        where: { auctionId },
        orderBy: { createdAt: "desc" },
        take,
        include: { user: { select: { id: true, name: true } } },
    });
}
export function userImages(car) {
    return readJsonArray(car.images);
}
// ---- Dashboard helpers ----
export async function getUserBids(userId) {
    return prisma.bid.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 60,
        include: {
            auction: {
                include: {
                    car: true,
                    bids: { orderBy: { amount: "desc" }, take: 1 },
                },
            },
        },
    });
}
export async function getUserWatchlist(userId) {
    return prisma.watchlist.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: { car: { include: { auctions: { orderBy: { createdAt: "desc" }, take: 1 } } } },
    });
}
export async function getActiveBids(userId) {
    const now = new Date();
    const bids = await prisma.bid.findMany({
        where: { userId, auction: { status: "LIVE", endsAt: { gt: now } } },
        orderBy: { createdAt: "desc" },
        include: {
            auction: {
                include: {
                    car: true,
                    bids: { orderBy: { amount: "desc" }, take: 1 },
                },
            },
        },
    });
    // Keep only the user's highest bid per auction
    const byAuction = new Map();
    for (const b of bids) {
        const existing = byAuction.get(b.auctionId);
        if (!existing || b.amount > existing.amount)
            byAuction.set(b.auctionId, b);
    }
    return [...byAuction.values()];
}
export async function getUserTransactions(userId) {
    return prisma.transaction.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 50,
    });
}
export async function getDepositBalance(userId) {
    const rows = await prisma.transaction.findMany({
        where: { userId, status: { in: ["SUCCESS", "REFUNDED"] } },
        select: { type: true, status: true, amount: true },
    });
    const crudeDeposit = Math.max(0, rows.filter((r) => r.status === "SUCCESS" && r.type === "DEPOSIT").reduce((a, r) => a + r.amount, 0) -
        rows.filter((r) => r.status === "SUCCESS" && r.type === "REFUND").reduce((a, r) => a + r.amount, 0));
    return crudeDeposit;
}
export async function getWatchCount(carId) {
    return prisma.watchlist.count({ where: { carId } });
}
// ---- Admin helpers ----
export async function getAdminStats() {
    const [cars, live, ended, bids, users, revenue] = await Promise.all([
        prisma.car.count(),
        prisma.auction.count({ where: { status: "LIVE" } }),
        prisma.auction.count({ where: { status: "ENDED" } }),
        prisma.bid.count(),
        prisma.user.count(),
        prisma.auction.aggregate({
            _sum: { soldPrice: true },
            where: { status: "ENDED", soldPrice: { not: null } },
        }),
    ]);
    return { cars, live, ended, bids, users, revenue: revenue._sum.soldPrice ?? 0 };
}
export function getAdminCars() {
    return prisma.car.findMany({
        orderBy: { createdAt: "desc" },
        include: { auctions: { orderBy: { createdAt: "desc" }, take: 1 } },
    });
}
export function getAdminAuctions() {
    return prisma.auction.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            car: true,
            _count: { select: { bids: true } },
            winner: { select: { name: true } },
        },
    });
}
export function getBidders() {
    return prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            _count: { select: { bids: true, transactions: true } },
        },
    });
}
export function getAdminTransactions() {
    return prisma.transaction.findMany({
        orderBy: { createdAt: "desc" },
        take: 200,
        include: { user: { select: { name: true, email: true } } },
    });
}
