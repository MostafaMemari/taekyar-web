import prismaPackage from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

import { hashPassword } from "../lib/auth/session.ts";
import { normalizeSlug } from "../lib/blog/slug.ts";
import { blogPosts } from "./seed-data/posts.ts";
import { getPostBlocks } from "./seed-data/post-content.ts";
import { TAG_DESCRIPTIONS } from "./seed-data/taxonomy.ts";
import { MOCK_COMMENTS } from "./seed-data/comments.ts";

const { PrismaClient } = prismaPackage;

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

interface SeedCategory {
  name: string;
  description: string;
  children?: { name: string; description: string }[];
}

const SEED_CATEGORIES: SeedCategory[] = [
  {
    name: "تکنیک‌ها",
    description:
      "آموزش گام‌به‌گام فن‌های تکواندو؛ از ضربات پایه چاگی و دفاع‌های ماکی تا پومسه‌های هر کمربند. هر مقاله با نکات مربیان، اشتباهات رایج و تمرین‌های اصلاحی نوشته شده تا اجرای شما دقیق‌تر و ایمن‌تر شود.",
    children: [
      {
        name: "چاگی",
        description:
          "ضربات پا، امضای تکواندو هستند. در این بخش اجرای فنی هر چاگی را از نقطه اتکا و چرخش لگن تا فرود و برگشت به گارد بررسی می‌کنیم.",
      },
      {
        name: "پومسه",
        description:
          "فرم‌های استاندارد تکواندو و ستون ارتقای کمربند؛ آموزش حرکت‌به‌حرکت هر پومسه با نکات ریتم، تعادل، نگاه و تنفس.",
      },
    ],
  },
  {
    name: "اخبار و مسابقات",
    description:
      "اخبار دنیای تکواندو، تغییرات قوانین کیوروگی و تحلیل مسابقات؛ همراه با نکات تاکتیکی و آمادگی ذهنی برای روز مصافحه.",
  },
  {
    name: "تغذیه و تناسب اندام",
    description:
      "تغذیه ورزشی عملی، برنامه‌های وزنی و تمرین‌های آمادگی جسمانی ویژه تکواندوکاران؛ از آب‌رسانی و برنامه غذایی آزمون تا انعطاف‌پذیری و تمرین در خانه.",
  },
];

const POST_DATES: Record<string, Date> = {
  "dollyo-chagki-common-mistakes": new Date("2026-08-16T09:30:00Z"),
  "poomsae-taeguk-one-guide": new Date("2026-08-09T10:00:00Z"),
  "olympic-rules-2026-changes": new Date("2026-08-01T08:00:00Z"),
  "belt-test-week-nutrition-plan": new Date("2026-07-24T11:30:00Z"),
  "home-flexibility-routine": new Date("2026-07-19T07:45:00Z"),
  "competition-mindset-stress-control": new Date("2026-07-11T09:00:00Z"),
};

const POST_CATEGORIES: Record<string, string[]> = {
  "dollyo-chagki-common-mistakes": ["چاگی", "تکنیک‌ها"],
  "poomsae-taeguk-one-guide": ["پومسه", "تکنیک‌ها"],
  "olympic-rules-2026-changes": ["اخبار و مسابقات"],
  "competition-mindset-stress-control": ["اخبار و مسابقات"],
  "belt-test-week-nutrition-plan": ["تغذیه و تناسب اندام"],
  "home-flexibility-routine": ["تغذیه و تناسب اندام"],
};

