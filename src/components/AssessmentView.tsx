import React, { useState } from "react";
import { ClipboardList, Sparkles, AlertTriangle, ArrowLeft, CheckCircle } from "lucide-react";
import { UserProfile, AssessmentQuestion, AssessmentResult } from "../types";
import { translations } from "../translations";

interface AssessmentViewProps {
  user: UserProfile;
  onRewardXP: (amount: number) => void;
  onUnlockBadge: (badgeId: string) => void;
}

export default function AssessmentView({ user, onRewardXP, onUnlockBadge }: AssessmentViewProps) {
  const t = translations[user.language];

  // Active quiz ID state
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [scoresAccumulator, setScoresAccumulator] = useState<number[]>([]);
  
  // Results states
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loadingAI, setLoadingAI] = useState<boolean>(false);

  // Mapped questionnaires
  const questionnaires = [
    {
      id: "stress",
      titleEn: t.assessments.startStress,
      titleTh: t.assessments.startStress,
      descEn: "Evaluate your level of perceived mental pressure and tension over the last month.",
      descTh: "ประเมินความรู้สึกตึงเครียดและการรับมือกับแรงกดดันทางใจของคุณในช่วงหนึ่งเดือนที่ผ่านมา",
      questions: [
        {
          id: 1,
          textEn: "In the last month, how often have you been upset because of something that happened unexpectedly?",
          textTh: "ในเดือนที่ผ่านมา บ่อยครั้งแค่ไหนที่คุณรู้สึกหงุดหงิดหรืออารมณ์เสียกับสิ่งที่เกิดขึ้นโดยไม่คาดคิด?",
          optionsEn: ["Never", "Almost Never", "Sometimes", "Fairly Often", "Very Often"],
          optionsTh: ["ไม่เคยเลย", "แทบไม่เคยเลย", "เป็นบางครั้ง", "ค่อนข้างบ่อย", "เป็นประจำ"],
          scores: [0, 1, 2, 3, 4]
        },
        {
          id: 2,
          textEn: "In the last month, how often have you felt that you were unable to control the important things in your life?",
          textTh: "ในเดือนที่ผ่านมา บ่อยครั้งแค่ไหนที่คุณรู้สึกว่าตนเองควบคุมเรื่องสำคัญๆ ในชีวิตไม่ได้เลย?",
          optionsEn: ["Never", "Almost Never", "Sometimes", "Fairly Often", "Very Often"],
          optionsTh: ["ไม่เคยเลย", "แทบไม่เคยเลย", "เป็นบางครั้ง", "ค่อนข้างบ่อย", "เป็นประจำ"],
          scores: [0, 1, 2, 3, 4]
        },
        {
          id: 3,
          textEn: "In the last month, how often have you felt nervous and stressed?",
          textTh: "ในเดือนที่ผ่านมา บ่อยครั้งแค่ไหนที่คุณรู้สึกกระสับกระส่ายและเครียดเกร็ง?",
          optionsEn: ["Never", "Almost Never", "Sometimes", "Fairly Often", "Very Often"],
          optionsTh: ["ไม่เคยเลย", "แทบไม่เคยเลย", "เป็นบางครั้ง", "ค่อนข้างบ่อย", "เป็นประจำ"],
          scores: [0, 1, 2, 3, 4]
        },
        {
          id: 4,
          textEn: "In the last month, how often have you felt confident about your ability to handle your personal problems?",
          textTh: "ในเดือนที่ผ่านมา บ่อยครั้งแค่ไหนที่คุณรู้สึกมั่นใจในความสามารถที่จะแก้ไขปัญหาส่วนตัวได้?",
          optionsEn: ["Never", "Almost Never", "Sometimes", "Fairly Often", "Very Often"],
          optionsTh: ["ไม่เคยเลย", "แทบไม่เคยเลย", "เป็นบางครั้ง", "ค่อนข้างบ่อย", "เป็นประจำ"],
          scores: [4, 3, 2, 1, 0] // Reverse scoring for positive state
        },
        {
          id: 5,
          textEn: "In the last month, how often have you felt that difficulties were piling up so high that you could not overcome them?",
          textTh: "ในเดือนที่ผ่านมา บ่อยครั้งแค่ไหนที่คุณรู้สึกว่าปัญหาทับถมสูงเกินกว่าจะหาทางออกพ้น?",
          optionsEn: ["Never", "Almost Never", "Sometimes", "Fairly Often", "Very Often"],
          optionsTh: ["ไม่เคยเลย", "แทบไม่เคยเลย", "เป็นบางครั้ง", "ค่อนข้างบ่อย", "เป็นประจำ"],
          scores: [0, 1, 2, 3, 4]
        }
      ]
    },
    {
      id: "wellbeing",
      titleEn: t.assessments.startWellbeing,
      titleTh: t.assessments.startWellbeing,
      descEn: "Standard WHO index to measure emotional stability, peace of mind, and vitality.",
      descTh: "แบบประเมินสุขภาวะทางใจมาตรฐานองค์กรอนามัยโลก วัดความสงบ พลังชีวิต และความพึงพอใจในชีวิต",
      questions: [
        {
          id: 1,
          textEn: "Over the last 2 weeks, I have felt cheerful and in good spirits.",
          textTh: "ในช่วง 2 สัปดาห์ที่ผ่านมา ฉันรู้สึกกระปรี้กระเปร่า ร่าเริง และจิตใจแจ่มใส",
          optionsEn: ["At no time", "Some of the time", "Less than half", "More than half", "Most of the time", "All of the time"],
          optionsTh: ["ไม่เคยเลย", "เป็นบางครั้ง", "น้อยกว่าครึ่งหนึ่ง", "มากกว่าครึ่งหนึ่ง", "เกือบตลอดเวลา", "ตลอดเวลา"],
          scores: [0, 1, 2, 3, 4, 5]
        },
        {
          id: 2,
          textEn: "Over the last 2 weeks, I have felt calm and relaxed.",
          textTh: "ในช่วง 2 สัปดาห์ที่ผ่านมา ฉันรู้สึกสงบและผ่อนคลาย",
          optionsEn: ["At no time", "Some of the time", "Less than half", "More than half", "Most of the time", "All of the time"],
          optionsTh: ["ไม่เคยเลย", "เป็นบางครั้ง", "น้อยกว่าครึ่งหนึ่ง", "มากกว่าครึ่งหนึ่ง", "เกือบตลอดเวลา", "ตลอดเวลา"],
          scores: [0, 1, 2, 3, 4, 5]
        },
        {
          id: 3,
          textEn: "Over the last 2 weeks, I have felt active and vigorous.",
          textTh: "ในช่วง 2 สัปดาห์ที่ผ่านมา ฉันรู้สึกกระฉับกระเฉงและกระตือรือร้น",
          optionsEn: ["At no time", "Some of the time", "Less than half", "More than half", "Most of the time", "All of the time"],
          optionsTh: ["ไม่เคยเลย", "เป็นบางครั้ง", "น้อยกว่าครึ่งหนึ่ง", "มากกว่าครึ่งหนึ่ง", "เกือบตลอดเวลา", "ตลอดเวลา"],
          scores: [0, 1, 2, 3, 4, 5]
        },
        {
          id: 4,
          textEn: "Over the last 2 weeks, I woke up feeling fresh and rested.",
          textTh: "ในช่วง 2 สัปดาห์ที่ผ่านมา ฉันตื่นนอนตอนเช้ารู้สึกสดชื่นและได้รับการพักผ่อนเพียงพอ",
          optionsEn: ["At no time", "Some of the time", "Less than half", "More than half", "Most of the time", "All of the time"],
          optionsTh: ["ไม่เคยเลย", "เป็นบางครั้ง", "น้อยกว่าครึ่งหนึ่ง", "มากกว่าครึ่งหนึ่ง", "เกือบตลอดเวลา", "ตลอดเวลา"],
          scores: [0, 1, 2, 3, 4, 5]
        },
        {
          id: 5,
          textEn: "Over the last 2 weeks, my daily life has been filled with things that interest me.",
          textTh: "ในช่วง 2 สัปดาห์ที่ผ่านมา ชีวิตประจำวันของฉันเต็มไปด้วยเรื่องที่น่าสนใจและท้าทายความสามารถ",
          optionsEn: ["At no time", "Some of the time", "Less than half", "More than half", "Most of the time", "All of the time"],
          optionsTh: ["ไม่เคยเลย", "เป็นบางครั้ง", "น้อยกว่าครึ่งหนึ่ง", "มากกว่าครึ่งหนึ่ง", "เกือบตลอดเวลา", "ตลอดเวลา"],
          scores: [0, 1, 2, 3, 4, 5]
        }
      ]
    },
    {
      id: "burnout",
      titleEn: t.assessments.startBurnout,
      titleTh: t.assessments.startBurnout,
      descEn: "Assess levels of study fatigue, emotional exhaustion, and career stress.",
      descTh: "วัดระดับความเหนื่อยล้าทางอารมณ์ ความเครียดสะสม และสภาวะหมดไฟจากการเรียนหรือการทำงาน",
      questions: [
        {
          id: 1,
          textEn: "I feel emotionally drained or exhausted by my study/work.",
          textTh: "ฉันรู้สึกอ่อนล้าทางอารมณ์และหมดแรงใจจากการทำภารกิจเรียนหรือทำงานอย่างมาก",
          optionsEn: ["Never", "Almost Never", "Sometimes", "Fairly Often", "Very Often"],
          optionsTh: ["ไม่เคยเลย", "แทบไม่เคยเลย", "เป็นบางครั้ง", "ค่อนข้างบ่อย", "เป็นประจำ"],
          scores: [0, 1, 2, 3, 4]
        },
        {
          id: 2,
          textEn: "I feel less interested in my hobbies or goals since starting this academic term or job.",
          textTh: "ฉันรู้สึกเหินห่างหรือไม่กระตือรือร้นกับกิจกรรมยามว่างหรืองานอดิเรกที่เคยรัก",
          optionsEn: ["Never", "Almost Never", "Sometimes", "Fairly Often", "Very Often"],
          optionsTh: ["ไม่เคยเลย", "แทบไม่เคยเลย", "เป็นบางครั้ง", "ค่อนข้างบ่อย", "เป็นประจำ"],
          scores: [0, 1, 2, 3, 4]
        },
        {
          id: 3,
          textEn: "I find it hard to concentrate on my tasks due to mental fatigue.",
          textTh: "ฉันพบว่าตนเองรวบรวมสมาธิหรือจดจ่อได้ยากเพราะความเหนื่อยล้าทางสมองตกค้าง",
          optionsEn: ["Never", "Almost Never", "Sometimes", "Fairly Often", "Very Often"],
          optionsTh: ["ไม่เคยเลย", "แทบไม่เคยเลย", "เป็นบางครั้ง", "ค่อนข้างบ่อย", "เป็นประจำ"],
          scores: [0, 1, 2, 3, 4]
        },
        {
          id: 4,
          textEn: "I feel unaccomplished or ineffective even when I complete my tasks.",
          textTh: "ฉันรู้สึกเหมือนงานที่ทำไม่เกิดผลสำเร็จที่จับต้องได้ หรือรู้สึกไม่เก่งพอแม้ผลงานจะผ่านพ้น",
          optionsEn: ["Never", "Almost Never", "Sometimes", "Fairly Often", "Very Often"],
          optionsTh: ["ไม่เคยเลย", "แทบไม่เคยเลย", "เป็นบางครั้ง", "ค่อนข้างบ่อย", "เป็นประจำ"],
          scores: [0, 1, 2, 3, 4]
        },
        {
          id: 5,
          textEn: "I worry that my studies/job is making me emotionally hardened or pessimistic.",
          textTh: "ฉันแอบกังวลว่าการเรียนหรือการทำงานกำลังทำร้ายให้ฉันเป็นคนมองโลกในแง่ร้ายและเย็นชามากขึ้น",
          optionsEn: ["Never", "Almost Never", "Sometimes", "Fairly Often", "Very Often"],
          optionsTh: ["ไม่เคยเลย", "แทบไม่เคยเลย", "เป็นบางครั้ง", "ค่อนข้างบ่อย", "เป็นประจำ"],
          scores: [0, 1, 2, 3, 4]
        }
      ]
    }
  ];

  const handleStartQuiz = (id: string) => {
    setActiveQuizId(id);
    setQuestionIndex(0);
    setScoresAccumulator([]);
    setResult(null);
  };

  const handleAnswerSelect = (score: number) => {
    const updatedScores = [...scoresAccumulator, score];
    setScoresAccumulator(updatedScores);

    const activeQuiz = questionnaires.find(q => q.id === activeQuizId);
    if (!activeQuiz) return;

    if (questionIndex + 1 < activeQuiz.questions.length) {
      setQuestionIndex(questionIndex + 1);
    } else {
      // Quiz finished! Calculate and fetch AI suggestions
      calculateResults(updatedScores, activeQuiz);
    }
  };

  const calculateResults = async (scores: number[], activeQuiz: any) => {
    setLoadingAI(true);
    const sum = scores.reduce((a, b) => a + b, 0);
    const maxScore = activeQuiz.id === "wellbeing" ? 25 : 20;

    let risk: 'low' | 'moderate' | 'high' = 'low';
    if (activeQuiz.id === "wellbeing") {
      // For WHO-5, HIGHER is better. Low score is high risk.
      if (sum < 13) risk = 'high';
      else if (sum < 18) risk = 'moderate';
    } else {
      // For Stress & Burnout, HIGHER is worse.
      if (sum > 14) risk = 'high';
      else if (sum > 8) risk = 'moderate';
    }

    try {
      // Call modern server endpoint for custom AI recommendations
      const response = await fetch("/api/gemini/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stressScore: activeQuiz.id === "wellbeing" ? (25 - sum) / 2.5 : sum / 2,
          wellbeingScore: activeQuiz.id === "wellbeing" ? (sum / 25) * 100 : ((20 - sum) / 20) * 100,
          category: activeQuiz.id,
          role: user.role,
          language: user.language
        })
      });

      if (!response.ok) {
        throw new Error("Failed to get AI recommendations");
      }

      const data = await response.json();
      const aiRecs = data.recommendations || [];

      setResult({
        category: activeQuiz.id as any,
        score: sum,
        maxScore,
        riskScore: risk,
        date: new Date().toLocaleDateString(),
        recommendations: aiRecs
      });

      // Reward XP + Unlock badge
      onRewardXP(100);
      onUnlockBadge("assessment_guru");
    } catch (err: any) {
      console.error(err);
      // Fallback local recommendations
      const localRecs = user.language === 'en' ? [
        "**1. Try a 5-minute Box Breathing break**: Breathe in for 4 seconds, hold for 4, exhale for 4, and hold for 4. Repeat.",
        "**2. Unplug for 30 minutes**: Social media fast is highly supportive in clearing cortisol load.",
        "**3. Talk with your support buddy**: Sharing progress or having an authentic chat offers robust mental safety."
      ] : [
        "**1. ฝึกการหายใจแบบ 4-4-4-4 (Box Breathing)**: หายใจเข้า 4 วินาที กลั้น 4 วินาที หายใจออก 4 วินาที และกลั้นต่ออีก 4 วินาที เพื่อคืนสมดุลจิตใจ",
        "**2. พักสายตาและงดโซเชียลมีเดีย 30 นาที**: ลดการดูหน้าจอก่อนตื่นและหลังนอนเพื่อปรับอารมณ์และลดความเครียดสะสม",
        "**3. แบ่งปันความก้าวหน้ากับบัดดี้**: การได้ระบายและแบ่งปันชีวิตประจำวันกับเพื่อนคู่หูในแอปช่วยเสริมเกราะใจให้แข็งแรงขึ้นอย่างเห็นได้ชัด"
      ];

      setResult({
        category: activeQuiz.id as any,
        score: sum,
        maxScore,
        riskScore: risk,
        date: new Date().toLocaleDateString(),
        recommendations: localRecs
      });
      onRewardXP(100);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleReset = () => {
    setActiveQuizId(null);
    setResult(null);
  };

  // Render lists of questionnaires
  if (!activeQuizId) {
    return (
      <div id="assessments-hub" className="space-y-6">
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">{t.assessments.title}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">{t.assessments.subtitle}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {questionnaires.map((quiz) => (
            <div 
              key={quiz.id} 
              className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800/60 dark:bg-slate-900 transition-all shadow-sm flex flex-col justify-between hover:border-purple-200 hover:shadow-md cursor-pointer"
              onClick={() => handleStartQuiz(quiz.id)}
            >
              <div className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/20">
                  <ClipboardList className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    {user.language === 'en' ? quiz.titleEn : quiz.titleTh}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-3">
                    {user.language === 'en' ? quiz.descEn : quiz.descTh}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">5 {t.assessments.questionsCount}</span>
                <span className="font-bold text-purple-600">{t.assessments.takeAssessment} &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const activeQuiz = questionnaires.find(q => q.id === activeQuizId)!;

  return (
    <div id="assessment-flow-container" className="space-y-6 max-w-3xl mx-auto">
      
      {/* Back button */}
      <button 
        onClick={handleReset}
        className="flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-slate-700 cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>{t.assessments.backToList}</span>
      </button>

      {/* Result Display view */}
      {result ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-6 dark:border-slate-800/60 dark:bg-slate-900 transition-all shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-50 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                {user.language === 'en' ? activeQuiz.titleEn : activeQuiz.titleTh} - {user.language === 'en' ? 'Results' : 'ผลการประเมิน'}
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">{t.assessments.scoreTitle} {result.score} / {result.maxScore}</p>
            </div>
            
            {/* Risk Badge */}
            <div className={`mt-3 sm:mt-0 px-4 py-1.5 rounded-full text-xs font-bold ${result.riskScore === 'low' ? 'bg-emerald-50 text-emerald-600' : result.riskScore === 'moderate' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600 animate-pulse'}`}>
              {result.riskScore === 'low' ? t.assessments.riskLow : result.riskScore === 'moderate' ? t.assessments.riskMod : t.assessments.riskHigh}
            </div>
          </div>

          {/* SVG Progress gauge */}
          <div className="flex flex-col items-center justify-center py-6">
            <div className="relative h-28 w-28 flex items-center justify-center">
              <svg className="absolute inset-0 transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="8" fill="transparent" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  className={result.riskScore === 'low' ? 'stroke-emerald-400' : result.riskScore === 'moderate' ? 'stroke-amber-400' : 'stroke-rose-400'} 
                  strokeWidth="8" 
                  fill="transparent" 
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - result.score / result.maxScore)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="text-center">
                <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{Math.round((result.score / result.maxScore) * 100)}%</span>
                <span className="text-[9px] text-slate-400 block uppercase font-bold">Index</span>
              </div>
            </div>
          </div>

          {/* Recommendations list */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-purple-600">
              <Sparkles className="h-4 w-4" />
              <span>{t.assessments.aiRecTitle}</span>
            </div>

            <div className="space-y-2">
              {result.recommendations.map((rec, i) => (
                <div key={i} className="rounded-xl bg-purple-50/30 p-3.5 text-xs text-slate-600 dark:bg-purple-950/5 dark:text-slate-300 leading-relaxed border border-purple-100/20">
                  {rec}
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={handleReset}
            className="w-full py-3 bg-slate-50 dark:bg-slate-800 text-xs font-bold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 border border-slate-100 dark:border-slate-800 cursor-pointer text-center"
          >
            {user.language === 'en' ? "Complete & Back" : "เสร็จสิ้นและกลับไปหน้ารวม"}
          </button>

        </div>
      ) : loadingAI ? (
        /* AI Calculation and recommendation loader */
        <div className="rounded-2xl border border-slate-100 bg-white p-12 dark:border-slate-800/60 dark:bg-slate-900 transition-all shadow-sm text-center space-y-4">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-purple-100 border-t-purple-500" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">{user.language === 'en' ? "Consulting AI Psychologist..." : "กำลังปรึกษาผู้เชี่ยวชาญ AI..."}</h4>
            <p className="text-[11px] text-slate-400">{user.language === 'en' ? "Structuring personalized daily guidelines & stress mitigation strategies." : "ระบบกำลังวิเคราะห์คะแนนและประมวลผลคำแนะนำเฉพาะบุคคลสำหรับคุณ"}</p>
          </div>
        </div>
      ) : (
        /* Interactive Question Wizard */
        <div className="rounded-2xl border border-slate-100 bg-white p-6 dark:border-slate-800/60 dark:bg-slate-900 transition-all shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800 pb-3">
            <span className="text-[10px] font-bold text-purple-600 tracking-wider uppercase">
              {user.language === 'en' ? activeQuiz.titleEn : activeQuiz.titleTh}
            </span>
            <span className="text-[10px] font-semibold text-slate-400">
              {questionIndex + 1} / {activeQuiz.questions.length}
            </span>
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-relaxed">
              {user.language === 'en' ? activeQuiz.questions[questionIndex].textEn : activeQuiz.questions[questionIndex].textTh}
            </h3>
          </div>

          {/* Progress Bar */}
          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-purple-500 transition-all duration-300"
              style={{ width: `${((questionIndex + 1) / activeQuiz.questions.length) * 100}%` }}
            />
          </div>

          {/* Options grid */}
          <div className="grid gap-2.5">
            {activeQuiz.questions[questionIndex].optionsEn.map((opt, i) => {
              const score = activeQuiz.questions[questionIndex].scores[i];
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleAnswerSelect(score)}
                  className="w-full text-left p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/40 bg-slate-50/40 hover:bg-purple-50/40 dark:hover:bg-purple-950/10 dark:hover:border-purple-900/40 hover:border-purple-200 text-xs text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
                >
                  {user.language === 'en' ? opt : activeQuiz.questions[questionIndex].optionsTh[i]}
                </button>
              );
            })}
          </div>

          {/* Disclaimer details */}
          <div className="rounded-xl bg-orange-50/20 p-3 flex items-start space-x-2 text-[10px] text-orange-700 dark:text-orange-400 border border-orange-100/20">
            <AlertTriangle className="h-4 w-4 shrink-0 text-orange-500" />
            <span>
              {user.language === 'en' 
                ? "Important: This is a screening helper, not a formal diagnostic tool. Answer honestly to obtain genuine suggestions." 
                : "คำชี้แจง: แบบประเมินนี้ใช้เพื่อการประเมินเบื้องต้นเท่านั้น ไม่ทดแทนการวินิจฉัยทางการแพทย์ โปรดตอบตามจริงเพื่อคำแนะนำที่ถูกต้อง"}
            </span>
          </div>

        </div>
      )}

    </div>
  );
}
