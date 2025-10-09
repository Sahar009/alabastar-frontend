"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { 
  ArrowLeft,
  HelpCircle,
  MessageSquare,
  Phone,
  Mail,
  Search,
  ChevronDown,
  ChevronUp,
  Send,
  Loader2,
  Clock,
  AlertCircle,
  Headphones,
  Book,
  CheckCircle,
  Calendar,
  CreditCard,
  Star,
  Settings,
  Gift
} from "lucide-react";

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export default function ProviderSupport() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('faq');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({
    subject: '',
    category: 'general',
    message: '',
    priority: 'normal'
  });
  const [submitting, setSubmitting] = useState(false);

  const faqs: FAQ[] = [
    {
      id: 1,
      question: "How do I get verified as a provider?",
      answer: "To get verified, ensure you've uploaded all required documents (ID card, professional certificate, and business license) in your profile. Our verification team typically reviews applications within 24-48 hours. You'll receive an email notification once your verification is complete.",
      category: "verification"
    },
    {
      id: 2,
      question: "How do I receive payments from customers?",
      answer: "Payments are processed through Paystack and automatically deposited to your registered bank account. After completing a booking, funds are typically available within 2-3 business days. You can track all your earnings in the Earnings section of your dashboard.",
      category: "payments"
    },
    {
      id: 3,
      question: "Can I cancel or reschedule a booking?",
      answer: "Yes, you can cancel bookings from the Bookings page. However, frequent cancellations may affect your rating. If you need to reschedule, we recommend contacting the customer directly through the messaging feature to arrange a new time.",
      category: "bookings"
    },
    {
      id: 4,
      question: "How does the subscription work?",
      answer: "Your subscription gives you access to receive bookings and use all platform features. Subscriptions are billed monthly or yearly depending on your chosen plan. You can upgrade, downgrade, or cancel your subscription anytime from the Settings page.",
      category: "subscription"
    },
    {
      id: 5,
      question: "What happens if a customer doesn't pay?",
      answer: "All bookings require upfront payment from customers before confirmation. This protects you from non-payment issues. The platform holds the payment securely and releases it to you after service completion.",
      category: "payments"
    },
    {
      id: 6,
      question: "How can I improve my rating?",
      answer: "Maintain high ratings by: providing excellent service, arriving on time, communicating clearly with customers, completing jobs professionally, and responding promptly to booking requests. Customer reviews are visible on your profile.",
      category: "ratings"
    },
    {
      id: 7,
      question: "Can I offer multiple services?",
      answer: "Yes! You can add multiple services to your profile. Go to your Profile page and add services in your category. Each service can have its own pricing and description.",
      category: "services"
    },
    {
      id: 8,
      question: "How do referrals work?",
      answer: "Share your unique referral code with other service providers. When they register and subscribe using your code, you earn 10% commission on their subscription fee. Track your referrals and earnings in your dashboard.",
      category: "referrals"
    },
    {
      id: 9,
      question: "What if I have a dispute with a customer?",
      answer: "If you have a dispute, contact our support team immediately with your booking details. We'll mediate the situation fairly. Document everything and keep all communication professional.",
      category: "disputes"
    },
    {
      id: 10,
      question: "How do I update my business information?",
      answer: "Go to your Profile page to update your business name, description, location, services, and contact information. Some changes may require re-verification.",
      category: "profile"
    }
  ];

  const categories = [
    { id: 'all', label: 'All Topics', icon: Book },
    { id: 'verification', label: 'Verification', icon: CheckCircle },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'ratings', label: 'Ratings', icon: Star },
    { id: 'services', label: 'Services', icon: Settings },
    { id: 'referrals', label: 'Referrals', icon: Gift },
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactForm.subject || !contactForm.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      // TODO: Create support ticket endpoint
      // For now, just show success message
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Support ticket submitted successfully! We\'ll get back to you soon.');
      setContactForm({
        subject: '',
        category: 'general',
        message: '',
        priority: 'normal'
      });
    } catch (error) {
      console.error('Error submitting ticket:', error);
      toast.error('Error submitting ticket');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => router.push('/provider/dashboard')}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-4xl font-bold text-[#ec4899] mb-2">
                Help & Support
              </h1>
              <p className="text-slate-600 dark:text-slate-400 font-medium">
                We're here to help you succeed
              </p>
            </div>
          </div>

          {/* Quick Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="group bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-blue-900/20 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Call Us</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-50">+234 800 000 0000</p>
                </div>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-purple-900/20 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Email Us</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-50">support@alabastar.com</p>
                </div>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-white to-green-50 dark:from-slate-800 dark:to-green-900/20 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl group-hover:scale-110 transition-transform">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Support Hours</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-50">24/7 Available</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 mb-8">
          <div className="flex border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
            <button
              onClick={() => setActiveTab('faq')}
              className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-all duration-200 whitespace-nowrap ${
                activeTab === 'faq'
                  ? 'text-[#ec4899] border-b-2 border-pink-600'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <HelpCircle className="w-5 h-5" />
              <span>FAQs</span>
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-all duration-200 whitespace-nowrap ${
                activeTab === 'contact'
                  ? 'text-[#ec4899] border-b-2 border-pink-600'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span>Contact Support</span>
            </button>
          </div>

          <div className="p-6">
            {/* FAQ Tab */}
            {activeTab === 'faq' && (
              <div className="space-y-6">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search for help..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* FAQ List */}
                <div className="space-y-4">
                  {filteredFAQs.length > 0 ? (
                    filteredFAQs.map((faq) => (
                      <div
                        key={faq.id}
                        className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-700 dark:to-slate-800 rounded-xl border border-slate-200 dark:border-slate-600 overflow-hidden hover:shadow-lg transition-all duration-300"
                      >
                        <button
                          onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                          className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                        >
                          <div className="flex items-start space-x-4 flex-1">
                            <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg mt-1">
                              <HelpCircle className="w-5 h-5 text-[#ec4899]" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-1">
                                {faq.question}
                              </h3>
                              <span className="text-xs px-2 py-1 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-full font-medium">
                                {faq.category}
                              </span>
                            </div>
                          </div>
                          {expandedFAQ === faq.id ? (
                            <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                          )}
                        </button>
                        {expandedFAQ === faq.id && (
                          <div className="px-6 pb-6 pt-2">
                            <div className="pl-14">
                              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Search className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-600 dark:text-slate-400">No FAQs found matching your search</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Contact Support Tab */}
            {activeTab === 'contact' && (
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                  <div className="inline-flex p-4 bg-pink-100 dark:bg-pink-900/30 rounded-2xl mb-4">
                    <Headphones className="w-8 h-8 text-[#ec4899]" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Get in Touch</h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    Can't find what you're looking for? Send us a message and we'll get back to you shortly.
                  </p>
                </div>

                <form onSubmit={handleSubmitTicket} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      placeholder="Brief description of your issue"
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Category
                      </label>
                      <select
                        value={contactForm.category}
                        onChange={(e) => setContactForm({ ...contactForm, category: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="technical">Technical Issue</option>
                        <option value="billing">Billing & Payments</option>
                        <option value="account">Account Issue</option>
                        <option value="verification">Verification</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Priority
                      </label>
                      <select
                        value={contactForm.priority}
                        onChange={(e) => setContactForm({ ...contactForm, priority: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="low">Low</option>
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Describe your issue in detail..."
                      rows={6}
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 resize-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 bg-gradient-to-r from-pink-600 to-orange-500 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center space-x-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Submitting...</span>
                      </span>
                    ) : (
                      <span className="flex items-center justify-center space-x-2">
                        <Send className="w-5 h-5" />
                        <span>Submit Ticket</span>
                      </span>
                    )}
                  </button>
                </form>

                {/* Response Time Info */}
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900 dark:text-blue-100">
                      <p className="font-semibold mb-1">Expected Response Time</p>
                      <p className="text-blue-700 dark:text-blue-300">
                        Normal: 24 hours | High: 12 hours | Urgent: 4 hours
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Additional Help */}
        <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">
              Still need help?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto">
              Our support team is available 24/7 to assist you. Choose your preferred contact method below.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => toast('📞 Calling support...', { duration: 2000 })}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
              >
                <Phone className="w-5 h-5" />
                <span>Call Support</span>
              </button>
              <button
                onClick={() => toast('📧 Opening email client...', { duration: 2000 })}
                className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
              >
                <Mail className="w-5 h-5" />
                <span>Email Support</span>
              </button>
              <button
                onClick={() => toast('💬 Live chat coming soon!', { duration: 2000 })}
                className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Live Chat</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
