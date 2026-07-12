import type { User } from "@/types/user";

export const USER_STORAGE_KEY = "user";

export function getStoredUser(): User | null {
    if (typeof window === "undefined") {
        return null;
    }

    const storedUser = localStorage.getItem(USER_STORAGE_KEY);

    if (!storedUser) {
        return null;
    }

    try {
        return JSON.parse(storedUser) as User;
    } catch {
        return null;
    }
}
