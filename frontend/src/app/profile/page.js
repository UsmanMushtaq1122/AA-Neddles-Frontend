'use client';

import AuthGuard from '@/components/AuthGuard';
import PageLayout from '@/components/PageLayout';
import { useAuth } from '@/hooks/useAuth';
import { UserCircle, Mail, Phone } from 'lucide-react';

function ProfileContent() {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10">
        <div className="w-20 h-20 rounded-full bg-noor-maroon text-white flex items-center justify-center ty-h3 flex-shrink-0">
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div className="text-center sm:text-left">
          <h2 className="ty-h3 text-noor-black">{user?.name || 'User'}</h2>
          <p className="ty-body-sm text-noor-gray mt-1">Member of AA Neddles</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4 p-4 bg-zinc-50">
          <Mail size={18} strokeWidth={1.5} className="text-noor-gray flex-shrink-0" />
          <div>
            <p className="ty-caption uppercase tracking-[0.1em] text-noor-gray">Email</p>
            <p className="ty-body-sm font-medium text-noor-black">{user?.email || '—'}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-zinc-50">
          <Phone size={18} strokeWidth={1.5} className="text-noor-gray flex-shrink-0" />
          <div>
            <p className="ty-caption uppercase tracking-[0.1em] text-noor-gray">Phone</p>
            <p className="ty-body-sm font-medium text-noor-black">{user?.phone || '—'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <AuthGuard>
      <PageLayout
        title="My Profile"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'My Profile' },
        ]}
      >
        <ProfileContent />
      </PageLayout>
    </AuthGuard>
  );
}
