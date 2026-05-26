import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { config } from "dotenv";
import { resolve } from "path";

// Load .env from project root (tsx doesn't auto-load it)
config({ path: resolve(process.cwd(), ".env") });

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ── 1. Admin user ──────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@pavulum.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@pavulum.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log(`✅ Admin: ${admin.email}`);

  // ── 2. One live book ───────────────────────────────────────────────────
  const book = await prisma.product.upsert({
    where: { slug: "the-pause" },
    update: {},
    create: {
      slug: "the-pause",
      title: "The Pause",
      author: "Jane",
      type: "BOOK",
      category: "books",
      price: 24.99,
      description: "A guide to intentional living for parents and partners.",
      longDescription:
        "The Pause is a short, honest book about slowing down. It began as a series of late-night journal entries and grew into a practical guide for anyone who wants to live with more intention — as a parent, a partner, or simply a human being who is tired of rushing.",
      digital: true,
      comingSoon: false,
      thumbnail:
        "https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&w=800&q=80",
      images: [
        "https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&w=800&q=80",
      ],
      fileUrl: null, // replace with real Cloudinary PDF URL after upload
    },
  });
  console.log(`✅ Book: ${book.title}`);

  // ── 3. Two digital courses (coming soon) ──────────────────────────────
  const course1 = await prisma.product.upsert({
    where: { slug: "parenting-with-intention-course" },
    update: {},
    create: {
      slug: "parenting-with-intention-course",
      title: "Parenting with Intention",
      author: "Jane",
      type: "COURSE",
      category: "courses",
      price: 97.0,
      description: "A self-paced course on conscious, connected parenting.",
      longDescription:
        "This 6-week digital course walks you through the core principles of intentional parenting — from repairing after conflict to building rituals that actually stick. Includes video lessons, worksheets, and a private community.",
      digital: true,
      comingSoon: true,
      thumbnail:
        "https://images.unsplash.com/photo-1516321318423-f06f70504504?auto=format&fit=crop&w=800&q=80",
      images: [
        "https://images.unsplash.com/photo-1516321318423-f06f70504504?auto=format&fit=crop&w=800&q=80",
      ],
      courseData: {
        chapters: [
          { title: "Introduction", videoUrl: "", duration: "10 min" },
          { title: "The Pause Practice", videoUrl: "", duration: "25 min" },
          { title: "Repair & Reconnect", videoUrl: "", duration: "30 min" },
        ],
      },
    },
  });
  console.log(`✅ Course: ${course1.title} (coming soon)`);

  const course2 = await prisma.product.upsert({
    where: { slug: "the-relationship-reset" },
    update: {},
    create: {
      slug: "the-relationship-reset",
      title: "The Relationship Reset",
      author: "Jane",
      type: "COURSE",
      category: "courses",
      price: 127.0,
      description: "Rebuild connection and communication with your partner.",
      longDescription:
        "The Relationship Reset is a 4-week digital course for couples who want to stop having the same argument and start having the real conversation. Includes guided exercises, audio reflections, and a shared workbook.",
      digital: true,
      comingSoon: true,
      thumbnail:
        "https://images.unsplash.com/photo-1455849318169-8c8e4f1a629b?auto=format&fit=crop&w=800&q=80",
      images: [
        "https://images.unsplash.com/photo-1455849318169-8c8e4f1a629b?auto=format&fit=crop&w=800&q=80",
      ],
      courseData: {
        chapters: [
          { title: "Why We Fight", videoUrl: "", duration: "20 min" },
          { title: "The Reset Method", videoUrl: "", duration: "35 min" },
          { title: "Building New Patterns", videoUrl: "", duration: "40 min" },
        ],
      },
    },
  });
  console.log(`✅ Course: ${course2.title} (coming soon)`);

  // ── 4. Podcast episodes ────────────────────────────────────────────────
  const episodesData = [
    { slug: "parenting-without-perfection", title: "Parenting without perfection", description: "A conversation about showing up messy, apologizing, and starting over.", duration: "42 min", order: 3 },
    { slug: "the-conversations-we-avoid", title: "The conversations we avoid", description: "Why the hardest sentences are usually the ones worth saying.", duration: "38 min", order: 2 },
    { slug: "rest-as-resistance", title: "Rest as resistance", description: "An interview with a sleep researcher and a tired mother of three.", duration: "51 min", order: 1 },
  ];
  for (const ep of episodesData) {
    await prisma.episode.upsert({ where: { slug: ep.slug }, update: {}, create: { ...ep, published: true } });
  }
  console.log(`✅ ${episodesData.length} podcast episodes`);

  // ── 5. Journal essays ──────────────────────────────────────────────────
  const essaysData = [
    { slug: "why-we-stop-listening", title: "Why we stop listening (and how to start)", readTime: "5 min read", excerpt: "Somewhere between the ages of seven and seventeen, most of us stop listening. Here is how to find your way back.", order: 3 },
    { slug: "letter-to-my-younger-self", title: "A letter to my younger self", readTime: "4 min read", excerpt: "What I'd say to her, if she'd stop long enough to hear me.", order: 2 },
    { slug: "the-art-of-doing-nothing", title: "The art of doing nothing", readTime: "6 min read", excerpt: "On idleness, and why it might be the most productive thing you do this week.", order: 1 },
  ];
  for (const essay of essaysData) {
    await prisma.essay.upsert({ where: { slug: essay.slug }, update: {}, create: { ...essay, published: true } });
  }
  console.log(`✅ ${essaysData.length} journal essays`);

  console.log("\n🎉 Seed complete!");
  console.log("   Admin: admin@pavulum.com / admin123");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