const EXTRA_COMMENTS: Record<string, Array<{ author: string; role?: string; isTeamAuthor?: boolean; date: string; message: string; status?: "APPROVED" | "PENDING"; replies?: Array<{ author: string; role?: string; isTeamAuthor?: boolean; date: string; message: string }> }>> = {
  "poomsae-taeguk-one-guide": [
    {
      author: "رضا قاسمی",
      role: "عضو تک‌یار",
      date: "۲۱ مرداد ۱۴۰۵",
      message:
        "دقت کنید که جهت نگاه واقعاً مهم است؛ من تا وقتی مربی‌ام نگفت اول چشم بچرخ بعد بدن، مدام مسیر را اشتباه می‌رفتم. مقاله کامل و خوبی بود.",
      replies: [
        {
          author: "تیم تحریریه تک‌یار",
          role: "تیم تک‌یار",
          isTeamAuthor: true,
          date: "۲۲ مرداد ۱۴۰۵",
          message: "کاملاً درست است رضا جان؛ نگاه پیش‌رو، نیمی از مسیر درست است. ممنون که تجربه‌ات را نوشتی.",
        },
      ],
    },
    {
      author: "مینا شریفی",
      role: "عضو تک‌یار",
      date: "۲۳ مرداد ۱۴۰۵",
      message: "برای آزمون زرد همین هفته تمرین ایل جانگ را شروع کردم؛ بخش ریتم و تنفس خیلی کمکم کرد. دست شما درد نکند.",
    },
  ],
  "home-flexibility-routine": [
    {
      author: "الهام نوری",
      role: "عضو تک‌یار",
      date: "۱ مرداد ۱۴۰۵",
      message:
        "سه هفته است هر شب این روتین را انجام می‌دهم؛ ضربه دولیوم واقعاً بلندتر شده. مخصوصاً لانژ پایین برای فلکسور لگن عالی بود.",
    },
  ],
  "olympic-rules-2026-changes": [
    {
      author: "حسین یزدانی",
      role: "عضو تک‌یار",
      date: "۵ مرداد ۱۴۰۵",
      message:
        "پس ضربات چرخشی این‌قدر تعیین‌کننده شده‌اند؛ به نظر می‌رسد تمرین بوت چاگی را باید جدی‌تر از قبل شروع کنیم. مرسی از مرور کاملش.",
    },
    {
      author: "کاربر مهمان",
      role: "عضو تک‌یار",
      date: "۱۲ مرداد ۱۴۰۵",
      message: "لطفاً درباره تغییرات رپید اسکور و حساسیت جوراب الکترونیکی هم توضیح بدهید؛ کمی سوال دارم.",
      status: "PENDING",
    },
  ],
};

const HOMEPAGE_FAQS = [
  {
    question: "تک‌یار برای چه کسانی مناسب است؟",
    answer:
      "برای هر علاقه‌مندی به تکواندو؛ از مبتدی‌ای که اولین ضربه‌اش را یاد می‌گیرد تا ورزشکاری که خودش را برای آزمون کمربند یا مسابقه آماده می‌کند.",
  },
  {
    question: "برنامه تمرینی چطور شخصی‌سازی می‌شود؟",
    answer:
      "کافی است سطح، هدفت و روزهای تمرینت را مشخص کنی؛ تک‌یار بر همان اساس برنامه هفتگی می‌سازد و با پیشرفت تو آن را به‌روز نگه می‌دارد.",
  },
  {
    question: "آیا می‌توانم مسیر ارتقای کمربندم را دنبال کنم؟",
    answer:
      "بله؛ از کمربند سفید تا مشکی، فن‌ها و شرایط هر آزمون ثبت شده است. همیشه می‌بینی دقیقاً کجای مسیر ایستاده‌ای و برای قدم بعدی چه چیزی لازم داری.",
  },
  {
    question: "امکان پرسیدن سوال از مربی وجود دارد؟",
    answer:
      "بله؛ سوالاتت را از مربی بپرس، ویدیوی اجرایت را برایش بفرست و روی فن‌هایت بازخورد مستقیم بگیر تا با اطمینان جلو بروی.",
  },
  {
    question: "آیا استفاده از تک‌یار رایگان است؟",
    answer:
      "دانلود و شروع استفاده از تک‌یار رایگان است؛ امکانات تکمیلی داخل اپلیکیشن معرفی می‌شوند تا هر زمان که خواستی مسیرت را گسترش بدهی.",
  },
];

