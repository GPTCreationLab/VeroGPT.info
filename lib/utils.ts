import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import {useSearchParams} from "next/navigation";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
}