import Link from "next/link";
import RegisterForm from "@/components/auth/register-form";
import AuthWrapper from "@/components/auth/auth-wrapper";

export default function RegisterPage() {
  return (
    <AuthWrapper
      heading={<>Mulai Perjalanan<br />Magang Anda!</>}
      description={<>Buat akun NOTEZ. <br />sekarang dan mulailah mengelola logbook 
      magang Anda dengan lebih rapi dan efisien.</>}
    >
      <div className="w-full max-w-sm mx-auto">
        
        {/* Logo Tengah Atas */}
        <div className="flex justify-center mb-6">
          <h2 className="text-3xl font-extrabold text-brand-primary tracking-widest">
            NOTEZ<span className="text-brand-accent">.</span>
          </h2>
        </div>

        <RegisterForm />

        {/* Link ke Login */}
        <p className="text-center text-xs text-gray-500 mt-6">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-bold text-brand-accent hover:text-orange-600 transition-colors">
            Masuk di sini
          </Link>
        </p>
      </div>
    </AuthWrapper>
  );
}