const POST_FAQS: Record<string, Array<{ question: string; answer: string }>> = {
  "dollyo-chagki-common-mistakes": [
    {
      question: "چند وقت طول می‌کشد دولیو چاگی درست شود؟",
      answer:
        "با سه جلسه تمرین هدفمند در هفته، معمولاً بعد از دو تا سه هفته الگوی حرکتی تثبیت می‌شود؛ سرعت را فقط بعد از درست شدن فرم اضافه کنید.",
    },
    {
      question: "برای اصلاح فرم آینه کافی است؟",
      answer:
        "آینه برای دیدن مسیر لگن و بالاتنه عالی است، اما ضبط ویدیو جزئیاتی را نشان می‌دهد که در حین اجرا از قلم می‌افتد؛ هر دو را ترکیب کنید.",
    },
  ],
};

const MENU_SEED: Array<{
  location: "HEADER_DESKTOP" | "HEADER_MOBILE" | "FOOTER_QUICK" | "FOOTER_BLOG";
  title: string;
  type: "CUSTOM" | "CATEGORY" | "PAGE";
  customUrl?: string;
  categoryName?: string;
  pageSlug?: string;
}> = [
  { location: "HEADER_DESKTOP", title: "خانه", type: "CUSTOM", customUrl: "/" },
  { location: "HEADER_DESKTOP", title: "وبلاگ", type: "CUSTOM", customUrl: "/blog" },
  { location: "HEADER_DESKTOP", title: "دانشنامه فن‌ها", type: "CUSTOM", customUrl: "/techniques" },
  { location: "HEADER_DESKTOP", title: "درباره ما", type: "CUSTOM", customUrl: "/about" },
  { location: "HEADER_DESKTOP", title: "تماس با ما", type: "CUSTOM", customUrl: "/contact" },
  { location: "HEADER_MOBILE", title: "خانه", type: "CUSTOM", customUrl: "/" },
  { location: "HEADER_MOBILE", title: "وبلاگ", type: "CUSTOM", customUrl: "/blog" },
  { location: "HEADER_MOBILE", title: "دانشنامه فن‌ها", type: "CUSTOM", customUrl: "/techniques" },
  { location: "HEADER_MOBILE", title: "سوالات متداول", type: "CUSTOM", customUrl: "/faq" },
  { location: "HEADER_MOBILE", title: "همکاری با ما", type: "CUSTOM", customUrl: "/collab" },
  { location: "HEADER_MOBILE", title: "درباره ما", type: "CUSTOM", customUrl: "/about" },
  { location: "HEADER_MOBILE", title: "تماس با ما", type: "CUSTOM", customUrl: "/contact" },
  { location: "FOOTER_QUICK", title: "خانه", type: "CUSTOM", customUrl: "/" },
  { location: "FOOTER_QUICK", title: "وبلاگ", type: "CUSTOM", customUrl: "/blog" },
  { location: "FOOTER_QUICK", title: "دانشنامه فن‌ها", type: "CUSTOM", customUrl: "/techniques" },
  { location: "FOOTER_QUICK", title: "سوالات متداول", type: "CUSTOM", customUrl: "/faq" },
  { location: "FOOTER_QUICK", title: "همکاری با ما", type: "CUSTOM", customUrl: "/collab" },
  { location: "FOOTER_QUICK", title: "درباره ما", type: "CUSTOM", customUrl: "/about" },
  { location: "FOOTER_QUICK", title: "تماس با ما", type: "CUSTOM", customUrl: "/contact" },
  { location: "FOOTER_QUICK", title: "حریم خصوصی", type: "PAGE", pageSlug: "privacy" },
  { location: "FOOTER_QUICK", title: "قوانین و مقررات", type: "PAGE", pageSlug: "terms" },
  { location: "FOOTER_BLOG", title: "تکنیک‌ها", type: "CATEGORY", categoryName: "تکنیک‌ها" },
  { location: "FOOTER_BLOG", title: "اخبار و مسابقات", type: "CATEGORY", categoryName: "اخبار و مسابقات" },
  { location: "FOOTER_BLOG", title: "تغذیه و تناسب اندام", type: "CATEGORY", categoryName: "تغذیه و تناسب اندام" },
];

