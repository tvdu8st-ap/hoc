import React, { useState } from 'react';
import { useAgeMode } from '../context/AgeModeContext';
import { BreathingExercise } from '../components/BreathingExercise';
import {
  Smile,
  Heart,
  Send,
  Sparkles,
  CheckCircle,
  Wind,
  Sun,
  CloudRain,
  Flame,
  Coffee,
  HelpCircle,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

const MOODS = [
  {
    key: 'HAPPY',
    emoji: '😊',
    label: 'Vui vẻ & Tự tin',
    color: 'from-amber-400 to-yellow-500',
    bg: 'bg-amber-50 border-amber-200 text-amber-900',
    advice: 'Niềm vui của em thật tuyệt vời! Hãy lan tỏa nụ cười này đến một người bạn cạnh mình nhé.',
  },
  {
    key: 'CALM',
    emoji: '😌',
    label: 'Bình yên & Nhẹ nhõm',
    color: 'from-emerald-400 to-teal-500',
    bg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    advice: 'Trạng thái thư thái giúp tâm trí sáng suốt nhất. Đây là thời điểm tuyệt vời để đọc một cuốn sách.',
  },
  {
    key: 'WORRIED',
    emoji: '😰',
    label: 'Lo lắng & Hồi hộp',
    color: 'from-sky-400 to-blue-500',
    bg: 'bg-sky-50 border-sky-200 text-sky-900',
    advice: 'Lo lắng là dấu hiệu cho thấy em đang quan tâm đến một điều gì đó. Hãy thử hít thở sâu 3 nhịp và chia nhỏ công việc nhé.',
  },
  {
    key: 'SAD',
    emoji: '😢',
    label: 'Buồn bã & Trống trải',
    color: 'from-indigo-400 to-purple-500',
    bg: 'bg-indigo-50 border-indigo-200 text-indigo-900',
    advice: 'Buồn bã cũng giống như một ngày mưa rào, rồi trời sẽ lại nắng ấm. Em hãy cho phép bản thân nghỉ ngơi và chia sẻ với người em tin cậy.',
  },
  {
    key: 'ANGRY',
    emoji: '😠',
    label: 'Tức giận & Bực bội',
    color: 'from-rose-400 to-red-500',
    bg: 'bg-rose-50 border-rose-200 text-rose-900',
    advice: 'Cơn tức giận giống như ngọn lửa bùng cháy. Uống một ngụm nước mát và tập bài thở 4-4 bên dưới để dập tắt ngọn lửa nhé.',
  },
  {
    key: 'CONFUSED',
    emoji: '🤔',
    label: 'Bối rối & Khó hiểu',
    color: 'from-violet-400 to-purple-500',
    bg: 'bg-purple-50 border-purple-200 text-purple-900',
    advice: 'Không sao cả nếu em chưa tìm ra câu trả lời ngay. Cứ từ từ từng bước một, thầy cô luôn ở đây để cùng em gỡ rối.',
  },
  {
    key: 'TIRED',
    emoji: '🥱',
    label: 'Mệt mỏi & Thiếu năng lượng',
    color: 'from-slate-400 to-gray-500',
    bg: 'bg-slate-50 border-slate-200 text-slate-900',
    advice: 'Cơ thể và tâm trí em đang nhắn gửi rằng em cần nạp lại năng lượng. Hãy ngủ sớm tối nay và uống đủ nước nhé.',
  },
];

export const EmotionCorner: React.FC = () => {
  const { isPrimary, mode } = useAgeMode();
  const [selectedMood, setSelectedMood] = useState(MOODS[0]);
  const [energyScore, setEnergyScore] = useState(3);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  // Letting Go / Balloon Release interactive activity
  const [letGoText, setLetGoText] = useState('');
  const [balloonReleased, setBalloonReleased] = useState(false);

  const handleSubmitCheckin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/emotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moodKey: selectedMood.key,
          moodLabel: selectedMood.label,
          energyScore,
          note,
          gradeLevel: mode,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmittedMessage(selectedMood.advice);
        setNote('');
      }
    } catch {
      setSubmittedMessage(selectedMood.advice);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReleaseBalloon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!letGoText.trim()) return;
    setBalloonReleased(true);
    setTimeout(() => {
      setLetGoText('');
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Title */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-50 text-amber-800 rounded-full text-xs font-bold border border-amber-200">
          <Smile className="w-4 h-4 text-amber-500" />
          <span>Góc Cảm Xúc & Nuôi Dưỡng Tâm Hồn</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {isPrimary ? 'Trạm Lắng Nghe Trái Tim' : 'Nhận Diện Cảm Xúc & Cân Bằng Tâm Trí'}
        </h1>
        <p className="text-sm text-slate-600">
          Không có cảm xúc nào là "xấu" hay "sai". Mọi cảm xúc đều là thông điệp tự nhiên của cơ thể gửi đến em.
        </p>
      </div>

      {/* Grid: Emotion Check-in + Balloon Release */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Emotion Check-in Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                1. Hiện tại em cảm thấy thế nào?
              </h2>
              <p className="text-xs text-slate-500">Chọn biểu tượng thể hiện đúng tâm trạng của em nhất</p>
            </div>
            <div className="text-xs bg-sky-50 text-sky-700 px-3 py-1 rounded-full font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
              <span>Tuyệt đối bảo mật</span>
            </div>
          </div>

          {/* Mood buttons grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {MOODS.map((mood) => {
              const isSelected = selectedMood.key === mood.key;
              return (
                <button
                  type="button"
                  key={mood.key}
                  onClick={() => {
                    setSelectedMood(mood);
                    setSubmittedMessage(null);
                  }}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 ${
                    isSelected
                      ? `${mood.bg} ring-2 ring-sky-500 shadow-sm scale-102 font-bold`
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-3xl">{mood.emoji}</span>
                  <span className="text-xs">{mood.label}</span>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmitCheckin} className="space-y-5">
            {/* Energy Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-2">
                <span>Mức độ năng lượng trong người:</span>
                <span className="px-2.5 py-0.5 bg-slate-100 rounded-full text-sky-700">
                  {energyScore}/5 {energyScore <= 2 ? '(Thấp)' : energyScore === 3 ? '(Bình thường)' : '(Rất dồi dào)'}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={energyScore}
                onChange={(e) => setEnergyScore(Number(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>Uể oải, cạn kiệt</span>
                <span>Vừa phải</span>
                <span>Tràn đầy sinh lực</span>
              </div>
            </div>

            {/* Optional note */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {isPrimary
                  ? 'Em có muốn viết vài chữ về nguyên nhân không? (Không bắt buộc)'
                  : 'Ghi chú ngắn về suy nghĩ của em lúc này (Tùy chọn):'}
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={
                  isPrimary
                    ? 'Ví dụ: Hôm nay bài tập hơi khó một chút, hoặc em vừa được bạn khen...'
                    : 'Ví dụ: Đang chuẩn bị kiểm tra 1 tiết, hoặc có chuyện buồn với bạn thân...'
                }
                rows={3}
                className="w-full text-xs p-3.5 rounded-2xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-slate-50"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl text-xs font-bold transition-all shadow-md shadow-sky-200 flex items-center justify-center gap-2 active:scale-98"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Đang ghi nhận...' : 'Lắng nghe lời khuyên cho cảm xúc này'}</span>
            </button>
          </form>

          {/* Feedback response */}
          {submittedMessage && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-sky-50 border border-amber-200/80 animate-in fade-in duration-300">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{selectedMood.emoji}</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    Thông điệp dành riêng cho em:
                  </h4>
                  <p className="text-xs text-slate-700 mt-1 leading-relaxed">{submittedMessage}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Interactive "Thả Bóng Bay Giải Tỏa Lo Lắng" */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-2 text-purple-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Trò Chơi Thả Bóng Giải Tỏa</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {isPrimary ? 'Thổi Bay Cục Buồn Phiền!' : 'Buông Bỏ Căng Thẳng & Lo Âu'}
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Hãy viết một điều khiến em phiền lòng vào quả bóng này, rồi bấm nút để thả nó bay lên bầu trời xa xôi nhé.
            </p>

            <form onSubmit={handleReleaseBalloon} className="mt-5 space-y-3">
              <input
                type="text"
                value={letGoText}
                onChange={(e) => setLetGoText(e.target.value)}
                placeholder={
                  isPrimary
                    ? 'Ví dụ: Em lo bài kiểm tra Toán, em sợ bị điểm kém...'
                    : 'Ví dụ: Lo lắng thi cử, áp lực kỳ vọng, mâu thuẫn với bạn...'
                }
                className="w-full text-xs p-3.5 rounded-2xl border border-purple-200 focus:outline-hidden focus:ring-2 focus:ring-purple-400 bg-white"
                disabled={balloonReleased}
              />

              <button
                type="submit"
                disabled={!letGoText.trim() || balloonReleased}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <span>🎈</span>
                <span>Thả bóng bay lên trời</span>
              </button>
            </form>

            {balloonReleased && (
              <div className="mt-4 p-4 rounded-2xl bg-white/90 border border-purple-200 text-center animate-in zoom-in-95 duration-300">
                <span className="text-4xl animate-bounce inline-block">🎈💨</span>
                <p className="text-xs font-bold text-purple-900 mt-2">
                  Quả bóng mang theo nỗi lo đã bay xa rồi!
                </p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Tâm trí em xứng đáng được bình yên và nhẹ nhõm.
                </p>
                <button
                  onClick={() => setBalloonReleased(false)}
                  className="mt-3 text-[11px] font-bold text-purple-700 hover:underline flex items-center justify-center gap-1 mx-auto"
                >
                  <RefreshCw className="w-3 h-3" /> Thả thêm một điều khác
                </button>
              </div>
            )}
          </div>

          {/* Emotional Safety Guidelines */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>3 Thói Quen Nhỏ Cho Trái Tim Khỏe:</span>
            </h4>
            <ul className="text-xs text-slate-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-sky-600 font-bold">•</span>
                <span>
                  <strong>Gọi tên cảm xúc:</strong> Khi nhận biết được "Mình đang buồn" hay "Mình đang giận", cơn bão cảm xúc đã giảm đi 50%.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sky-600 font-bold">•</span>
                <span>
                  <strong>Đừng kìm nén:</strong> Khóc khi buồn là cơ chế tự làm sạch tự nhiên của cơ thể, không phải yếu đuối.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sky-600 font-bold">•</span>
                <span>
                  <strong>Tìm sự trợ giúp:</strong> Người trưởng thành thực sự dũng cảm là người biết nhờ người khác giúp khi gặp khó khăn.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Breathing Exercise Section */}
      <section className="pt-4">
        <BreathingExercise isPrimary={isPrimary} />
      </section>
    </div>
  );
};
