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

  // ── 2. The Chop Game — Paperback ($18.99) ─────────────────────────────
  const chopPaperback = await prisma.product.upsert({
    where: { slug: "the-chop-game-paperback" },
    update: {
      title: "The Chop Game: When Love Is a Game, Nobody Wins",
      author: "Pav King",
      price: 18.99,
      description:
        "A thought-provoking exploration of modern relationships, dating culture, communication, accountability, and the challenges facing love in today's world.",
      longDescription:
        "The Chop Game is a bold, honest, and sometimes uncomfortable look at why so many modern relationships fail before they even begin. It explores the games people play, the walls they build, and the habits they develop that quietly sabotage love. This book doesn't offer easy answers — it asks better questions. If you've ever wondered why relationships feel so hard, this is the book that will make you stop and think.",
      comingSoon: false,
      digital: false,
    },
    create: {
      slug: "the-chop-game-paperback",
      title: "The Chop Game: When Love Is a Game, Nobody Wins",
      author: "Pav King",
      type: "BOOK",
      category: "books",
      price: 18.99,
      description:
        "A thought-provoking exploration of modern relationships, dating culture, communication, accountability, and the challenges facing love in today's world.",
      longDescription:
        "The Chop Game is a bold, honest, and sometimes uncomfortable look at why so many modern relationships fail before they even begin. It explores the games people play, the walls they build, and the habits they develop that quietly sabotage love. This book doesn't offer easy answers — it asks better questions. If you've ever wondered why relationships feel so hard, this is the book that will make you stop and think.",
      digital: false,
      comingSoon: false,
      thumbnail:
        "https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&w=800&q=80",
      images: [
        "https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&w=800&q=80",
      ],
    },
  });
  console.log(`✅ Book: ${chopPaperback.title} (Paperback $${chopPaperback.price})`);

  // ── 3. The Chop Game — Signed Author Copy ($29.99) ───────────────────
  const chopSigned = await prisma.product.upsert({
    where: { slug: "the-chop-game-signed" },
    update: {
      title: "The Chop Game — Signed Author Copy",
      author: "Pav King",
      price: 29.99,
      description:
        "A personally signed paperback copy of The Chop Game by Pav King. Limited quantities available.",
      longDescription:
        "This is a signed copy of The Chop Game: When Love Is a Game, Nobody Wins, signed directly by the author Pav King. Each copy is signed by hand. A great gift for someone who needs to read this — or for yourself, if you already know you do.",
      comingSoon: false,
      digital: false,
    },
    create: {
      slug: "the-chop-game-signed",
      title: "The Chop Game — Signed Author Copy",
      author: "Pav King",
      type: "BOOK",
      category: "books",
      price: 29.99,
      description:
        "A personally signed paperback copy of The Chop Game by Pav King. Limited quantities available.",
      longDescription:
        "This is a signed copy of The Chop Game: When Love Is a Game, Nobody Wins, signed directly by the author Pav King. Each copy is signed by hand. A great gift for someone who needs to read this — or for yourself, if you already know you do.",
      digital: false,
      comingSoon: false,
      thumbnail:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80",
      images: [
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80",
      ],
    },
  });
  console.log(`✅ Book: ${chopSigned.title} (Signed $${chopSigned.price})`);

  // ── 4. Coming Soon Book — The Man After the Man ───────────────────────
  const manAfterMan = await prisma.product.upsert({
    where: { slug: "the-man-after-the-man" },
    update: {
      title: "The Man After the Man",
      description:
        "A reflective look at identity, responsibility, growth, healing, and the journey of becoming the person you were meant to be.",
      comingSoon: true,
    },
    create: {
      slug: "the-man-after-the-man",
      title: "The Man After the Man",
      author: "Pav King",
      type: "BOOK",
      category: "books",
      price: 0,
      description:
        "A reflective look at identity, responsibility, growth, healing, and the journey of becoming the person you were meant to be.",
      longDescription:
        "A reflective look at identity, responsibility, growth, healing, and the journey of becoming the person you were meant to be.",
      digital: false,
      comingSoon: true,
      thumbnail: null,
      images: [],
    },
  });
  console.log(`✅ Book (coming soon): ${manAfterMan.title}`);

  // ── 5. Coming Soon Book — Wash Yo As* ────────────────────────────────
  const washYo = await prisma.product.upsert({
    where: { slug: "wash-yo-as" },
    update: {
      title: "Wash Yo As*",
      description:
        "A humorous and practical guide to self-respect, hygiene, accountability, and the everyday habits that influence how we present ourselves to the world.",
      comingSoon: true,
    },
    create: {
      slug: "wash-yo-as",
      title: "Wash Yo As*",
      author: "Pav King",
      type: "BOOK",
      category: "books",
      price: 0,
      description:
        "A humorous and practical guide to self-respect, hygiene, accountability, and the everyday habits that influence how we present ourselves to the world.",
      longDescription:
        "A humorous and practical guide to self-respect, hygiene, accountability, and the everyday habits that influence how we present ourselves to the world.",
      digital: false,
      comingSoon: true,
      thumbnail: null,
      images: [],
    },
  });
  console.log(`✅ Book (coming soon): ${washYo.title}`);

  // ── 6. Coming Soon Course — Chop Game Generator ──────────────────────
  const chopCourse = await prisma.product.upsert({
    where: { slug: "chop-game-generator" },
    update: {
      title: "Chop Game Generator: New Age Parenting in a New Age",
      description:
        "A forward-thinking parenting course designed to help future parents navigate the realities of raising children in a rapidly changing world.",
      comingSoon: true,
    },
    create: {
      slug: "chop-game-generator",
      title: "Chop Game Generator: New Age Parenting in a New Age",
      author: "Pav King",
      type: "COURSE",
      category: "courses",
      price: 0,
      description:
        "A forward-thinking parenting course designed to help future parents navigate the realities of raising children in a rapidly changing world.",
      longDescription:
        "Today's parents face challenges that previous generations never imagined. Social media, artificial intelligence, digital addiction, online influence, changing family structures, virtual relationships, and emerging technologies are reshaping childhood and redefining what it means to be a parent.\n\nThis course encourages parents to think intentionally before conception, during parenthood, and throughout the developmental journey of their children. It explores communication, responsibility, emotional intelligence, family planning, technology, social pressures, and the long-term consequences of parenting decisions.\n\nThe goal is simple: prepare parents not only for the children of today, but for the world their children will inherit tomorrow.",
      digital: true,
      comingSoon: true,
      thumbnail: null,
      images: [],
    },
  });
  console.log(`✅ Course (coming soon): ${chopCourse.title}`);

  // ── 7. Podcast episodes ────────────────────────────────────────────────
  const episodesData = [
    { slug: "parenting-without-perfection", title: "Parenting without perfection", description: "A conversation about showing up messy, apologizing, and starting over.", duration: "42 min", order: 3 },
    { slug: "the-conversations-we-avoid", title: "The conversations we avoid", description: "Why the hardest sentences are usually the ones worth saying.", duration: "38 min", order: 2 },
    { slug: "rest-as-resistance", title: "Rest as resistance", description: "An interview with a sleep researcher and a tired mother of three.", duration: "51 min", order: 1 },
  ];
  for (const ep of episodesData) {
    await prisma.episode.upsert({ where: { slug: ep.slug }, update: {}, create: { ...ep, published: true } });
  }
  console.log(`✅ ${episodesData.length} podcast episodes`);

  // ── 8. Journal essays ──────────────────────────────────────────────────
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
