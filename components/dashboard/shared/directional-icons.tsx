import type { ComponentProps } from "react";
import { ArrowLeft, ArrowRight, ChevronLeft } from "lucide-react";

type DirectionalIconProps = ComponentProps<typeof ArrowLeft>;

export function ForwardIcon(props: DirectionalIconProps) {
  return <ArrowLeft {...props} />;
}

export function BackIcon(props: DirectionalIconProps) {
  return <ArrowRight {...props} />;
}

export function BreadcrumbSeparatorIcon(props: DirectionalIconProps) {
  return <ChevronLeft {...props} />;
}