const PRIVACY_CONTENT = `<p>حریم خصوصی شما برای تیم تک‌یار مهم است. در این سند توضیح می‌دهیم چه اطلاعاتی جمع‌آوری می‌کنیم، چرا جمع‌آوری می‌کنیم و چگونه از آن محافظت می‌کنیم.</p>
<h2>اطلاعاتی که جمع‌آوری می‌کنیم</h2>
<ul>
<li>اطلاعات حساب کاربری مانند نام، ایمیل و شماره تماس که هنگام ثبت‌نام در اپلیکیشن وارد می‌کنید.</li>
<li>داده‌های تمرینی شما شامل سطح کمربند، فن‌های تمرین‌شده و پیشرفت آزمون‌ها که فقط برای ساخت برنامه شخصی استفاده می‌شود.</li>
<li>دیدگاه‌هایی که در وبلاگ ثبت می‌کنید، همراه با یک نسخه رمزنگاری‌شده از نشانی IP برای مقابله با ارسال هرزنامه.</li>
</ul>
<h2>استفاده از اطلاعات</h2>
<p>از اطلاعات شما فقط برای بهبود برنامه تمرینی، پاسخ به پشتیبانی و ارتقای کیفیت محتوا استفاده می‌کنیم. اطلاعات شما هرگز فروخته یا اجاره داده نمی‌شود و در اختیار اشخاص ثالث تبلیغاتی قرار نمی‌گیرد.</p>
<h2>ذخیره‌سازی و امنیت</h2>
<p>داده‌ها روی سرورهای امن ذخیره می‌شوند و ارتباط اپلیکیشن و وب‌سایت با پروتکل‌های رمزنگاری‌شده انجام می‌شود. دسترسی به داده‌های کاربران فقط برای اعضای مجاز تیم فنی امکان‌پذیر است.</p>
<h2>حقوق شما</h2>
<p>هر زمان که بخواهید می‌توانید درخواست حذف کامل حساب و داده‌های تمرینی‌تان را برای ما ارسال کنید؛ این درخواست حداکثر تا ۷۲ ساعت انجام می‌شود.</p>
<h2>تماس با ما</h2>
<p>برای هر سوال درباره این سند از صفحه تماس با ما استفاده کنید؛ تیم پشتیبانی پاسخگوی شماست.</p>`;

const TERMS_CONTENT = `<p>استفاده از وب‌سایت و اپلیکیشن تک‌یار به معنای پذیرش شرایط زیر است. لطفاً پیش از شروع استفاده، این قوانین را با دقت بخوانید.</p>
<h2>شرایط استفاده از محتوا</h2>
<p>تمامی مقالات، برنامه‌های تمرینی و ویدیوهای آموزشی تک‌یار برای استفاده شخصی کاربران تهیه شده‌اند. بازنشر تجاری، کپی یا استفاده از محتوا بدون ذکر منبع و کسب اجازه کتبی مجاز نیست.</p>
<h2>برنامه‌های تمرینی</h2>
<p>برنامه‌های ارائه‌شده در تک‌یار جنبه پیشنهادی دارند. اگر بیماری خاص، آسیب قبلی یا محدودیت جسمانی دارید، پیش از شروع هر برنامه با پزشک یا مربی خود مشورت کنید و مسئولیت اجرای تمرین‌ها بر عهده خودتان است.</p>
<h2>دیدگاه‌های کاربران</h2>
<p>دیدگاه‌های ثبت‌شده در وبلاگ پس از بررسی تیم moderator منتشر می‌شوند. انتشار نظرهای توهین‌آمیز، تبلیغاتی یا بی‌ارتباط با موضوع، بدون اطلاع قبلی رد می‌شود.</p>
<h2>اشتراک و پرداخت</h2>
<p>در صورت فعال‌سازی امکانات تکمیلی، جزئیات قیمت و شرایط تمدید پیش از پرداخت نمایش داده می‌شود و پرداخت‌ها از طریق درگاه‌های بانکی معتبر انجام می‌شود.</p>
<h2>تغییرات قوانین</h2>
<p>تک‌یار می‌تواند این قوانین را به‌روزرسانی کند؛ نسخه جدید از همین صفحه منتشر خواهد شد و ادامه استفاده از سرویس به معنای پذیرش تغییرات است.</p>`;

