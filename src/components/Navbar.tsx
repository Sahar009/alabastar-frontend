import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
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
              <Link href="#providers" className="text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white transition-colors">Providers</Link>
              <Link href="#pricing" className="text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white transition-colors">Pricing</Link>
              <Link href="#contact" className="text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white transition-colors">Contact</Link>
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <Link href="/auth/login" className="text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white transition-colors">Log in</Link>
              <Link href="/auth/register" className="inline-flex items-center rounded-full bg-gradient-to-r from-[#2563EB] to-[#14B8A6] px-4 py-2 text-white font-semibold shadow-md shadow-sky-500/20 hover:shadow-lg hover:shadow-teal-500/20 transition-all active:scale-[.98]">Get started</Link>
            </div>

            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}

function MobileMenu() {
  return (
    <details className="md:hidden relative">
      <summary className="list-none cursor-pointer p-2 rounded-lg hover:bg-slate-900/5 dark:hover:bg-white/5 transition-colors">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-slate-800 dark:text-slate-100">
          <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </summary>
      <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-2xl border border-white/20 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl p-3 space-y-1">
        <Link href="/" className="block rounded-lg px-3 py-2 text-slate-800 dark:text-slate-100 hover:bg-slate-900/5 dark:hover:bg-white/5">Home</Link>
        <Link href="#services" className="block rounded-lg px-3 py-2 text-slate-800 dark:text-slate-100 hover:bg-slate-900/5 dark:hover:bg-white/5">Services</Link>
        <Link href="#providers" className="block rounded-lg px-3 py-2 text-slate-800 dark:text-slate-100 hover:bg-slate-900/5 dark:hover:bg-white/5">Providers</Link>
        <Link href="#pricing" className="block rounded-lg px-3 py-2 text-slate-800 dark:text-slate-100 hover:bg-slate-900/5 dark:hover:bg-white/5">Pricing</Link>
        <Link href="#contact" className="block rounded-lg px-3 py-2 text-slate-800 dark:text-slate-100 hover:bg-slate-900/5 dark:hover:bg-white/5">Contact</Link>
        <div className="h-px bg-gradient-to-r from-transparent via-slate-900/10 to-transparent dark:via-white/10 my-1" />
        <Link href="/auth/login" className="block rounded-lg px-3 py-2 text-slate-800 dark:text-slate-100 hover:bg-slate-900/5 dark:hover:bg-white/5">Log in</Link>
        <Link href="/auth/register" className="block rounded-lg px-3 py-2 text-white text-center bg-gradient-to-r from-[#2563EB] to-[#14B8A6] font-semibold">Get started</Link>
      </div>
    </details>
  );
}
