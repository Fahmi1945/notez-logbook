import { redirect } from 'next/navigation';

export default function Home() {
  // Sistem akan langsung melempar user ke rute /login
  redirect('/login');
}