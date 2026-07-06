"use client";

import { useEffect, useState } from "react";
import { getStoredUser } from "@/lib/auth-session";

const overviewItems = [
	{ label: "Logbook aktif", value: "12" },
	{ label: "Revisi menunggu", value: "3" },
	{ label: "Persetujuan mentor", value: "1" },
];

export default function DashboardPage() {
	const [name, setName] = useState("Mahasiswa");

	useEffect(() => {
		const storedUser = getStoredUser();

		if (storedUser?.name) {
			setName(storedUser.name);
		}
	}, []);

	return (
		<section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-6 py-10">
			<div>
				<p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
					Dashboard Mahasiswa
				</p>
				<h1 className="mt-2 text-3xl font-semibold text-slate-900">
					Welcome, {name}
				</h1>
				<p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
					Pantau progres magang, status revisi, dan persetujuan mentor dari satu tempat.
				</p>
			</div>

			<div className="grid gap-4 sm:grid-cols-3">
				{overviewItems.map((item) => (
					<article
						key={item.label}
						className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
					>
						<p className="text-sm text-slate-500">{item.label}</p>
						<p className="mt-3 text-3xl font-semibold text-slate-900">{item.value}</p>
					</article>
				))}
			</div>

			<div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-8 text-sm text-slate-600">
				Halaman ini sudah aktif dan siap diisi dengan komponen dashboard yang lebih lengkap.
			</div>
		</section>
	);
}
