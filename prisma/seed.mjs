import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || "file:./dev.db",
});

// Real Unsplash car photos mapped to car types
const CAR_META = [
  // --- LIVE auctions (index 0-14) ---
  { img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&h=500&fit=crop&q=80", make: "Hyundai", model: "Creta", variant: "1.5 SX IVT", year: 2021, fuel: "PETROL", trans: "CVT", body: "SUV", km: 27850, own: 1, colour: "White", city: "Mumbai", base: 985000, featured: true },
  { img: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&h=500&fit=crop&q=80", make: "Maruti Suzuki", model: "Swift", variant: "ZXi AMT", year: 2022, fuel: "PETROL", trans: "AMT", body: "HATCHBACK", km: 18400, own: 1, colour: "Yellow", city: "Delhi NCR", base: 525000, featured: false },
  { img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=500&fit=crop&q=80", make: "Toyota", model: "Fortuner", variant: "Legender 4x4 AT", year: 2020, fuel: "DIESEL", trans: "AUTOMATIC", body: "SUV", km: 45200, own: 1, colour: "White", city: "Bengaluru", base: 2670000, featured: true },
  { img: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=500&fit=crop&q=80", make: "Honda", model: "City", variant: "ZX CVT", year: 2021, fuel: "PETROL", trans: "CVT", body: "SEDAN", km: 31200, own: 2, colour: "Meteoroid Grey", city: "Pune", base: 780000, featured: false },
  { img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=500&fit=crop&q=80&auto=format", make: "Mahindra", model: "Thar", variant: "LX Hard Top 4x4", year: 2022, fuel: "DIESEL", trans: "MANUAL", body: "SUV", km: 15600, own: 1, colour: "Deep Forest", city: "Jaipur", base: 1120000, featured: true },
  { img: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=500&fit=crop&q=80", make: "Kia", model: "Seltos", variant: "HTX 1.5 DCT", year: 2021, fuel: "PETROL", trans: "DCT", body: "SUV", km: 39800, own: 1, colour: "Intense Red", city: "Hyderabad", base: 890000, featured: false },
  { img: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=500&fit=crop&q=80", make: "Tata", model: "Nexon", variant: "XZ+ S Dark", year: 2023, fuel: "PETROL", trans: "AMT", body: "SUV", km: 9800, own: 1, colour: "Black", city: "Chandigarh", base: 820000, featured: false },
  { img: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=500&fit=crop&q=80", make: "Skoda", model: "Slavia", variant: "Style 1.5 TSI", year: 2022, fuel: "PETROL", trans: "MANUAL", body: "SEDAN", km: 22100, own: 1, colour: "Carbon Steel", city: "Mumbai", base: 940000, featured: false },
  { img: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=500&fit=crop&q=80", make: "Volkswagen", model: "Taigun", variant: "GT Line 1.5 TSI", year: 2022, fuel: "PETROL", trans: "DCT", body: "SUV", km: 26200, own: 1, colour: "Wild Cherry Red", city: "Bengaluru", base: 960000, featured: false },
  { img: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&h=500&fit=crop&q=80", make: "MG", model: "Hector", variant: "Sharp Pro CVT", year: 2021, fuel: "PETROL", trans: "CVT", body: "SUV", km: 33400, own: 1, colour: "Sterling Grey", city: "Delhi NCR", base: 1020000, featured: false },
  { img: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=500&fit=crop&q=80&auto=format", make: "Hyundai", model: "Verna", variant: "1.5 SX IVT", year: 2023, fuel: "PETROL", trans: "CVT", body: "SEDAN", km: 12400, own: 1, colour: "Titan Grey", city: "Mumbai", base: 1050000, featured: true },
  { img: "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&h=500&fit=crop&q=80", make: "Toyota", model: "Innova Crysta", variant: "VX 2.4 AT", year: 2021, fuel: "DIESEL", trans: "AUTOMATIC", body: "MUV", km: 52000, own: 1, colour: "Super White", city: "Chennai", base: 1650000, featured: false },
  { img: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=500&fit=crop&q=80", make: "BMW", model: "3 Series", variant: "320d M Sport", year: 2020, fuel: "DIESEL", trans: "AUTOMATIC", body: "SEDAN", km: 38000, own: 1, colour: "Alpine White", city: "Mumbai", base: 2850000, featured: true },
  { img: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=500&fit=crop&q=80", make: "Tata", model: "Harrier", variant: "XZA+ Dark", year: 2022, fuel: "DIESEL", trans: "AUTOMATIC", body: "SUV", km: 21000, own: 1, colour: "Dark Edition", city: "Pune", base: 1480000, featured: false },
  { img: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&h=500&fit=crop&q=80", make: "Mercedes-Benz", model: "A-Class", variant: "A200d", year: 2021, fuel: "DIESEL", trans: "DCT", body: "SEDAN", km: 29000, own: 1, colour: "Cosmos Black", city: "Bengaluru", base: 2550000, featured: false },

  // --- ENDED auctions (index 15-17) ---
  { img: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&h=500&fit=crop&q=80", make: "Maruti Suzuki", model: "Ertiga", variant: "ZXi", year: 2021, fuel: "PETROL", trans: "MANUAL", body: "MUV", km: 41500, own: 1, colour: "Pearl White", city: "Chennai", base: 640000, featured: false },
  { img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&h=500&fit=crop&q=80", make: "Renault", model: "Kwid", variant: "Climber AMT", year: 2022, fuel: "PETROL", trans: "AMT", body: "HATCHBACK", km: 14500, own: 2, colour: "Lightning Yellow", city: "Kolkata", base: 385000, featured: false },
  { img: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=500&fit=crop&q=80", make: "Hyundai", model: "i20", variant: "Asta 1.0 Turbo DCT", year: 2022, fuel: "PETROL", trans: "DCT", body: "HATCHBACK", km: 19800, own: 1, colour: "Starry Night", city: "Hyderabad", base: 720000, featured: false },

  // --- SCHEDULED auctions (index 18-19) ---
  { img: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800&h=500&fit=crop&q=80", make: "Kia", model: "Sonet", variant: "HTX+ 1.0 iMT", year: 2023, fuel: "PETROL", trans: "IMT", body: "SUV", km: 8200, own: 1, colour: "Aurora Black Pearl", city: "Ahmedabad", base: 870000, featured: false },
  { img: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=500&fit=crop&q=80", make: "Mahindra", model: "XUV700", variant: "AX7 L Diesel AT", year: 2023, fuel: "DIESEL", trans: "AUTOMATIC", body: "SUV", km: 11000, own: 1, colour: "Dazzling Silver", city: "Delhi NCR", base: 1850000, featured: false },
];

const BUYERS = [
  { name: "Aryan Mehta", email: "buyer@demo.com", phone: "+919812345601", city: "Mumbai" },
  { name: "Neha Sharma", email: "neha@demo.com", phone: "+919812345602", city: "Delhi NCR" },
  { name: "Rahul Verma", email: "rahul@demo.com", phone: "+919812345603", city: "Bengaluru" },
  { name: "Priya Nair", email: "priya@demo.com", phone: "+919812345604", city: "Chennai" },
  { name: "Vikram Singh", email: "vikram@demo.com", phone: "+919812345605", city: "Jaipur" },
  { name: "Anita Desai", email: "anita@demo.com", phone: "+919812345606", city: "Pune" },
  { name: "Rohit Kapoor", email: "rohit@demo.com", phone: "+919812345607", city: "Hyderabad" },
  { name: "Sanya Malhotra", email: "sanya@demo.com", phone: "+919812345608", city: "Kolkata" },
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
    const isEnded = i >= 15 && i <= 17;
    const isScheduled = i >= 18;

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
        registrationNumber: `HR-14-${String(1000 + i)}`,
        vin: `CZ${c.year}${String(i + 1).padStart(4, "0")}`,
        insuranceValidTill: new Date(now + 300 * day),
        lastServiceKm: c.km,
        engineCc: c.body === "SUV" ? 1497 : c.body === "MUV" ? 2393 : 1197,
        seats: c.body === "MUV" ? 7 : 5,
        description: `Certified ${c.year} ${c.make} ${c.model} ${c.variant} in ${c.colour}. ${c.km.toLocaleString("en-IN")} km driven, ${c.own === 1 ? "single" : c.own + "nd"} owner, ${c.city}. Full 220-point inspection passed. Insurance valid. RC transfer included.`,
        inspectionScore: 82 + (i % 5) * 3,
        certified: true,
        featured: c.featured,
        source: i % 3 === 0 ? "CONSIGNED" : "CRUISERZONE",
        status: isEnded ? "SOLD" : "LIVE",
        images: JSON.stringify([c.img, c.img]),
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
    const increment = c.base > 2000000 ? 20000 : c.base > 1000000 ? 15000 : 10000;

    let startsAt;
    let endsAt;
    if (isEnded) {
      startsAt = new Date(now - 3 * day);
      endsAt = new Date(now - (1 * day + i * hour));
    } else if (isScheduled) {
      startsAt = new Date(now + 2 * day);
      endsAt = new Date(now + 4 * day);
    } else {
      startsAt = new Date(now - (2 + i % 4) * hour);
      // stagger endings so some end soon (urgency) and some later
      const spreadHours = [1, 2, 5, 8, 12, 20, 28, 36, 48, 60, 72, 84, 96, 108, 120][i] ?? 120;
      endsAt = new Date(now + spreadHours * hour);
    }

    // For live auctions, simulate a few bids have already pushed the price up
    const bidIncrement = isEnded ? 0 : Math.floor(Math.random() * 6 + 2);
    const currentPrice = isEnded
      ? Math.round(reserve * (1 + 0.04 * (i % 3)) / 1000) * 1000
      : startBid + increment * bidIncrement;

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
      },
    });

    // Create realistic bids
    if (!isScheduled) {
      const numBids = isEnded ? 6 : Math.floor(Math.random() * 5 + 2);
      let price = startBid;
      const bidData = [];

      for (let b = 0; b < numBids; b++) {
        price += increment;
        if (price > currentPrice) price = currentPrice;
        const bidder = buyers[(i + b) % buyers.length];
        bidData.push({
          auctionId: auction.id,
          userId: bidder.id,
          amount: price,
          createdAt: new Date(now - (numBids - b) * hour * 0.5),
        });
      }

      await prisma.bid.createMany({ data: bidData });

      if (isEnded) {
        const winner = buyers[(i + numBids - 1) % buyers.length];
        const winningBid = await prisma.bid.findFirst({
          where: { auctionId: auction.id },
          orderBy: { amount: "desc" },
        });
        await prisma.auction.update({
          where: { id: auction.id },
          data: {
            winnerId: winner.id,
            soldPrice: currentPrice,
            winningBidId: winningBid?.id,
            endedAt: endsAt,
            currentPrice,
          },
        });
        await prisma.car.update({ where: { id: car.id }, data: { status: "SOLD" } });
      }
    }

    // Watchlists
    if (i % 4 === 0) {
      await prisma.watchlist.create({
        data: { userId: buyers[i % buyers.length].id, carId: car.id },
      });
    }
  }

  // Deposits for all buyers
  for (const b of buyers) {
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

  // Notifications
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
        link: "/cars/2021-kia-seltos-htx-1-5-dct",
      },
      {
        userId: buyers[2].id,
        type: "AUCTION_ENDING",
        title: "Auction ending soon!",
        message: "The 2021 Hyundai Creta auction ends in less than 1 hour.",
        link: "/cars/2021-hyundai-creta-1-5-sx-ivt",
      },
    ],
  });

  console.log("Seed complete!");
  console.log(`  ${CAR_META.length} cars seeded (15 live, 3 ended, 2 scheduled)`);
  console.log("  Admin login : admin@cruiserzone.in / Admin@123");
  console.log("  Buyer login : buyer@demo.com / Demo@1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });