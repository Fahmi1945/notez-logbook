"use client";

import { useState } from "react";
import { getStoredUser } from "@/lib/auth-session";

const mentorOverviewItems = [
	{ label: "Mahasiswa aktif", value: "28" },
	{ label: "Review pending", value: "5" },
	{ label: "Permintaan mentorship", value: "2" },
];

export default function MentorDashboardPage() {
	const [name] = useState(() => getStoredUser()?.name || "Mentor");

	return (
		<section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-6 py-10">
			<div>
				<p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">
					Dashboard Mentor
				</p>
				<h1 className="mt-2 text-3xl font-semibold text-white">
					Welcome, {name}
				</h1>
				<p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
					Lihat progres mahasiswa, permintaan mentorship, dan pekerjaan review yang masih menunggu.
				</p>
			</div>

			<div className="grid gap-4 sm:grid-cols-3">
				{mentorOverviewItems.map((item) => (
					<article
						key={item.label}
						className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm backdrop-blur"
					>
						<p className="text-sm text-slate-300">{item.label}</p>
						<p className="mt-3 text-3xl font-semibold text-white">{item.value}</p>
					</article>
				))}
			</div>

			<div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-sm text-slate-300 backdrop-blur">
				Halaman mentor sudah valid dan siap menerima komponen kontrol lanjutan.
			</div>
		</section>
	);
}
