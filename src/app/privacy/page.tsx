"use client";

import { Shield, Lock, Eye, User, Database, Mail, Phone, MapPin } from "lucide-react";

export default function PrivacyPage() {
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
              Privacy Policy
            </h1>
            <p className="text-slate-700 dark:text-slate-300">
              Last Updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Content */}
          <div className="space-y-8">
            {/* Introduction */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">1. Introduction</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                Alabastar ("we", "our", or "us") is committed to protecting your privacy and personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform at https://alabastar.ng (the "Platform").
              </p>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                This Privacy Policy complies with the Nigeria Data Protection Regulation (NDPR) 2019 and the Nigeria Data Protection Act (NDPA) 2023. By using our Platform, you consent to the data practices described in this policy.
              </p>
            </div>

            {/* Information We Collect */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">2. Information We Collect</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">Personal Information</h3>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-2">
                    When you create an account or use our services, we may collect:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 ml-4">
                    <li>Name, email address, and phone number</li>
                    <li>Profile information and preferences</li>
                    <li>Payment information (processed securely through third-party gateways)</li>
                    <li>Location data for service matching</li>
                    <li>Government-issued identification (for provider verification)</li>
                    <li>Business registration documents (for service providers)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">Usage Data</h3>
                  <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 ml-4">
                    <li>IP address and device information</li>
                    <li>Browser type and version</li>
                    <li>Pages visited and time spent on the Platform</li>
                    <li>Search queries and service bookings</li>
                    <li>Interaction data with providers and customers</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">Content Data</h3>
                  <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 ml-4">
                    <li>Reviews and ratings</li>
                    <li>Messages between users and providers</li>
                    <li>Uploaded photos and documents</li>
                    <li>Service listings and descriptions</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* How We Use Your Information */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">3. How We Use Your Information</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                We use your personal data for the following purposes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 ml-4">
                <li>To provide, operate, and maintain our Platform</li>
                <li>To facilitate bookings and transactions between users and providers</li>
                <li>To verify provider identities and credentials</li>
                <li>To process payments and manage billing</li>
                <li>To send service-related notifications and updates</li>
                <li>To respond to your inquiries and provide customer support</li>
                <li>To improve our services and user experience</li>
                <li>To detect and prevent fraud, abuse, and security threats</li>
                <li>To comply with legal obligations and enforce our terms</li>
                <li>To send marketing communications (with your consent)</li>
              </ul>
            </div>

            {/* Data Sharing and Disclosure */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">4. Data Sharing and Disclosure</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">Service Providers</h3>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    We may share your information with third-party service providers who assist us in operating the Platform, such as payment processors, cloud hosting services, and analytics providers. These parties are contractually bound to protect your data.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">Users and Providers</h3>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    When you book a service, relevant information (such as your name, contact details, and service requirements) is shared with the service provider to facilitate the booking. Similarly, provider information is visible to customers on their profiles.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">Legal Requirements</h3>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    We may disclose your information if required by law, court order, or government regulation, or to protect our rights, property, or safety.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">Business Transfers</h3>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    In the event of a merger, acquisition, or sale of assets, your data may be transferred to the acquiring entity.
                  </p>
                </div>
              </div>
            </div>

            {/* Data Security */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">5. Data Security</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                We implement appropriate technical and organizational measures to protect your personal data, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 ml-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Secure payment processing through PCI-DSS compliant gateways</li>
                <li>Regular security assessments and vulnerability testing</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Employee training on data protection</li>
              </ul>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
                However, no method of transmission over the Internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
              </p>
            </div>

            {/* Your Rights */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">6. Your Rights (Under NDPR and NDPA)</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                You have the following rights regarding your personal data:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 ml-4">
                <li><strong>Right to Access:</strong> Request a copy of your personal data we hold</li>
                <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete data</li>
                <li><strong>Right to Erasure:</strong> Request deletion of your data (subject to legal obligations)</li>
                <li><strong>Right to Restriction:</strong> Request limitation of processing in certain circumstances</li>
                <li><strong>Right to Data Portability:</strong> Receive your data in a structured, machine-readable format</li>
                <li><strong>Right to Object:</strong> Object to processing of your data for marketing purposes</li>
                <li><strong>Right to Withdraw Consent:</strong> Withdraw consent where processing is based on consent</li>
                <li><strong>Right to Lodge Complaints:</strong> File complaints with the Nigeria Data Protection Commission</li>
              </ul>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
                To exercise these rights, please contact us at <a href="mailto:privacy@alabastar.ng" className="text-pink-600 hover:text-pink-700 dark:text-pink-400 underline">privacy@alabastar.ng</a>.
              </p>
            </div>

            {/* Data Retention */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">7. Data Retention</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                We retain your personal data only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, comply with legal obligations, resolve disputes, and enforce our agreements. Account data is typically retained for the duration of your account and for a reasonable period thereafter as required by law.
              </p>
            </div>

            {/* Cookies and Tracking */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">8. Cookies and Tracking Technologies</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                We use cookies and similar tracking technologies to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 ml-4">
                <li>Maintain your session and authenticate your account</li>
                <li>Remember your preferences and settings</li>
                <li>Analyze Platform usage and improve performance</li>
                <li>Provide personalized content and advertisements</li>
              </ul>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
                You can control cookies through your browser settings. However, disabling cookies may limit some Platform functionality.
              </p>
            </div>

            {/* Children's Privacy */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">9. Children's Privacy</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Our Platform is not intended for individuals under 18 years of age. We do not knowingly collect personal information from children. If we become aware that we have collected data from a minor, we will take steps to delete such information promptly.
              </p>
            </div>

            {/* International Data Transfers */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">10. International Data Transfers</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Your data may be transferred to and processed in countries outside Nigeria. When we transfer data internationally, we ensure appropriate safeguards are in place, such as standard contractual clauses approved by the Nigeria Data Protection Commission.
              </p>
            </div>

            {/* Updates to Privacy Policy */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">11. Updates to This Privacy Policy</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date. Your continued use of the Platform after changes become effective constitutes acceptance of the revised policy.
              </p>
            </div>

            {/* Contact Information */}
            <div className="rounded-2xl border-2 border-pink-200 dark:border-pink-900 bg-gradient-to-br from-pink-50 to-orange-50 dark:from-pink-950/30 dark:to-orange-950/30 p-6 sm:p-8 shadow-lg">
              <div className="flex items-start gap-4">
                <Lock className="w-8 h-8 text-pink-600 dark:text-pink-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">12. Contact Us</h2>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                    If you have questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact our Data Protection Officer:
                  </p>
                  <div className="space-y-3 text-slate-700 dark:text-slate-300">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                      <a href="mailto:privacy@alabastar.ng" className="hover:text-pink-600 dark:hover:text-pink-400">
                        privacy@alabastar.ng
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
                    You also have the right to lodge a complaint with the Nigeria Data Protection Commission if you believe your data protection rights have been violated.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}




