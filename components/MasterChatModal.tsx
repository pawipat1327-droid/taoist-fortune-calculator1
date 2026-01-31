import React, { useState, useEffect, useRef } from 'react';
import { UserData, FortuneResult } from '../types';
import { ChatMessage, startMasterChat, continueMasterChat } from '../services/masterChatService';

interface MasterChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: UserData;
  fortuneResult: FortuneResult;
}

const MasterChatModal: React.FC<MasterChatModalProps> = ({
  isOpen,
  onClose,
  userData,
  fortuneResult
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const [remainingCount, setRemainingCount] = useState(3);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat when modal opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeChat();
    }
  }, [isOpen, messages.length]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const initializeChat = async () => {
    setIsLoading(true);
    try {
      const initialMessage = await startMasterChat(userData, fortuneResult);
      setMessages([initialMessage]);
    } catch (error) {
      console.error('Failed to start chat:', error);
      alert('无法连接大师，请稍后再试。');
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading || remainingCount <= 0) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setRemainingCount(prev => prev - 1);
    setIsLoading(true);

    try {
      const aiResponse = await continueMasterChat(
        [...messages, userMessage],
        userData,
        fortuneResult
      );
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('大师暂时无法回应，请稍后再试。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const isLocked = remainingCount <= 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-gradient-to-br from-[#1a2342] to-[#0a0f1e] border-2 border-amber-500/30 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-900/40 to-amber-700/30 px-6 py-4 border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-2xl shadow-lg">
              ☯
            </div>
            <div>
              <h3 className="text-xl font-brush text-amber-200 font-bold">大师深层解读</h3>
              <p className="text-xs text-amber-400/70 font-mono">道长为您答疑解惑</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-amber-400/70 hover:text-amber-200 transition-colors hover:bg-amber-900/20 rounded-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#0a0f1e]/30">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-[#0a0f1e] rounded-br-md'
                    : 'bg-gradient-to-br from-[#1a2342] to-[#0a0f1e] border border-amber-500/20 text-amber-100 rounded-bl-md'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-brush text-amber-400/80">道长</span>
                    <span className="text-[10px] text-amber-400/50 font-mono">
                      {new Date(message.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-wrap font-serif-sc">
                  {message.content}
                </p>
                {message.role === 'user' && (
                  <div className="text-right mt-1">
                    <span className="text-[10px] text-amber-900/50 font-mono">
                      {new Date(message.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gradient-to-br from-[#1a2342] to-[#0a0f1e] border border-amber-500/20 text-amber-100 px-4 py-3 rounded-2xl rounded-bl-md">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  <span className="text-xs text-amber-400/70 ml-2">大师正在思考...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-amber-500/20 bg-[#0a0f1e]/50 p-4">
          {/* Remaining Count Display */}
          <div className="flex items-center justify-between mb-3">
            <div className={`flex items-center gap-2 text-sm ${isLocked ? 'text-amber-400/50' : 'text-amber-400/80'}`}>
              <span className="text-lg">✦</span>
              <span className="font-mono">
                大师剩余解惑次数：<span className={isLocked ? 'text-red-400' : 'text-amber-300 font-bold'}>{remainingCount}</span>/3
              </span>
            </div>
            {!isLocked && (
              <span className="text-xs text-amber-400/50 font-mono">按 Enter 发送</span>
            )}
          </div>

          {isLocked ? (
            /* Locked State */
            <div className="relative">
              {/* Lock Overlay */}
              <div className="absolute inset-0 bg-[#0a0f1e]/80 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center z-10">
                <div className="text-amber-400/80 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
                <p className="text-amber-400 font-serif-sc mb-3">天机不可尽泄</p>
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-[#0a0f1e] rounded-lg font-bold font-serif-sc hover:from-amber-300 hover:to-amber-400 transition-all shadow-lg shadow-amber-500/30"
                >
                  ✨ 解锁无限追问
                </button>
              </div>

              {/* Disabled Input (for visual consistency) */}
              <textarea
                disabled
                className="w-full bg-[#1a2342]/50 border border-amber-900/30 rounded-lg p-4 text-amber-100 font-serif-sc resize-none opacity-50"
                rows={3}
                placeholder="请输入您的问题..."
              />
            </div>
          ) : (
            /* Normal State */
            <div className="flex gap-3">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                placeholder="请输入您的问题，道长将为您解惑..."
                className="flex-1 bg-[#1a2342]/50 border border-amber-900/30 focus:border-amber-500/50 rounded-lg p-4 text-amber-100 font-serif-sc resize-none transition-all placeholder-amber-100/30"
                rows={2}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isLoading}
                className="px-6 bg-gradient-to-br from-amber-500 to-amber-600 text-[#0a0f1e] rounded-lg font-bold font-serif-sc hover:from-amber-400 hover:to-amber-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed self-end shadow-lg shadow-amber-500/20"
              >
                {isLoading ? '发送中...' : '发送'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowUpgradeModal(false)} />
          <div className="relative bg-gradient-to-br from-[#1a2342] to-[#0a0f1e] border-2 border-amber-500/40 rounded-2xl p-8 max-w-md text-center">
            <div className="text-4xl mb-4">🔮</div>
            <h3 className="text-2xl font-brush text-amber-200 mb-3">功能开发中</h3>
            <p className="text-amber-400/80 font-serif-sc leading-relaxed mb-6">
              无限追问功能正在准备中，敬请期待。
              <br /><br />
              感谢您的耐心等待。
            </p>
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="px-8 py-3 bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-lg font-bold font-serif-sc hover:bg-amber-500/30 transition-all"
            >
              知道了
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterChatModal;
