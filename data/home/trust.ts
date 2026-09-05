import { Building2, Medal, Trophy, Users, type LucideIcon } from "lucide-react";

export interface TrustStat {
  value: string;
  label: string;
  Icon: LucideIcon;
}

export const TRUST_STATS: TrustStat[] = [
  { value: "+۵۰۰", label: "ورزشکار فعال", Icon: Users },
  { value: "+۲۰", label: "مربی حرفه‌ای", Icon: Medal },
  { value: "+۱۵", label: "باشگاه همکار", Icon: Building2 },
  { value: "+۱۰", label: "سال تجربه", Icon: Trophy },
];
