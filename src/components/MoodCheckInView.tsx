import React, { useState } from "react";
import { Compass, Sparkles, AlertCircle } from "lucide-react";
import { UserProfile, MoodCheckIn, MoodType } from "../types";
import { translations } from "../translations";

interface MoodCheckInViewProps {
  user: UserProfile;
  onAddLog: (log: MoodCheckIn) => void;
  onRewardXP: (amount: number) => void;
}

export default function MoodCheckInView({ user, onAddLog, onRewardXP }: MoodCheckInViewProps) {
  const t = translations[user.language];

  const [mood, setMood] = useState<MoodType>("good");
  const [stress, setStress] = useState<number>(3);
  const [sleep, setSleep] = useState<number>(7);
  const [exercise, setExercise] = useState<number>(20);
  const [water, setWater] = useState<number>(1000);
  const [studyWork, setStudyWork] = useState<string>("balanced");
  const [gratitude, setGratitude] = useState<string>("");
  const [journal, setJournal] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<string>("");

  const moods: { type: MoodType; emoji: string; labelEn: string; labelTh: string; color: string }[] = [
    { type: "excellent", emoji: "☀️", labelEn: "Excellent", labelTh: "ดีเยี่ยม", color: "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30 hover:bg-amber-100/50" },
    { type: "good", emoji: "🌸", labelEn: "Good", labelTh: "ดี", color: "bg-pink-50 text-pink-600 border-pink-200 dark:bg-pink-950/20 dark:text-pink-400 dark:border-pink-900/30 hover:bg-pink-100/50" },
    { type: "neutral", emoji: "🌊", labelEn: "Neutral", labelTh: "เฉยๆ", color: "bg-sky-50 text-sky-600 border-sky-200 dark:bg-sky-950/20 dark:text-sky-400 dark:border-sky-900/30 hover:bg-sky-100/50" },
    { type: "bad", emoji: "🍃", labelEn: "Bad", labelTh: "แย่", color: "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30 hover:bg-emerald-100/50" },
    { type: "terrible", emoji: "⛈️", labelEn: "Terrible", labelTh: "แย่มาก", color: "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30 hover:bg-rose-100/50" }
  ];

  const studyWorkOptions = [
    { value: "focused", labelEn: "Highly Focused", labelTh: "มีสมาธิดีเยี่ยม" },
    { value: "balanced", labelEn: "Balanced", labelTh: "สมดุลพอดี" },
    { value: "procrastinated", labelEn: "Procrastinated", labelTh: "ผัดวันประกันพรุ่ง" },
    { value: "overwhelmed", labelEn: "Overwhelmed", labelTh: "งานหนักเกินไป" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAiAnalysis("");
    setStatusMessage("");

    const newLog: MoodCheckIn = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split("T")[0],
      mood,
      stress,
      sleep,
      exercise,
      water,
      studyWork,
      gratitude,
      journal
    };

    try {
      // Call backend API to analyze mood and journal
      const response = await fetch("/api/gemini/analyze-mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mood,
          stress,
          sleep,
          exercise,
          gratitude,
          journal,
          language: user.language
        })
      });

      if (!response.ok) {
        throw new Error("Failed to reach AI Analyzer server.");
      }

      const data = await response.json();
      const aiResponse = data.text || "AI completed the analysis smoothly.";

      // Attach feedback to the checkin log
      newLog.aiAnalysis = aiResponse;
      setAiAnalysis(aiResponse);

      // Save log to local state & reward XP
      onAddLog(newLog);
      onRewardXP(30);
      setStatusMessage(t.moodCheck.success);

      // Clean inputs
      setGratitude("");
      setJournal("");
    } catch (err: any) {
      console.error(err);
      // Fallback analysis if offline or server error
      const fallbackMsg = user.language === 'en' 
        ? `We noted down your check-in. It seems your stress level is at ${stress}/10. Keep reflecting on your daily triggers and connect with your buddy to lift your spirits.` 
        : `ระบบบันทึกความรู้สึกของคุณเรียบร้อยแล้ว ด้วยสภาวะความเครียดที่ระดับ ${stress}/10 แนะนำให้พักผ่อนให้เพียงพอและระบายความกังวลร่วมกับบัดดี้ในแอปนะครับ`;
      
      newLog.aiAnalysis = fallbackMsg;
      setAiAnalysis(fallbackMsg);
      onAddLog(newLog);
      onRewardXP(30);
      setStatusMessage(t.moodCheck.success);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="mood-check-view" className="space-y-6">
      <div className="space-y-1.5">
        <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">{t.moodCheck.title}</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">{t.moodCheck.subtitle}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Input Form Column (Takes 2/3 space) */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6 rounded-2xl border border-slate-100 bg-white p-6 dark:border-slate-800/60 dark:bg-slate-900 transition-all shadow-sm">
          
          {/* Mood Selector */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
              {t.moodCheck.howAreYou}
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {moods.map((m) => {
                const isSelected = mood === m.type;
                return (
                  <button
                    key={m.type}
                    type="button"
                    onClick={() => setMood(m.type)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${m.color} ${isSelected ? 'ring-2 ring-purple-400 font-bold scale-[1.03]' : 'opacity-70 border-slate-100 dark:border-slate-800'}`}
                  >
                    <span className="text-2xl mb-1">{m.emoji}</span>
                    <span className="text-[10px] uppercase tracking-wide">
                      {user.language === 'en' ? m.labelEn : m.labelTh}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sliders and Quick Inputs Row */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Stress Level (Sunlight Yellow / Amber) */}
            <div className="space-y-2 rounded-2xl bg-amber-50/40 p-4 border border-amber-100/50 dark:bg-slate-800/30 dark:border-slate-800">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex justify-between">
                <span>{t.moodCheck.stressLabel}</span>
                <span className="text-amber-600 font-extrabold">{stress} / 10</span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={stress}
                onChange={(e) => setStress(parseInt(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none dark:bg-slate-700"
              />
              <div className="flex justify-between text-[9px] text-slate-400">
                <span>{user.language === 'en' ? "Serene" : "สงบ"}</span>
                <span>{user.language === 'en' ? "Extreme" : "เครียดมาก"}</span>
              </div>
            </div>

            {/* Sleep duration (Sky Blue) */}
            <div className="space-y-2 rounded-2xl bg-sky-50/40 p-4 border border-sky-100/50 dark:bg-slate-800/30 dark:border-slate-800">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex justify-between">
                <span>{t.moodCheck.sleepLabel}</span>
                <span className="text-sky-600 font-extrabold">{sleep} Hrs</span>
              </label>
              <input
                type="range"
                min="3"
                max="12"
                value={sleep}
                onChange={(e) => setSleep(parseInt(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none dark:bg-slate-700"
              />
              <div className="flex justify-between text-[9px] text-slate-400">
                <span>3 Hrs</span>
                <span>12 Hrs</span>
              </div>
            </div>
          </div>

          {/* Hydration / Gym / Work Study options */}
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Exercise minutes (Mint Green) */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400">{t.moodCheck.exerciseLabel}</label>
              <input
                type="number"
                min="0"
                value={exercise}
                onChange={(e) => setExercise(parseInt(e.target.value) || 0)}
                className="w-full rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-400 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
              />
            </div>

            {/* Water intake (Sky Blue) */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400">{t.moodCheck.waterLabel}</label>
              <input
                type="number"
                min="0"
                step="250"
                value={water}
                onChange={(e) => setWater(parseInt(e.target.value) || 0)}
                className="w-full rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs focus:ring-1 focus:ring-sky-400 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
              />
            </div>

            {/* Work Study tags */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400">{t.moodCheck.workStudy}</label>
              <select
                value={studyWork}
                onChange={(e) => setStudyWork(e.target.value)}
                className="w-full rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs focus:ring-1 focus:ring-amber-400 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
              >
                {studyWorkOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {user.language === 'en' ? opt.labelEn : opt.labelTh}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Gratitude Statement (Blossom Pink) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-pink-600 dark:text-pink-400 flex items-center space-x-1.5">
              <span>💖</span>
              <span>{t.moodCheck.gratitudeLabel}</span>
            </label>
            <input
              type="text"
              required
              placeholder={t.moodCheck.gratitudePlaceholder}
              value={gratitude}
              onChange={(e) => setGratitude(e.target.value)}
              className="w-full rounded-xl border border-pink-100 bg-pink-50/20 px-4 py-2.5 text-xs focus:ring-1 focus:ring-pink-400 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
            />
          </div>

          {/* Personal thoughts journal */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
              {t.moodCheck.journalLabel}
            </label>
            <textarea
              rows={4}
              required
              placeholder={t.moodCheck.journalPlaceholder}
              value={journal}
              onChange={(e) => setJournal(e.target.value)}
              className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs focus:ring-1 focus:ring-sky-400 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
            />
          </div>

          {/* Submit block */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-2">
            <span className="text-[10px] text-slate-400 mb-3 sm:mb-0">
              {user.language === 'en' ? "* Submitting rewards +30 XP and starts AI Psychological review." : "* การบันทึกสุขภาพใจจะได้รับ +30 XP และวิเคราะห์ผลด้วยจิตวิทยา AI บัดดี้"}
            </span>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500 px-6 py-3 text-xs font-bold text-white shadow-md shadow-sky-500/15 hover:opacity-95 disabled:opacity-50 transition-all cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>{loading ? (user.language === 'en' ? "Analyzing..." : "กำลังวิเคราะห์...") : t.moodCheck.submit}</span>
            </button>
          </div>

        </form>

        {/* AI Analysis output column (Takes 1/3 space) */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-sky-100/70 bg-white p-5 dark:border-slate-800/60 dark:bg-slate-900 transition-all shadow-sm h-full flex flex-col justify-between">
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-50 dark:border-slate-800 pb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950/20">
                  <Compass className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">{t.moodCheck.aiAnalysisTitle}</h3>
                  <p className="text-[9px] text-slate-400">Psychological Insights</p>
                </div>
              </div>

              {/* Status or Analysis Text */}
              {loading ? (
                <div className="py-8 text-center space-y-3">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-sky-100 border-t-sky-500" />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 animate-pulse">
                    {t.moodCheck.analysisLoading}
                  </p>
                </div>
              ) : aiAnalysis ? (
                <div className="space-y-4">
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-sky-50/40 p-4 rounded-xl border border-sky-100/60 dark:bg-sky-950/20 dark:border-sky-900/30">
                    {aiAnalysis}
                  </p>
                  <div className="rounded-xl border border-amber-200/80 bg-amber-50/40 p-3 flex items-start space-x-2 text-[10px] text-amber-800 dark:bg-amber-950/20 dark:text-amber-300 dark:border-amber-900/30">
                    <AlertCircle className="h-4 w-4 shrink-0 text-amber-500" />
                    <span>
                      {user.language === 'en' 
                        ? "Tip: Consistently logging your raw feelings builds higher emotional regulation over time." 
                        : "เคล็ดลับ: การเขียนบันทึกความคิดดิบๆ ช่วยจัดระเบียบความคิดและคลายความวิตกกังวลได้ดีที่สุด"}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-300 dark:text-slate-700 space-y-2">
                  <span className="text-4xl block">📖</span>
                  <p className="text-[11px] text-slate-400 max-w-[200px] mx-auto">
                    {t.dashboard.completeCheckin}
                  </p>
                </div>
              )}
            </div>

            {statusMessage && (
              <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-center text-[11px] font-semibold text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
                {statusMessage}
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
