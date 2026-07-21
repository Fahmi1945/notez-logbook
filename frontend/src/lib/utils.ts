import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge tailwind classes safely.
 * Kombinasi dari clsx (kondisional class) dan tailwind-merge (mencegah konflik).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}