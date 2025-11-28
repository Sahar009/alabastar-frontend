"use client";
import { ShieldCheck, CreditCard, XCircle, AlertCircle, CheckCircle, Mail, Phone, FileText, Scale, Lock } from "lucide-react";
import Image from "next/image";
import type React from "react";

export default function RefundPage() {
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
                  Refund & Cancellation Policy
                </h1>
              </div>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                This policy explains how Alabastar handles subscription payments, refunds, and cancellations made by service providers who subscribe to our Platform.
              </p>
              <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                Alabastar serves as a connection and listing platform. We do not collect or process payments for services between customers and providers — such transactions occur offline, directly between the two parties. This policy applies only to subscription fees paid by service providers for listing and onboarding on Alabastar.
              </p>
            </div>
            <div className="relative">
              <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-8 shadow-lg">
                <Image
                  src="/refund.png"
                  alt="Refund and Cancellation Policy"
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
            {/* Section 2: Subscription Payments */}
            <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 grid place-items-center rounded-lg bg-gradient-to-br from-pink-600 to-orange-500 text-white">
                  <CreditCard size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">2. Subscription Payments</h2>
              </div>
              <div className="space-y-4 text-slate-600 dark:text-slate-300">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-2">a. Annual Subscription</h3>
                  <p className="leading-relaxed">
                    To access Alabastar as a verified service provider or vendor, you are required to pay an annual subscription fee. This fee grants you access to list your services, create a business profile, and connect with potential customers on the Platform.
                  </p>
                  <p className="mt-2 leading-relaxed">
                    The subscription begins immediately after successful payment and remains valid for 12 months, unless otherwise stated.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-2">b. Payment Method</h3>
                  <p className="leading-relaxed">
                    Subscription fees are paid online through approved payment gateways or via other official channels provided by Alabastar. Once payment is confirmed, your provider account will be activated and visible to potential clients.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3: No Refunds After Activation */}
            <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 grid place-items-center rounded-lg bg-gradient-to-br from-pink-600 to-orange-500 text-white">
                  <XCircle size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">3. No Refunds After Activation</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Because Alabastar provides immediate access to a digital listing service upon payment, all subscription payments are non-refundable once your account is activated.
              </p>
              <p className="font-semibold text-slate-900 dark:text-slate-50 mb-3">Refunds will not be issued for:</p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-pink-600 dark:text-pink-400 mt-1">•</span>
                  <span>Change of mind after payment;</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-600 dark:text-pink-400 mt-1">•</span>
                  <span>Non-usage of the Platform;</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-600 dark:text-pink-400 mt-1">•</span>
                  <span>Failure to secure customers through the Platform;</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-600 dark:text-pink-400 mt-1">•</span>
                  <span>Early termination of your account;</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-600 dark:text-pink-400 mt-1">•</span>
                  <span>Violation of Alabastar's Terms of Service leading to account suspension or removal.</span>
                </li>
              </ul>
              <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed">
                By subscribing, you acknowledge and agree that the subscription fee is non-refundable and covers your listing visibility, verification, and platform maintenance for the subscription period.
              </p>
            </div>

            {/* Section 4: Exceptions */}
            <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 grid place-items-center rounded-lg bg-gradient-to-br from-pink-600 to-orange-500 text-white">
                  <AlertCircle size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">4. Exceptions — Refund Eligibility</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Refunds may only be considered under the following exceptional circumstances:
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-1">Duplicate Payment</h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">If you were accidentally charged twice for the same subscription period.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-1">Technical Error</h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">If a system or payment gateway error resulted in an incorrect deduction without account activation.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-1">Service Failure on Our Part</h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">If, due to internal technical failure, your subscription could not be activated within 7 business days after confirmed payment.</p>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed">
                Refunds for these cases will be reviewed and, if approved, processed within 10–15 working days.
              </p>
            </div>

            {/* Section 5: Cancellation */}
            <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 grid place-items-center rounded-lg bg-gradient-to-br from-pink-600 to-orange-500 text-white">
                  <XCircle size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">5. Cancellation of Subscription</h2>
              </div>
              <div className="space-y-3 text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>You may cancel your subscription at any time through your dashboard or by contacting <a href="mailto:support@alabastar.ng" className="text-pink-600 dark:text-pink-400 hover:underline font-semibold">support@alabastar.ng</a>.</p>
                <p>Cancellation stops auto-renewal of future subscriptions (if enabled) but does not entitle you to a refund for the remaining period of your active plan.</p>
                <p>Once canceled, your listing will remain active until your paid subscription period ends, after which it will be automatically removed from the Platform.</p>
              </div>
            </div>

            {/* Section 6: Termination */}
            <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 grid place-items-center rounded-lg bg-gradient-to-br from-pink-600 to-orange-500 text-white">
                  <Lock size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">6. Termination by Alabastar</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Alabastar reserves the right to suspend or terminate a provider's account without refund if:
              </p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-pink-600 dark:text-pink-400 mt-1">•</span>
                  <span>False or misleading information is provided during registration;</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-600 dark:text-pink-400 mt-1">•</span>
                  <span>You engage in fraudulent, unethical, or illegal business practices;</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-600 dark:text-pink-400 mt-1">•</span>
                  <span>You violate our Terms of Service, Privacy Policy, or User Safety Policy;</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-600 dark:text-pink-400 mt-1">•</span>
                  <span>You attempt to solicit customers off-platform in deceptive ways;</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-600 dark:text-pink-400 mt-1">•</span>
                  <span>You post offensive or prohibited content.</span>
                </li>
              </ul>
              <p className="mt-4 font-semibold text-slate-900 dark:text-slate-50">
                In all such cases, the subscription fee remains non-refundable.
              </p>
            </div>

            {/* Section 7: Provider Renewal */}
            <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 grid place-items-center rounded-lg bg-gradient-to-br from-pink-600 to-orange-500 text-white">
                  <CreditCard size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">7. Provider Renewal</h2>
              </div>
              <div className="space-y-3 text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>Renewal reminders will be sent before your subscription expires.</p>
                <p>Providers who wish to continue listing on Alabastar must renew their annual subscription before the expiration date.</p>
                <p>Failure to renew may result in the removal or deactivation of your business profile until payment is made.</p>
              </div>
            </div>

            {/* Section 8: Disputes */}
            <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 grid place-items-center rounded-lg bg-gradient-to-br from-pink-600 to-orange-500 text-white">
                  <FileText size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">8. Disputes and Resolution</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                If you believe you are eligible for a refund or dispute a charge, you may contact our Billing & Accounts Team at <a href="mailto:refund@alabastar.ng" className="text-pink-600 dark:text-pink-400 hover:underline font-semibold">refund@alabastar.ng</a> with the following details:
              </p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300 mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-pink-600 dark:text-pink-400 mt-1">•</span>
                  <span>Your full name and registered business name;</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-600 dark:text-pink-400 mt-1">•</span>
                  <span>Payment receipt or transaction reference number;</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-600 dark:text-pink-400 mt-1">•</span>
                  <span>Date and amount paid;</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-600 dark:text-pink-400 mt-1">•</span>
                  <span>Reason for your refund or dispute claim.</span>
                </li>
              </ul>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                All claims will be reviewed within 5 working days, and a resolution will be communicated via email.
              </p>
            </div>

            {/* Section 9: Offline Payments */}
            <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 grid place-items-center rounded-lg bg-gradient-to-br from-pink-600 to-orange-500 text-white">
                  <CreditCard size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">9. Offline Payments Between Users</h2>
              </div>
              <div className="space-y-3 text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>Alabastar does not process, mediate, or guarantee payments between customers and service providers.</p>
                <p>Any payment made directly between a provider and a customer (offline or outside the Platform) is solely between those parties.</p>
                <p>Alabastar bears no responsibility or liability for non-payment, service failure, or disputes arising from such offline transactions.</p>
                <p>We encourage both customers and providers to communicate clearly and maintain professional agreements.</p>
              </div>
            </div>

            {/* Section 10: Policy Updates */}
            <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 grid place-items-center rounded-lg bg-gradient-to-br from-pink-600 to-orange-500 text-white">
                  <FileText size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">10. Policy Updates</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Alabastar may revise this Refund & Cancellation Policy from time to time to reflect operational, legal, or regulatory updates. The revised version will be posted on our website with an updated "Last Updated" date. Continued use of our Platform after such updates constitutes acceptance of the revised terms.
              </p>
            </div>

            {/* Section 11: Contact Information */}
            <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 grid place-items-center rounded-lg bg-gradient-to-br from-pink-600 to-orange-500 text-white">
                  <Mail size={20} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">11. Contact Information</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                For questions or refund-related inquiries, please contact:
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-pink-600 dark:text-pink-400" />
                  <a href="mailto:refund@alabastar.ng" className="text-slate-900 dark:text-slate-50 font-semibold hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
                    refund@alabastar.ng
                  </a>
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
                This Refund & Cancellation Policy complies with:
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

