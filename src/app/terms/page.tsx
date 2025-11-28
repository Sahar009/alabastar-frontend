"use client";
import { FileText, ShieldCheck, UserCheck, Lock, Users, CreditCard, AlertTriangle, Copyright, Eye, Ban, AlertCircle, XCircle, Scale, Mail, Phone, CheckCircle, Gavel } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type React from "react";

export default function TermsPage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 sm:pt-24 pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 grid place-items-center rounded-xl bg-gradient-to-br from-pink-600 to-orange-500 text-white">
                  <FileText size={24} />
                </div>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-50">
                  Terms and Conditions
                </h1>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Last Updated: {new Date().toLocaleDateString()}</p>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Welcome to Alabastar. These Terms and Conditions govern your use of our Platform. By accessing or using our Platform, you agree to comply with these Terms.
              </p>
              <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                These Terms constitute a legally binding agreement between you and Alabastar. If you do not agree, please discontinue using the Platform immediately.
              </p>
            </div>
            <div className="relative">
              <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-8 shadow-lg">
                <Image
                  src="/terms.png"
                  alt="Terms and Conditions"
                  width={500}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Section 2: About Alabastar */}
            <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 grid place-items-center rounded-lg bg-gradient-to-br from-pink-600 to-orange-500 text-white">
                  <ShieldCheck size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">2. About Alabastar</h2>
              </div>
              <div className="space-y-3 text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>Alabastar is an online marketplace designed to connect users (customers) with service providers, vendors, or businesses who offer goods or services.</p>
                <p>We act as an intermediary platform facilitating discovery, communication, and transactions between users and service providers — but we are not a direct party to any transaction between users and providers.</p>
              </div>
            </div>

            {/* Section 3: Eligibility */}
            <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 grid place-items-center rounded-lg bg-gradient-to-br from-pink-600 to-orange-500 text-white">
                  <UserCheck size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">3. Eligibility</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">To use Alabastar, you must:</p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-pink-600 dark:text-pink-400 mt-0.5 shrink-0" />
                  <span>Be at least 18 years old and have full legal capacity to enter a binding contract.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-pink-600 dark:text-pink-400 mt-0.5 shrink-0" />
                  <span>Provide accurate, complete, and up-to-date registration details.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-pink-600 dark:text-pink-400 mt-0.5 shrink-0" />
                  <span>Use the Platform for lawful purposes only.</span>
                </li>
              </ul>
              <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed">
                We reserve the right to suspend or terminate any account that violates these Terms or any applicable laws.
              </p>
            </div>

            {/* Section 4: Account Registration and Security */}
            <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 grid place-items-center rounded-lg bg-gradient-to-br from-pink-600 to-orange-500 text-white">
                  <Lock size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">4. Account Registration and Security</h2>
              </div>
              <div className="space-y-3 text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>You may need to create an account to access certain services.</p>
                <p>You are responsible for maintaining the confidentiality of your login credentials and all activities under your account.</p>
                <p>You agree to notify Alabastar immediately of any unauthorized access or breach.</p>
                <p>We reserve the right to refuse, suspend, or delete your account if we suspect fraudulent, illegal, or abusive behavior.</p>
              </div>
            </div>

            {/* Section 5: Services and Marketplace Role */}
            <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 grid place-items-center rounded-lg bg-gradient-to-br from-pink-600 to-orange-500 text-white">
                  <Users size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">5. Services and Marketplace Role</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">Alabastar provides a digital platform where:</p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300 mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-pink-600 dark:text-pink-400 mt-1">•</span>
                  <span>Customers can find and hire service providers or purchase products.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-600 dark:text-pink-400 mt-1">•</span>
                  <span>Vendors/Providers can list, promote, and sell their services or goods.</span>
                </li>
              </ul>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                We are not a service provider, agent, or guarantor of any user, vendor, or transaction. All bookings, purchases, and payments made through the Platform are agreements between you and the respective provider/vendor. Alabastar only facilitates the process.
              </p>
            </div>

            {/* Section 6: User Responsibilities */}
            <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 grid place-items-center rounded-lg bg-gradient-to-br from-pink-600 to-orange-500 text-white">
                  <ShieldCheck size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">6. User Responsibilities</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">When using Alabastar, you agree to:</p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-pink-600 dark:text-pink-400 mt-1">•</span>
                  <span>Use the Platform only for legitimate and lawful purposes.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-600 dark:text-pink-400 mt-1">•</span>
                  <span>Provide accurate and truthful information.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-600 dark:text-pink-400 mt-1">•</span>
                  <span>Respect the rights and privacy of other users.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-600 dark:text-pink-400 mt-1">•</span>
                  <span>Not use the Platform to defraud, harass, or mislead others.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-600 dark:text-pink-400 mt-1">•</span>
                  <span>Not upload harmful, obscene, or illegal content.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-600 dark:text-pink-400 mt-1">•</span>
                  <span>Not copy, distribute, or modify any part of the Platform without authorization.</span>
                </li>
              </ul>
              <p className="mt-4 font-semibold text-slate-900 dark:text-slate-50">
                Violation of these rules may result in suspension, termination, or legal action.
              </p>
            </div>

            {/* Section 7: Vendor and Service Provider Obligations */}
            <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 grid place-items-center rounded-lg bg-gradient-to-br from-pink-600 to-orange-500 text-white">
                  <Users size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">7. Vendor and Service Provider Obligations</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">If you register as a vendor or service provider, you agree to:</p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-pink-600 dark:text-pink-400 mt-0.5 shrink-0" />
                  <span>Provide accurate and verifiable business information.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-pink-600 dark:text-pink-400 mt-0.5 shrink-0" />
                  <span>Deliver services or products as described in your listings.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-pink-600 dark:text-pink-400 mt-0.5 shrink-0" />
                  <span>Comply with all applicable business and consumer protection laws.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-pink-600 dark:text-pink-400 mt-0.5 shrink-0" />
                  <span>Not misrepresent your qualifications or services.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-pink-600 dark:text-pink-400 mt-0.5 shrink-0" />
                  <span>Handle user data in compliance with the Nigeria Data Protection Regulation (NDPR) and NDPA 2023.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-pink-600 dark:text-pink-400 mt-0.5 shrink-0" />
                  <span>Resolve disputes with customers in good faith.</span>
                </li>
              </ul>
              <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed">
                Alabastar reserves the right to verify vendor identities and remove listings that are false, misleading, or illegal.
              </p>
            </div>

            {/* Section 8: Payments and Fees */}
            <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 grid place-items-center rounded-lg bg-gradient-to-br from-pink-600 to-orange-500 text-white">
                  <CreditCard size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">8. Payments and Fees</h2>
              </div>
              <div className="space-y-3 text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>Payments on the Platform may be processed by Alabastar or a third-party payment partner.</p>
                <p>You agree to provide accurate billing information and authorize payment for services purchased.</p>
                <p>Alabastar may charge service or transaction fees where applicable (clearly disclosed before payment).</p>
                <p>We do not store your payment card details directly; they are securely processed by trusted payment gateways.</p>
                <p>All transactions are final, except as otherwise stated in our <Link href="/refund" className="text-pink-600 dark:text-pink-400 hover:underline font-semibold">refund policy</Link> or required by law.</p>
              </div>
            </div>

            {/* Section 9: Refunds and Disputes */}
            <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 grid place-items-center rounded-lg bg-gradient-to-br from-pink-600 to-orange-500 text-white">
                  <AlertTriangle size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">9. Refunds and Disputes</h2>
              </div>
              <div className="space-y-3 text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>Refunds (if applicable) are subject to the service provider's or Alabastar's <Link href="/refund" className="text-pink-600 dark:text-pink-400 hover:underline font-semibold">refund policy</Link>.</p>
                <p>Users must first attempt to resolve disputes directly with the service provider.</p>
                <p>If unresolved, users may escalate the issue to Alabastar for mediation.</p>
                <p>Alabastar reserves the right to issue or withhold refunds after investigating each case.</p>
                <p>We are not obligated to intervene in every dispute but will act fairly where necessary.</p>
              </div>
            </div>

            {/* Section 10: Content and Intellectual Property */}
            <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 grid place-items-center rounded-lg bg-gradient-to-br from-pink-600 to-orange-500 text-white">
                  <Copyright size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">10. Content and Intellectual Property</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-2">a. User Content</h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    You may upload or post content such as reviews, photos, or business information. By doing so, you grant Alabastar a non-exclusive, royalty-free, worldwide license to use, display, and distribute that content for platform operations and marketing.
                  </p>
                  <p className="mt-2 text-slate-600 dark:text-slate-300 leading-relaxed">
                    You represent that you own all rights to your content and that it does not infringe the rights of others.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-2">b. Alabastar Content</h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    All platform content — including design, logo, text, graphics, and code — is the intellectual property of Alabastar or its licensors. You may not copy, modify, or reuse it without written permission.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 11: Privacy and Data Protection */}
            <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 grid place-items-center rounded-lg bg-gradient-to-br from-pink-600 to-orange-500 text-white">
                  <Eye size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">11. Privacy and Data Protection</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Your privacy is very important to us. All personal data collected through Alabastar is processed in accordance with our <Link href="/privacy" className="text-pink-600 dark:text-pink-400 hover:underline font-semibold">Privacy Policy</Link>, which complies with the Nigeria Data Protection Regulation (NDPR) and the Nigeria Data Protection Act (NDPA 2023).
              </p>
            </div>

            {/* Section 12: Prohibited Activities */}
            <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 grid place-items-center rounded-lg bg-gradient-to-br from-pink-600 to-orange-500 text-white">
                  <Ban size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">12. Prohibited Activities</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">You agree not to:</p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <XCircle size={18} className="text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
                  <span>Attempt to hack, disrupt, or interfere with the Platform.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle size={18} className="text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
                  <span>Create fake profiles or listings.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle size={18} className="text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
                  <span>Use automated bots or scripts to collect data.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle size={18} className="text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
                  <span>Violate intellectual property rights.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle size={18} className="text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
                  <span>Use the Platform for money laundering or fraud.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle size={18} className="text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
                  <span>Post false reviews or manipulate ratings.</span>
                </li>
              </ul>
              <p className="mt-4 font-semibold text-slate-900 dark:text-slate-50">
                Engaging in any of these may result in immediate account termination and legal consequences.
              </p>
            </div>

            {/* Section 13: Limitation of Liability */}
            <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 grid place-items-center rounded-lg bg-gradient-to-br from-pink-600 to-orange-500 text-white">
                  <AlertCircle size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">13. Limitation of Liability</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">To the fullest extent permitted by law:</p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-pink-600 dark:text-pink-400 mt-1">•</span>
                  <span>Alabastar provides its services "as is" and "as available."</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-600 dark:text-pink-400 mt-1">•</span>
                  <span>We make no warranties, express or implied, about accuracy, reliability, or availability.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-600 dark:text-pink-400 mt-1">•</span>
                  <span>We are not liable for any indirect, incidental, or consequential damages, including data loss, loss of profits, or business interruptions.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-600 dark:text-pink-400 mt-1">•</span>
                  <span>Alabastar is not responsible for the conduct, quality, or legality of services provided by users, vendors, or third parties.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-600 dark:text-pink-400 mt-1">•</span>
                  <span>Your use of the Platform is at your sole risk.</span>
                </li>
              </ul>
            </div>

            {/* Section 14: Indemnification */}
            <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 grid place-items-center rounded-lg bg-gradient-to-br from-pink-600 to-orange-500 text-white">
                  <ShieldCheck size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">14. Indemnification</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                You agree to indemnify and hold harmless Alabastar, its affiliates, officers, employees, and partners from any claims, damages, or expenses arising from:
              </p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-pink-600 dark:text-pink-400 mt-1">•</span>
                  <span>Your use or misuse of the Platform;</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-600 dark:text-pink-400 mt-1">•</span>
                  <span>Violation of these Terms;</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-600 dark:text-pink-400 mt-1">•</span>
                  <span>Violation of any law or third-party rights.</span>
                </li>
              </ul>
            </div>

            {/* Section 15: Suspension and Termination */}
            <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 grid place-items-center rounded-lg bg-gradient-to-br from-pink-600 to-orange-500 text-white">
                  <XCircle size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">15. Suspension and Termination</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                We may suspend or permanently terminate your access to Alabastar if:
              </p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300 mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-pink-600 dark:text-pink-400 mt-1">•</span>
                  <span>You violate these Terms or applicable laws;</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-600 dark:text-pink-400 mt-1">•</span>
                  <span>You engage in fraud, harassment, or illegal activity;</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-600 dark:text-pink-400 mt-1">•</span>
                  <span>Required by law enforcement or regulatory authorities.</span>
                </li>
              </ul>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Upon termination, your right to use the Platform immediately ceases, but our rights and obligations (including intellectual property and limitation of liability) will survive.
              </p>
            </div>

            {/* Section 16: Modifications to the Terms */}
            <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 grid place-items-center rounded-lg bg-gradient-to-br from-pink-600 to-orange-500 text-white">
                  <FileText size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">16. Modifications to the Terms</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Alabastar reserves the right to update or modify these Terms at any time. When we do, we will revise the "Last Updated" date and post the new version on our Platform. Continued use of the Platform after updates constitutes acceptance of the revised Terms.
              </p>
            </div>

            {/* Section 17: Governing Law and Jurisdiction */}
            <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 grid place-items-center rounded-lg bg-gradient-to-br from-pink-600 to-orange-500 text-white">
                  <Gavel size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">17. Governing Law and Jurisdiction</h2>
              </div>
              <div className="space-y-3 text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>These Terms are governed by the laws of the Federal Republic of Nigeria.</p>
                <p>In the event of a dispute, the matter shall first be resolved amicably.</p>
                <p>If unresolved, it shall be referred to arbitration in Lagos, Nigeria, under the Arbitration and Mediation Act 2023. The arbitrator's decision shall be final and binding.</p>
              </div>
            </div>

            {/* Section 18: Severability */}
            <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 grid place-items-center rounded-lg bg-gradient-to-br from-pink-600 to-orange-500 text-white">
                  <FileText size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">18. Severability</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                If any part of these Terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.
              </p>
            </div>

            {/* Section 19: Contact Information */}
            <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 grid place-items-center rounded-lg bg-gradient-to-br from-pink-600 to-orange-500 text-white">
                  <Mail size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">19. Contact Information</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                For questions, complaints, or support, please contact:
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-pink-600 dark:text-pink-400" />
                  <a href="mailto:support@alabastar.ng" className="text-slate-900 dark:text-slate-50 font-semibold hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
                    support@alabastar.ng
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-pink-600 dark:text-pink-400" />
                  <span className="text-slate-600 dark:text-slate-300">+234</span>
                </div>
              </div>
            </div>

            {/* Section 20: Entire Agreement */}
            <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 grid place-items-center rounded-lg bg-gradient-to-br from-pink-600 to-orange-500 text-white">
                  <FileText size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">20. Entire Agreement</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                These Terms, together with our <Link href="/privacy" className="text-pink-600 dark:text-pink-400 hover:underline font-semibold">Privacy Policy</Link> and any other posted legal notices, constitute the entire agreement between you and Alabastar regarding the use of the Platform.
              </p>
            </div>

            {/* Compliance Statement */}
            <div className="rounded-3xl border-2 border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/20 backdrop-blur-xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 grid place-items-center rounded-lg bg-gradient-to-br from-green-600 to-green-500 text-white">
                  <Scale size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">Compliance Statement</h2>
              </div>
              <p className="text-slate-700 dark:text-slate-300 font-semibold mb-4">
                These Terms and Conditions comply with:
              </p>
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                  <span>The Nigeria Data Protection Act 2023 (NDPA)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                  <span>The NDPR 2019</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                  <span>The Cybercrimes (Prohibition, Prevention, etc.) Act 2015</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                  <span>The Arbitration and Mediation Act 2023</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                  <span>Other applicable Nigerian e-commerce and contract laws.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

