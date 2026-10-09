import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Heart, Sparkles, Wind } from 'lucide-react';

interface BreathingExerciseProps {
  isPrimary?: boolean;
}

type BreathPhase = 'INHALE' | 'HOLD_IN' | 'EXHALE' | 'REST';

export const BreathingExercise: React.FC<BreathingExerciseProps> = ({ isPrimary = false }) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<BreathPhase>('INHALE');
  const [timer, setTimer] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev > 1) return prev - 1;

          // Transition phase
          setPhase((currentPhase) => {
            switch (currentPhase) {
              case 'INHALE':
                return 'HOLD_IN';
              case 'HOLD_IN':
                return 'EXHALE';
              case 'EXHALE':
                return 'REST';
              case 'REST':
                setCyclesCompleted((c) => c + 1);
                return 'INHALE';
            }
          });
          return 4; // Reset to 4 seconds
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  const resetExercise = () => {
    setIsActive(false);
    setPhase('INHALE');
    setTimer(4);
    setCyclesCompleted(0);
  };

  const getPhaseInfo = () => {
    switch (phase) {
      case 'INHALE':
        return {
          title: isPrimary ? '🌸 Hít vào nhè nhẹ' : 'Hít vào chậm rãi qua mũi',
          desc: isPrimary ? 'Như ngửi hương một bông hoa thơm' : 'Cảm nhận lồng ngực và bụng nở rộng',
          color: 'from-sky-400 to-blue-500',
          scale: 'scale-110',
          ring: 'ring-sky-200',
        };
      case 'HOLD_IN':
        return {
          title: isPrimary ? '✨ Giữ hơi một chút' : 'Giữ hơi thở êm dịu',
          desc: isPrimary ? 'Để trái tim cảm thấy thật bình yên' : 'Thư giãn cơ vai và cơ mặt',
          color: 'from-amber-400 to-yellow-500',
          scale: 'scale-110',
          ring: 'ring-amber-200',
        };
      case 'EXHALE':
        return {
          title: isPrimary ? '🍃 Thổi nhẹ ra nào' : 'Thở ra từ từ qua miệng',
          desc: isPrimary ? 'Như thổi bay một chiếc bồ công anh' : 'Giải phóng hết mọi căng thẳng lo âu',
          color: 'from-emerald-400 to-teal-500',
          scale: 'scale-90',
          ring: 'ring-emerald-200',
        };
      case 'REST':
        return {
          title: isPrimary ? '🧸 Nghỉ ngơi thảnh thơi' : 'Nghỉ ngơi và thả lỏng',
          desc: isPrimary ? 'Cơ thể em thật nhẹ nhàng' : 'Chuẩn bị cho nhịp thở tiếp theo',
          color: 'from-purple-400 to-indigo-500',
          scale: 'scale-100',
          ring: 'ring-purple-200',
        };
    }
  };

  const phaseInfo = getPhaseInfo();

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 flex flex-col items-center text-center relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-1 bg-sky-50 text-sky-700 rounded-full text-xs font-semibold mb-3">
        <Wind className="w-4 h-4 text-sky-500" />
        <span>{isPrimary ? 'Bong Bóng Hơi Thở Êm Dịu' : 'Kỹ Thuật Hít Thở 4-4-4 Giảm Căng Thẳng'}</span>
      </div>

      <h3 className="text-xl sm:text-2xl font-bold text-slate-800">
        {isPrimary ? 'Cùng Thở Đều Với Chú Gấu Nhé!' : 'Bài Tập Thư Giãn Hơi Thở (Box Breathing)'}
      </h3>
      <p className="text-sm text-slate-600 max-w-md mt-1">
        {isPrimary
          ? 'Mỗi khi lo lắng hoặc tức giận, chỉ cần 3 phút hít thở sẽ giúp em cảm thấy vui vẻ trở lại.'
          : 'Kỹ thuật khoa học giúp hạ nhịp tim, giảm hormone cortisol và lấy lại sự tập trung tức thì.'}
      </p>

      {/* Visual Animation Circle */}
      <div className="my-8 relative flex items-center justify-center w-56 h-56">
        {/* Outer glowing pulsing aura */}
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-tr ${phaseInfo.color} opacity-20 blur-xl transition-all duration-1000 ${
            isActive ? phaseInfo.scale : 'scale-100'
          }`}
        />

        {/* Outer decorative ring */}
        <div
          className={`absolute inset-2 rounded-full border-4 border-dashed border-slate-200 transition-all duration-1000 ${
            isActive ? 'rotate-45' : ''
          }`}
        />

        {/* Dynamic Breathing Bubble */}
        <div
          className={`w-40 h-40 rounded-full bg-gradient-to-br ${
            phaseInfo.color
          } text-white shadow-xl flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${
            isActive ? phaseInfo.scale : 'scale-100'
          }`}
        >
          {isActive ? (
            <>
              <span className="text-4xl font-extrabold tracking-tight">{timer}</span>
              <span className="text-xs font-medium uppercase tracking-wider opacity-90 mt-1">giây</span>
            </>
          ) : (
            <div className="flex flex-col items-center">
              <Sparkles className="w-8 h-8 mb-1 opacity-90" />
              <span className="text-xs font-bold uppercase tracking-wider">Sẵn sàng</span>
            </div>
          )}
        </div>
      </div>

      {/* Phase status text */}
      <div className="min-h-[4rem] flex flex-col items-center justify-center">
        <h4 className="text-lg font-bold text-slate-800 transition-all duration-300">
          {isActive ? phaseInfo.title : 'Bấm nút "Bắt đầu" để thư giãn'}
        </h4>
        <p className="text-sm text-slate-500 mt-0.5">
          {isActive ? phaseInfo.desc : 'Thực hiện 3-5 vòng thở để cảm nhận sự bình yên bên trong.'}
        </p>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-3 mt-6">
        <button
          onClick={() => setIsActive(!isActive)}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm shadow-md transition-all active:scale-95 ${
            isActive
              ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200'
              : 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-200'
          }`}
        >
          {isActive ? (
            <>
              <Pause className="w-4 h-4" /> Tạm dừng
            </>
          ) : (
            <>
              <Play className="w-4 h-4" /> Bắt đầu hít thở
            </>
          )}
        </button>

        <button
          onClick={resetExercise}
          className="p-3 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-2xl border border-slate-200 transition-colors"
          title="Làm lại từ đầu"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Completion Counter */}
      {cyclesCompleted > 0 && (
        <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold">
          <Heart className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
          <span>Em đã hoàn thành {cyclesCompleted} vòng thở tuyệt vời!</span>
        </div>
      )}
    </div>
  );
};
