import type { ReactNode } from "react";

export default function UserLayout({
	children,
}: {
	children: ReactNode;
}) {
	return <main className="min-h-screen bg-slate-50 text-slate-900">{children}</main>;
}
