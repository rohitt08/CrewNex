import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { MessageSquare, X, Send, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;
// Deduce socket URL from API URL (remove /api)
const SOCKET_URL = API_URL.replace("/api", "");

const ProjectChatWindow = ({ projectId, currentUserId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchHistory = React.useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/chat/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setMessages(res.data.messages);
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not load chat history");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  useEffect(() => {
    // Only connect if the chat is open
    if (isOpen && !socketRef.current) {
      socketRef.current = io(SOCKET_URL);
      
      socketRef.current.emit("join_project_room", projectId);
      
      socketRef.current.on("receive_message", (message) => {
        setMessages((prev) => [...prev, message]);
      });

      fetchHistory();
    }

    return () => {
      // Cleanup on unmount or close if you want, but typical is keep connection
    };
  }, [isOpen, projectId, fetchHistory]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socketRef.current) return;

    const messageData = {
      projectId,
      senderId: currentUserId,
      content: newMessage.trim()
    };

    socketRef.current.emit("send_message", messageData);
    setNewMessage("");
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-apple-blue text-slate-900 rounded-full flex items-center justify-center shadow-sm z-50 transition-colors hover:bg-blue-600 border border-slate-200"
          >
            <MessageSquare className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] bg-white rounded-2xl shadow-sm z-50 flex flex-col border border-slate-200 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-slate-50 backdrop-blur-md border-b border-slate-200 px-5 py-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-apple-blue/20 flex items-center justify-center border border-blue-300">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">Team Chat</h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0a0f1c] scrollbar-thin scrollbar-thumb-white/10">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-500">
                  <MessageSquare className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-sm font-semibold">No messages yet.</p>
                  <p className="text-xs">Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isMe = msg.sender?._id === currentUserId;
                  return (
                    <div key={msg._id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        {!isMe && (
                          <span className="text-[10px] text-slate-500 font-bold ml-2 mb-1">
                            {msg.sender?.name} {msg.sender?.role ? `(${msg.sender.role})` : ''}
                          </span>
                        )}
                        <div 
                          className={`px-4 py-2.5 rounded-2xl text-sm font-medium leading-relaxed ${
                            isMe 
                              ? "bg-apple-blue text-slate-900 rounded-tr-sm" 
                              : "bg-slate-100 text-slate-900 rounded-tl-sm border border-white/5"
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-3 bg-slate-50 backdrop-blur-md border-t border-slate-200 flex items-center gap-2 flex-shrink-0">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 text-sm text-slate-900 placeholder-apple-text-secondary outline-none focus:border-apple-blue/50 focus:bg-slate-100 transition-all font-medium"
              />
              <button 
                type="submit"
                disabled={!newMessage.trim()}
                className="p-2.5 bg-apple-blue text-slate-900 rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProjectChatWindow;



