import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200/60 dark:border-white/10">
      <div className="bg-gradient-to-b from-transparent to-slate-900/5 dark:to-slate-50/[.02]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-slate-900 dark:text-slate-100 font-bold text-lg">Alabastar</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300/80">Trusted home & business services platform. Book verified providers with escrow-backed safety.</p>
            </div>
            <div>
              <h4 className="text-slate-900 dark:text-slate-100 font-semibold">Company</h4>
              <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300/80">
                <li><Link href="#about" className="hover:text-slate-900 dark:hover:text-white">About</Link></li>
                <li><Link href="#blog" className="hover:text-slate-900 dark:hover:text-white">Blog</Link></li>
                <li><Link href="#contact" className="hover:text-slate-900 dark:hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-slate-900 dark:text-slate-100 font-semibold">Products</h4>
              <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300/80">
                <li><Link href="#services" className="hover:text-slate-900 dark:hover:text-white">Find Services</Link></li>
                <li><Link href="#providers" className="hover:text-slate-900 dark:hover:text-white">Become a Provider</Link></li>
                <li><Link href="#marketplace" className="hover:text-slate-900 dark:hover:text-white">Marketplace</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-slate-900 dark:text-slate-100 font-semibold">Legal</h4>
              <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300/80">
                <li><Link href="#privacy" className="hover:text-slate-900 dark:hover:text-white">Privacy</Link></li>
                <li><Link href="#terms" className="hover:text-slate-900 dark:hover:text-white">Terms</Link></li>
                <li><Link href="#safety" className="hover:text-slate-900 dark:hover:text-white">Safety</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">© {new Date().getFullYear()} Alabastar. All rights reserved.</p>
            <div className="flex items-center gap-3">
              <a href="#" aria-label="Twitter" className="p-2 rounded-full bg-slate-900/5 dark:bg-white/10 hover:bg-slate-900/10 dark:hover:bg-white/20 transition">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-slate-600 dark:text-slate-300"><path d="M22 5.92c-.77.35-1.6.58-2.47.69a4.27 4.27 0 0 0 1.87-2.36 8.51 8.51 0 0 1-2.7 1.04 4.25 4.25 0 0 0-7.38 2.9c0 .33.04.66.11.97A12.07 12.07 0 0 1 3.16 4.6a4.23 4.23 0 0 0-.58 2.14 4.25 4.25 0 0 0 1.89 3.54 4.23 4.23 0 0 1-1.93-.53v.05a4.25 4.25 0 0 0 3.41 4.17c-.46.12-.94.18-1.44.18-.35 0-.7-.03-1.03-.1a4.26 4.26 0 0 0 3.97 2.95A8.52 8.52 0 0 1 2 19.54 12.02 12.02 0 0 0 8.29 21.5c7.55 0 11.68-6.26 11.68-11.68l-.01-.53A8.35 8.35 0 0 0 22 5.92z"/></svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="p-2 rounded-full bg-slate-900/5 dark:bg.white/10 hover:bg-slate-900/10 dark:hover:bg-white/20 transition">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-slate-600 dark:text-slate-300"><path d="M20.45 20.45h-3.55v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.07 1.4-2.07 2.85v5.5H9.48V9h3.41v1.57h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}