async function seedAdmin() {
  const { ADMIN_USERNAME, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
    console.warn("ADMIN_USERNAME/ADMIN_PASSWORD not set; skipping admin seed.");
    return;
  }

  await prisma.admin.upsert({
    where: { username: ADMIN_USERNAME },
    update: { passwordHash: hashPassword(ADMIN_PASSWORD) },
    create: {
      username: ADMIN_USERNAME,
      passwordHash: hashPassword(ADMIN_PASSWORD),
    },
  });
}

async function wipeAll() {
  await prisma.comment.deleteMany();
  await prisma.faq.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.seoMetadata.deleteMany();
  await prisma.post.deleteMany();
  await prisma.category.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.page.deleteMany();
  await prisma.captchaChallenge.deleteMany();
  await prisma.rateLimitCounter.deleteMany();
}

async function seedSiteSettings() {
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {
      siteName: "تک‌یار",
      siteTitle: "تک‌یار | همراه تمرینی تکواندو",
      siteDescription:
        "تک‌یار اپلیکیشن همراه تمرین تکواندوست؛ برنامه تمرین شخصی، آموزش گام‌به‌گام فن‌ها و پیگیری ارتقای کمربند، از کمربند سفید تا مشکی",
      telegramUrl: "https://t.me/taekyar",
      instagramUrl: "https://instagram.com/taekyar",
      youtubeUrl: "https://youtube.com/@taekyar",
      twitterUrl: null,
      appDownloadUrl: null,
    },
    create: {
      id: 1,
      siteName: "تک‌یار",
      siteTitle: "تک‌یار | همراه تمرینی تکواندو",
      siteDescription:
        "تک‌یار اپلیکیشن همراه تمرین تکواندوست؛ برنامه تمرین شخصی، آموزش گام‌به‌گام فن‌ها و پیگیری ارتقای کمربند، از کمربند سفید تا مشکی",
      telegramUrl: "https://t.me/taekyar",
      instagramUrl: "https://instagram.com/taekyar",
      youtubeUrl: "https://youtube.com/@taekyar",
      twitterUrl: null,
      appDownloadUrl: null,
    },
  });
}

async function seedCategories() {
  const idByName = new Map<string, number>();

  for (const parent of SEED_CATEGORIES) {
    const created = await prisma.category.create({
      data: {
        name: parent.name,
        slug: normalizeSlug(parent.name),
        path: normalizeSlug(parent.name),
        description: parent.description,
      },
    });
    idByName.set(parent.name, created.id);

    for (const child of parent.children ?? []) {
      const childSlug = normalizeSlug(child.name);
      const createdChild = await prisma.category.create({
        data: {
          name: child.name,
          slug: childSlug,
          path: `${normalizeSlug(parent.name)}/${childSlug}`,
          parentId: created.id,
          description: child.description,
        },
      });
      idByName.set(child.name, createdChild.id);
    }
  }

  return idByName;
}

async function seedTags() {
  const idByName = new Map<string, number>();

  for (const [name, description] of Object.entries(TAG_DESCRIPTIONS)) {
    const tag = await prisma.tag.create({
      data: { name, slug: normalizeSlug(name), description },
    });
    idByName.set(name, tag.id);
  }

  return idByName;
}

async function seedPosts(categoryIdByName: Map<string, number>, tagIdByName: Map<string, number>) {
  const idBySlug = new Map<string, number>();

  for (const post of blogPosts) {
    const categoryIds = (POST_CATEGORIES[post.slug] ?? []).map((name) => {
      const id = categoryIdByName.get(name);
      if (!id) throw new Error(`Unknown category: ${name}`);
      return { id };
    });

    const tagIds = post.tags.map((name) => {
      const id = tagIdByName.get(name);
      if (!id) throw new Error(`Unknown tag: ${name}`);
      return { id };
    });

    const createdAt = POST_DATES[post.slug] ?? new Date();
    const created = await prisma.post.create({
      data: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: getPostBlocks(post.slug) ?? [],
        date: createdAt,
        readTimeMinutes: post.readTimeMinutes,
        status: "PUBLISHED",
        createdAt,
        updatedAt: createdAt,
        categories: { connect: categoryIds },
        tags: { connect: tagIds },
      },
    });
    idBySlug.set(post.slug, created.id);
  }

  return idBySlug;
}

