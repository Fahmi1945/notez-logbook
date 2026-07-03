export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-brand-white-light flex items-center flex-col justify-center">
      {children}
    </div>
  );
}