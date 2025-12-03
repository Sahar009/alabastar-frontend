"use client";

import { Shield, ShieldCheck, AlertTriangle, Eye, Lock, CheckCircle, Users, Ban, Mail, Phone, MapPin } from "lucide-react";

export default function SafetyPage() {
  return (
    <div className="relative">
      <section className="relative overflow-hidden pt-16 sm:pt-24 pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-pink-600 to-orange-500 mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-50 mb-4">
              Safety & Trust
            </h1>
            <p className="text-slate-700 dark:text-slate-300">
              Your security and peace of mind are our top priorities
            </p>
          </div>

          {/* Content */}
          <div className="space-y-8">
            {/* Introduction */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">Our Commitment to Safety</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                At Alabastar, we take user safety seriously. We've built a comprehensive safety system to protect both customers and service providers, ensuring a secure and trustworthy marketplace experience.
              </p>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                This Safety Policy outlines the measures we take to maintain a safe platform and what you can do to protect yourself when using our services.
              </p>
            </div>

            {/* Provider Verification */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 grid place-items-center rounded-xl bg-gradient-to-br from-pink-600 to-orange-500 text-white">
                  <ShieldCheck size={24} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Provider Verification</h2>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                Every service provider on Alabastar undergoes a verification process:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 ml-4">
                <li>Identity verification using government-issued identification</li>
                <li>Business registration document review (where applicable)</li>
                <li>Contact information verification</li>
                <li>Profile review and approval by our team</li>
                <li>Annual subscription requirement ensures active monitoring</li>
              </ul>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
                Only verified providers are allowed to list their services on our platform. This helps ensure that you're connecting with legitimate professionals.
              </p>
            </div>

            {/* Reporting & Moderation */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 grid place-items-center rounded-xl bg-gradient-to-br from-pink-600 to-orange-500 text-white">
                  <AlertTriangle size={24} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Reporting & Moderation</h2>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                We actively monitor the platform and investigate all reports of:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 ml-4 mb-4">
                <li>Fraudulent or misleading profiles</li>
                <li>Inappropriate behavior or harassment</li>
                <li>False reviews or ratings</li>
                <li>Violations of our Terms of Service</li>
                <li>Unsolicited messages or spam</li>
                <li>Any suspicious or illegal activity</li>
              </ul>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                If you encounter any safety concerns, please report them immediately through our platform or contact us directly. We take all reports seriously and investigate them promptly.
              </p>
            </div>

            {/* User Guidelines */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 grid place-items-center rounded-xl bg-gradient-to-br from-pink-600 to-orange-500 text-white">
                  <Users size={24} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Safety Guidelines for Users</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-3">For Customers</h3>
                  <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 ml-4">
                    <li>Always verify provider credentials before hiring</li>
                    <li>Check provider reviews and ratings on their profile</li>
                    <li>Communicate through the platform's messaging system when possible</li>
                    <li>Meet providers in public places for initial consultations</li>
                    <li>Trust your instincts — if something feels wrong, don't proceed</li>
                    <li>Keep records of all communications and agreements</li>
                    <li>Report any suspicious behavior immediately</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-3">For Service Providers</h3>
                  <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 ml-4">
                    <li>Maintain accurate and up-to-date profile information</li>
                    <li>Respond professionally to all customer inquiries</li>
                    <li>Deliver services as promised and described</li>
                    <li>Respect customer privacy and boundaries</li>
                    <li>Follow all local laws and regulations</li>
                    <li>Report any abusive or fraudulent customers</li>
                    <li>Keep business credentials current and valid</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Data Protection */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 grid place-items-center rounded-xl bg-gradient-to-br from-pink-600 to-orange-500 text-white">
                  <Lock size={24} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Data Protection & Privacy</h2>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                We protect your personal information with industry-standard security measures:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 ml-4">
                <li>Encrypted data transmission and storage</li>
                <li>Secure payment processing (where applicable)</li>
                <li>Regular security audits and updates</li>
                <li>Compliance with Nigeria Data Protection Regulation (NDPR) and NDPA 2023</li>
                <li>Limited data sharing with verified providers only</li>
              </ul>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
                For more details, please review our <a href="/privacy" className="text-pink-600 hover:text-pink-700 dark:text-pink-400 underline">Privacy Policy</a>.
              </p>
            </div>

            {/* Prohibited Activities */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 grid place-items-center rounded-xl bg-gradient-to-br from-pink-600 to-orange-500 text-white">
                  <Ban size={24} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Prohibited Activities</h2>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                The following activities are strictly prohibited and will result in immediate account suspension or termination:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 ml-4">
                <li>Creating fake profiles or impersonating others</li>
                <li>Harassment, threats, or abusive behavior</li>
                <li>Fraudulent transactions or scams</li>
                <li>Posting false reviews or manipulating ratings</li>
                <li>Spam, phishing, or malicious content</li>
                <li>Sharing contact information to circumvent the platform</li>
                <li>Any illegal activities or violations of local laws</li>
                <li>Using the platform for money laundering or other financial crimes</li>
              </ul>
            </div>

            {/* Account Security */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 grid place-items-center rounded-xl bg-gradient-to-br from-pink-600 to-orange-500 text-white">
                  <Eye size={24} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Account Security</h2>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                Protect your account by following these best practices:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 ml-4">
                <li>Use a strong, unique password</li>
                <li>Never share your account credentials with others</li>
                <li>Log out from shared or public devices</li>
                <li>Monitor your account for suspicious activity</li>
                <li>Enable two-factor authentication if available</li>
                <li>Keep your contact information up to date</li>
              </ul>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
                If you suspect unauthorized access to your account, contact us immediately.
              </p>
            </div>

            {/* Dispute Resolution */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 grid place-items-center rounded-xl bg-gradient-to-br from-pink-600 to-orange-500 text-white">
                  <CheckCircle size={24} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Dispute Resolution</h2>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                If you encounter a problem with a service provider or customer:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-slate-700 dark:text-slate-300 ml-4">
                <li>First, attempt to resolve the issue directly with the other party</li>
                <li>If unresolved, report the issue to our support team with evidence</li>
                <li>We will investigate and may mediate the dispute</li>
                <li>In severe cases, we may suspend or terminate accounts</li>
              </ol>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
                Note: Alabastar facilitates connections but is not a party to service agreements between users and providers. All service transactions occur directly between the parties involved.
              </p>
            </div>

            {/* Contact for Safety Issues */}
            <div className="rounded-2xl border-2 border-pink-200 dark:border-pink-900 bg-gradient-to-br from-pink-50 to-orange-50 dark:from-pink-950/30 dark:to-orange-950/30 p-6 sm:p-8 shadow-lg">
              <div className="flex items-start gap-4">
                <Shield className="w-8 h-8 text-pink-600 dark:text-pink-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">Report Safety Concerns</h2>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                    If you have safety concerns, need to report an incident, or have questions about our safety policies, please contact our Safety Team:
                  </p>
                  <div className="space-y-3 text-slate-700 dark:text-slate-300">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                      <a href="mailto:safety@alabastar.ng" className="hover:text-pink-600 dark:hover:text-pink-400">
                        safety@alabastar.ng
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
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4 text-sm">
                    For emergencies, please contact local law enforcement immediately. We are available to assist with follow-up investigations.
                  </p>
                </div>
              </div>
            </div>

            {/* Updates */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">Policy Updates</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                This Safety Policy may be updated periodically to reflect changes in our practices or legal requirements. We will notify users of significant changes via email or platform notifications. Continued use of Alabastar after updates constitutes acceptance of the revised policy.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}




