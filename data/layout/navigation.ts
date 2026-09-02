export interface NavLink {
  href: string;
  label: string;
}

export const navLinks: NavLink[] = [
  { href: "/", label: "خانه" },
  { href: "/#features", label: "امکانات اپلیکیشن" },
  { href: "/blog", label: "وبلاگ" },
  { href: "/about", label: "درباره ما" },
  { href: "/contact", label: "تماس با ما" },
];

export const MOBILE_NAV_FALLBACK = navLinks.map(({ href, label }) => ({
  id: -1,
  title: label,
  href,
  children: [],
}));
