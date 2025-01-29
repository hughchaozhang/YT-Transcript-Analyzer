"use client";

import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import SignInWithGoogle from "@/components/SignInWithGoogle";

export function NavBar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-white font-bold">Creator Zone</span>
            </div>
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Transcript Analyzer
              </Link>
              <Link
                href="/research"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Youtube Research
              </Link>
            </div>
          </div>
          <div>
            {user ? (
              <button
                onClick={signOut}
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign Out
              </button>
            ) : (
              <SignInWithGoogle />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 