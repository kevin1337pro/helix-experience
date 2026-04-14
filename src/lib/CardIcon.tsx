import type { LucideProps } from "lucide-react";
import {
  Globe,
  Zap,
  Rocket,
  Palette,
  Monitor,
  Smartphone,
  TvMinimal,
  Clapperboard,
  Building2,
  Target,
  Sparkles,
  Box,
  Settings,
  Blocks,
  BarChart3,
  Mail,
  CalendarDays,
  FileText,
  Share2,
} from "lucide-react";
import type { ComponentType } from "react";

const iconMap: Record<string, ComponentType<LucideProps>> = {
  Globe,
  Zap,
  Rocket,
  Palette,
  Monitor,
  Smartphone,
  TvMinimal,
  Clapperboard,
  Building2,
  Target,
  Sparkles,
  Box,
  Settings,
  Blocks,
  BarChart3,
  Mail,
  CalendarDays,
  FileText,
  Share2,
};

interface CardIconProps extends LucideProps {
  name: string;
}

export default function CardIcon({ name, ...props }: CardIconProps) {
  const Icon = iconMap[name];
  if (!Icon) return <span>{name}</span>;
  return <Icon {...props} />;
}
