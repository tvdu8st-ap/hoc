import React, { useState, useEffect } from 'react';
import { useAgeMode } from '../context/AgeModeContext';
import { EducationalResource, GradeLevel } from '../types';
import {
  BookOpen,
  Search,
  Clock,
  User,
  Tag,
  ArrowRight,
  X,
  Sparkles,
  BookMarked,
  Filter,
} from 'lucide-react';

export const Library: React.FC = () => {
  const { mode, isPrimary } = useAgeMode();
  const [resources, setResources] = useState<EducationalResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [gradeFilter, setGradeFilter] = useState<string>(mode);
  const [readingResource, setReadingResource] = useState<EducationalResource | null>(null);

  const categories = [
    'ALL',
    'Áp lực học tập',
    'Kỹ năng cảm xúc',
    'Phòng chống bắt nạt',
    'Dành cho phụ huynh',
  ];

  useEffect(() => {
    fetchResources();
  }, [gradeFilter, selectedCategory, search]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (gradeFilter !== 'ALL') query.append('gradeLevel', gradeFilter);
      if (selectedCategory !== 'ALL') query.append('category', selectedCategory);
      if (search.trim()) query.append('search', search.trim());

      const res = await fetch(`/api/resources?${query.toString()}`);
      const data = await res.json();
      if (data.success) {
        setResources(data.resources);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold border border-emerald-200">
          <BookOpen className="w-4 h-4 text-emerald-600" />
          <span>Thư Viện Kỹ Năng & Bài Học Trưởng Thành</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Kho Học Liệu & Kỹ Năng Sống
        </h1>
        <p className="text-sm text-slate-600">
          Bài viết, truyện tình huống và cẩm nang khoa học giúp em rèn luyện bản lĩnh, quản lý cảm xúc và xây dựng tình bạn lành mạnh.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo chủ đề, tiêu đề..."
            className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Grade Level Selector */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Lọc:
          </span>
          <button
            onClick={() => setGradeFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              gradeFilter === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tất cả cấp học
          </button>
          <button
            onClick={() => setGradeFilter('PRIMARY')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              gradeFilter === 'PRIMARY'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🧸 Tiểu học (1-5)
          </button>
          <button
            onClick={() => setGradeFilter('SECONDARY')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              gradeFilter === 'SECONDARY'
                ? 'bg-sky-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🎓 THCS (6-9)
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all ${
              selectedCategory === cat
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat === 'ALL' ? 'Tất cả danh mục' : cat}
          </button>
        ))}
      </div>

      {/* Resource Cards Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400">
          Đang tải kho học liệu...
        </div>
      ) : resources.length === 0 ? (
        <div className="py-16 text-center text-xs text-slate-500 bg-white rounded-3xl border border-dashed border-slate-200">
          Không tìm thấy bài viết phù hợp với tiêu chí lọc.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((res) => (
            <div
              key={res.id}
              onClick={() => setReadingResource(res)}
              className="group bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between cursor-pointer"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                    {res.category}
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{res.readTimeMinutes} phút đọc</span>
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-snug">
                  {res.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {res.summary}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>{res.authorName}</span>
                </span>
                <span className="font-bold text-emerald-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Đọc tiếp</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reader Modal */}
      {readingResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-slate-200 flex items-start justify-between bg-slate-50">
              <div className="space-y-1 pr-6">
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  {readingResource.category}
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1 leading-snug">
                  {readingResource.title}
                </h2>
                <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
                  <span>Tác giả: {readingResource.authorName}</span>
                  <span>•</span>
                  <span>Thời lượng: {readingResource.readTimeMinutes} phút đọc</span>
                </div>
              </div>
              <button
                onClick={() => setReadingResource(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200 transition-colors"
                aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 italic text-slate-600 text-xs">
                {readingResource.summary}
              </div>
              <div className="whitespace-pre-line space-y-3 pt-2">
                {readingResource.content}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center text-xs">
              <span className="text-slate-400 text-[11px]">
                Nguồn: Ban Tư vấn Tâm lý Học đường
              </span>
              <button
                onClick={() => setReadingResource(null)}
                className="px-5 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
              >
                Đã hiểu bài học
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
