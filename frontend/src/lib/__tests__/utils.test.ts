import { cn } from "@/lib/utils";

describe("cn (className utility)", () => {
  it("harus menggabungkan class biasa", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("harus mengabaikan nilai falsy (undefined, null, false)", () => {
    expect(cn("foo", undefined, null, false, "bar")).toBe("foo bar");
  });

  it("harus me-merge class Tailwind yang konflik (yang terakhir menang)", () => {
    // tailwind-merge: p-4 dan p-2 konflik, yang terakhir (p-2) yang dipakai
    expect(cn("p-4", "p-2")).toBe("p-2");
  });

  it("harus mendukung conditional class via objek", () => {
    expect(cn("base", { active: true, hidden: false })).toBe("base active");
  });

  it("harus mengembalikan string kosong jika tidak ada argumen", () => {
    expect(cn()).toBe("");
  });
});
