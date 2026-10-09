import React, { useState, useRef, useEffect } from 'react';
import { useAgeMode } from '../context/AgeModeContext';
import {
  Bot,
  Send,
  User,
  Trash2,
  AlertTriangle,
  Sparkles,
  Phone,
  ShieldCheck,
  RefreshCw,
  HelpCircle,
  HeartHandshake,
  UserCheck,
  Calendar,
  CheckCircle2,
  MessageSquare,
  Volume2,
  X,
  ArrowRight,
} from 'lucide-react';

interface EscalationData {
  type: 'MEET_COUNSELOR' | 'DIRECT_HOTLINE';
  title: string;
  desc: string;
  targetStaff: string;
  location: string;
  suggestedAction: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  isEmergency?: boolean;
  needsEscalation?: boolean;
  escalationCard?: EscalationData;
  timestamp: string;
}

interface AIChatProps {
  onOpenEmergency: () => void;
}

export const AIChat: React.FC<AIChatProps> = ({ onOpenEmergency }) => {
  const { isPrimary, mode, setMode } = useAgeMode();
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'welcome-msg',
        sender: 'bot',
        text: isPrimary
          ? 'Chào bạn nhỏ! Mình là Bạn Đồng Hành đây 🧸. Mình có thể cùng em trò chuyện về chuyện học tập, bạn bè ở trường hoặc những cảm xúc lúc vui, lúc buồn. Nếu có chuyện khiến em lo lắng, em cũng luôn có thể tìm thầy cô hoặc bố mẹ nhé!'
          : 'Chào em! Mình là Bạn Đồng Hành, trợ lý tư vấn học đường. Mình có thể cùng em tìm hiểu về cảm xúc, phương pháp học tập, tình bạn và cách giải quyết những tình huống thường gặp ở trường. Nếu có chuyện khiến em lo lắng, em cũng có thể tìm thầy cô hoặc người lớn mà em tin tưởng.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);
  const [emergencyAlert, setEmergencyAlert] = useState(false);

  // Escalation Modal state
  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [escalateSummary, setEscalateSummary] = useState('');
  const [isEscalating, setIsEscalating] = useState(false);
  const [escalateSuccess, setEscalateSuccess] = useState<{
    requestCode: string;
    assignedStaff: string;
    location: string;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const primarySuggestions = [
    'Em buồn vì bị bạn trêu',
    'Làm sao để làm bài kiểm tra không run?',
    'Cách làm hòa với bạn thân',
    'Em muốn gặp Cô Thùy Trang phòng tư vấn',
  ];

  const secondarySuggestions = [
    'Làm sao để bớt lo lắng trước kỳ thi?',
    'Nhóm bạn thân bỗng dưng tẩy chay mình',
    'Cách nói chuyện để bố mẹ hiểu áp lực học tập',
    'Bị bắt nạt trên mạng thì nên làm gì?',
    'Em muốn đặt lịch gặp Thầy Tuấn Anh tại Phòng 204',
  ];

  const suggestions = isPrimary ? primarySuggestions : secondarySuggestions;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (userTextToSend?: string) => {
    const text = (userTextToSend || input).trim();
    if (!text || isLoading) return;

    setRateLimitError(null);
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Build conversation history for context
      const history = messages.slice(-5).map((m) => ({
        role: (m.sender === 'user' ? 'user' : 'model') as 'user' | 'model',
        text: m.text,
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          gradeLevel: mode,
          history,
        }),
      });

      if (res.status === 429) {
        setRateLimitError('Bạn gửi tin nhắn quá nhanh. Vui lòng chờ 30 giây rồi tiếp tục trò chuyện nhé!');
        setIsLoading(false);
        return;
      }

      const data = await res.json();

      if (data.success && data.data) {
        const botReply = data.data.reply;
        const isUrgent = data.data.isUrgentOrEmergency;
        const needsEscalation = data.data.needsEscalation;
        const escalationCard = data.data.escalationCard;

        if (isUrgent) {
          setEmergencyAlert(true);
        }

        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: botReply,
          isEmergency: isUrgent,
          needsEscalation,
          escalationCard,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, botMsg]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: 'Mình luôn ở đây lắng nghe bạn. Bạn hãy chia sẻ thêm nhé!',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch (err) {
      console.error('Chat error', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: 'Hệ thống trợ lý AI đang bận một chút. Bạn có thể thử lại sau hoặc gửi tâm sự qua Góc Chia Sẻ để gặp thầy cô trực tiếp nhé!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Human Counselor Handover execution
  const handleEscalateToStaff = async () => {
    setIsEscalating(true);
    try {
      const summary =
        escalateSummary.trim() ||
        messages
          .filter((m) => m.sender === 'user')
          .slice(-2)
          .map((m) => m.text)
          .join('; ') ||
        'Học sinh cần gặp trực tiếp chuyên viên tư vấn qua phiên Bạn Đồng Hành AI.';

      const res = await fetch('/api/ai/escalate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageSummary: summary,
          gradeLevel: mode,
          studentAlias: isPrimary ? 'Bé học sinh Tiểu học' : 'Học sinh THCS',
          contactMethod: 'Gặp trực tiếp tại Phòng Tư vấn 204',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setEscalateSuccess({
          requestCode: data.requestCode,
          assignedStaff: data.assignedStaff,
          location: data.location,
        });

        // Add confirmation message to chat
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-handover-${Date.now()}`,
            sender: 'bot',
            text: `Thầy/Cô đã nhận được thông báo kết nối của em! Mã phiếu của em là [${data.requestCode}]. Em có thể ghé ${data.location} để gặp ${data.assignedStaff} vào bất kỳ giờ ra chơi nào nhé. Thầy cô luôn chờ em!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch (e) {
      console.error(e);
      alert('Không thể kết nối. Em có thể gửi trực tiếp qua mục Góc Chia Sẻ nhé!');
    } finally {
      setIsEscalating(false);
    }
  };

  const clearChatHistory = () => {
    setMessages([
      {
        id: 'welcome-msg',
        sender: 'bot',
        text: 'Cuộc trò chuyện đã được làm sạch để bảo vệ sự riêng tư của em. Em muốn trò chuyện về điều gì tiếp theo?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setEmergencyAlert(false);
    setRateLimitError(null);
  };

  // Text-to-speech reading for primary accessibility
  const handleReadText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-100">
            <Bot className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900">
                Bạn Đồng Hành (AI Học Đường)
              </h1>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Gemini 3.8 Flash
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Lắng nghe thấu cảm • Không phán xét • Không lưu thông tin cá nhân
            </p>
          </div>
        </div>

        {/* Action Controls: Dual Age Toggle & Escalation Button */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-full border border-slate-200 text-xs">
            <button
              onClick={() => setMode('PRIMARY')}
              className={`px-3 py-1 rounded-full font-bold transition-all ${
                isPrimary ? 'bg-amber-400 text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🧸 Tiểu học
            </button>
            <button
              onClick={() => setMode('SECONDARY')}
              className={`px-3 py-1 rounded-full font-bold transition-all ${
                !isPrimary ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🎓 THCS
            </button>
          </div>

          {/* Direct Human Counselor Handover Button */}
          <button
            onClick={() => {
              setEscalateSuccess(null);
              setShowEscalateModal(true);
            }}
            className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-200 transition-colors flex items-center gap-1.5 shadow-2xs"
            title="Gặp trực tiếp chuyên viên tư vấn học đường"
          >
            <UserCheck className="w-4 h-4 text-indigo-600" />
            <span>Gặp Thầy/Cô tư vấn thật</span>
          </button>

          {/* Privacy Wipe Button */}
          <button
            onClick={clearChatHistory}
            className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-xl transition-colors"
            title="Xóa trò chuyện (Bảo vệ riêng tư trên máy chung)"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Emergency Distress Alert Banner */}
      {emergencyAlert && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-600 text-white rounded-xl shrink-0">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-rose-900">
                Em đang cảm thấy quá tải hoặc gặp nguy hiểm?
              </h4>
              <p className="text-xs text-rose-700">
                Thầy cô và Tổng đài Quốc gia 111 luôn sẵn sàng hỗ trợ em ngay lập tức!
              </p>
            </div>
          </div>
          <button
            onClick={onOpenEmergency}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shrink-0 transition-colors flex items-center gap-1.5 shadow-md shadow-rose-200"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Mở trợ giúp khẩn cấp</span>
          </button>
        </div>
      )}

      {/* Rate limit warning */}
      {rateLimitError && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{rateLimitError}</span>
        </div>
      )}

      {/* Chat Window Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[580px] overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
          {messages.map((msg) => {
            const isBot = msg.sender === 'bot';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isBot ? '' : 'flex-row-reverse'}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isBot ? 'bg-purple-600 text-white' : 'bg-sky-600 text-white'
                  }`}
                >
                  {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isBot
                      ? msg.isEmergency
                        ? 'bg-rose-50 border border-rose-200 text-rose-950 font-medium'
                        : 'bg-white border border-slate-200/90 text-slate-800 shadow-2xs'
                      : 'bg-sky-600 text-white shadow-2xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Counselor Escalation Recommendation Card */}
                  {isBot && msg.escalationCard && (
                    <div className="mt-3.5 p-3.5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 text-slate-800 space-y-2">
                      <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
                        <HeartHandshake className="w-4 h-4 text-indigo-600" />
                        <span>{msg.escalationCard.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-normal">
                        {msg.escalationCard.desc}
                      </p>
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-indigo-100 text-[11px]">
                        <span className="text-indigo-800 font-semibold">
                          {msg.escalationCard.targetStaff} • {msg.escalationCard.location}
                        </span>
                        <button
                          onClick={() => {
                            setEscalateSuccess(null);
                            setShowEscalateModal(true);
                          }}
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                        >
                          <span>Kết nối ngay</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-2 pt-1">
                    {isBot && (
                      <button
                        onClick={() => handleReadText(msg.text)}
                        className="text-[10px] text-slate-400 hover:text-purple-600 flex items-center gap-1"
                        title="Nghe đọc nội dung"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Đọc</span>
                      </button>
                    )}
                    <span
                      className={`text-[10px] ml-auto ${
                        isBot ? 'text-slate-400' : 'text-sky-200'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-2xs flex items-center gap-2 text-xs text-slate-500">
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
                <span>Bạn Đồng Hành đang suy nghĩ câu trả lời...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="p-2.5 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
            Gợi ý:
          </span>
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => handleSendMessage(s)}
              className="text-xs px-3 py-1 rounded-full bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-slate-700 shrink-0 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3.5 bg-white border-t border-slate-200 space-y-1.5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              maxLength={500}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                isPrimary
                  ? 'Viết điều em muốn trò chuyện cùng Bạn Đồng Hành ở đây nhé...'
                  : 'Nhập tâm sự hoặc điều bạn muốn chia sẻ cùng Bạn Đồng Hành...'
              }
              className="flex-1 text-xs sm:text-sm p-3.5 rounded-2xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-400 bg-slate-50/70"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-3.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-2xl shadow-sm transition-all shrink-0 active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Character counter & safety disclaimer */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>An toàn cho học sinh • Không tự chẩn đoán bệnh tâm thần</span>
            </div>
            <span>{input.length}/500 ký tự</span>
          </div>
        </div>
      </div>

      {/* HUMAN COUNSELOR HANDOVER MODAL */}
      {showEscalateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-5">
            <button
              onClick={() => setShowEscalateModal(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {escalateSuccess ? (
              <div className="text-center py-4 space-y-4 animate-in zoom-in-95 duration-200">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Đã Kết Nối Tới Thầy/Cô Thành Công!
                </h3>
                <p className="text-xs text-slate-600">
                  Mã tiếp nhận bảo mật của em là:{' '}
                  <strong className="font-mono text-indigo-700 text-base">
                    {escalateSuccess.requestCode}
                  </strong>
                </p>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-left space-y-1.5">
                  <div>
                    Người phụ trách: <strong>{escalateSuccess.assignedStaff}</strong>
                  </div>
                  <div>
                    Địa điểm: <strong>{escalateSuccess.location}</strong>
                  </div>
                  <div className="text-slate-500 text-[11px] pt-1 border-t border-slate-200">
                    Em có thể ghé Phòng 204 vào giờ ra chơi hoặc theo dõi tiến độ phiếu tại mục <strong>Góc Chia Sẻ</strong>.
                  </div>
                </div>
                <button
                  onClick={() => setShowEscalateModal(false)}
                  className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
                >
                  Đã hiểu, quay lại trò chuyện
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-100 text-indigo-700 rounded-2xl">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Kết Nối Với Chuyên Viên Tư Vấn Học Đường
                    </h3>
                    <p className="text-xs text-slate-500">
                      Chuyển tiếp tâm sự tới {isPrimary ? 'Cô Nguyễn Thị Thùy Trang' : 'ThS. Nguyễn Tuấn Anh'} (Phòng 204)
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Khi gặp khó khăn kéo dài, trò chuyện cùng người lớn tin cậy là cách an toàn và hiệu quả nhất. Thầy cô luôn giữ bí mật tuyệt đối nội dung chia sẻ.
                </p>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ghi chú tóm tắt điều em cần hỗ trợ:
                  </label>
                  <textarea
                    rows={3}
                    value={escalateSummary}
                    onChange={(e) => setEscalateSummary(e.target.value)}
                    placeholder="Ví dụ: Em đang rất lo lắng về bài kiểm tra và muốn gặp thầy cô xin lời khuyên..."
                    className="w-full text-xs p-3.5 rounded-2xl border border-slate-200 bg-slate-50"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setShowEscalateModal(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    onClick={handleEscalateToStaff}
                    disabled={isEscalating}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold shadow-sm flex items-center gap-2"
                  >
                    <HeartHandshake className="w-4 h-4" />
                    <span>{isEscalating ? 'Đang kết nối...' : 'Xác nhận kết nối tới Thầy/Cô'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
