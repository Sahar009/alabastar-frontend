import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200/60 dark:border-white/10 relative overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/images/footer.mp4" type="video/mp4" />
          {/* Fallback for browsers that don't support video */}
          <div className="w-full h-full bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800" />
        </video>
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold text-xl mb-4">Alabastar</h3>
              <p className="text-white/90 text-sm leading-relaxed">Trusted home & business services platform. Book verified providers with escrow-backed safety.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/about" className="text-white/80 hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact" className="text-white/80 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Products</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/providers" className="text-white/80 hover:text-white transition-colors">Find Services</Link></li>
                <li><Link href="/become-provider" className="text-white/80 hover:text-white transition-colors">Become a Provider</Link></li>
                <li><Link href="/providers" className="text-white/80 hover:text-white transition-colors">Marketplace</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/privacy" className="text-white/80 hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="text-white/80 hover:text-white transition-colors">Terms</Link></li>
                <li><Link href="/safety" className="text-white/80 hover:text-white transition-colors">Safety</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-white/70 text-sm">© {new Date().getFullYear()} Alabastar. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" aria-label="Twitter" className="p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:scale-110">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                  <path d="M22 5.92c-.77.35-1.6.58-2.47.69a4.27 4.27 0 0 0 1.87-2.36 8.51 8.51 0 0 1-2.7 1.04 4.25 4.25 0 0 0-7.38 2.9c0 .33.04.66.11.97A12.07 12.07 0 0 1 3.16 4.6a4.23 4.23 0 0 0-.58 2.14 4.25 4.25 0 0 0 1.89 3.54 4.23 4.23 0 0 1-1.93-.53v.05a4.25 4.25 0 0 0 3.41 4.17c-.46.12-.94.18-1.44.18-.35 0-.7-.03-1.03-.1a4.26 4.26 0 0 0 3.97 2.95A8.52 8.52 0 0 1 2 19.54 12.02 12.02 0 0 0 8.29 21.5c7.55 0 11.68-6.26 11.68-11.68l-.01-.53A8.35 8.35 0 0 0 22 5.92z"/>
                </svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:scale-110">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                  <path d="M20.45 20.45h-3.55v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.07 1.4-2.07 2.85v5.5H9.48V9h3.41v1.57h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z"/>
                </svg>
              </a>
              <a href="#" aria-label="Facebook" className="p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:scale-110">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className="p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:scale-110">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.781c-.49 0-.98-.49-.98-.98s.49-.98.98-.98.98.49.98.98-.49.98-.98.98z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}










