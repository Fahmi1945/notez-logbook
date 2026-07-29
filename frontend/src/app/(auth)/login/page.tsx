import Link from "next/link";
import LoginForm from "@/components/auth/login-form";
import AuthWrapper from "@/components/auth/auth-wrapper";

export default function LoginPage() {
  return (
    <AuthWrapper
      heading={<>Kelola Logbook<br />Magang Anda<br />dengan Mudah.</>}
      description={<>Bergabunglah dengan NOTEZ. <br />untuk melacak progres, mendapatkan review dari mentor, dan mengorganisir aktivitas harian Anda.</>}
    >
      <div className="w-full max-w-sm mx-auto">
        <div className="flex justify-center mb-8">
          <h2 className="text-3xl font-extrabold text-brand-primary tracking-widest">
            NOTEZ<span className="text-brand-accent">.</span>
          </h2>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-1">Selamat Datang Kembali!</h3>
          <p className="text-[13px] text-gray-500">Silakan masukkan detail akun Anda untuk masuk.</p>
        </div>

        <LoginForm />

        <p className="text-left text-xs text-gray-500 mt-8">
          Belum punya akun?{" "}
          <Link href="/register" className="font-bold text-brand-accent hover:text-orange-600 transition-colors">
            Daftar di sini
          </Link>
        </p>
      </div>
    </AuthWrapper>
  );
}