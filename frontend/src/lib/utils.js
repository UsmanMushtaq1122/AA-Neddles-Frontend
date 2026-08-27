import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function roundPrice(value) {
  const num = Number(value) || 0;
  return Math.round(num * 100) / 100;
}
