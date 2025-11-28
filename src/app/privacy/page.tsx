"use client";
import { ShieldCheck, Eye, Lock, Database, Users, Mail, Phone, FileText, CheckCircle, AlertCircle, Cookie, Settings, Bell, Globe, Scale } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type React from "react";

export default function PrivacyPage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 sm:pt-24 pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 grid place-items-center rounded-xl bg-gradient-to-br from-pink-600 to-orange-500 text-white">
                  <ShieldCheck size={24} />
                </div>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-50">
                  Privacy Policy
                </h1>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Last Updated: {new Date().toLocaleDateString()}</p>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                At Alabastar, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, store, and protect your data when you use our Platform.
              </p>
              <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                This policy complies with the Nigeria Data Protection Regulation (NDPR 2019) and the Nigeria Data Protection Act (NDPA 2023). By using Alabastar, you consent to the practices described in this policy.
              </p>
            </div>
            <div className="relative">
              <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-8 shadow-lg">
                <Image
                  src="/privacy.png"
                  alt="Privacy Policy"
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
            {/* Section 1: Information We Collect */}
            <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 grid place-items-center rounded-lg bg-gradient-to-br from-pink-600 to-orange-500 text-white">
                  <Database size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">1. Information We Collect</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-2">a. Personal Information</h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-2">
                    When you register or use Alabastar, we may collect:
                  </p>
                  <ul className="space-y-2 text-slate-600 dark:text-slate-300 ml-4">
                    <li className="flex items-start gap-2">
                      <span className="text-pink-600 dark:text-pink-400 mt-1">•</span>
                      <span>Name, email address, phone number, and physical address</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-pink-600 dark:text-pink-400 mt-1">•</span>
                      <span>Profile information, including photos and business details (for service providers)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-pink-600 dark:text-pink-400 mt-1">•</span>
                      <span>Payment and billing information (processed securely through third-party payment gateways)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-pink-600 dark:text-pink-400 mt-1">•</span>
                      <span>Identity verification documents (for service provider verification)</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-2">b. Usage Information</h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-2">
                    We automatically collect information about how you interact with our Platform:
                  </p>
                  <ul className="space-y-2 text-slate-600 dark:text-slate-300 ml-4">
                    <li className="flex items-start gap-2">
                      <span className="text-pink-600 dark:text-pink-400 mt-1">•</span>
                      <span>Device information (IP address, browser type, operating system)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-pink-600 dark:text-pink-400 mt-1">•</span>
                      <span>Usage patterns, search queries, and pages visited</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-pink-600 dark:text-pink-400 mt-1">•</span>
                      <span>Location data (when you enable location services)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-pink-600 dark:text-pink-400 mt-1">•</span>
                      <span>Cookies and similar tracking technologies</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-2">c. Communication Data</h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    We collect information from your communications with us, including customer support inquiries, feedback, and messages sent through the Platform.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2: How We Use Your Information */}
            <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 grid place-items-center rounded-lg bg-gradient-to-br from-pink-600 to-orange-500 text-white">
                  <Settings size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">2. How We Use Your Information</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                We use your information for the following purposes:
              </p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-pink-600 dark:text-pink-400 mt-0.5 shrink-0" />
                  <span>To provide, maintain, and improve our Platform services</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-pink-600 dark:text-pink-400 mt-0.5 shrink-0" />
                  <span>To process transactions, subscriptions, and payments</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-pink-600 dark:text-pink-400 mt-0.5 shrink-0" />
                  <span>To verify service provider identities and maintain platform safety</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-pink-600 dark:text-pink-400 mt-0.5 shrink-0" />
                  <span>To facilitate communication between customers and service providers</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-pink-600 dark:text-pink-400 mt-0.5 shrink-0" />
                  <span>To send you service updates, notifications, and marketing communications (with your consent)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-pink-600 dark:text-pink-400 mt-0.5 shrink-0" />
                  <span>To detect, prevent, and address fraud, security issues, and violations of our Terms</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-pink-600 dark:text-pink-400 mt-0.5 shrink-0" />
                  <span>To comply with legal obligations and respond to lawful requests</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-pink-600 dark:text-pink-400 mt-0.5 shrink-0" />
                  <span>To analyze usage patterns and improve user experience</span>
                </li>
              </ul>
            </div>

            {/* Section 3: Data Sharing and Disclosure */}
            <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 grid place-items-center rounded-lg bg-gradient-to-br from-pink-600 to-orange-500 text-white">
                  <Users size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">3. Data Sharing and Disclosure</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                We do not sell your personal information. We may share your data only in the following circumstances:
              </p>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-2">a. Service Providers</h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    We may share information with trusted third-party service providers who assist us in operating our Platform, processing payments, hosting data, or providing customer support. These providers are contractually obligated to protect your data.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-2">b. Platform Users</h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    When you contact a service provider through Alabastar, we may share your contact information to facilitate communication. Service providers can see your public profile information when you interact with them.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-2">c. Legal Requirements</h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    We may disclose your information if required by law, court order, or government regulation, or to protect the rights, property, or safety of Alabastar, our users, or others.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-2">d. Business Transfers</h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new entity, subject to the same privacy protections.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 4: Data Security */}
            <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 grid place-items-center rounded-lg bg-gradient-to-br from-pink-600 to-orange-500 text-white">
                  <Lock size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">4. Data Security</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                We implement industry-standard security measures to protect your personal information:
              </p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-pink-600 dark:text-pink-400 mt-0.5 shrink-0" />
                  <span>Encryption of data in transit and at rest</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-pink-600 dark:text-pink-400 mt-0.5 shrink-0" />
                  <span>Secure authentication and access controls</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-pink-600 dark:text-pink-400 mt-0.5 shrink-0" />
                  <span>Regular security audits and vulnerability assessments</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-pink-600 dark:text-pink-400 mt-0.5 shrink-0" />
                  <span>Limited access to personal data on a need-to-know basis</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-pink-600 dark:text-pink-400 mt-0.5 shrink-0" />
                  <span>Secure payment processing through certified payment gateways</span>
                </li>
              </ul>
              <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed">
                However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
              </p>
            </div>

            {/* Section 5: Your Rights */}
            <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 grid place-items-center rounded-lg bg-gradient-to-br from-pink-600 to-orange-500 text-white">
                  <Eye size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">5. Your Rights</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Under the Nigeria Data Protection Regulation (NDPR) and NDPA 2023, you have the following rights:
              </p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-pink-600 dark:text-pink-400 mt-0.5 shrink-0" />
                  <span><strong>Right to Access:</strong> Request a copy of your personal data we hold</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-pink-600 dark:text-pink-400 mt-0.5 shrink-0" />
                  <span><strong>Right to Rectification:</strong> Correct inaccurate or incomplete information</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-pink-600 dark:text-pink-400 mt-0.5 shrink-0" />
                  <span><strong>Right to Erasure:</strong> Request deletion of your personal data (subject to legal obligations)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-pink-600 dark:text-pink-400 mt-0.5 shrink-0" />
                  <span><strong>Right to Restrict Processing:</strong> Limit how we use your data</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-pink-600 dark:text-pink-400 mt-0.5 shrink-0" />
                  <span><strong>Right to Data Portability:</strong> Receive your data in a structured, machine-readable format</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-pink-600 dark:text-pink-400 mt-0.5 shrink-0" />
                  <span><strong>Right to Object:</strong> Object to processing of your data for certain purposes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-pink-600 dark:text-pink-400 mt-0.5 shrink-0" />
                  <span><strong>Right to Withdraw Consent:</strong> Withdraw consent for data processing at any time</span>
                </li>
              </ul>
              <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed">
                To exercise any of these rights, please contact us at <a href="mailto:privacy@alabastar.ng" className="text-pink-600 dark:text-pink-400 hover:underline font-semibold">privacy@alabastar.ng</a>. We will respond to your request within 30 days.
              </p>
            </div>

            {/* Section 6: Cookies and Tracking Technologies */}
            <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 grid place-items-center rounded-lg bg-gradient-to-br from-pink-600 to-orange-500 text-white">
                  <Cookie size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">6. Cookies and Tracking Technologies</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                We use cookies and similar technologies to enhance your experience, analyze usage, and personalize content. Types of cookies we use:
              </p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-pink-600 dark:text-pink-400 mt-1">•</span>
                  <span><strong>Essential Cookies:</strong> Required for the Platform to function properly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-600 dark:text-pink-400 mt-1">•</span>
                  <span><strong>Analytics Cookies:</strong> Help us understand how users interact with our Platform</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-600 dark:text-pink-400 mt-1">•</span>
                  <span><strong>Preference Cookies:</strong> Remember your settings and preferences</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-600 dark:text-pink-400 mt-1">•</span>
                  <span><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements (with your consent)</span>
                </li>
              </ul>
              <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed">
                You can control cookies through your browser settings. However, disabling certain cookies may affect Platform functionality.
              </p>
            </div>

            {/* Section 7: Data Retention */}
            <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 grid place-items-center rounded-lg bg-gradient-to-br from-pink-600 to-orange-500 text-white">
                  <Database size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">7. Data Retention</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. When you delete your account, we will delete or anonymize your data, except where we are required to retain it by law or for legitimate business purposes.
              </p>
            </div>

            {/* Section 8: Children's Privacy */}
            <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 grid place-items-center rounded-lg bg-gradient-to-br from-pink-600 to-orange-500 text-white">
                  <Users size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">8. Children's Privacy</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Alabastar is not intended for users under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected information from a child under 18, we will take steps to delete such information promptly. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </div>

            {/* Section 9: Third-Party Links */}
            <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 grid place-items-center rounded-lg bg-gradient-to-br from-pink-600 to-orange-500 text-white">
                  <Globe size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">9. Third-Party Links</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Our Platform may contain links to third-party websites or services. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.
              </p>
            </div>

            {/* Section 10: International Data Transfers */}
            <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 grid place-items-center rounded-lg bg-gradient-to-br from-pink-600 to-orange-500 text-white">
                  <Globe size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">10. International Data Transfers</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Your information may be transferred to and processed in countries other than Nigeria, where data protection laws may differ. We ensure that appropriate safeguards are in place to protect your data in accordance with NDPR and NDPA requirements.
              </p>
            </div>

            {/* Section 11: Changes to This Policy */}
            <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 grid place-items-center rounded-lg bg-gradient-to-br from-pink-600 to-orange-500 text-white">
                  <FileText size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">11. Changes to This Policy</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of significant changes by posting the updated policy on our Platform and updating the "Last Updated" date. Your continued use of Alabastar after such changes constitutes acceptance of the updated policy.
              </p>
            </div>

            {/* Section 12: Contact Information */}
            <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 grid place-items-center rounded-lg bg-gradient-to-br from-pink-600 to-orange-500 text-white">
                  <Mail size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">12. Contact Information</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-pink-600 dark:text-pink-400" />
                  <div>
                    <a href="mailto:privacy@alabastar.ng" className="text-slate-900 dark:text-slate-50 font-semibold hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
                      privacy@alabastar.ng
                    </a>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">For privacy-related inquiries</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-pink-600 dark:text-pink-400" />
                  <div>
                    <a href="mailto:support@alabastar.ng" className="text-slate-900 dark:text-slate-50 font-semibold hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
                      support@alabastar.ng
                    </a>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">For general support</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-pink-600 dark:text-pink-400" />
                  <span className="text-slate-600 dark:text-slate-300">+234</span>
                </div>
              </div>
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
                This Privacy Policy complies with:
              </p>
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                  <span>Nigeria Data Protection Regulation (NDPR 2019)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                  <span>Nigeria Data Protection Act (NDPA 2023)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                  <span>Federal Competition and Consumer Protection Act (FCCPA 2018)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                  <span>Electronic Transactions Act 2023</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                  <span>Cybercrimes (Prohibition, Prevention, etc.) Act 2015</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

