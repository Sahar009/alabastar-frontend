"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle, MessageCircle, Shield, Clock, Star, Users, Zap, Sparkles } from "lucide-react";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  icon: React.ReactNode;
  category: string;
}

const FAQComponent = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Debug function to test state
  const testToggle = () => {
    console.log("Test toggle clicked!");
    setOpenItems([1, 2]); // Force open items 1 and 2
  };

  const faqData: FAQItem[] = [
    {
      id: 1,
      question: "How do I book a service provider?",
      answer: "Simply search for the service you need, browse verified providers in your area, and book instantly. You can filter by ratings, price, and availability to find the perfect match for your needs.",
      icon: <MessageCircle className="w-5 h-5" />,
      category: "booking"
    },
    {
      id: 2,
      question: "Are all providers verified and trustworthy?",
      answer: "Yes! All providers on Alabastar undergo a thorough verification process including background checks, document verification, and continuous performance monitoring. We ensure only qualified professionals join our platform.",
      icon: <Shield className="w-5 h-5" />,
      category: "safety"
    },
    {
      id: 3,
      question: "How quickly can I get a service provider?",
      answer: "Most services can be booked within minutes! Our platform shows real-time availability, and many providers offer same-day service. For urgent needs, use our emergency booking feature for immediate assistance.",
      icon: <Clock className="w-5 h-5" />,
      category: "timing"
    },
    {
      id: 4,
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, bank transfers, and digital wallets. All payments are processed securely through our encrypted payment system, and you only pay after the service is completed to your satisfaction.",
      icon: <Zap className="w-5 h-5" />,
      category: "payment"
    },
    {
      id: 5,
      question: "Can I rate and review providers?",
      answer: "Absolutely! After each service, you can rate your provider and leave a detailed review. This helps other customers make informed decisions and helps us maintain high service quality standards.",
      icon: <Star className="w-5 h-5" />,
      category: "reviews"
    },
    {
      id: 6,
      question: "What if I'm not satisfied with the service?",
      answer: "We have a satisfaction guarantee! If you're not happy with the service, contact our support team within 24 hours, and we'll work with you to resolve the issue or provide a full refund.",
      icon: <Users className="w-5 h-5" />,
      category: "support"
    },
    {
      id: 7,
      question: "How do I become a service provider?",
      answer: "Join our community of professionals! Simply sign up, complete our verification process, upload your documents, and start receiving bookings. We provide training and support to help you succeed.",
      icon: <Sparkles className="w-5 h-5" />,
      category: "providers"
    },
    {
      id: 8,
      question: "Is there a mobile app available?",
      answer: "Yes! Our mobile apps for iOS and Android are coming soon. You'll be able to book services, track your bookings, chat with providers, and manage your account on the go.",
      icon: <HelpCircle className="w-5 h-5" />,
      category: "app"
    }
  ];

  const categories = [
    { key: "all", label: "All Questions", count: faqData.length },
    { key: "booking", label: "Booking", count: faqData.filter(item => item.category === "booking").length },
    { key: "safety", label: "Safety", count: faqData.filter(item => item.category === "safety").length },
    { key: "payment", label: "Payment", count: faqData.filter(item => item.category === "payment").length },
    { key: "support", label: "Support", count: faqData.filter(item => item.category === "support").length }
  ];

  const filteredFAQs = activeCategory === "all" 
    ? faqData 
    : faqData.filter(item => item.category === activeCategory);

  const toggleItem = (id: number) => {
    console.log('=== TOGGLE CLICKED ===');
    console.log('Item ID:', id);
    console.log('Current open items:', openItems);
    console.log('Is item open?', openItems.includes(id));
    
    setOpenItems(prev => {
      const isCurrentlyOpen = prev.includes(id);
      const newItems = isCurrentlyOpen 
        ? prev.filter(item => item !== id)
        : [...prev, id];
      
      console.log('Will be open?', !isCurrentlyOpen);
      console.log('New items array:', newItems);
      return newItems;
    });
  };

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-20">
      <div className="relative">
        {/* Animated background elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-gradient-to-br from-teal-400/20 to-blue-500/20 rounded-full blur-3xl animate-bounce"></div>
        
        {/* Floating animated icons */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 animate-float">
          <HelpCircle className="w-8 h-8 text-blue-500 animate-pulse" />
        </div>
        <div className="absolute bottom-0 left-0 w-14 h-14 bg-gradient-to-br from-teal-500/10 to-blue-500/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 animate-float" style={{ animationDelay: '1s' }}>
          <MessageCircle className="w-7 h-7 text-teal-500 animate-bounce" />
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/30 bg-blue-50/50 dark:bg-blue-900/20 px-4 py-2 text-sm text-blue-700 dark:text-blue-300 backdrop-blur-sm mb-4">
            <HelpCircle className="w-4 h-4" />
            <span className="font-medium">Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-50 mb-4">
            Got Questions?
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#14B8A6]">
              We've Got Answers
            </span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Find answers to common questions about booking services, payments, safety, and more.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => setActiveCategory(category.key)}
              className={`group px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category.key
                  ? 'bg-gradient-to-r from-[#2563EB] to-[#14B8A6] text-white shadow-lg shadow-blue-500/25'
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-blue-300 dark:hover:border-blue-600'
              }`}
            >
              <span className="flex items-center gap-2">
                {category.label}
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeCategory === category.key
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
                }`}>
                  {category.count}
                </span>
              </span>
            </button>
          ))}
        </div>

        {/* Debug Info */}
        {/* <div className="mb-4 p-4 bg-yellow-100 dark:bg-yellow-900/20 rounded text-sm">
          <div className="mb-2">Debug: Open items: {JSON.stringify(openItems)}</div>
          <button 
            onClick={testToggle}
            className="px-3 py-1 bg-blue-500 text-white rounded text-xs"
          >
            Test Toggle (Force Open Items 1,2)
          </button>
        </div> */}

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.map((item, index) => {
            const isOpen = openItems.includes(item.id);
            console.log(`Rendering item ${item.id}, isOpen: ${isOpen}`);
            
            return (
              <div
                key={item.id}
                className="border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 shadow-sm"
              >
                {/* Question Button */}
                <button
                  onClick={() => {
                    console.log(`Button clicked for item ${item.id}`);
                    toggleItem(item.id);
                  }}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    {/* Icon */}
                    <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center text-white">
                      {item.icon}
                    </div>
                    
                    {/* Question */}
                    <div className="flex-1">
                      <h3 className={`text-lg font-semibold ${
                        isOpen ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-slate-100'
                      }`}>
                        {item.question}
                      </h3>
                    </div>
                  </div>
                  
                  {/* Chevron */}
                  <div className="ml-4">
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-blue-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-500" />
                    )}
                  </div>
                </button>
                
                {/* Answer */}
                {isOpen && (
                  <div className="px-6 pb-6">
                    <div className="pl-14">
                      <div className="border-l-2 border-blue-200 dark:border-blue-800 pl-4">
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#2563EB]/5 to-[#14B8A6]/5 border border-blue-200/30 dark:border-blue-800/30 p-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-teal-500/5 animate-pulse" />
            <div className="relative">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Still have questions?
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                Our support team is here to help you 24/7
              </p>
              <button className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2563EB] to-[#14B8A6] text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300">
                <MessageCircle className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                <span>Contact Support</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQComponent;
