"use client";

import { FileText, Shield, Scale, Mail, Phone, MapPin } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="relative">
      <section className="relative overflow-hidden pt-16 sm:pt-24 pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-pink-600 to-orange-500 mb-6">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-50 mb-4">
              Terms and Conditions
            </h1>
            <p className="text-slate-600 dark:text-slate-300">
              Last Updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Content */}
          <div className="space-y-8">
            {/* Introduction */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">1. Introduction</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                Welcome to Alabastar ("we", "our", or "us"). These Terms and Conditions ("Terms") govern your use of the website https://alabastar.ng and all related services, features, and content (collectively, the "Platform" or "Services").
              </p>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                By accessing or using our Platform, you agree to comply with these Terms. If you do not agree, please stop (discontinue) using the Platform immediately.
              </p>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                These Terms constitute a legally binding agreement between you ("user", "you", or "your") and Alabastar.
              </p>
            </div>

            {/* About Alabastar */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">2. About Alabastar</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                Alabastar is an online marketplace designed to connect users (customers) with service providers, vendors, or businesses who offer goods or services.
              </p>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                We act as an intermediary platform facilitating discovery, communication, and transactions between users and service providers — but we are not a direct party to any transaction between users and providers.
              </p>
            </div>

            {/* Eligibility */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">3. Eligibility</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                To use Alabastar, you must:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 ml-4">
                <li>Be at least 18 years old and have full legal capacity to enter a binding contract.</li>
                <li>Provide accurate, complete, and up-to-date registration details.</li>
                <li>Use the Platform for lawful purposes only.</li>
              </ul>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
                We reserve the right to suspend or terminate any account that violates these Terms or any applicable laws.
              </p>
            </div>

            {/* Account Registration */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">4. Account Registration and Security</h2>
              <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 ml-4">
                <li>You may need to create an account to access certain services.</li>
                <li>You are responsible for maintaining the confidentiality of your login credentials and all activities under your account.</li>
                <li>You agree to notify Alabastar immediately of any unauthorized access or breach.</li>
                <li>We reserve the right to refuse, suspend, or delete your account if we suspect fraudulent, illegal, or abusive behavior.</li>
              </ul>
            </div>

            {/* Services and Marketplace Role */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">5. Services and Marketplace Role</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                Alabastar provides a digital platform where:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 ml-4 mb-4">
                <li>Customers can find and hire service providers or purchase products.</li>
                <li>Vendors/Providers can list, promote, and sell their services or goods.</li>
              </ul>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                We are not a service provider, agent, or guarantor of any user, vendor, or transaction. All bookings, purchases, and payments made through the Platform are agreements between you and the respective provider/vendor. Alabastar only facilitates the process.
              </p>
            </div>

            {/* User Responsibilities */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">6. User Responsibilities</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                When using Alabastar, you agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 ml-4">
                <li>Use the Platform only for legitimate and lawful purposes.</li>
                <li>Provide accurate and truthful information.</li>
                <li>Respect the rights and privacy of other users.</li>
                <li>Not use the Platform to defraud, harass, or mislead others.</li>
                <li>Not upload harmful, obscene, or illegal content.</li>
                <li>Not copy, distribute, or modify any part of the Platform without authorization.</li>
              </ul>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
                Violation of these rules may result in suspension, termination, or legal action.
              </p>
            </div>

            {/* Vendor and Service Provider Obligations */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">7. Vendor and Service Provider Obligations</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                If you register as a vendor or service provider, you agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 ml-4">
                <li>Provide accurate and verifiable business information.</li>
                <li>Deliver services or products as described in your listings.</li>
                <li>Comply with all applicable business and consumer protection laws.</li>
                <li>Not misrepresent your qualifications or services.</li>
                <li>Handle user data in compliance with the Nigeria Data Protection Regulation (NDPR) and NDPA 2023.</li>
                <li>Resolve disputes with customers in good faith.</li>
              </ul>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
                Alabastar reserves the right to verify vendor identities and remove listings that are false, misleading, or illegal.
              </p>
            </div>

            {/* Payments and Fees */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">8. Payments and Fees</h2>
              <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 ml-4">
                <li>Payments on the Platform may be processed by Alabastar or a third-party payment partner.</li>
                <li>You agree to provide accurate billing information and authorize payment for services purchased.</li>
                <li>Alabastar may charge service or transaction fees where applicable (clearly disclosed before payment).</li>
                <li>We do not store your payment card details directly; they are securely processed by trusted payment gateways.</li>
                <li>All transactions are final, except as otherwise stated in our refund policy or required by law.</li>
              </ul>
            </div>

            {/* Refunds and Disputes */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">9. Refunds and Disputes</h2>
              <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 ml-4">
                <li>Refunds (if applicable) are subject to the service provider's or Alabastar's refund policy.</li>
                <li>Users must first attempt to resolve disputes directly with the service provider.</li>
                <li>If unresolved, users may escalate the issue to Alabastar for mediation.</li>
                <li>Alabastar reserves the right to issue or withhold refunds after investigating each case.</li>
                <li>We are not obligated to intervene in every dispute but will act fairly where necessary.</li>
              </ul>
            </div>

            {/* Content and Intellectual Property */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">10. Content and Intellectual Property</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">a. User Content</h3>
                  <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 ml-4">
                    <li>You may upload or post content such as reviews, photos, or business information.</li>
                    <li>By doing so, you grant Alabastar a non-exclusive, royalty-free, worldwide license to use, display, and distribute that content for platform operations and marketing.</li>
                    <li>You represent that you own all rights to your content and that it does not infringe the rights of others.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">b. Alabastar Content</h3>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    All platform content — including design, logo, text, graphics, and code — is the intellectual property of Alabastar or its licensors. You may not copy, modify, or reuse it without written permission.
                  </p>
                </div>
              </div>
            </div>

            {/* Privacy and Data Protection */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">11. Privacy and Data Protection</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Your privacy is very important to us. All personal data collected through Alabastar is processed in accordance with our Privacy Policy, which complies with the Nigeria Data Protection Regulation (NDPR) and the Nigeria Data Protection Act (NDPA 2023). Please review our Privacy Policy here: <a href="/privacy" className="text-pink-600 hover:text-pink-700 dark:text-pink-400 underline">Privacy Policy</a>.
              </p>
            </div>

            {/* Prohibited Activities */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">12. Prohibited Activities</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">You agree not to:</p>
              <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 ml-4">
                <li>Attempt to hack, disrupt, or interfere with the Platform.</li>
                <li>Create fake profiles or listings.</li>
                <li>Use automated bots or scripts to collect data.</li>
                <li>Violate intellectual property rights.</li>
                <li>Use the Platform for money laundering or fraud.</li>
                <li>Post false reviews or manipulate ratings.</li>
              </ul>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
                Engaging in any of these may result in immediate account termination and legal consequences.
              </p>
            </div>

            {/* Limitation of Liability */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">13. Limitation of Liability</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                To the fullest extent permitted by law:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 ml-4">
                <li>Alabastar provides its services "as is" and "as available."</li>
                <li>We make no warranties, express or implied, about accuracy, reliability, or availability.</li>
                <li>We are not liable for any indirect, incidental, or consequential damages, including data loss, loss of profits, or business interruptions.</li>
                <li>Alabastar is not responsible for the conduct, quality, or legality of services provided by users, vendors, or third parties.</li>
                <li>Your use of the Platform is at your sole risk.</li>
              </ul>
            </div>

            {/* Indemnification */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">14. Indemnification</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                You agree to indemnify and hold harmless Alabastar, its affiliates, officers, employees, and partners from any claims, damages, or expenses arising from:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 ml-4">
                <li>Your use or misuse of the Platform;</li>
                <li>Violation of these Terms;</li>
                <li>Violation of any law or third-party rights.</li>
              </ul>
            </div>

            {/* Suspension and Termination */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">15. Suspension and Termination</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                We may suspend or permanently terminate your access to Alabastar if:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 ml-4">
                <li>You violate these Terms or applicable laws;</li>
                <li>You engage in fraud, harassment, or illegal activity;</li>
                <li>Required by law enforcement or regulatory authorities.</li>
              </ul>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
                Upon termination, your right to use the Platform immediately ceases, but our rights and obligations (including intellectual property and limitation of liability) will survive.
              </p>
            </div>

            {/* Modifications to the Terms */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">16. Modifications to the Terms</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Alabastar reserves the right to update or modify these Terms at any time. When we do, we will revise the "Last Updated" date and post the new version on our Platform. Continued use of the Platform after updates constitutes acceptance of the revised Terms.
              </p>
            </div>

            {/* Governing Law and Jurisdiction */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">17. Governing Law and Jurisdiction</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                These Terms are governed by the laws of the Federal Republic of Nigeria. In the event of a dispute, the matter shall first be resolved amicably. If unresolved, it shall be referred to arbitration in Lagos, Nigeria, under the Arbitration and Mediation Act 2023. The arbitrator's decision shall be final and binding.
              </p>
            </div>

            {/* Severability */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">18. Severability</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                If any part of these Terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.
              </p>
            </div>

            {/* Contact Information */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">19. Contact Information</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                For questions, complaints, or support, please contact:
              </p>
              <div className="space-y-3 text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                  <a href="mailto:support@alabastar.ng" className="hover:text-pink-600 dark:hover:text-pink-400">
                    support@alabastar.ng
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                  <a href="tel:+234" className="hover:text-pink-600 dark:hover:text-pink-400">
                    +234 (Office Phone)
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                  <span>Lagos, Nigeria</span>
                </div>
              </div>
            </div>

            {/* Entire Agreement */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">20. Entire Agreement</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                These Terms, together with our Privacy Policy and any other posted legal notices, constitute the entire agreement between you and Alabastar regarding the use of the Platform.
              </p>
            </div>

            {/* Compliance Statement */}
            <div className="rounded-2xl border-2 border-pink-200 dark:border-pink-900 bg-gradient-to-br from-pink-50 to-orange-50 dark:from-pink-950/30 dark:to-orange-950/30 p-6 sm:p-8 shadow-lg">
              <div className="flex items-start gap-4">
                <Shield className="w-8 h-8 text-pink-600 dark:text-pink-400 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">Compliance Statement</h2>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                    These Terms and Conditions comply with:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 ml-4">
                    <li>The Nigeria Data Protection Act 2023 (NDPA)</li>
                    <li>The NDPR 2019</li>
                    <li>The Cybercrimes (Prohibition, Prevention, etc.) Act 2015</li>
                    <li>The Arbitration and Mediation Act 2023</li>
                    <li>Other applicable Nigerian e-commerce and contract laws.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

