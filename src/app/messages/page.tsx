"use client";
import { useState, useEffect, useRef, Suspense } from "react";
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
  X
} from "lucide-react";
import { io, Socket } from "socket.io-client";

interface User {
  id: string;
  fullName: string;
  avatarUrl?: string;
  profilePicture?: string;
}

interface Message {
  id: number;
  content: string;
  senderId: string;
  createdAt: string;
  isEdited: boolean;
  sender: User;
  readReceipts?: any[];
  messageType?: string;
  mediaUrl?: string;
  mediaType?: string;
  fileName?: string;
  fileSize?: number;
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

function MessagesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedConversationId = searchParams?.get('conversation');
  
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize socket connection
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token) {
      router.push('/login');
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

    socket.on('user:online', ({ userId }) => {
      setConversations(prev => prev.map(conv => ({
        ...conv,
        participants: conv.participants.map(p => 
          p.id === userId ? { ...p, isOnline: true } : p
        )
      })));
    });

    socket.on('user:offline', ({ userId }) => {
      setConversations(prev => prev.map(conv => ({
        ...conv,
        participants: conv.participants.map(p => 
          p.id === userId ? { ...p, isOnline: false } : p
        )
      })));
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
        
        // Mark as read
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
      
      // Update unread count locally
      setConversations(prev => prev.map(conv =>
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
      ));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleSendMessage = async () => {
    if ((!newMessage.trim() && !selectedFile) || !selectedConversation || sending) return;

    setSending(true);
    try {
      const token = localStorage.getItem('token');
      
      if (selectedFile) {
        // Send file message
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('messageType', 'file');
        formData.append('content', newMessage.trim() || 'Shared a file');

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/messages/conversations/${selectedConversation.id}/messages`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: formData
          }
        );

        const result = await response.json();
        console.log('File message response:', result);
        
        // Always clear the input and file selection
        setNewMessage("");
        setSelectedFile(null);
        stopTyping();
        
        if (result.success && result.data && result.data.message) {
          // Add the sent message to the UI immediately
          const sentMessage = result.data.message;
          // Ensure the message has required properties
          if (sentMessage.senderId && sentMessage.id) {
            setMessages(prev => [...prev, sentMessage]);
            
            // Update conversation list with latest message
            setConversations(prev => prev.map(conv => 
              conv.id === selectedConversation.id 
                ? { 
                    ...conv, 
                    messages: [sentMessage], 
                    lastMessageAt: sentMessage.createdAt,
                    unreadCount: 0 // Reset unread count for sent messages
                  }
                : conv
            ));
            
            scrollToBottom();
          } else {
            console.error('Invalid message structure:', sentMessage);
          }
        } else {
          console.error('Failed to send file message:', result);
        }
      } else {
        // Send text message
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
        console.log('Text message response:', result);
        
        // Always clear the input
        setNewMessage("");
        stopTyping();
        
        if (result.success && result.data && result.data.message) {
          // Add the sent message to the UI immediately
          const sentMessage = result.data.message;
          // Ensure the message has required properties
          if (sentMessage.senderId && sentMessage.id) {
            setMessages(prev => [...prev, sentMessage]);
            
            // Update conversation list with latest message
            setConversations(prev => prev.map(conv => 
              conv.id === selectedConversation.id 
                ? { 
                    ...conv, 
                    messages: [sentMessage], 
                    lastMessageAt: sentMessage.createdAt,
                    unreadCount: 0 // Reset unread count for sent messages
                  }
                : conv
            ));
            
            scrollToBottom();
          } else {
            console.error('Invalid message structure:', sentMessage);
          }
        } else {
          console.error('Failed to send text message:', result);
        }
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

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 2 seconds of inactivity
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
    if (messagesEndRef.current) {
      const messagesContainer = messagesEndRef.current.parentElement;
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const commonEmojis = ['😀', '😂', '😍', '🥰', '😎', '🤔', '👍', '❤️', '🔥', '💯', '🎉', '😢', '😡', '🤷‍♂️', '👏'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-slate-600">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-900">
      {/* Sidebar - Conversations List */}
      <div className={`${selectedConversation ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-96 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700`}>
        {/* Header */}
        <div className="p-4 bg-pink-600 text-white">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold">Messages</h1>
            <button className="p-2 hover:bg-pink-700 rounded-full transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30"
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
                        {otherUser?.avatarUrl || otherUser?.profilePicture ? (
                          <img src={otherUser.avatarUrl || otherUser.profilePicture} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-6 h-6 text-pink-600" />
                        )}
                      </div>
                      {/* Online indicator */}
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
                className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full"
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
                <MoreVertical className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div 
            className="flex-1 overflow-y-auto p-4 space-y-4 relative" 
            style={{ 
              backgroundImage: 'url("/chat-bg.jpeg")', 
              backgroundSize: 'cover', 
              backgroundPosition: 'center', 
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'fixed'
            }}
          >
            {/* Semi-transparent overlay for better readability */}
            <div className="absolute inset-0 bg-black/5 dark:bg-black/10 pointer-events-none"></div>
            
            <div className="relative z-10">
              {messages.map((message, index) => {
                // Add safety check for message object
                if (!message || !message.senderId) {
                  console.error('Invalid message object:', message);
                  return null;
                }
                
                const isOwnMessage = message.senderId === currentUser?.id;
                const showDate = index === 0 || formatDate(messages[index - 1].createdAt) !== formatDate(message.createdAt);

                return (
                  <div key={message.id} className="mb-4">
                    {showDate && (
                      <div className="flex justify-center my-6">
                        <span className="px-3 py-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full text-xs text-slate-600 dark:text-slate-400 shadow-sm">
                          {formatDate(message.createdAt)}
                        </span>
                      </div>
                    )}
                    
                    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-2`}>
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-3 backdrop-blur-sm ${
                          isOwnMessage
                            ? 'bg-pink-600/95 text-white rounded-br-none shadow-lg'
                            : 'bg-white/95 dark:bg-slate-800/95 text-slate-900 dark:text-slate-100 rounded-bl-none shadow-lg'
                        }`}
                      >
                        {message.messageType === 'image' && message.mediaUrl ? (
                          <div className="space-y-2">
                            <img 
                              src={message.mediaUrl} 
                              alt={message.fileName || 'Shared image'} 
                              className="max-w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => window.open(message.mediaUrl, '_blank')}
                            />
                            {message.content && message.content !== 'Shared a file' && (
                              <p className="text-sm break-words">{message.content}</p>
                            )}
                          </div>
                        ) : message.messageType === 'video' && message.mediaUrl ? (
                          <div className="space-y-2">
                            <video 
                              src={message.mediaUrl} 
                              controls 
                              className="max-w-full h-auto rounded-lg"
                              preload="metadata"
                            >
                              Your browser does not support the video tag.
                            </video>
                            {message.content && message.content !== 'Shared a file' && (
                              <p className="text-sm break-words">{message.content}</p>
                            )}
                          </div>
                        ) : message.messageType === 'audio' && message.mediaUrl ? (
                          <div className="space-y-2">
                            <audio 
                              src={message.mediaUrl} 
                              controls 
                              className="w-full"
                            >
                              Your browser does not support the audio tag.
                            </audio>
                            {message.content && message.content !== 'Shared a file' && (
                              <p className="text-sm break-words">{message.content}</p>
                            )}
                          </div>
                        ) : message.messageType === 'file' && message.mediaUrl ? (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                              <Paperclip className="w-4 h-4 text-slate-600" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                                  {message.fileName || 'Shared file'}
                                </p>
                                {message.fileSize && (
                                  <p className="text-xs text-slate-500">
                                    {(message.fileSize / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                )}
                              </div>
                              <a 
                                href={message.mediaUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-pink-600 hover:text-pink-700 text-sm font-medium"
                              >
                                Download
                              </a>
                            </div>
                            {message.content && message.content !== 'Shared a file' && (
                              <p className="text-sm break-words">{message.content}</p>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm break-words">{message.content}</p>
                        )}
                        <div className={`flex items-center justify-end gap-1 mt-2 text-xs ${
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
          </div>

          {/* Message Input */}
          <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
            {/* File Preview */}
            {selectedFile && (
              <div className="mb-3 p-3 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-slate-600" />
                  <span className="text-sm text-slate-700 dark:text-slate-300 truncate">
                    {selectedFile.name}
                  </span>
                  <span className="text-xs text-slate-500">
                    ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="mb-3 p-3 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="grid grid-cols-8 gap-2">
                  {commonEmojis.map((emoji, index) => (
                    <button
                      key={index}
                      onClick={() => handleEmojiClick(emoji)}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg text-lg transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
              >
                <Smile className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
              >
                <Paperclip className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
              />
              
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
                disabled={(!newMessage.trim() && !selectedFile) || sending}
                className="p-3 bg-pink-600 hover:bg-pink-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 rounded-full transition-colors"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center bg-slate-50 dark:bg-slate-900">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
              <User className="w-16 h-16 text-pink-600" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Select a conversation
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Choose a conversation from the list to start messaging
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <div className="text-slate-600">Loading messages...</div>
      </div>
    }>
      <MessagesPageContent />
    </Suspense>
  );
}



