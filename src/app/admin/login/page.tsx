import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { AuthCard } from '@/components/auth/AuthShell';
import AdminLoginForm from '@/components/admin/LoginForm';
import { Logo } from '@/components/Navbar';
import { isAdmin } from '@/lib/admin-auth';

export const metadata: Metadata = { title: 'Admin Login', robots: { index: false, follow: false } };

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect('/admin');
  return (
    <main className="grid min-h-dvh place-items-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-5 flex justify-center"><Logo /></div>
        <AuthCard padding="p-5 sm:p-6">
          <h1 className="mb-4 text-center font-display text-3xl text-[var(--maroon)]">Admin Panel</h1>
          <AdminLoginForm />
        </AuthCard>
      </div>
    </main>
  );
}
