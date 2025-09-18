"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { LogOut, Settings } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };
  return (
    <header className="sticky top-0 z-50">
      <div className="backdrop-blur-xl bg-white/60 dark:bg-slate-900/50 border-b border-white/20 dark:border-white/10 supports-[backdrop-filter]:bg-white/40 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/brand/logo-icon.svg" alt="Alabastar" width={32} height={32} priority />
              <span className="hidden sm:inline text-slate-900 dark:text-slate-100 font-extrabold tracking-tight">ALABASTAR</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link href="/" className="text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white transition-colors">Home</Link>
              <Link href="#services" className="text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white transition-colors">Services</Link>
              <Link href="/providers" className="text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white transition-colors">Providers</Link>
              <Link href="#pricing" className="text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white transition-colors">Pricing</Link>
              <Link href="/contact" className="text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white transition-colors">Contact</Link>
            </nav>

            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-[#2563EB] to-[#14B8A6] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {user.fullName?.charAt(0) || 'U'}
                    </div>
                    <span className="text-slate-700 dark:text-slate-200">{user.fullName}</span>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-50">
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings size={16} />
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : null}
              <Link href="/become-provider" className="text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white transition-colors">Become Provider</Link>
              <Link href="/providers" className="inline-flex items-center rounded-full bg-gradient-to-r from-[#14B8A6] to-[#2563EB] px-4 py-2 text-white font-semibold shadow-md shadow-teal-500/20 hover:shadow-lg hover:shadow-sky-500/20 transition-all active:scale-[.98]">Book a Service</Link>
            </div>

            <MobileMenu user={user} onLogout={handleLogout} />
          </div>
        </div>
      </div>
    </header>
  );
}

interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  provider: string;
}

function MobileMenu({ user, onLogout }: { user: User | null; onLogout: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-slate-900/5 dark:hover:bg-white/5 transition-colors"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-slate-800 dark:text-slate-100">
          <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-2xl border border-white/20 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl p-3 space-y-1 z-50">
          <Link href="/" className="block rounded-lg px-3 py-2 text-slate-800 dark:text-slate-100 hover:bg-slate-900/5 dark:hover:bg-white/5" onClick={() => setIsOpen(false)}>Home</Link>
          <Link href="#services" className="block rounded-lg px-3 py-2 text-slate-800 dark:text-slate-100 hover:bg-slate-900/5 dark:hover:bg-white/5" onClick={() => setIsOpen(false)}>Services</Link>
          <Link href="/providers" className="block rounded-lg px-3 py-2 text-slate-800 dark:text-slate-100 hover:bg-slate-900/5 dark:hover:bg-white/5" onClick={() => setIsOpen(false)}>Providers</Link>
          <Link href="#pricing" className="block rounded-lg px-3 py-2 text-slate-800 dark:text-slate-100 hover:bg-slate-900/5 dark:hover:bg-white/5" onClick={() => setIsOpen(false)}>Pricing</Link>
          <Link href="/contact" className="block rounded-lg px-3 py-2 text-slate-800 dark:text-slate-100 hover:bg-slate-900/5 dark:hover:bg-white/5" onClick={() => setIsOpen(false)}>Contact</Link>
          
          <div className="h-px bg-gradient-to-r from-transparent via-slate-900/10 to-transparent dark:via-white/10 my-1" />
          
          {user ? (
            <>
              <div className="flex items-center gap-2 px-3 py-2 text-slate-800 dark:text-slate-100">
                <div className="w-6 h-6 bg-gradient-to-r from-[#2563EB] to-[#14B8A6] rounded-full flex items-center justify-center text-white font-semibold text-xs">
                  {user.fullName?.charAt(0) || 'U'}
                </div>
                <span className="text-sm">{user.fullName}</span>
              </div>
              <Link href="/profile" className="block rounded-lg px-3 py-2 text-slate-800 dark:text-slate-100 hover:bg-slate-900/5 dark:hover:bg-white/5" onClick={() => setIsOpen(false)}>Profile</Link>
              <button onClick={() => { onLogout(); setIsOpen(false); }} className="w-full text-left rounded-lg px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">Sign Out</button>
            </>
          ) : null}
          
          <Link href="/become-provider" className="block rounded-lg px-3 py-2 text-slate-800 dark:text-slate-100 hover:bg-slate-900/5 dark:hover:bg-white/5" onClick={() => setIsOpen(false)}>Become Provider</Link>
          <Link href="/providers" className="block rounded-lg px-3 py-2 text-white text-center bg-gradient-to-r from-[#14B8A6] to-[#2563EB] font-semibold" onClick={() => setIsOpen(false)}>Book a Service</Link>
        </div>
      )}
    </div>
  );
}