async function seedComments(postIdBySlug: Map<string, number>) {
  for (const [slug, mockComments] of Object.entries({
    "dollyo-chagki-common-mistakes": MOCK_COMMENTS,
    ...EXTRA_COMMENTS,
  })) {
    const postId = postIdBySlug.get(slug);
    if (!postId) continue;

    for (const comment of mockComments) {
      const parent = await prisma.comment.create({
        data: {
          postId,
          author: comment.author,
          role: comment.role ?? "عضو تک‌یار",
          isTeamAuthor: comment.isTeamAuthor ?? false,
          date: comment.date,
          message: comment.message,
          status: comment.status ?? "APPROVED",
        },
      });

      for (const reply of comment.replies ?? []) {
        await prisma.comment.create({
          data: {
            postId,
            parentId: parent.id,
            author: reply.author,
            role: reply.role ?? "عضو تک‌یار",
            isTeamAuthor: reply.isTeamAuthor ?? false,
            date: reply.date,
            message: reply.message,
            status: "APPROVED",
          },
        });
      }
    }
  }
}

async function seedFaqs(postIdBySlug: Map<string, number>) {
  for (const [index, faq] of HOMEPAGE_FAQS.entries()) {
    await prisma.faq.create({
      data: { ...faq, location: "HOMEPAGE", order: index },
    });
  }

  for (const [slug, faqs] of Object.entries(POST_FAQS)) {
    const postId = postIdBySlug.get(slug);
    if (!postId) continue;
    for (const [index, faq] of faqs.entries()) {
      await prisma.faq.create({
        data: { ...faq, location: "BLOG", postId, order: index },
      });
    }
  }
}

async function seedMenus(categoryIdByName: Map<string, number>) {
  for (const [index, item] of MENU_SEED.entries()) {
    await prisma.menuItem.create({
      data: {
        title: item.title,
        type: item.type,
        customUrl: item.type === "CUSTOM" ? (item.customUrl ?? "/") : null,
        categoryId:
          item.type === "CATEGORY"
            ? (categoryIdByName.get(item.categoryName ?? "") ?? null)
            : null,
        location: item.location,
        order: index,
      },
    });
  }
}

async function seedPages() {
  const now = new Date();

  await prisma.page.create({
    data: {
      slug: "privacy",
      title: "حریم خصوصی",
      content: PRIVACY_CONTENT,
      status: "PUBLISHED",
      publishedAt: now,
    },
  });

  await prisma.page.create({
    data: {
      slug: "terms",
      title: "قوانین و مقررات",
      content: TERMS_CONTENT,
      status: "PUBLISHED",
      publishedAt: now,
    },
  });
}

async function main() {
  await seedAdmin();
  await wipeAll();
  await seedSiteSettings();

  const categoryIdByName = await seedCategories();
  const tagIdByName = await seedTags();
  const postIdBySlug = await seedPosts(categoryIdByName, tagIdByName);
  await seedComments(postIdBySlug);
  await seedFaqs(postIdBySlug);
  await seedMenus(categoryIdByName);
  await seedPages();

  const [posts, categories, tags, comments, faqs, menus, pages] = await Promise.all([
    prisma.post.count(),
    prisma.category.count(),
    prisma.tag.count(),
    prisma.comment.count(),
    prisma.faq.count(),
    prisma.menuItem.count(),
    prisma.page.count(),
  ]);

  console.log(
    `Seed completed: ${posts} posts, ${categories} categories, ${tags} tags, ${comments} comments, ${faqs} faqs, ${menus} menu items, ${pages} pages.`,
  );
}

main()
  .then(() => {
    console.log("Seed completed.");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
