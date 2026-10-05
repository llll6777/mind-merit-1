import React, { useState, useEffect } from "react";
import { ShieldAlert, PhoneCall, MapPin, Compass, Volume2, VolumeX, CheckCircle } from "lucide-react";
import { UserProfile } from "../types";
import { translations } from "../translations";

interface SOSViewProps {
  user: UserProfile;
}

export default function SOSView({ user }: SOSViewProps) {
  const t = translations[user.language];

  const [calmActive, setCalmActive] = useState<boolean>(false);
  const [calmSeconds, setCalmSeconds] = useState<number>(10);
  const [playAudio, setPlayAudio] = useState<boolean>(false);

  // Audio Context synth for ambient relaxing frequency (528Hz Solfeggio frequency)
  useEffect(() => {
    if (!calmActive || !playAudio) return;

    let audioCtx: AudioContext | null = null;
    let oscillator: OscillatorNode | null = null;
    let gainNode: GainNode | null = null;

    try {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      oscillator = audioCtx.createOscillator();
      gainNode = audioCtx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(528, audioCtx.currentTime); // 528Hz Healing Solfeggio frequency

      // Low soothing volume
      gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start();
    } catch (err) {
      console.warn("AudioContext failed to start.", err);
    }

    return () => {
      if (oscillator) oscillator.stop();
      if (audioCtx) audioCtx.close();
    };
  }, [calmActive, playAudio]);

  // Calm Down countdown cycle
  useEffect(() => {
    if (!calmActive) return;

    const timer = setInterval(() => {
      setCalmSeconds((prev) => {
        if (prev <= 1) {
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [calmActive]);

  const handlePanicClick = () => {
    setCalmActive(!calmActive);
    setCalmSeconds(10);
    setPlayAudio(true);
  };

  const hotlinesList = [
    { name: "Thai Mental Health Department (สายด่วนสุขภาพจิต)", phone: "1323", desc: "Confidential psychiatric help in Thailand, free 24/7." },
    { name: "Samaritans Thailand (สมาคมสะมาริตันส์แห่งประเทศไทย)", phone: "02-113-6789", desc: "Confidential emotional support and suicide prevention." },
    { name: "International Crisis Hotlines (988 US)", phone: "988", desc: "Global supportive lifelines and mental health triage." }
  ];

  const hospitalsList = [
    { name: "Srithanya Psychiatric Hospital (โรงพยาบาลศรีธัญญา)", location: "Nonthaburi, Thailand", contact: "02-528-7800" },
    { name: "Somdet Chaopraya Institute of Psychiatry (สถาบันจิตเวชศาสตร์สมเด็จเจ้าพระยา)", location: "Bangkok, Thailand", contact: "02-442-2500" },
    { name: "Mahidol Ramathibodi Psychiatric Outpatient Clinic (คลินิกจิตเวช รามาธิบดี)", location: "Bangkok, Thailand", contact: "02-201-1238" }
  ];

  return (
    <div id="sos-view-container" className="space-y-6">
      <div className="space-y-1.5">
        <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">{t.sos.title}</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">{t.sos.subtitle}</p>
      </div>

      {/* 1. Large Calm Me Down Panic Trigger */}
      <div className={`rounded-3xl border p-6 text-center transition-all duration-500 ${calmActive ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-950/20 dark:border-indigo-900/40 ring-4 ring-indigo-100 dark:ring-indigo-950/40' : 'bg-rose-50/50 border-rose-100 dark:bg-rose-950/15 dark:border-rose-900/30'}`}>
        <div className="max-w-md mx-auto space-y-4">
          <div className="flex justify-center space-x-2">
            <ShieldAlert className={`h-8 w-8 text-rose-500 ${calmActive ? 'animate-bounce' : 'animate-pulse'}`} />
          </div>

          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {calmActive ? (user.language === 'en' ? "CALMING MECHANISM ACTIVE" : "ระบบระงับอารมณ์กำลังทำงาน") : t.sos.panicBtn}
          </h3>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            {calmActive 
              ? (user.language === 'en' ? "Close your eyes, relax your shoulders, and synchronize with the 528Hz hum. Inhale for 4 seconds, and let the air escape slowly." : "หลับตาลง ผ่อนคลายไหล่ของคุณ ฟังเสียงความถี่คลื่นสมาธิ 528Hz และหายใจเข้าออกตามความถี่อย่างช้าๆ")
              : (user.language === 'en' ? "Experiencing sudden panic, extreme distress, or severe anxiety? Click above to trigger an immediate, visual and acoustic grounding cycle." : "มีสภาวะวิตกกังวลรุนแรง ตื่นตระหนก หรือรู้สึกท้อแท้หนัก? กดปุ่มเพื่อเริ่มต้นวงจรผ่อนคลายและลดความกังวลในทันที")}
          </p>

          {calmActive && (
            <div className="space-y-3 py-2">
              <div className="flex items-center justify-center space-x-3">
                <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400">
                  {calmSeconds > 5 ? (user.language === 'en' ? "Inhale Slow..." : "หายใจเข้าช้าๆ...") : (user.language === 'en' ? "Exhale Slow..." : "หายใจออกช้าๆ...")}
                </span>
                <span className="text-xl font-black text-indigo-600 dark:text-indigo-300 font-mono">{calmSeconds}s</span>
              </div>

              {/* Sound controller */}
              <button 
                onClick={() => setPlayAudio(!playAudio)}
                className="mx-auto flex items-center space-x-1.5 px-3 py-1 bg-white hover:bg-slate-50 text-[10px] rounded-full border border-indigo-100 text-indigo-600 shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-indigo-400 cursor-pointer"
              >
                {playAudio ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
                <span>{playAudio ? (user.language === 'en' ? "Hum: On" : "เสียงคลื่น: เปิด") : (user.language === 'en' ? "Hum: Muted" : "เสียงคลื่น: ปิด")}</span>
              </button>
            </div>
          )}

          <button
            onClick={handlePanicClick}
            className={`px-6 py-3 rounded-2xl text-xs font-bold shadow-md transition-all cursor-pointer ${calmActive ? 'bg-slate-700 text-white hover:bg-slate-800' : 'bg-rose-500 text-white hover:bg-rose-600'}`}
          >
            {calmActive ? (user.language === 'en' ? "Stop calm session" : "หยุดขั้นตอน") : (user.language === 'en' ? "Calm Down Now" : "เริ่มลดความเครียดทันที")}
          </button>
        </div>
      </div>

      {/* Grid for Hotlines and Grounding guides */}
      <div className="grid gap-6 md:grid-cols-2">
        
        {/* Confident Hotlines list */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800/60 dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-50 dark:border-slate-800 pb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-500 dark:bg-rose-950/20">
              <PhoneCall className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">{t.sos.hotlines}</h4>
              <p className="text-[9px] text-slate-400">Confidential 24/7 Human support</p>
            </div>
          </div>

          <div className="space-y-3">
            {hotlinesList.map((hl, i) => (
              <div key={i} className="flex items-center justify-between p-3.5 border border-slate-50 rounded-xl hover:bg-slate-50 dark:border-slate-800/40 dark:hover:bg-slate-800/30 transition-all">
                <div className="space-y-0.5 max-w-[70%]">
                  <h5 className="text-[11px] font-bold text-slate-700 dark:text-slate-200">{hl.name}</h5>
                  <p className="text-[9px] text-slate-400">{hl.desc}</p>
                </div>
                
                <a 
                  href={`tel:${hl.phone}`}
                  className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-[10px] font-bold text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-100/30 text-center"
                >
                  {t.sos.callNow}: {hl.phone}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* 5-4-3-2-1 technique guide */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800/60 dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-50 dark:border-slate-800 pb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-500 dark:bg-indigo-950/20">
              <Compass className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">5-4-3-2-1 Panic Grounding Guide</h4>
              <p className="text-[9px] text-slate-400">Standard CBT panic reduction cycle</p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <p className="text-[10px] text-slate-400 mb-2 leading-relaxed">
              {user.language === 'en' 
                ? "This technique helps ground you in the physical present by redirecting your sensory focus away from cognitive anxiety." 
                : "เทคนิคนี้จะช่วยดึงสติสัมปชัญญะของคุณให้กลับมาอยู่กับกายในปัจจุบัน โดยการหันความสนใจของประสาทสัมผัสออกจากความวิตกกังวล"}
            </p>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center space-x-2"><span className="font-bold text-purple-600 shrink-0">👀 5:</span> <span className="text-slate-600 dark:text-slate-300">{t.sos.guideStep5}</span></div>
              <div className="flex items-center space-x-2"><span className="font-bold text-purple-600 shrink-0">🤝 4:</span> <span className="text-slate-600 dark:text-slate-300">{t.sos.guideStep4}</span></div>
              <div className="flex items-center space-x-2"><span className="font-bold text-purple-600 shrink-0">👂 3:</span> <span className="text-slate-600 dark:text-slate-300">{t.sos.guideStep3}</span></div>
              <div className="flex items-center space-x-2"><span className="font-bold text-purple-600 shrink-0">👃 2:</span> <span className="text-slate-600 dark:text-slate-300">{t.sos.guideStep2}</span></div>
              <div className="flex items-center space-x-2"><span className="font-bold text-purple-600 shrink-0">👅 1:</span> <span className="text-slate-600 dark:text-slate-300">{t.sos.guideStep1}</span></div>
            </div>
          </div>
        </div>

      </div>

      {/* Psychiatric clinic directory */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800/60 dark:bg-slate-900 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-50 dark:border-slate-800 pb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-500 dark:bg-purple-950/20">
            <MapPin className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">{t.sos.hospitals}</h4>
            <p className="text-[9px] text-slate-400">Specialized medical centers & hospital directories</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {hospitalsList.map((hosp, i) => (
            <div key={i} className="p-4 border border-slate-50 rounded-xl space-y-1 bg-slate-50/20 dark:border-slate-800/40">
              <h5 className="text-[11px] font-bold text-slate-700 dark:text-slate-200">{hosp.name}</h5>
              <p className="text-[9px] text-slate-400 flex items-center space-x-1">
                <MapPin className="h-3 w-3 shrink-0" />
                <span>{hosp.location}</span>
              </p>
              <div className="pt-2">
                <a 
                  href={`tel:${hosp.contact}`}
                  className="block w-full py-1.5 bg-white text-center text-[10px] font-bold rounded-lg border border-slate-100 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                >
                  📞 {hosp.contact}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
