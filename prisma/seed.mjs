import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || "file:./dev.db",
});

const CAR_META = [
  { img: "cz-001", make: "Hyundai", model: "Creta", variant: "1.5 SX IVT", year: 2021, fuel: "PETROL", trans: "CVT", body: "SUV", km: 27850, own: 1, colour: "White", city: "Mumbai", base: 985000, featured: true },
  { img: "cz-002", make: "Maruti Suzuki", model: "Swift", variant: "ZXi AMT", year: 2022, fuel: "PETROL", trans: "AMT", body: "HATCHBACK", km: 18400, own: 1, colour: "Yellow", city: "Delhi NCR", base: 525000, featured: false },
  { img: "cz-003", make: "Toyota", model: "Fortuner", variant: "Legender 4x4 AT", year: 2020, fuel: "DIESEL", trans: "AUTOMATIC", body: "SUV", km: 45200, own: 1, colour: "White", city: "Bengaluru", base: 2670000, featured: true },
  { img: "cz-004", make: "Honda", model: "City", variant: "ZX CVT", year: 2021, fuel: "PETROL", trans: "CVT", body: "SEDAN", km: 31200, own: 2, colour: "Meteoroid Grey", city: "Pune", base: 780000, featured: false },
  { img: "cz-005", make: "Mahindra", model: "Thar", variant: "LX Hard Top 4x4", year: 2022, fuel: "DIESEL", trans: "MANUAL", body: "SUV", km: 15600, own: 1, colour: "Deep Forest", city: "Jaipur", base: 1120000, featured: false },
  { img: "cz-006", make: "Kia", model: "Seltos", variant: "HTX 1.5 DCT", year: 2021, fuel: "PETROL", trans: "DCT", body: "SUV", km: 39800, own: 1, colour: "Intense Red", city: "Hyderabad", base: 890000, featured: false },
  { img: "cz-007", make: "Tata", model: "Nexon", variant: "XZ+ S Dark", year: 2023, fuel: "PETROL", trans: "AMT", body: "SUV", km: 9800, own: 1, colour: "Black", city: "Chandigarh", base: 820000, featured: false },
  { img: "cz-008", make: "Skoda", model: "Slavia", variant: "Style 1.5 TSI", year: 2022, fuel: "PETROL", trans: "MANUAL", body: "SEDAN", km: 22100, own: 1, colour: "Carbon Steel", city: "Mumbai", base: 940000, featured: false },
  { img: "cz-009", make: "Maruti Suzuki", model: "Ertiga", variant: "ZXi", year: 2021, fuel: "PETROL", trans: "MANUAL", body: "MUV", km: 41500, own: 1, colour: "Pearl White", city: "Chennai", base: 640000, featured: false },
  { img: "cz-010", make: "Volkswagen", model: "Taigun", variant: "GT Line 1.5 TSI", year: 2022, fuel: "PETROL", trans: "DCT", body: "SUV", km: 26200, own: 1, colour: "Wild Cherry Red", city: "Bengaluru", base: 960000, featured: false },
  { img: "cz-011", make: "MG", model: "Hector", variant: "Sharp Pro CVT", year: 2021, fuel: "PETROL", trans: "CVT", body: "SUV", km: 33400, own: 1, colour: "Sterling Grey", city: "Delhi NCR", base: 1020000, featured: false },
  { img: "cz-012", make: "Renault", model: "Kwid", variant: "Climber AMT", year: 2022, fuel: "PETROL", trans: "AMT", body: "HATCHBACK", km: 14500, own: 2, colour: "Lightning Yellow", city: "Kolkata", base: 385000, featured: false },
];

const BUYERS = [
  { name: "Aryan Mehta", email: "buyer@demo.com", phone: "+919812345601", city: "Mumbai" },
  { name: "Neha Sharma", email: "neha@demo.com", phone: "+919812345602", city: "Delhi NCR" },
  { name: "Rahul Verma", email: "rahul@demo.com", phone: "+919812345603", city: "Bengaluru" },
  { name: "Priya Nair", email: "priya@demo.com", phone: "+919812345604", city: "Chennai" },
  { name: "Vikram Singh", email: "vikram@demo.com", phone: "+919812345605", city: "Jaipur" },
];

