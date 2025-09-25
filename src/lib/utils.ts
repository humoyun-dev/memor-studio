import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { LocalizedString } from "@/lib/data/navigations";

export function t(value: LocalizedString, lang: string = "uz") {
  return value[lang as keyof LocalizedString] || value.uz;
}
