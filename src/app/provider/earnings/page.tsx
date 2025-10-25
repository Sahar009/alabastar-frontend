"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { 
  ArrowLeft,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Filter,
  Search,
  RefreshCw,
  Wallet,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  XCircle,
  MoreVertical,
  Eye,
  FileText,
  PieChart,
  BarChart3,
  Loader2,
  AlertCircle,
  Info,
  ExternalLink,
  Banknote,
  Receipt,
  Gift
} from "lucide-react";

interface Transaction {
  id: string;
  type: 'earning' | 'withdrawal' | 'refund' | 'commission';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  description: string;
  reference: string;
  date: string;
  customer?: string;
  bookingId?: string;
}

interface EarningStats {
  totalEarnings: number;
  thisMonth: number;
  lastMonth: number;
  availableBalance: number;
  pendingEarnings: number;
  totalWithdrawals: number;
  commissionEarned: number;
  wallet?: {
    balance: number;
    currency: string;
    totalCredits: number;
    totalDebits: number;
    netAmount: number;
    recentTransactions: any[];
  };
}

export default function ProviderEarnings() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [bankAccount, setBankAccount] = useState({
    accountNumber: '',
    bankName: '',
    accountName: ''
  });
  const [processingWithdrawal, setProcessingWithdrawal] = useState(false);
  const [banks, setBanks] = useState([]);
  const [loadingBanks, setLoadingBanks] = useState(false);
  const [verifyingAccount, setVerifyingAccount] = useState(false);
  const [accountVerified, setAccountVerified] = useState(false);
  const [verifiedAccountName, setVerifiedAccountName] = useState('');

  const [stats, setStats] = useState<EarningStats>({
    totalEarnings: 0,
    thisMonth: 0,
    lastMonth: 0,
    availableBalance: 0,
    pendingEarnings: 0,
    totalWithdrawals: 0,
    commissionEarned: 0
  });

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Fetch earnings stats from API
  const fetchEarningsStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please sign in to view earnings');
        router.push('/provider/signin');
        return;
      }

      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${base}/api/earnings/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          // Use wallet balance if available, otherwise use availableBalance
          const walletBalance = data.data.wallet?.balance || data.data.availableBalance || 0;
          setStats({
            ...data.data,
            availableBalance: walletBalance
          });
        }
      } else {
        console.error('Failed to fetch earnings stats:', response.statusText);
        toast.error('Failed to load earnings stats');
      }
    } catch (error) {
      console.error('Error fetching earnings stats:', error);
      toast.error('Error loading earnings stats');
    }
  };

  // Fetch transactions from API
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please sign in to view transactions');
        router.push('/provider/signin');
        return;
      }

      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const params = new URLSearchParams({
        type: filter,
        dateRange: dateRange,
        search: searchTerm,
        page: '1',
        limit: '50'
      });

      const response = await fetch(`${base}/api/earnings/transactions?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setTransactions(data.data.transactions || []);
        }
      } else {
        console.error('Failed to fetch transactions:', response.statusText);
        toast.error('Failed to load transactions');
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Error loading transactions');
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount and when filters change
  useEffect(() => {
    fetchEarningsStats();
    fetchTransactions();
  }, [filter, dateRange]);

  // Refresh data when search term changes (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== undefined) {
        fetchTransactions();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch banks when withdrawal modal opens
  useEffect(() => {
    if (showWithdrawalModal && banks.length === 0) {
      fetchBanks();
    }
  }, [showWithdrawalModal]);

  const filteredTransactions = transactions;

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earning': return <ArrowDownRight className="w-5 h-5" />;
      case 'withdrawal': return <ArrowUpRight className="w-5 h-5" />;
      case 'commission': return <Gift className="w-5 h-5" />;
      case 'refund': return <XCircle className="w-5 h-5" />;
      default: return <DollarSign className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'earning': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
      case 'withdrawal': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'commission': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'refund': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200';
    }
  };

  // Fetch banks from Paystack API
  const fetchBanks = async () => {
    try {
      setLoadingBanks(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${base}/api/paystack/banks`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setBanks(data.data);
        }
      } else {
        console.error('Failed to fetch banks:', response.statusText);
        toast.error('Failed to load banks list');
      }
    } catch (error) {
      console.error('Error fetching banks:', error);
      toast.error('Error loading banks');
    } finally {
      setLoadingBanks(false);
    }
  };

  // Verify account number
  const verifyAccount = async (accountNumber: string, bankCode: string) => {
    if (!accountNumber || !bankCode) return;

    try {
      setVerifyingAccount(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${base}/api/paystack/verify-account`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          accountNumber,
          bankCode
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setAccountVerified(true);
          setVerifiedAccountName(data.data.account_name);
          setBankAccount(prev => ({
            ...prev,
            accountName: data.data.account_name
          }));
          toast.success('Account verified successfully');
        } else {
          setAccountVerified(false);
          setVerifiedAccountName('');
          toast.error(data.message || 'Account verification failed');
        }
      } else {
        setAccountVerified(false);
        setVerifiedAccountName('');
        toast.error('Account verification failed');
      }
    } catch (error) {
      console.error('Error verifying account:', error);
      setAccountVerified(false);
      setVerifiedAccountName('');
      toast.error('Error verifying account');
    } finally {
      setVerifyingAccount(false);
    }
  };

  // Handle bank selection change
  const handleBankChange = (bankName: string) => {
    setBankAccount(prev => ({ ...prev, bankName }));
    setAccountVerified(false);
    setVerifiedAccountName('');
  };

  // Handle account number change
  const handleAccountNumberChange = (accountNumber: string) => {
    setBankAccount(prev => ({ ...prev, accountNumber }));
    setAccountVerified(false);
    setVerifiedAccountName('');
    
    // Auto-verify account when both bank and account number are provided
    if (accountNumber.length === 10 && bankAccount.bankName) {
      const selectedBank = banks.find(bank => bank.name === bankAccount.bankName);
      if (selectedBank) {
        verifyAccount(accountNumber, selectedBank.code);
      }
    }
  };

  const handleWithdrawal = async () => {
    if (!withdrawalAmount || parseFloat(withdrawalAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (parseFloat(withdrawalAmount) > (stats.wallet?.balance || stats.availableBalance)) {
      toast.error('Insufficient balance');
      return;
    }

    if (!bankAccount.accountNumber || !bankAccount.bankName || !bankAccount.accountName) {
      toast.error('Please provide complete bank details');
      return;
    }

    try {
      setProcessingWithdrawal(true);
      const token = localStorage.getItem('token');
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      const response = await fetch(`${base}/api/wallet/withdraw`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: parseFloat(withdrawalAmount),
          withdrawalMethod: 'bank_transfer',
          bankDetails: {
            bankName: bankAccount.bankName,
            accountNumber: bankAccount.accountNumber,
            accountName: bankAccount.accountName
          }
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('Withdrawal request submitted successfully!');
        setShowWithdrawalModal(false);
        setWithdrawalAmount('');
        setBankAccount({
          accountNumber: '',
          bankName: '',
          accountName: ''
        });
        // Refresh data
        await fetchEarningsStats();
        await fetchTransactions();
      } else {
        toast.error(data.message || 'Failed to process withdrawal');
      }
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      toast.error('Error processing withdrawal');
    } finally {
      setProcessingWithdrawal(false);
    }
  };

  const monthlyGrowth = stats.lastMonth > 0 
    ? ((stats.thisMonth - stats.lastMonth) / stats.lastMonth) * 100 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/provider/dashboard')}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-4xl font-bold text-[#ec4899] mb-2">
                  Earnings & Payouts
                </h1>
                <p className="text-slate-600 dark:text-slate-400 font-medium">
                  Track your revenue and manage withdrawals
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  fetchEarningsStats();
                  fetchTransactions();
                }}
                disabled={loading}
                className="group px-4 py-2 bg-[#ec4899] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
              >
                <div className="flex items-center space-x-2">
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-500`} />
                  <span>Refresh</span>
                </div>
              </button>

            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {/* Total Earnings */}
          <div className="group bg-gradient-to-br from-white via-emerald-50 to-white dark:from-slate-800 dark:via-emerald-900/20 dark:to-slate-800 rounded-3xl shadow-lg p-6 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">Total Earnings</p>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">₦{stats.totalEarnings.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-emerald-100 to-green-200 dark:from-emerald-900/30 dark:to-green-800/30 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="w-7 h-7 text-emerald-600 dark:text-emerald-400 group-hover:animate-bounce" />
              </div>
            </div>
            <div className="flex items-center space-x-1 text-sm">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-green-600 font-semibold">All time</span>
            </div>
          </div>

          {/* This Month */}
          <div className="group bg-gradient-to-br from-white via-pink-50 to-white dark:from-slate-800 dark:via-pink-900/20 dark:to-slate-800 rounded-3xl shadow-lg p-6 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">This Month</p>
                <p className="text-3xl font-bold text-[#ec4899]">₦{stats.thisMonth.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-pink-100 dark:from-pink-900/30 dark:to-pink-800/30 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <Calendar className="w-7 h-7 text-[#ec4899] group-hover:animate-pulse" />
              </div>
            </div>
            <div className="flex items-center space-x-1 text-sm">
              {monthlyGrowth >= 0 ? (
                <>
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-green-600 font-semibold">+{monthlyGrowth.toFixed(1)}% from last month</span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-4 h-4 text-red-600" />
                  <span className="text-red-600 font-semibold">{monthlyGrowth.toFixed(1)}% from last month</span>
                </>
              )}
            </div>
          </div>

          {/* Available Balance */}
          {/* <div className="group bg-gradient-to-br from-white via-blue-50 to-white dark:from-slate-800 dark:via-blue-900/20 dark:to-slate-800 rounded-3xl shadow-lg p-6 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">Available Balance</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">₦{stats.availableBalance.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <Wallet className="w-7 h-7 text-blue-600 dark:text-blue-400 group-hover:animate-bounce" />
              </div>
            </div>
            <button
              onClick={() => setShowWithdrawalModal(true)}
              disabled={stats.availableBalance <= 0}
              className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Withdraw Funds
            </button>
          </div> */}

          {/* Pending Earnings */}
          <div className="group bg-gradient-to-br from-white via-amber-50 to-white dark:from-slate-800 dark:via-amber-900/20 dark:to-slate-800 rounded-3xl shadow-lg p-6 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">Pending</p>
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">₦{stats.pendingEarnings.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-amber-100 to-yellow-200 dark:from-amber-900/30 dark:to-yellow-800/30 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-7 h-7 text-amber-600 dark:text-amber-400 group-hover:animate-spin" />
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              Available after service completion
            </p>
          </div>

          {/* Wallet Balance */}
          <div className="group bg-gradient-to-br from-white via-purple-50 to-white dark:from-slate-800 dark:via-purple-900/20 dark:to-slate-800 rounded-3xl shadow-lg p-6 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">Wallet Balance</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">₦{stats.wallet?.balance?.toLocaleString() || stats.availableBalance.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <Wallet className="w-7 h-7 text-purple-600 dark:text-purple-400 group-hover:animate-bounce" />
              </div>
            </div>
            <button
              onClick={() => setShowWithdrawalModal(true)}
              disabled={stats.wallet?.balance <= 0 && stats.availableBalance <= 0}
              className="w-full mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Withdraw Funds
            </button>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400">Total Withdrawals</h3>
              <Banknote className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">₦{stats.totalWithdrawals.toLocaleString()}</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400">Referral Commissions</h3>
              <Gift className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">₦{stats.commissionEarned.toLocaleString()}</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400">Last Month</h3>
              <Calendar className="w-5 h-5 text-slate-500" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">₦{stats.lastMonth.toLocaleString()}</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-700 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div className="flex items-center space-x-3">
              <Filter className="w-5 h-5 text-slate-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 font-medium"
              >
                <option value="all">All Types</option>
                <option value="earning">Earnings</option>
                <option value="withdrawal">Withdrawals</option>
                <option value="commission">Commissions</option>
                <option value="refund">Refunds</option>
              </select>
            </div>

            {/* Date Range */}
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 font-medium"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Transaction History</h2>
              <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                {filteredTransactions.length} transactions
              </span>
            </div>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-[#ec4899] animate-spin" />
              </div>
            ) : filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction, index) => (
                <div
                  key={transaction.id}
                  className="group p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-200"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      {/* Icon */}
                      <div className={`p-3 rounded-xl ${
                        transaction.type === 'earning' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        transaction.type === 'withdrawal' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                        transaction.type === 'commission' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' :
                        'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {getTransactionIcon(transaction.type)}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50 truncate">
                            {transaction.description}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getTypeColor(transaction.type)}`}>
                            {transaction.type}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-400">
                          <span className="flex items-center space-x-1">
                            <Receipt className="w-3 h-3" />
                            <span className="font-mono">{transaction.reference}</span>
                          </span>
                          <span>•</span>
                          <span>{new Date(transaction.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}</span>
                        </div>
                      </div>
                    </div>

                    {/* Amount and Status */}
                    <div className="flex items-center space-x-4 ml-4">
                      <div className="text-right">
                        <p className={`text-xl font-bold ${
                          transaction.amount > 0 
                            ? 'text-emerald-600 dark:text-emerald-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}₦{Math.abs(transaction.amount).toLocaleString()}
                        </p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(transaction.status)}`}>
                          {transaction.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {transaction.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                          {transaction.status === 'failed' && <XCircle className="w-3 h-3 mr-1" />}
                          {transaction.status}
                        </span>
                      </div>

                      <button
                        onClick={() => toast('🚧 Transaction details coming soon!', { duration: 2000 })}
                        className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 bg-[#ec4899]/20 rounded-full animate-pulse"></div>
                  <div className="absolute inset-4 bg-[#ec4899]/10 rounded-full"></div>
                  <Receipt className="absolute inset-0 w-12 h-12 text-[#ec4899] mx-auto my-auto" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2">No transactions found</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {searchTerm || filter !== 'all' 
                    ? 'Try adjusting your filters to find what you\'re looking for.'
                    : 'Your transaction history will appear here once you start earning.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Withdrawal Modal */}
        {showWithdrawalModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-3xl max-w-md w-full shadow-2xl shadow-blue-500/20 border border-white/20 dark:border-slate-700/50">
              <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                      <Banknote className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Withdraw Funds</h2>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Available: ₦{(stats.wallet?.balance || stats.availableBalance).toLocaleString()}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowWithdrawalModal(false)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Amount to Withdraw *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 font-semibold">₦</span>
                    <input
                      type="number"
                      value={withdrawalAmount}
                      onChange={(e) => setWithdrawalAmount(e.target.value)}
                      placeholder="0.00"
                      max={stats.wallet?.balance || stats.availableBalance}
                      className="w-full pl-8 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-semibold text-lg"
                    />
                  </div>
                  <button
                    onClick={() => setWithdrawalAmount((stats.wallet?.balance || stats.availableBalance).toString())}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Withdraw all available balance
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Bank Name *
                  </label>
                  <select
                    value={bankAccount.bankName}
                    onChange={(e) => handleBankChange(e.target.value)}
                    disabled={loadingBanks}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                  >
                    <option value="">
                      {loadingBanks ? 'Loading banks...' : 'Select Bank'}
                    </option>
                    {banks.map((bank) => (
                      <option key={bank.code} value={bank.name}>
                        {bank.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Account Number *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={bankAccount.accountNumber}
                      onChange={(e) => handleAccountNumberChange(e.target.value)}
                      placeholder="0123456789"
                      maxLength={10}
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-mono"
                    />
                    {verifyingAccount && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                      </div>
                    )}
                    {accountVerified && !verifyingAccount && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                    )}
                  </div>
                  {accountVerified && verifiedAccountName && (
                    <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-800 dark:text-green-200 font-medium">
                          Account verified: {verifiedAccountName}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Account Name *
                  </label>
                  <input
                    type="text"
                    value={bankAccount.accountName}
                    onChange={(e) => setBankAccount({ ...bankAccount, accountName: e.target.value })}
                    placeholder={accountVerified ? verifiedAccountName : "Full name as registered"}
                    disabled={accountVerified}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:bg-slate-50 dark:disabled:bg-slate-800"
                  />
                  {accountVerified && (
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Account name verified automatically
                    </p>
                  )}
                </div>

                {/* Info Box */}
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900 dark:text-blue-100">
                      <p className="font-semibold mb-1">Processing Time</p>
                      <p className="text-blue-700 dark:text-blue-300">
                        Withdrawals are typically processed within 1-2 business days.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowWithdrawalModal(false)}
                    className="flex-1 px-4 py-3 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleWithdrawal}
                    disabled={processingWithdrawal || !accountVerified || !bankAccount.bankName || !bankAccount.accountNumber || !bankAccount.accountName}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processingWithdrawal ? (
                      <span className="flex items-center justify-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processing...</span>
                      </span>
                    ) : !accountVerified ? (
                      'Verify Account First'
                    ) : (
                      'Submit Withdrawal'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

       
      </div>
    </div>
  );
}
