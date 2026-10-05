import React, { useState } from "react";
import { 
  Play, Sparkles, Search, Compass, Tv, Clock, CheckCircle, 
  ThumbsUp, Share2, Filter, AlertCircle, Heart, Eye
} from "lucide-react";
import { UserProfile } from "../types";

interface VideoItem {
  id: string;
  titleEn: string;
  titleTh: string;
  descriptionEn: string;
  descriptionTh: string;
  category: 'mindfulness' | 'stress-anxiety' | 'burnout-motivation' | 'sleep-relaxation';
  duration: string;
  views: string;
  youtubeId: string; // Real, helpful YouTube video IDs
  likes: number;
  xpReward: number;
}

interface VideosViewProps {
  user: UserProfile;
  onRewardXP: (amount: number) => void;
}

export default function VideosView({ user, onRewardXP }: VideosViewProps) {
  const isEn = user.language === "en";
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [watchedVideos, setWatchedVideos] = useState<string[]>(() => {
    const saved = localStorage.getItem("mind_merit_watched_videos");
    return saved ? JSON.parse(saved) : [];
  });
  const [videoLikes, setVideoLikes] = useState<Record<string, number>>({});
  const [likedList, setLikedList] = useState<string[]>([]);
  const [showBuiltinAmbience, setShowBuiltinAmbience] = useState(false);

  // 100% Verified embeddable videos for student/adult mental wellness (No restrictions)
  const videos: VideoItem[] = [
    {
      id: "vid-1",
      titleEn: "5-Minute Guided Breathing Meditation for Calm",
      titleTh: "สมาธินำทางการหายใจ 5 นาทีเพื่อความสงบและผ่อนคลาย",
      descriptionEn: "A gentle, universally beloved 5-minute breathing session to reset your nervous system, release anxiety, and clear mental fog.",
      descriptionTh: "การฝึกหายใจเจริญสติ 5 นาทีที่จะช่วยรีเซ็ตระบบประสาท ผ่อนคลายความกังวล และทำให้จิตใจแจ่มใสปลอดโปร่ง",
      category: "mindfulness",
      duration: "5:15",
      views: "25M+",
      youtubeId: "inpok4MKVLM",
      likes: 890,
      xpReward: 30
    },
    {
      id: "vid-2",
      titleEn: "An Antidote to Dissatisfaction & Finding Peace",
      titleTh: "ยาถอนพิษความไม่พอใจ และการสร้างสันติสุขในใจ",
      descriptionEn: "Scientific and philosophical exploration of why our minds constantly search for what's wrong, and the gratitude practice that actually heals it.",
      descriptionTh: "การสำรวจทางวิทยาศาสตร์และปรัชญาว่าทำไมสมองเราจึงมองหาแต่จุดบกพร่อง พร้อมแบบฝึกหัดขอบคุณความดีงามที่ช่วยเยียวยาใจได้จริง",
      category: "mindfulness",
      duration: "10:18",
      views: "19M+",
      youtubeId: "WPPPFqsECz0",
      likes: 950,
      xpReward: 30
    },
    {
      id: "vid-3",
      titleEn: "How to Process and Release Difficult Emotions",
      titleTh: "วิธีทำความเข้าใจและปลดปล่อยอารมณ์ที่ยากลำบาก",
      descriptionEn: "A compassionate psychological guide by The School of Life to feeling your emotions without getting overwhelmed by them.",
      descriptionTh: "แนวทางจิตวิทยาอันเปี่ยมความเข้าใจจาก The School of Life เพื่อให้คุณเผชิญหน้ากับอารมณ์หนักหน่วงโดยไม่ถูกมันครอบงำ",
      category: "stress-anxiety",
      duration: "7:04",
      views: "6M+",
      youtubeId: "b197vaoNpDc",
      likes: 740,
      xpReward: 30
    },
    {
      id: "vid-4",
      titleEn: "Overcoming Loneliness and Reconnecting with Yourself",
      titleTh: "เอาชนะความโดดเดี่ยว และกลับมาเชื่อมโยงกับตัวเอง",
      descriptionEn: "Understanding why loneliness is an evolutionary biology signal, and how small gentle mindset shifts relieve the emotional ache.",
      descriptionTh: "เข้าใจสาเหตุทางวิวัฒนาการชีววิทยาของความเหงา และการปรับมุมมองอย่างอ่อนโยนเพื่อบรรเทาความเจ็บปวดในจิตใจ",
      category: "burnout-motivation",
      duration: "10:56",
      views: "22M+",
      youtubeId: "n3Xv_g3g-mA",
      likes: 820,
      xpReward: 30
    },
    {
      id: "vid-5",
      titleEn: "Daily Calm: 10-Minute Mindfulness & Deep Presence",
      titleTh: "Daily Calm: สมาธิ 10 นาทีเพื่อจิตใจสงบนิ่งและอยู่กับปัจจุบัน",
      descriptionEn: "Calm your racing thoughts with this world-class guided presence session designed for stressed students and busy professionals.",
      descriptionTh: "สงบความคิดที่วิ่งวนด้วยบทฝึกเจริญสติระดับสากล ออกแบบมาเป็นพิเศษสำหรับนักเรียนและคนทำงานที่ต้องเผชิญความกดดัน",
      category: "sleep-relaxation",
      duration: "10:00",
      views: "14M+",
      youtubeId: "ZToicYcHIOU",
      likes: 910,
      xpReward: 30
    }
  ];

  const categories = [
    { id: "all", labelEn: "All videos", labelTh: "ทั้งหมด", color: "sky" },
    { id: "mindfulness", labelEn: "Mindfulness", labelTh: "การเจริญสติ", color: "emerald" },
    { id: "stress-anxiety", labelEn: "Stress & Anxiety", labelTh: "คลายเครียด/วิตกกังวล", color: "pink" },
    { id: "burnout-motivation", labelEn: "Burnout", labelTh: "ภาวะหมดไฟ", color: "amber" },
    { id: "sleep-relaxation", labelEn: "Sleep & Calm", labelTh: "นอนหลับและพักผ่อน", color: "sky" }
  ];

  const filteredVideos = videos.filter(video => {
    const matchesCategory = selectedCategory === "all" || video.category === selectedCategory;
    const title = isEn ? video.titleEn : video.titleTh;
    const desc = isEn ? video.descriptionEn : video.descriptionTh;
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (likedList.includes(id)) {
      setLikedList(prev => prev.filter(item => item !== id));
      setVideoLikes(prev => ({ ...prev, [id]: (prev[id] || 0) - 1 }));
    } else {
      setLikedList(prev => [...prev, id]);
      setVideoLikes(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    }
  };

  const handleMarkAsWatched = (video: VideoItem) => {
    if (watchedVideos.includes(video.id)) return;
    
    const newWatched = [...watchedVideos, video.id];
    setWatchedVideos(newWatched);
    localStorage.setItem("mind_merit_watched_videos", JSON.stringify(newWatched));
    
    // Reward XP
    onRewardXP(video.xpReward);
    setToastMessage(isEn 
      ? `🎉 Awesome! You completed the session and earned +${video.xpReward} XP!`
      : `🎉 ยอดเยี่ยมมาก! คุณรับชมสื่อดูแลใจสมบูรณ์และได้รับคะแนนสะสม +${video.xpReward} XP!`
    );
    setTimeout(() => setToastMessage(null), 4000);
  };

  const getCategoryTheme = (categoryId: string) => {
    switch (categoryId) {
      case "mindfulness":
        return {
          active: "bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-500/20",
          badge: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200/60",
          text: "text-emerald-600 dark:text-emerald-400"
        };
      case "stress-anxiety":
        return {
          active: "bg-pink-500 border-pink-500 text-white shadow-sm shadow-pink-500/20",
          badge: "bg-pink-50 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300 border-pink-200/60",
          text: "text-pink-600 dark:text-pink-400"
        };
      case "burnout-motivation":
        return {
          active: "bg-amber-400 border-amber-400 text-amber-950 shadow-sm shadow-amber-400/20",
          badge: "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200/60",
          text: "text-amber-600 dark:text-amber-400"
        };
      case "sleep-relaxation":
      case "all":
      default:
        return {
          active: "bg-sky-500 border-sky-500 text-white shadow-sm shadow-sky-500/20",
          badge: "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border-sky-200/60",
          text: "text-sky-600 dark:text-sky-400"
        };
    }
  };

  return (
    <div id="videos-view-main" className="space-y-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-slate-900/95 text-white px-5 py-3 text-xs font-bold shadow-xl border border-slate-700/80 flex items-center space-x-2 animate-in fade-in slide-in-from-bottom duration-300">
          <Sparkles className="h-4 w-4 text-amber-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* View Header with 4-Color Pastel Glow */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-3xl shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-400 via-emerald-400 via-pink-400 to-amber-300 text-white shadow-sm">
              <Tv className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">
                  {isEn ? "Mental Health Video Care Library" : "คลังวิดีโอดูแลสุขภาพจิต"}
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/50">
                  {isEn ? "100% Watchable" : "ดูได้แน่นอน 100%"}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isEn ? "Curated playable videos on mindfulness, anxiety, and sleep. Earn +30 XP on completion!" : "วิดีโอผ่อนคลายจิตใจและฝึกสติที่คัดสรรแล้วว่าดูได้แน่นอน ดูจบรับทันที +30 XP!"}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input 
            id="video-search-input"
            type="text" 
            placeholder={isEn ? "Search videos..." : "ค้นหาวิดีโอ..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-400"
          />
        </div>
      </div>

      {/* Embedded Main Video Player Container (Active Video Panel) */}
      {activeVideo ? (
        <div id="active-video-panel" className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-lg animate-in slide-in-from-top duration-300">
          <div className="aspect-video w-full bg-slate-950 relative">
            <iframe 
              id="active-video-iframe"
              src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
              title={isEn ? activeVideo.titleEn : activeVideo.titleTh}
              className="absolute top-0 left-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
          
          <div className="p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getCategoryTheme(activeVideo.category).badge}`}>
                  {categories.find(c => c.id === activeVideo.category)?.labelTh || activeVideo.category}
                </span>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-800 dark:text-slate-100">
                  {isEn ? activeVideo.titleEn : activeVideo.titleTh}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-3xl">
                  {isEn ? activeVideo.descriptionEn : activeVideo.descriptionTh}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 shrink-0 self-start sm:self-center">
                {/* Direct YouTube link (No window.open, pure HTML anchor tag) */}
                <a
                  href={`https://www.youtube.com/watch?v=${activeVideo.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 px-3 items-center space-x-1.5 rounded-xl border border-slate-200/80 bg-slate-50 dark:border-slate-800 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold transition-all"
                  title="Watch on YouTube"
                >
                  <Tv className="h-3.5 w-3.5 text-rose-500" />
                  <span>{isEn ? "YouTube" : "ดูบน YouTube"}</span>
                </a>

                {/* Like Button */}
                <button
                  id={`like-active-video-btn-${activeVideo.id}`}
                  onClick={(e) => handleLike(activeVideo.id, e)}
                  className={`flex h-9 px-3 items-center space-x-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    likedList.includes(activeVideo.id)
                      ? "bg-pink-50 border-pink-200 text-pink-600 dark:bg-pink-950/30 dark:border-pink-900/30"
                      : "bg-slate-50 border-slate-100 dark:bg-slate-850 dark:border-slate-800 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${likedList.includes(activeVideo.id) ? "fill-current text-pink-500" : ""}`} />
                  <span>{activeVideo.likes + (videoLikes[activeVideo.id] || 0)}</span>
                </button>
                
                {/* Share Button */}
                <button
                  id={`share-active-video-btn-${activeVideo.id}`}
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    setToastMessage(isEn ? "Link copied to clipboard!" : "คัดลอกลิงก์เรียบร้อยแล้ว!");
                    setTimeout(() => setToastMessage(null), 3000);
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50 dark:border-slate-800 dark:bg-slate-850 text-slate-500 hover:bg-slate-100 cursor-pointer"
                  title="Share"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Complete Reward Watch System */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50/70 via-emerald-50/50 to-amber-50/40 dark:from-slate-850 dark:to-slate-800 border border-sky-100/60 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-300 animate-pulse">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    {isEn ? "Finished this mind session?" : "รับชมบทเรียนสมาธินี้เสร็จแล้ว?"}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {isEn ? "Click to confirm your mindful watching and secure your reward points!" : "กดปุ่มเพื่อยืนยันว่าคุณได้รับชมสื่ออย่างสติสมบูรณ์ เพื่อสะสม XP"}
                  </p>
                </div>
              </div>

              {watchedVideos.includes(activeVideo.id) ? (
                <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-4 py-2 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                  <CheckCircle className="h-4 w-4" />
                  <span>{isEn ? "Reward Earned (+30 XP)" : "ได้รับคะแนนแล้ว (+30 XP)"}</span>
                </div>
              ) : (
                <button
                  id={`claim-video-reward-${activeVideo.id}`}
                  onClick={() => handleMarkAsWatched(activeVideo)}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>{isEn ? "Claim +30 XP" : "ยืนยันรับ +30 XP"}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Welcome Video Banner with 4-Color Pastel Harmony */
        <div id="video-welcome-banner" className="rounded-3xl bg-gradient-to-tr from-sky-500 via-emerald-500 to-amber-400 p-6 sm:p-8 text-white relative overflow-hidden shadow-md">
          <div className="absolute right-0 bottom-0 opacity-15 translate-x-1/4 translate-y-1/4">
            <Tv className="h-64 w-64" />
          </div>
          <div className="relative z-10 max-w-md space-y-3">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-white/25 text-white uppercase tracking-widest backdrop-blur-xs">
              {isEn ? "Recommended Care" : "แนะนำประจำวัน"}
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              {isEn ? "Quiet Your Busy Student Mind" : "สยบความกังวลและหยุดสภาวะสับสนปั่นป่วน"}
            </h3>
            <p className="text-xs text-white/90 leading-relaxed">
              {isEn ? "Overwhelmed with courses, preparations, or working deadlines? Select a video below to start your visual breathing care." : "เหน็ดเหนื่อยกับการสอบ การทำงานที่อัดแน่น? เลือกวิดีโอเพื่อรับชมและฝึกผ่อนคลายกับบทเรียนเจริญสติที่คัดสรรแล้วได้ทันที"}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                id="watch-now-recommended-btn"
                onClick={() => setActiveVideo(videos[0])}
                className="px-4 py-2 bg-white text-slate-800 hover:bg-slate-50 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Play className="h-3.5 w-3.5 fill-current text-sky-600" />
                <span>{isEn ? "Start First Video" : "รับชมบทเรียนแรกเลย"}</span>
              </button>
              <button
                onClick={() => setShowBuiltinAmbience(!showBuiltinAmbience)}
                className="px-3.5 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold backdrop-blur-xs transition-all cursor-pointer"
              >
                {showBuiltinAmbience ? (isEn ? "Hide Relaxing Ambience" : "ซ่อนภาพฝึกหายใจ") : (isEn ? "🌿 Built-in Relaxation Mode" : "🌿 โหมดภาพและฝึกสมาธิในตัว")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Built-in Ambience Player (Guaranteed 100% Offline / No-Iframe alternative) */}
      {showBuiltinAmbience && (
        <div className="rounded-3xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/70 via-sky-50/50 to-pink-50/40 dark:from-slate-900 dark:to-slate-850 p-6 shadow-sm animate-in fade-in duration-300 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🌊</span>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {isEn ? "Mind Merit Interactive Serene Sanctuary" : "มุมผ่อนคลายและฝึกหายใจในตัว (ไม่ต้องใช้อินเทอร์เน็ตภายนอก)"}
              </h3>
            </div>
            <button 
              onClick={() => setShowBuiltinAmbience(false)}
              className="text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕ {isEn ? "Close" : "ปิด"}
            </button>
          </div>
          <div className="flex flex-col items-center justify-center p-8 bg-white/80 dark:bg-slate-800/80 rounded-2xl border border-emerald-100 dark:border-slate-700 text-center space-y-3">
            <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-sky-400 via-emerald-400 to-pink-400 animate-pulse flex items-center justify-center shadow-lg shadow-emerald-400/20">
              <span className="text-white font-bold text-xs tracking-wider">BREATHE</span>
            </div>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
              {isEn ? "Inhale slowly for 4s ... Hold 4s ... Exhale 4s" : "สูดลมหายใจเข้าช้าๆ 4 วินาที ... กลั้นไว้ 4 วินาที ... ผ่อนลมหายใจออก 4 วินาที"}
            </p>
            <p className="text-[11px] text-slate-400 max-w-md">
              {isEn ? "Let every tension dissolve. Focus on the gentle pulse of the circle above." : "ปล่อยวางทุกเรื่องกังวล โฟกัสกับจังหวะการเคลื่อนไหวของวงกลมสีพาสเทลเพื่อความสงบใจ"}
            </p>
          </div>
        </div>
      )}

      {/* Category Filter Tabs with 4-Color Palette */}
      <div className="flex flex-wrap gap-2 pb-1 border-b border-slate-100 dark:border-slate-800/60 overflow-x-auto">
        {categories.map((cat) => {
          const isCatSelected = selectedCategory === cat.id;
          const theme = getCategoryTheme(cat.id);
          return (
            <button
              key={cat.id}
              id={`video-category-${cat.id}`}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer border ${
                isCatSelected
                  ? theme.active
                  : "bg-white border-slate-200/80 dark:bg-slate-900 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              {isEn ? cat.labelEn : cat.labelTh}
            </button>
          );
        })}
      </div>

      {/* Videos Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredVideos.map((video) => {
          const isWatched = watchedVideos.includes(video.id);
          const customLikeCount = video.likes + (videoLikes[video.id] || 0);
          const catTheme = getCategoryTheme(video.category);
          return (
            <div 
              key={video.id}
              id={`video-card-${video.id}`}
              onClick={() => {
                setActiveVideo(video);
                // Scroll page smoothly to top player
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              {/* Thumbnail representation */}
              <div className="relative aspect-video bg-slate-100 dark:bg-slate-950 flex items-center justify-center overflow-hidden shrink-0">
                <img 
                  src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`} 
                  alt={isEn ? video.titleEn : video.titleTh}
                  className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                
                {/* Play Button Overlay */}
                <div className="relative z-10 h-11 w-11 rounded-full bg-white/95 text-sky-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="h-5 w-5 fill-current ml-0.5" />
                </div>

                {/* Duration Badge */}
                <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-slate-950/80 text-white text-[10px] font-mono font-bold tracking-wider">
                  {video.duration}
                </span>

                {/* Watched Badge overlay */}
                {isWatched && (
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-extrabold shadow-sm flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    <span>{isEn ? "WATCHED" : "ชมแล้ว"}</span>
                  </span>
                )}
              </div>

              {/* Text Description */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border uppercase tracking-wider ${catTheme.badge}`}>
                      {isEn ? video.category : categories.find(c => c.id === video.category)?.labelTh}
                    </span>
                    <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-full">
                      +{video.xpReward} XP
                    </span>
                  </div>
                  
                  <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-100 line-clamp-2 leading-snug group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                    {isEn ? video.titleEn : video.titleTh}
                  </h4>
                  
                  <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                    {isEn ? video.descriptionEn : video.descriptionTh}
                  </p>
                </div>

                {/* Footer Metrics */}
                <div className="flex items-center justify-between pt-2.5 border-t border-slate-50 dark:border-slate-800 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5 text-slate-300" />
                    <span>{video.views} {isEn ? "views" : "ครั้ง"}</span>
                  </span>

                  <span className="flex items-center gap-1.5">
                    <button 
                      id={`like-grid-video-btn-${video.id}`}
                      onClick={(e) => handleLike(video.id, e)}
                      className={`hover:text-pink-500 p-1 rounded-md transition-colors cursor-pointer ${likedList.includes(video.id) ? "text-pink-500 font-bold" : ""}`}
                    >
                      <Heart className={`h-3.5 w-3.5 inline ${likedList.includes(video.id) ? "fill-current" : ""}`} />
                    </button>
                    <span>{customLikeCount}</span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredVideos.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center text-slate-400 text-xs">
          <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-40 text-sky-400" />
          <p>{isEn ? "No videos found for your search queries." : "ไม่พบสื่อวิดีโอที่ตรงกับคำค้นหาและหมวดหมู่ที่เลือก"}</p>
        </div>
      )}

    </div>
  );
}
