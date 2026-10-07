import { Award, Zap, BookOpen, Calendar, ChevronRight, UserCheck, Edit2, Check, X, Compass, HelpCircle } from "lucide-react";
import { UserProfile, MoodCheckIn, Badge } from "../types";
import { translations } from "../translations";
import React, { useState } from "react";

interface DashboardViewProps {
  user: UserProfile;
  moodLogs: MoodCheckIn[];
  badges: Badge[];
  onNavigate: (tab: string) => void;
  onUpdateUser?: (updated: UserProfile) => void;
  onOpenProfile?: () => void;
}

export default function DashboardView({ user, moodLogs, badges, onNavigate, onUpdateUser, onOpenProfile }: DashboardViewProps) {
  const t = translations[user.language];
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(user.name);
  const [tempRole, setTempRole] = useState(user.role);
  const [tempAvatar, setTempAvatar] = useState(user.avatar || "🧘");

  const emojiList = ["🧘", "🌸", "☀️", "🐱", "🦊", "🌈", "🍀", "🧠", "🧸", "🐬", "⭐", "🎨", "🎮", "🎵", "🦄", "🦖", "☕", "🚀"];

  const handleSaveProfile = () => {
    if (onUpdateUser) {
      onUpdateUser({
        ...user,
        name: tempName.trim() || user.name,
        role: tempRole,
        avatar: tempAvatar
      });
    }
    setIsEditing(false);
  };

  // Map mood types to score values for rendering
  const moodScores: Record<string, number> = {
    excellent: 5,
    good: 4,
    neutral: 3,
    bad: 2,
    terrible: 1
  };

  // Extract recent logs (last 7 logs) to render inside the SVG chart
  const recentLogs = [...moodLogs].sort((a, b) => a.date.localeCompare(b.date)).slice(-7);

  // Default seed logs if empty
  const chartLogs = recentLogs.length > 0 ? recentLogs : [
    { id: "1", date: "Mon", mood: "good" as const, stress: 3 },
    { id: "2", date: "Tue", mood: "neutral" as const, stress: 4 },
    { id: "3", date: "Wed", mood: "excellent" as const, stress: 2 },
    { id: "4", date: "Thu", mood: "bad" as const, stress: 7 },
    { id: "5", date: "Fri", mood: "good" as const, stress: 3 },
    { id: "6", date: "Sat", mood: "excellent" as const, stress: 2 },
    { id: "7", date: "Sun", mood: "excellent" as const, stress: 1 },
  ];

  // Calculate SVG line points for custom chart
  const width = 500;
  const height = 180;
  const padding = 30;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const pointsCount = chartLogs.length;
  const getX = (index: number) => padding + (index * (chartWidth / Math.max(1, pointsCount - 1)));
  
  // Mood ranges from 1 to 5. So map (1-5) to height
  const getMoodY = (moodStr: string) => {
    const val = moodScores[moodStr] || 3;
    // Map 5 (excellent) to top (padding), 1 (terrible) to bottom (height - padding)
    return padding + chartHeight - ((val - 1) / 4) * chartHeight;
  };

  // Stress ranges from 1 to 10. Map (1-10) to height
  const getStressY = (stressVal: number) => {
    return padding + chartHeight - ((stressVal - 1) / 9) * chartHeight;
  };

  const moodPoints = chartLogs.map((log, idx) => `${getX(idx)},${getMoodY(log.mood)}`).join(" ");
  const stressPoints = chartLogs.map((log, idx) => `${getX(idx)},${getStressY(log.stress)}`).join(" ");

  // Localized upcoming events
  const events = user.language === 'en' ? [
    { title: "Exam Preparation Stress Workshop", date: "Jul 22, 14:00", host: "Kru Paul, Psychologist" },
    { title: "Group Breathing & Meditation Session", date: "Jul 25, 19:30", host: "MIND MERIT Circle" }
  ] : [
    { title: "สัมมนาผ่อนคลายความเครียดเตรียมสอบ", date: "22 ก.ค. เวลา 14:00", host: "ครูพอล นักจิตวิทยา" },
    { title: "ฝึกหายใจกลุ่มและสมาธิออนไลน์", date: "25 ก.ค. เวลา 19:30", host: "กลุ่มเพื่อน MIND MERIT" }
  ];

  return (
    <div id="dashboard-view-main" className="space-y-6">
      
      {/* 1. Welcome & Summary Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-sky-100/80 via-pink-100/60 to-amber-100/70 p-6 dark:from-slate-900 dark:via-sky-950/20 dark:to-slate-900 border border-sky-100/80 dark:border-slate-800 transition-all duration-300">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex-1 mr-4">
            {isEditing ? (
              <div className="space-y-3 bg-white/70 dark:bg-slate-900/60 p-4 rounded-2xl border border-purple-200/30">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                  <div className="flex-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      {user.language === 'en' ? "Your Name" : "ชื่อของคุณ"}
                    </label>
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 text-xs rounded-xl border border-purple-200/50 bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-400 text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      {user.language === 'en' ? "Status / Role" : "สถานะ / บทบาท"}
                    </label>
                    <select
                      value={tempRole}
                      onChange={(e) => setTempRole(e.target.value as 'student' | 'adult')}
                      className="w-full mt-1 px-3 py-1.5 text-xs rounded-xl border border-purple-200/50 bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-400 text-slate-800 dark:text-slate-100"
                    >
                      <option value="student">{user.language === 'en' ? "Student" : "นักเรียน / นักศึกษา"}</option>
                      <option value="adult">{user.language === 'en' ? "Working Adult" : "วัยทำงาน"}</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {user.language === 'en' ? "Profile Emoji" : "อิโมจิโปรไฟล์"}
                  </label>
                  <div className="flex flex-wrap gap-1.5 p-2 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-purple-200/20 max-h-20 overflow-y-auto">
                    {emojiList.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setTempAvatar(emoji)}
                        className={`h-7 w-7 flex items-center justify-center text-sm rounded-lg hover:bg-purple-100 dark:hover:bg-purple-950/40 transition-all cursor-pointer ${tempAvatar === emoji ? "bg-purple-100 dark:bg-purple-900 border border-purple-500 scale-105" : ""}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center space-x-1.5 rounded-xl bg-purple-600 text-white px-3 py-1.5 text-xs font-bold hover:bg-purple-700 transition-all cursor-pointer"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>{user.language === 'en' ? "Save" : "บันทึก"}</span>
                  </button>
                  <button
                    onClick={() => {
                      setTempName(user.name);
                      setTempRole(user.role);
                      setTempAvatar(user.avatar || "🧘");
                      setIsEditing(false);
                    }}
                    className="flex items-center space-x-1.5 rounded-xl bg-slate-200 text-slate-700 px-3 py-1.5 text-xs font-bold hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-all cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                    <span>{user.language === 'en' ? "Cancel" : "ยกเลิก"}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2.5">
                  <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <span>{t.dashboard.welcome} {user.name}!</span> <span className="text-2xl">{user.avatar || "🌟"}</span>
                  </h2>
                  <button
                    onClick={() => {
                      setTempName(user.name);
                      setTempRole(user.role);
                      setIsEditing(true);
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/40 dark:bg-slate-900/20 hover:bg-white/80 dark:hover:bg-slate-800 text-purple-600 dark:text-purple-400 transition-all cursor-pointer"
                    title={user.language === 'en' ? "Edit profile name & role" : "แก้ไขชื่อและบทบาทของคุณ"}
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {user.language === 'en' 
                    ? `Your mental fitness as a ${user.role === 'student' ? 'Student' : 'Working Adult'} is expanding. You're making continuous, mindful progress.` 
                    : `สุขภาวะทางใจในฐานะ${user.role === 'student' ? 'นักเรียน/นักศึกษา' : 'วัยทำงาน'}ของคุณกำลังเติบโตขึ้น คุณกำลังเดินหน้าอย่างมีสติสม่ำเสมอ`}
                </p>
                {onOpenProfile && (
                  <button
                    id="dashboard-open-profile-btn"
                    onClick={onOpenProfile}
                    className="mt-3 inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-sky-500/10 text-sky-700 hover:bg-sky-500/20 dark:bg-sky-500/15 dark:text-sky-300 dark:hover:bg-sky-500/30 text-xs font-bold rounded-xl border border-sky-200/50 dark:border-sky-900/40 transition-all cursor-pointer shadow-2xs"
                  >
                    <span>🏆 {user.language === 'en' ? "View Stats & Certificates" : "ดูแต้มสะสม & เกียรติบัตรของคุณ"}</span>
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2 md:mt-0">
            {/* 1. Guide Button (ฟ้า / Sky Blue) */}
            <button
              onClick={() => onNavigate("guide")}
              className="rounded-2xl border border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800/60 px-3.5 py-2.5 text-xs font-bold shadow-2xs transition-all flex items-center space-x-1.5 cursor-pointer hover:scale-[1.02] active:scale-95"
            >
              <HelpCircle className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
              <span>{user.language === 'en' ? "User Guide" : "วิธีใช้งาน"}</span>
            </button>

            {/* 2. Log Mood Button (ชมพู / Blossom Pink) */}
            <button
              onClick={() => onNavigate("moodCheck")}
              className="rounded-2xl border border-pink-200 bg-pink-500 hover:bg-pink-600 px-3.5 py-2.5 text-xs font-bold text-white shadow-sm shadow-pink-500/20 transition-all flex items-center space-x-1.5 cursor-pointer hover:scale-[1.02] active:scale-95"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>{user.language === 'en' ? "+ Log Mood" : "+ บันทึกอารมณ์"}</span>
            </button>

            {/* 3. Chat with Buddy Button (เขียว / Mint Green) */}
            <button
              onClick={() => onNavigate("aiChat")}
              className="rounded-2xl border border-emerald-200 bg-emerald-500 hover:bg-emerald-600 px-3.5 py-2.5 text-xs font-bold text-white shadow-sm shadow-emerald-500/20 transition-all flex items-center space-x-1.5 cursor-pointer hover:scale-[1.02] active:scale-95"
            >
              <span>🌱</span>
              <span>{user.language === 'en' ? "Chat Buddy" : "คุยกับคู่หู AI"}</span>
            </button>

            {/* 4. Watch Care Video Button (เหลือง / Sunlight Yellow) */}
            <button
              onClick={() => onNavigate("videos")}
              className="rounded-2xl border border-amber-300 bg-amber-400 hover:bg-amber-500 text-amber-950 px-3.5 py-2.5 text-xs font-bold shadow-sm shadow-amber-400/20 transition-all flex items-center space-x-1.5 cursor-pointer hover:scale-[1.02] active:scale-95"
            >
              <span>☀️</span>
              <span>{user.language === 'en' ? "Watch Videos" : "คลิปดูแลใจ"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Guide Card Banner (With Sky Blue, Mint, Pink, and Yellow elements) */}
      <div className="rounded-3xl border border-sky-100/70 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-sm transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-400 via-teal-400 to-emerald-400 text-white shadow-md shadow-sky-500/10">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 text-[10px] font-bold border border-sky-100 dark:border-sky-900/30">
                {user.language === 'en' ? "Quick Start Guide" : "คู่มือแนะนำวิธีใช้"}
              </span>
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                {user.language === 'en' ? "How to use MIND MERIT in 4 Simple Steps" : "วิธีการใช้งาน MIND MERIT เบื้องต้น (4 ขั้นตอนง่ายๆ)"}
              </h3>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
              <span className="text-pink-600 dark:text-pink-400 font-semibold">1. เช็คอินอารมณ์</span> ➔ 
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold ml-1">2. ปรึกษาคู่หู AI</span> ➔ 
              <span className="text-amber-600 dark:text-amber-400 font-semibold ml-1">3. ชมคลิปดูแลใจ</span> ➔ 
              <span className="text-sky-600 dark:text-sky-400 font-semibold ml-1">4. ฝึกหายใจ & รับเกียรติบัตร</span>
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate("guide")}
          className="shrink-0 inline-flex items-center space-x-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white text-xs font-bold shadow-sm shadow-sky-500/15 transition-all cursor-pointer hover:scale-[1.02] active:scale-95 w-full sm:w-auto justify-center"
        >
          <span>{user.language === 'en' ? "View Full Guide" : "ดูวิธีการใช้งานทั้งหมด"}</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* 2. Grid of Core Stats and Custom SVG Graph */}
      <div className="grid gap-6 md:grid-cols-3">
        
        {/* Left Stat Cards */}
        <div className="space-y-4">
          
          {/* Day Streak Card (Sunlight Yellow) */}
          <div className="rounded-2xl border border-amber-100/70 bg-white p-5 dark:border-slate-800/60 dark:bg-slate-900 transition-all shadow-sm hover:border-amber-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t.dashboard.streak}</span>
              <div className="rounded-xl bg-amber-50 p-2 text-amber-500 dark:bg-amber-950/30 shadow-2xs">
                <Zap className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline space-x-1">
              <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{user.streak}</span>
              <span className="text-xs text-slate-400">{user.language === 'en' ? 'days' : 'วัน'}</span>
            </div>
            <p className="mt-2 text-[11px] text-slate-400 dark:text-slate-500">
              {user.language === 'en' ? "Log daily to grow your mindfulness streak!" : "บันทึกติดต่อกันทุกวันเพื่อเพิ่มคะแนนพลังใจ!"}
            </p>
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>{user.language === 'en' ? "Visits Today:" : "จำนวนครั้งที่เข้ามาวันนี้:"}</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">
                {user.visitsToday || 1} {user.language === 'en' ? "times" : "ครั้ง"}
              </span>
            </div>
          </div>

          {/* Level and XP Mission (Fresh Mint Green) */}
          <div className="rounded-2xl border border-emerald-100/70 bg-white p-5 dark:border-slate-800/60 dark:bg-slate-900 transition-all shadow-sm hover:border-emerald-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t.dashboard.dailyMissions}</span>
              <div className="rounded-xl bg-emerald-50 p-2 text-emerald-500 dark:bg-emerald-950/30 shadow-2xs">
                <Award className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 space-y-2">
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{t.dashboard.activeChallenge}</p>
              <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full w-2/5 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400" />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>2 / 5 mins</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">+50 XP</span>
              </div>
            </div>
          </div>

        </div>

        {/* Custom SVG Mood & Stress Chart (Middle and Right Expansion) */}
        <div className="md:col-span-2 rounded-2xl border border-sky-100/70 bg-white p-5 dark:border-slate-800/60 dark:bg-slate-900 transition-all shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">{t.dashboard.moodTrend}</h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                {user.language === 'en' ? "Comparing mood index (Sky Blue) with stress intensity (Sunlight Yellow)" : "เปรียบเทียบสุขภาวะทางใจ (สีฟ้า) และความเครียด (สีเหลือง)"}
              </p>
            </div>
            <div className="flex space-x-3 text-[10px] font-semibold">
              <span className="flex items-center text-sky-500 font-bold">
                <span className="mr-1.5 h-2.5 w-2.5 rounded-full bg-sky-400 shadow-2xs" />
                {user.language === 'en' ? "Mood (Sky Blue)" : "อารมณ์ (สีฟ้า)"}
              </span>
              <span className="flex items-center text-amber-500 font-bold">
                <span className="mr-1.5 h-2.5 w-2.5 rounded-full bg-amber-400 shadow-2xs" />
                {user.language === 'en' ? "Stress (Yellow)" : "ความเครียด (สีเหลือง)"}
              </span>
            </div>
          </div>

          {/* SVG Canvas Container */}
          <div className="w-full overflow-x-auto">
            <svg 
              viewBox={`0 0 ${width} ${height}`} 
              className="w-full min-w-[300px] sm:min-w-[450px] overflow-visible text-slate-600 dark:text-slate-400"
            >
              {/* Horizontal gridlines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => (
                <line 
                  key={idx}
                  x1={padding}
                  y1={padding + ratio * chartHeight}
                  x2={width - padding}
                  y2={padding + ratio * chartHeight}
                  className="stroke-slate-100 dark:stroke-slate-800"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              ))}

              {/* Grid Y Axis Labels */}
              <text x={padding - 8} y={padding + 4} className="text-[9px] fill-slate-400 font-medium" textAnchor="end">High</text>
              <text x={padding - 8} y={padding + chartHeight / 2 + 4} className="text-[9px] fill-slate-400 font-medium" textAnchor="end">Mid</text>
              <text x={padding - 8} y={padding + chartHeight + 4} className="text-[9px] fill-slate-400 font-medium" textAnchor="end">Low</text>

              {/* Mood Line (Sky Blue) */}
              <polyline 
                fill="none" 
                stroke="#0ea5e9" 
                strokeWidth="3.5" 
                strokeLinecap="round"
                strokeLinejoin="round"
                points={moodPoints}
                className="opacity-95"
              />

              {/* Stress Line (Sunlight Yellow) */}
              <polyline 
                fill="none" 
                stroke="#f59e0b" 
                strokeWidth="2.5" 
                strokeLinecap="round"
                strokeLinejoin="round"
                points={stressPoints}
                className="opacity-85"
              />

              {/* Markers & Interaction dots */}
              {chartLogs.map((log, idx) => {
                const x = getX(idx);
                const ym = getMoodY(log.mood);
                const ys = getStressY(log.stress);
                return (
                  <g key={idx} className="cursor-pointer group">
                    {/* Vertical Guide line */}
                    <line 
                      x1={x} 
                      y1={padding} 
                      x2={x} 
                      y2={padding + chartHeight} 
                      className="stroke-slate-100 dark:stroke-slate-800 opacity-50 group-hover:opacity-100" 
                      strokeWidth="1"
                    />
                    
                    {/* Mood Dot (Sky Blue) */}
                    <circle cx={x} cy={ym} r="5" fill="#0ea5e9" className="stroke-white dark:stroke-slate-900 shadow-sm" strokeWidth="2" />
                    {/* Stress Dot (Sunlight Yellow) */}
                    <circle cx={x} cy={ys} r="4" fill="#f59e0b" className="stroke-white dark:stroke-slate-900 shadow-sm" strokeWidth="1.5" />

                    {/* Date label */}
                    <text 
                      x={x} 
                      y={height - 8} 
                      className="text-[10px] fill-slate-400 dark:fill-slate-500 font-semibold" 
                      textAnchor="middle"
                    >
                      {log.date}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

      </div>

      {/* 3. Bottom Columns: Growth Plan & Badges + Events */}
      <div className="grid gap-6 md:grid-cols-3">
        
        {/* Growth Plan & AI Suggestions */}
        <div className="md:col-span-2 rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800/60 dark:bg-slate-900 transition-all shadow-sm">
          <div className="flex items-center justify-between mb-3 border-b border-slate-50 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              {t.dashboard.recommendationTitle}
            </h3>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[9px] font-bold text-emerald-600 dark:bg-emerald-950/30 border border-emerald-100/60">
              AI Personalized
            </span>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl bg-gradient-to-r from-sky-50/70 via-pink-50/40 to-amber-50/30 dark:bg-slate-800/60 p-4 border border-sky-100/60 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
              <p className="font-semibold text-sky-800 dark:text-sky-300 mb-1">
                {user.language === 'en' ? "Today's Assessment & Trend Guidance" : "ข้อสังเกตและคำแนะนำจากสุขภาวะวันนี้"}
              </p>
              <p className="leading-relaxed">
                {user.language === 'en' 
                  ? "Your average stress level of 3/10 is healthy. We noticed you logged 25 minutes of active exercise and expressed beautiful appreciation for your friends. To maintain this serenity, try out our mindfulness breathing module or connect with your buddy."
                  : "ดัชนีความเครียดเฉลี่ย 3/10 ของคุณอยู่ในเกณฑ์ที่ดีมากครับ การที่คุณออกกำลังกาย 25 นาทีและจดบันทึกขอบคุณเพื่อนสนิทส่งเสริมสุขภาวะทางใจได้อย่างยอดเยี่ยม แนะนำให้ทำอย่างสม่ำเสมอและหมั่นตรวจสอบความก้าวหน้าร่วมกับบัดดี้ของคุณนะครับ"}
              </p>
            </div>

            {/* List of Custom Goals with harmonious 4 colors */}
            <div className="space-y-2">
              {/* Goal 1: Blossom Pink */}
              <div className="flex items-center space-x-3 rounded-xl border border-pink-100/60 bg-pink-50/30 dark:bg-pink-950/10 p-3 hover:bg-pink-50/60 dark:border-slate-800 dark:hover:bg-slate-800/40 cursor-pointer transition-all" onClick={() => onNavigate("community")}>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-50 text-pink-500 dark:bg-pink-950/30 shadow-2xs">
                  <UserCheck className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                    {user.language === 'en' ? "Share wellness status with matched Buddy" : "พูดคุยแชร์สเตตัสความก้าวหน้ากับบัดดี้"}
                  </p>
                  <p className="text-[10px] text-pink-500">Social Synergy Boost</p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </div>

              {/* Goal 2: Sunlight Yellow */}
              <div className="flex items-center space-x-3 rounded-xl border border-amber-100/60 bg-amber-50/30 dark:bg-amber-950/10 p-3 hover:bg-amber-50/60 dark:border-slate-800 dark:hover:bg-slate-800/40 cursor-pointer transition-all" onClick={() => onNavigate("academy")}>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-500 dark:bg-amber-950/30 shadow-2xs">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                    {user.language === 'en' ? "Pass 'Stress Relief' Module Quiz" : "ทำแบบทดสอบวิชา 'จัดการความเครียด'"}
                  </p>
                  <p className="text-[10px] text-amber-600 dark:text-amber-400">Earn certified credential & +100 XP</p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </div>

              {/* Goal 3: Sky Blue */}
              <div className="flex items-center space-x-3 rounded-xl border border-sky-100/60 bg-sky-50/30 dark:bg-sky-950/10 p-3 hover:bg-sky-50/60 dark:border-slate-800 dark:hover:bg-slate-800/40 cursor-pointer transition-all" onClick={() => onNavigate("videos")}>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-500 dark:bg-sky-950/30 shadow-2xs">
                  <Compass className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                    {user.language === 'en' ? "Watch 5-min Mindful Meditation Video" : "ชมวิดีโอฝึกสมาธิผ่อนคลาย 5 นาที"}
                  </p>
                  <p className="text-[10px] text-sky-600 dark:text-sky-400">Serenity & Calm +20 XP</p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Badges & Upcoming Events */}
        <div className="space-y-6">
          
          {/* Unlocked Badges */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800/60 dark:bg-slate-900 transition-all shadow-sm">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
              {t.dashboard.recentBadges}
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {badges.map((b) => {
                const unlocked = user.badges.includes(b.id);
                return (
                  <div 
                    key={b.id} 
                    title={user.language === 'en' ? b.titleEn : b.titleTh}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${unlocked ? 'bg-purple-50 text-purple-500 dark:bg-purple-950/20' : 'bg-slate-50 text-slate-300 dark:bg-slate-800 dark:text-slate-600 opacity-60'}`}
                  >
                    <span className="text-xl">
                      {b.icon === 'Zap' ? '🔥' : b.icon === 'Award' ? '🏅' : b.icon === 'BookOpen' ? '📖' : b.icon === 'ShieldAlert' ? '🛡️' : '🌟'}
                    </span>
                    <span className="text-[9px] font-medium text-center truncate w-full mt-1">
                      {user.language === 'en' ? b.titleEn.split(' ')[0] : b.titleTh.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Seminars/Events */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800/60 dark:bg-slate-900 transition-all shadow-sm">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
              {t.dashboard.upcomingEvents}
            </h3>
            <div className="space-y-3">
              {events.map((evt, i) => (
                <div key={i} className="flex space-x-3 items-start border-l-2 border-purple-200 dark:border-purple-900 pl-3 py-0.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-slate-50 dark:bg-slate-800">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-700 dark:text-slate-200 leading-tight">{evt.title}</h4>
                    <p className="text-[9px] text-slate-400 mt-0.5">{evt.date} • {evt.host}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
