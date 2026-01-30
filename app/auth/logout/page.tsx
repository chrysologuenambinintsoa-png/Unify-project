'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      // Sign out from NextAuth
      await signOut({ redirect: false });
      // Redirect to welcome/login page
      router.push('/welcome');
    };

    performLogout();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-dark to-primary-light">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Logging out...</h1>
        <p className="text-gray-200">You will be redirected shortly.</p>
      </div>
    </div>
  );
}