async function main() {
  console.log("Clearing existing data...");
  await prisma.notification.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.bid.deleteMany();
  await prisma.watchlist.deleteMany();
  await prisma.auction.deleteMany();
  await prisma.car.deleteMany();
  await prisma.user.deleteMany();

  console.log("Seeding users...");
  const admin = await prisma.user.create({
    data: {
      name: "CruiserZone Admin",
      email: "admin@cruiserzone.in",
      phone: "+919000000001",
      passwordHash: await bcrypt.hash("Admin@123", 10),
      role: "ADMIN",
      kycStatus: "APPROVED",
    },
  });

  const buyers = [];
  for (let i = 0; i < BUYERS.length; i++) {
    const b = BUYERS[i];
    const user = await prisma.user.create({
      data: {
        name: b.name,
        email: b.email,
        phone: b.phone,
        city: b.city,
        passwordHash: await bcrypt.hash("Demo@1234", 10),
        role: "BUYER",
        kycStatus: i === 2 ? "SUBMITTED" : "APPROVED",
        kycType: "PAN",
        kycNumber: `ABCDE${String(1000 + i)}F`,
        kycSubmittedAt: new Date(),
      },
    });
    buyers.push(user);
  }

  console.log("Seeding cars + auctions...");
  const now = Date.now();
  const day = 86400000;
  const hour = 3600000;

  for (let i = 0; i < CAR_META.length; i++) {
    const c = CAR_META[i];
    const isEnded = i === 8 || i === 9 || i === 10;
    const isScheduled = i === 11;

    const slug = `${c.year}-${c.make}-${c.model}-${c.variant}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const car = await prisma.car.create({
      data: {
        title: `${c.year} ${c.make} ${c.model} ${c.variant}`,
        slug,
        make: c.make,
        model: c.model,
        variant: c.variant,
        year: c.year,
        fuel: c.fuel,
        transmission: c.trans,
        bodyType: c.body,
        kmDriven: c.km,
        ownership: c.own,
        colour: c.colour,
        rto: c.city.split(" ")[0],
        city: c.city,
        registrationNumber: `MH-01-${c.img.split("-")[1]}${c.year}`,
        vin: `CZ${c.year}${String(i + 1).padStart(4, "0")}`,
        insuranceValidTill: new Date(now + 300 * day),
        lastServiceKm: c.km,
        engineCc: c.body === "SUV" ? 1497 : 1197,
        seats: c.body === "MUV" ? 7 : 5,
        description: `${c.make} ${c.model} ${c.variant} - single detailed description`,
        inspectionScore: 82 + (i % 4) * 4,
        certified: true,
        featured: c.featured,
        source: i % 3 === 0 ? "CONSIGNED" : "CRUISERZONE",
        status: isEnded ? "SOLD" : "LIVE",
        images: JSON.stringify([`/cars/${c.img}.svg`, `/cars/${c.img}.svg`]),
        conditionKeys: JSON.stringify([
          "Engine & transmission — no warning lights",
          "Exterior panel gaps & paint checked",
          "All electronics & infotainment working",
          "Suspension, brakes & tyres assessed",
          "Interior wear within normal limits",
          "No accident or flood damage",
          "Documentation & RC verified",
        ]),
      },
    });

    const startBid = Math.round(c.base * 0.94 / 5000) * 5000;
    const reserve = Math.round(c.base * 1.02 / 5000) * 5000;
    const increment = c.base > 2000000 ? 20000 : 10000;

    let startsAt;
    let endsAt;
    if (isEnded) {
      startsAt = new Date(now - 3 * day);
      endsAt = new Date(now - (1 * day + i * hour));
    } else if (isScheduled) {
      startsAt = new Date(now + 2 * day);
      endsAt = new Date(now + 4 * day);
    } else {
      startsAt = new Date(now - (2 + i % 3) * hour);
      // stagger endings: a few ending very soon (to demo countdown urgency)
      const spread = [1, 3, 8, 26, 40, 52, 70, 96][i] ?? 120;
      endsAt = new Date(now + spread * hour);
    }

    const currentPrice = isEnded ? Math.round(reserve * (1 + 0.04 * (i % 3)) / 1000) * 1000 : startBid;

    const auction = await prisma.auction.create({
      data: {
        carId: car.id,
        startBid,
        reservePrice: reserve,
        increment,
        currentPrice,
        startsAt,
        endsAt,
        status: isEnded ? "ENDED" : isScheduled ? "SCHEDULED" : "LIVE",
        published: isEnded,
        createdBy: admin.id,
        currentPrice,
      },
    });

    // Bids
    if (!isScheduled) {
      const bidder = buyers[(i + 1) % buyers.length];
      const bidder2 = buyers[(i + 2) % buyers.length];
      const first = Math.round((startBid + increment) / 1000) * 1000;
      let second = Math.round((first + increment) / 1000) * 1000;
      if (second > currentPrice) second = currentPrice;

      await prisma.bid.createMany({
        data: [
          {
            auctionId: auction.id,
            userId: bidder.id,
            amount: first,
            createdAt: new Date(now - 2 * hour),
          },
          {
            auctionId: auction.id,
            userId: bidder2.id,
            amount: second,
            createdAt: new Date(now - 1 * hour),
          },
        ],
      });

      if (isEnded) {
        const winner = bidder2;
        const winningBid = await prisma.bid.findFirst({
          where: { auctionId: auction.id, amount: second },
        });
        await prisma.auction.update({
          where: { id: auction.id },
          data: {
            winnerId: winner.id,
            soldPrice: second,
            winningBidId: winningBid?.id,
            endedAt: endsAt,
            currentPrice: second,
          },
        });
        await prisma.car.update({ where: { id: car.id }, data: { status: "SOLD" } });
      }
    }

    if (i === 3) {
      await prisma.watchlist.create({
        data: { userId: buyers[0].id, carId: car.id },
      });
    }
  }

  // Deposits for buyers (needed to bid)
  for (const b of buyers.slice(0, 3)) {
    await prisma.transaction.create({
      data: {
        userId: b.id,
        type: "DEPOSIT",
        amount: 10000,
        status: "SUCCESS",
        gateway: "MANUAL",
        gatewayRef: `TXN-DEMO-${b.id.slice(-4)}`,
        note: "Refundable bidding token",
        paidAt: new Date(now - 5 * day),
      },
    });
  }

  // Sample notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: buyers[0].id,
        type: "SYSTEM",
        title: "Welcome to CruiserZone Bids",
        message: "You're ready to bid. Complete your KYC for a faster checkout.",
        link: "/dashboard/profile",
      },
      {
        userId: buyers[1].id,
        type: "OUTBID",
        title: "You've been outbid",
        message: "Your bid on the Kia Seltos was outbid. Place a new bid to stay in the race.",
        link: "/cars/cz-006",
      },
    ],
  });

  console.log("Seed complete.");
  console.log("  Admin logins : admin@cruiserzone.in / Admin@123");
  console.log("  Buyer login  : buyer@demo.com / Demo@1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });