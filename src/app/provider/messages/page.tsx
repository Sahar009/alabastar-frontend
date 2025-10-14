"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Search, 
  MoreVertical, 
  Send, 
  Paperclip, 
  Smile, 
  ArrowLeft,
  Check,
  CheckCheck,
  Phone,
  Video,
  User,
  Home,
  Calendar,
  DollarSign,
  MessageSquare,
  Settings as SettingsIcon,
  HelpCircle,
  Menu,
  X
} from "lucide-react";
import { io, Socket } from "socket.io-client";
import Link from "next/link";
import toast from "react-hot-toast";

interface User {
  id: string;
  fullName: string;
  avatarUrl?: string;
}

interface Message {
  id: number;
  content: string;
  senderId: string;
  createdAt: string;
  isEdited: boolean;
  sender: User;
  readReceipts?: any[];
}

interface Conversation {
  id: number;
  type: 'direct' | 'group';
  title?: string;
  participants: User[];
  messages?: Message[];
  unreadCount: number;
  lastMessageAt: string;
}

export default function ProviderMessagesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedConversationId = searchParams?.get('conversation');
  
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Navigation items
  const navigationItems = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/provider/dashboard"
    },
    {
      title: "Bookings",
      icon: Calendar,
      href: "/provider/bookings"
    },
    {
      title: "Earnings",
      icon: DollarSign,
      href: "/provider/earnings"
    },
    {
      title: "Messages",
      icon: MessageSquare,
      href: "/provider/messages",
      active: true
    },
    {
      title: "Profile",
      icon: User,
      href: "/provider/profile"
    },
    {
      title: "Settings",
      icon: SettingsIcon,
      href: "/provider/settings"
    },
    {
      title: "Help & Support",
      icon: HelpCircle,
      href: "/provider/support"
    }
  ];

  // Initialize socket connection
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token) {
      router.push('/provider/signin');
      return;
    }

    if (user) {
      setCurrentUser(JSON.parse(user));
    }

    // Connect to Socket.io
    const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', {
      auth: { token }
    });

    socket.on('connect', () => {
      console.log('Connected to messaging server');
    });

    socket.on('message:new', ({ message }) => {
      setMessages(prev => [...prev, message]);
      scrollToBottom();
      
      // Update conversation list
      setConversations(prev => prev.map(conv => 
        conv.id === message.conversationId 
          ? { ...conv, messages: [message], lastMessageAt: message.createdAt }
          : conv
      ));
    });

    socket.on('typing:start', ({ userId, conversationId }) => {
      if (selectedConversation?.id === conversationId) {
        setTypingUsers(prev => new Set(prev).add(userId));
      }
    });

    socket.on('typing:stop', ({ userId }) => {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [router, selectedConversation?.id]);

  // Fetch conversations
  useEffect(() => {
    fetchConversations();
  }, []);

  // Load selected conversation from URL
  useEffect(() => {
    if (selectedConversationId && conversations.length > 0) {
      const conv = conversations.find(c => c.id === parseInt(selectedConversationId));
      if (conv) {
        handleSelectConversation(conv);
      }
    }
  }, [selectedConversationId, conversations]);

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/messages/conversations`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      const result = await response.json();
      if (result.success) {
        setConversations(result.data.conversations || []);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectConversation = async (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setSidebarOpen(false);
    
    // Join conversation room
    if (socketRef.current) {
      socketRef.current.emit('conversation:join', conversation.id);
    }

    // Fetch messages
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/messages/conversations/${conversation.id}/messages`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      const result = await response.json();
      if (result.success) {
        setMessages(result.data.messages || []);
        scrollToBottom();
        markAsRead(conversation.id);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const markAsRead = async (conversationId: number) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/messages/conversations/${conversationId}/read`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setConversations(prev => prev.map(conv =>
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
      ));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || sending) return;

    setSending(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/messages/conversations/${selectedConversation.id}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messageType: 'text',
            content: newMessage.trim()
          })
        }
      );

      const result = await response.json();
      if (result.success) {
        setNewMessage("");
        stopTyping();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    if (!isTyping && selectedConversation && socketRef.current) {
      setIsTyping(true);
      socketRef.current.emit('typing:start', { conversationId: selectedConversation.id });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 2000);
  };

  const stopTyping = () => {
    if (isTyping && selectedConversation && socketRef.current) {
      setIsTyping(false);
      socketRef.current.emit('typing:stop', { conversationId: selectedConversation.id });
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const filteredConversations = conversations.filter(conv => {
    const otherUser = conv.participants.find(p => p.id !== currentUser?.id);
    const name = conv.title || otherUser?.fullName || '';
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getOtherUser = (conversation: Conversation) => {
    return conversation.participants.find(p => p.id !== currentUser?.id);
  };

  const formatTime = (date: string) => {
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('providerProfile');
    router.push('/');
  };

  const handleComingSoon = (feature: string) => {
    toast(`🚧 ${feature} - Coming Soon!`, {
      duration: 3000,
      icon: '🚧'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-900">
        <div className="text-slate-600">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      {/* Sidebar Navigation */}
      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-pink-600">Alabastar</h2>
              <button onClick={() => setSidebarOpen(false)} className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Provider Portal</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => (
              <button
                key={item.title}
                onClick={() => {
                  if (item.href === '/provider/dashboard') {
                    router.push('/provider/dashboard');
                  } else if (item.href === '/provider/bookings') {
                    router.push('/provider/bookings');
                  } else if (item.href === '/provider/earnings') {
                    handleComingSoon('Earnings');
                  } else if (item.href === '/provider/profile') {
                    router.push('/provider/profile');
                  } else if (item.href === '/provider/settings') {
                    router.push('/provider/settings');
                  } else if (item.href === '/provider/support') {
                    router.push('/provider/support');
                  } else if (item.href === '/provider/messages') {
                    return;
                  } else {
                    router.push(item.href);
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left ${
                  item.active
                    ? 'bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.title}</span>
                {item.badge && (
                  <span className="ml-auto bg-pink-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-pink-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">
                  {currentUser?.fullName}
                </p>
                <p className="text-xs text-slate-500">Provider</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Messages</h1>
          <div className="w-10"></div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Conversations List */}
          <div className={`${selectedConversation ? 'hidden lg:flex' : 'flex'} flex-col w-full lg:w-96 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700`}>
            {/* Search */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  No conversations yet
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const otherUser = getOtherUser(conv);
                  const lastMessage = conv.messages?.[0];
                  
                  return (
                    <div
                      key={conv.id}
                      onClick={() => handleSelectConversation(conv)}
                      className={`p-4 border-b border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                        selectedConversation?.id === conv.id ? 'bg-pink-50 dark:bg-pink-900/20' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center overflow-hidden">
                            {otherUser?.avatarUrl ? (
                              <img src={otherUser.avatarUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-6 h-6 text-pink-600" />
                            )}
                          </div>
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                              {conv.title || otherUser?.fullName || 'Unknown'}
                            </h3>
                            <span className="text-xs text-slate-500">
                              {lastMessage && formatTime(lastMessage.createdAt)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                              {lastMessage?.content || 'No messages yet'}
                            </p>
                            {conv.unreadCount > 0 && (
                              <span className="ml-2 px-2 py-0.5 bg-pink-600 text-white text-xs rounded-full">
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Chat Area */}
          {selectedConversation ? (
            <div className="flex flex-col flex-1">
              {/* Chat Header */}
              <div className="p-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedConversation(null)}
                    className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  
                  <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center overflow-hidden">
                    {getOtherUser(selectedConversation)?.avatarUrl ? (
                      <img src={getOtherUser(selectedConversation)?.avatarUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-pink-600" />
                    )}
                  </div>
                  
                  <div>
                    <h2 className="font-semibold text-slate-900 dark:text-slate-100">
                      {selectedConversation.title || getOtherUser(selectedConversation)?.fullName || 'Unknown'}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {typingUsers.size > 0 ? 'typing...' : 'online'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                    <Phone className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </button>
                  <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                    <Video className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </button>
                  <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                    <MoreVertical className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900">
                {messages.map((message, index) => {
                  const isOwnMessage = message.senderId === currentUser?.id;
                  const showDate = index === 0 || formatDate(messages[index - 1].createdAt) !== formatDate(message.createdAt);

                  return (
                    <div key={message.id}>
                      {showDate && (
                        <div className="flex justify-center my-4">
                          <span className="px-3 py-1 bg-white dark:bg-slate-800 rounded-full text-xs text-slate-600 dark:text-slate-400 shadow-sm">
                            {formatDate(message.createdAt)}
                          </span>
                        </div>
                      )}
                      
                      <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[70%] rounded-lg px-4 py-2 ${
                            isOwnMessage
                              ? 'bg-pink-600 text-white rounded-br-none'
                              : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none shadow-sm'
                          }`}
                        >
                          <p className="text-sm break-words">{message.content}</p>
                          <div className={`flex items-center justify-end gap-1 mt-1 text-xs ${
                            isOwnMessage ? 'text-white/70' : 'text-slate-500'
                          }`}>
                            <span>{formatTime(message.createdAt)}</span>
                            {isOwnMessage && (
                              <div>
                                {message.readReceipts?.length ? (
                                  <CheckCheck className="w-4 h-4 text-blue-400" />
                                ) : (
                                  <Check className="w-4 h-4" />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                    <Smile className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </button>
                  <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                    <Paperclip className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </button>
                  
                  <input
                    type="text"
                    value={newMessage}
                    onChange={handleTyping}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || sending}
                    className="p-3 bg-pink-600 hover:bg-pink-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 rounded-full transition-colors"
                  >
                    <Send className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden lg:flex flex-1 items-center justify-center bg-slate-50 dark:bg-slate-900">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                  <MessageSquare className="w-16 h-16 text-pink-600" />
                </div>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Select a conversation
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Choose a conversation to start messaging with customers
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}



