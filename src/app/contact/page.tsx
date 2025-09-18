"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import type React from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill your name, email and message.");
      return;
    }
    setLoading(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${base}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        toast.success(data?.message || "Message sent. We’ll be in touch.");
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        toast.error(data?.message || "Failed to send. Try again.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <section className="relative overflow-hidden pt-16 sm:pt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-50">Contact us</h1>
              <p className="mt-3 text-slate-600 dark:text-slate-300">Questions, feedback, or partnership ideas? We’d love to hear from you.</p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <InfoCard icon={<Mail size={18} />} title="Email" value="support@alabastar.app" sub="We reply within 24 hours." />
                <InfoCard icon={<Phone size={18} />} title="Phone" value="+234 800 000 0000" sub="Mon–Fri, 9am–6pm WAT" />
                <InfoCard icon={<MapPin size={18} />} title="Address" value="Lagos, Nigeria" sub="HQ & customer care" />
              </div>

              <div className="mt-10 rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-6 shadow">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                  <img src="/images/support.svg" alt="Customer care" className="w-full h-auto" />
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-50">We’re here to help</h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Our support team is standing by to assist with bookings, payments, and provider questions. Reach out anytime and we’ll get back ASAP.</p>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <span className="rounded-full border border-slate-300/70 dark:border-white/10 px-2 py-1">Bookings</span>
                      <span className="rounded-full border border-slate-300/70 dark:border-white/10 px-2 py-1">Payments</span>
                      <span className="rounded-full border border-slate-300/70 dark:border-white/10 px-2 py-1">Verification</span>
                      <span className="rounded-full border border-slate-300/70 dark:border-white/10 px-2 py-1">Account</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={submit} className="relative overflow-hidden rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-6 shadow">
              <div className="absolute -inset-px opacity-10 bg-gradient-to-r from-[#2563EB] to-[#14B8A6]" />
              <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Full name" name="name" value={form.name} onChange={onChange} required />
                <Input label="Email" name="email" type="email" value={form.email} onChange={onChange} required />
                <Input label="Phone" name="phone" value={form.phone} onChange={onChange} />
                <Input label="Subject" name="subject" value={form.subject} onChange={onChange} />
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Message</label>
                  <textarea name="message" value={form.message} onChange={onChange} rows={5} className="mt-1 w-full rounded-xl border border-slate-300/70 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 px-4 py-3 outline-none focus:ring-2 focus:ring-[#2563EB]/30" placeholder="How can we help?" required />
                </div>
                <div className="sm:col-span-2 flex items-center justify-between">
                  <p className="text-xs text-slate-500 dark:text-slate-400">We’ll reply within 24 hours.</p>
                  <button disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#14B8A6] px-5 py-3 text-white font-semibold shadow disabled:opacity-70">
                    <Send size={16} /> {loading ? 'Sending…' : 'Send message'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

function InfoCard({ icon, title, value, sub }: { icon: React.ReactNode; title: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-4 shadow flex items-start gap-3">
      <div className="h-9 w-9 grid place-items-center rounded-lg bg-gradient-to-br from-[#2563EB] to-[#14B8A6] text-white shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{title}</p>
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-50 break-words">{value}</p>
        {sub ? <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{sub}</p> : null}
      </div>
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...rest } = props;
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">{label}</label>
      <input {...rest} className="mt-1 w-full rounded-xl border border-slate-300/70 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 px-4 py-3 outline-none focus:ring-2 focus:ring-[#2563EB]/30" />
    </div>
  );
}


