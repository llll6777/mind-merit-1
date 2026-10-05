import React, { useState, useEffect } from "react";
import { BookOpen, Award, CheckCircle, Sparkles, Compass, AlertCircle, ArrowLeft } from "lucide-react";
import { UserProfile, Course, Lesson, Certificate } from "../types";
import { translations } from "../translations";

interface LearningViewProps {
  user: UserProfile;
  onRewardXP: (amount: number) => void;
  onAddCertificate: (cert: Certificate) => void;
  certificates: Certificate[];
}

export default function LearningView({ user, onRewardXP, onAddCertificate, certificates }: LearningViewProps) {
  const t = translations[user.language];

  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState<boolean>(false);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [earnedCert, setEarnedCert] = useState<Certificate | null>(null);

  // Breathing box states
  const [breathPhase, setBreathPhase] = useState<'in' | 'hold1' | 'out' | 'hold2'>('in');
  const [breathSeconds, setBreathSeconds] = useState<number>(4);

  // Breathing Box Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setBreathSeconds((prev) => {
        if (prev <= 1) {
          setBreathPhase((current) => {
            if (current === 'in') return 'hold1';
            if (current === 'hold1') return 'out';
            if (current === 'out') return 'hold2';
            return 'in';
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Courses list
  const courses: Course[] = [
    {
      id: "stress-management",
      titleEn: "Stress & Anxiety Relief",
      titleTh: "ทักษะผ่อนคลายความเครียดและกังวล",
      descEn: "Learn scientific ways to calm your nervous system, handle heavy exam loads, and beat overthinking.",
      descTh: "เรียนรู้วิธีการผ่อนคลายความเครียดอย่างเป็นระบบวิทยาศาสตร์ จัดการกับการเตรียมสอบ และหยุดความวิตกกังวล",
      category: "stress-management",
      duration: "15 mins",
      xpReward: 150,
      badgeReward: "stress_warrior",
      lessons: [
        {
          id: "lesson-1",
          titleEn: "Understanding Stress Response",
          titleTh: "เข้าใจกลไกความเครียดและการตอบสนอง",
          duration: "5 mins",
          type: "article",
          contentEn: "Stress is not your enemy; it is an evolutionary survival mechanism. When your brain senses threat (like an upcoming difficult final exam), it triggers cortisol and adrenaline. The goal of mindfulness is not to eliminate stress entirely, but to teach the parasympathetic nervous system that you are safe.",
          contentTh: "ความเครียดไม่ใช่ศัตรูของคุณครับ แต่เป็นกลไกวิวัฒนาการเพื่อเอาชีวิตรอด เมื่อสมองสัมผัสได้ถึงแรงกดดัน (เช่นการเตรียมสอบคณิตศาสตร์ที่กำลังมาถึง) จะหลั่งฮอร์โมนคอร์ติซอลและอะดรีนาลีน เป้าหมายของการฝึกสมาธิคือการส่งสัญญาณบอกระบบประสาทพาราซิมพาเธติกว่าคุณอยู่ในสภาวะที่ปลอดภัยแล้ว"
        },
        {
          id: "lesson-2",
          titleEn: "Calming Overthinking and Ruminating",
          titleTh: "เอาชนะความรู้สึกวิตกและคิดวนเวียน",
          duration: "5 mins",
          type: "article",
          contentEn: "Overthinking is your brain's attempt to solve a problem by repeating it infinitely. To overcome overthinking, practice Cognitive Defusion: instead of thinking 'I am going to fail this exam', think 'I am noticing a thought that I might fail this exam'. This creates mental space and eases panic.",
          contentTh: "การคิดวนเวียนคือความพยายามของสมองในการแก้ปัญหาซ้ำเดิมแบบไม่สิ้นสุด เพื่อเอาชนะภาวะนี้ ลองใช้เทคนิค Cognitive Defusion แทนที่คุณจะคิดว่า 'ฉันกำลังจะสอบตกแน่ๆ' ให้คิดว่า 'ฉันกำลังรับรู้ถึงความคิดว่าฉันกลัวจะสอบตก' สิ่งนี้จะช่วยเปิดพื้นที่ว่างทางใจและระงับความวิตกกังวล"
        }
      ],
      quiz: [
        {
          questionEn: "What is the primary objective of mindfulness breathing in stress reduction?",
          questionTh: "จุดประสงค์หลักของการฝึกควบคุมลมหายใจสมาธิเพื่อลดความเครียดคืออะไร?",
          optionsEn: [
            "To ignore your study assignments and escape",
            "To signal your parasympathetic system that you are safe",
            "To force clinical memory improvement instantly"
          ],
          optionsTh: [
            "เพื่อหลีกหนีความรับผิดชอบและการอ่านหนังสือ",
            "เพื่อส่งสัญญาณบอกระบบประสาทพาราซิมพาเธติกให้คุณรู้สึกผ่อนคลายและปลอดภัย",
            "เพื่อบังคับความจำระดับอัจฉริยะในทันที"
          ],
          answerIndex: 1
        },
        {
          questionEn: "What does Cognitive Defusion help with?",
          questionTh: "เทคนิค Cognitive Defusion ช่วยเหลือในด้านใดมากที่สุด?",
          optionsEn: [
            "Creating separation between yourself and your thoughts",
            "Diagnosing deep severe mental illnesses",
            "Ignoring all study pressure entirely"
          ],
          optionsTh: [
            "สร้างระยะห่างระหว่างตัวคุณและความคิดเพื่อลดความตื่นตระหนก",
            "วินิจฉัยโรคทางจิตเวชระดับลึก",
            "เมินเฉยต่อหน้าที่ความรับผิดชอบทั้งหมด"
          ],
          answerIndex: 0
        }
      ]
    },
    {
      id: "emotional-resilience",
      titleEn: "Emotional Resilience Mastery",
      titleTh: "ทักษะเสริมเกราะใจและความยืดหยุ่น",
      descEn: "Develop strong emotional boundaries, defeat negative self-talk, and bounce back from setbacks.",
      descTh: "สร้างกรอบจิตสำนึกที่เข้มแข็ง เอาชนะเสียงวิจารณ์ตัวเองในแง่ลบ และฟื้นตัวจากความผิดหวังอย่างรวดเร็ว",
      category: "emotional-resilience",
      duration: "10 mins",
      xpReward: 150,
      badgeReward: "resilient_champion",
      lessons: [
        {
          id: "resilience-1",
          titleEn: "Defeating the Inner Critic",
          titleTh: "เอาชนะเสียงวิจารณ์ตัวเองในแง่ร้าย",
          duration: "5 mins",
          type: "article",
          contentEn: "The inner critic is that negative voice telling you that you are not good enough, not hard-working enough, or bound to fail. Combat this with Self-Compassion. Talk to yourself like you would speak to a beloved friend who is struggling. Replace perfectionism with balanced effort.",
          contentTh: "เสียงวิจารณ์ตัวเองคือคำพูดในใจที่พร่ำบอกว่าคุณดีไม่พอ พยายามไม่พอ หรือทำอะไรก็ล้มเหลว จงสู้กับสภาวะนี้ด้วยการฝึก Self-Compassion หรือความเมตตาต่อตนเอง พูดคุยและปลอบประโลมตนเองให้เหมือนกับที่คุณกำลังพูดให้กำลังใจเพื่อนสนิทที่กำลังเจอปัญหา"
        }
      ],
      quiz: [
        {
          questionEn: "How should you treat yourself when facing academic or career setbacks?",
          questionTh: "คุณควรปฏิบัติต่อตนเองอย่างไรเมื่อเผชิญกับความล้มเหลวในการสอบหรือการทำงาน?",
          optionsEn: [
            "Criticize yourself severely to work harder",
            "Practice self-compassion like you would treat a good friend",
            "Ignore the problem completely and sleep forever"
          ],
          optionsTh: [
            "ตำหนิและวิจารณ์ตัวเองอย่างรุนแรงเพื่อบังคับให้พยายามขึ้น",
            "ฝึกเมตตาต่อตนเอง ปลอบประโลมเหมือนพูดกับเพื่อนสนิทที่รักคุณ",
            "ละทิ้งทุกอย่างแล้วนอนหลับหนีความจริงไปตลอด"
          ],
          answerIndex: 1
        }
      ]
    }
  ];

  const handleStartCourse = (courseId: string) => {
    setActiveCourseId(courseId);
    setActiveLessonId(null);
    setShowQuiz(false);
    setQuizAnswers([]);
    setEarnedCert(null);
  };

  const handleOpenLesson = (lessonId: string) => {
    setActiveLessonId(lessonId);
  };

  const handleStartQuiz = () => {
    setShowQuiz(true);
    setQuizAnswers([]);
  };

  const handleSelectQuizAnswer = (answerIdx: number) => {
    const updatedAnswers = [...quizAnswers, answerIdx];
    setQuizAnswers(updatedAnswers);

    const activeCourse = courses.find(c => c.id === activeCourseId)!;
    if (updatedAnswers.length === activeCourse.quiz.length) {
      // Check answers
      const isPassed = updatedAnswers.every((ans, index) => ans === activeCourse.quiz[index].answerIndex);
      
      if (isPassed) {
        // Issue Certificate!
        const certId = "MIND-" + Math.random().toString(36).substr(2, 9).toUpperCase();
        const newCert: Certificate = {
          id: Math.random().toString(36).substr(2, 9),
          userName: user.name,
          courseNameEn: activeCourse.titleEn,
          courseNameTh: activeCourse.titleTh,
          date: new Date().toLocaleDateString(),
          certificateId: certId,
          qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://mindmerit.app/verify/${certId}`,
          verificationUrl: `https://mindmerit.app/verify/${certId}`,
          digitalSignature: "SHA256-RSA-MIND-MERIT-VERIFIED"
        };
        onAddCertificate(newCert);
        setEarnedCert(newCert);
        onRewardXP(activeCourse.xpReward);
      } else {
        // Reset answers to let them try again
        alert(user.language === 'en' ? "Please review the syllabus and try again! Some answers were incorrect." : "คำตอบบางข้อไม่ถูกต้อง ลองทบทวนบทเรียนและทำแบบทดสอบใหม่อีกครั้งนะครับ!");
        setQuizAnswers([]);
      }
    }
  };

  const handleBackToCourses = () => {
    setActiveCourseId(null);
    setEarnedCert(null);
    setShowQuiz(false);
  };

  const activeCourse = courses.find(c => c.id === activeCourseId);
  const activeLesson = activeCourse?.lessons.find(l => l.id === activeLessonId);

  // Render course page details
  if (activeCourse) {
    return (
      <div id="course-details-pane" className="space-y-6 max-w-3xl mx-auto">
        <button 
          onClick={handleBackToCourses}
          className="flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-slate-700 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t.academy.backToCourses}</span>
        </button>

        {earnedCert ? (
          /* Stunning Printable Verified Certificate View */
          <div className="rounded-2xl border-4 border-double border-purple-200 bg-white p-8 dark:bg-slate-900 dark:border-slate-800 shadow-xl space-y-6 text-center max-w-xl mx-auto relative overflow-hidden">
            
            {/* Dynamic visual crest */}
            <div className="mx-auto h-16 w-16 items-center justify-center rounded-full bg-purple-50 flex text-purple-600 dark:bg-purple-950/20 mb-2">
              <Award className="h-8 w-8 animate-bounce" />
            </div>

            <div className="space-y-1">
              <h3 className="text-sm uppercase tracking-widest font-extrabold text-purple-600">
                {t.academy.certificateVerified}
              </h3>
              <p className="text-[10px] text-slate-400">Mind Merit positive Mental Well-being Academy</p>
            </div>

            <div className="space-y-2 py-4">
              <p className="text-xs text-slate-400">This certifies that</p>
              <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 italic font-sans">{earnedCert.userName}</h2>
              <p className="text-xs text-slate-400">has successfully mastered the certified curriculum</p>
              <h4 className="text-sm font-extrabold text-slate-700 dark:text-slate-300">
                {user.language === 'en' ? earnedCert.courseNameEn : earnedCert.courseNameTh}
              </h4>
            </div>

            {/* Bottom details: QR / Date / Signature */}
            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 text-left text-[10px] items-center">
              <div className="space-y-1.5">
                <p className="text-slate-400">{t.academy.dateEarned}: <span className="font-bold text-slate-700 dark:text-slate-200">{earnedCert.date}</span></p>
                <p className="text-slate-400">{t.academy.certId}: <span className="font-bold font-mono text-slate-600 dark:text-slate-300">{earnedCert.certificateId}</span></p>
                <p className="text-slate-400">{t.academy.signatureText}: <span className="font-bold block text-purple-600 italic mt-0.5">{earnedCert.digitalSignature}</span></p>
              </div>

              <div className="flex justify-end">
                <div className="p-1.5 border border-slate-100 bg-white dark:bg-slate-800 rounded-lg">
                  <img 
                    src={earnedCert.qrCodeUrl} 
                    alt="Certificate Verification QR" 
                    className="h-16 w-16"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={handleBackToCourses}
              className="w-full mt-4 py-3 bg-gradient-to-tr from-purple-500 to-indigo-500 text-xs font-bold rounded-xl text-white shadow-md cursor-pointer"
            >
              {user.language === 'en' ? "Complete Lesson & Return" : "เสร็จสิ้นหลักสูตรและกลับหน้าหลัก"}
            </button>

          </div>
        ) : showQuiz ? (
          /* Active Quiz View */
          <div className="rounded-2xl border border-slate-100 bg-white p-6 dark:border-slate-800/60 dark:bg-slate-900 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{t.academy.quizTitle}</span>
              <span className="text-xs text-slate-400">{quizAnswers.length + 1} / {activeCourse.quiz.length}</span>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-relaxed">
                {user.language === 'en' ? activeCourse.quiz[quizAnswers.length].questionEn : activeCourse.quiz[quizAnswers.length].questionTh}
              </h3>
            </div>

            <div className="grid gap-2.5">
              {(user.language === 'en' ? activeCourse.quiz[quizAnswers.length].optionsEn : activeCourse.quiz[quizAnswers.length].optionsTh).map((opt, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectQuizAnswer(index)}
                  className="w-full text-left p-3.5 rounded-xl border border-slate-100 bg-slate-50/40 hover:bg-purple-50/40 dark:border-slate-800/40 dark:hover:bg-purple-950/20 hover:border-purple-200 text-xs text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ) : activeLesson ? (
          /* Active Lesson Article View */
          <div className="rounded-2xl border border-slate-100 bg-white p-6 dark:border-slate-800/60 dark:bg-slate-900 shadow-sm space-y-6">
            <div className="border-b border-slate-50 dark:border-slate-800 pb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {user.language === 'en' ? activeLesson.titleEn : activeLesson.titleTh}
              </h3>
              <span className="text-[10px] bg-slate-50 px-2 py-0.5 rounded-full text-slate-400 font-semibold">{activeLesson.duration}</span>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-4">
              <p>{user.language === 'en' ? activeLesson.contentEn : activeLesson.contentTh}</p>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-50 dark:border-slate-800">
              <button 
                onClick={() => setActiveLessonId(null)}
                className="px-4 py-2 bg-slate-50 text-xs font-semibold rounded-lg text-slate-500 hover:text-slate-700 cursor-pointer"
              >
                {user.language === 'en' ? "Back to Syllabus" : "กลับไปหัวข้อหลักสูตร"}
              </button>

              <button 
                onClick={handleStartQuiz}
                className="px-5 py-2.5 bg-purple-500 text-xs font-bold text-white rounded-xl hover:opacity-90 transition shadow-sm cursor-pointer"
              >
                {user.language === 'en' ? "Take Certification Quiz" : "ทำแบบทดสอบรับใบประกาศ"}
              </button>
            </div>
          </div>
        ) : (
          /* Course syllabus page */
          <div className="rounded-2xl border border-slate-100 bg-white p-6 dark:border-slate-800/60 dark:bg-slate-900 shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                {user.language === 'en' ? activeCourse.titleEn : activeCourse.titleTh}
              </h2>
              <p className="text-[11px] text-slate-400 mt-1">
                {user.language === 'en' ? activeCourse.descEn : activeCourse.descTh}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.academy.lessonsTitle}</h3>
              <div className="space-y-2">
                {activeCourse.lessons.map((lesson) => (
                  <div 
                    key={lesson.id}
                    onClick={() => handleOpenLesson(lesson.id)}
                    className="flex items-center justify-between p-4 border border-slate-100 bg-slate-50/30 rounded-xl hover:border-purple-200 cursor-pointer hover:bg-purple-50/10 dark:border-slate-800/40 dark:hover:bg-purple-950/10 transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/20">
                        <BookOpen className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                        {user.language === 'en' ? lesson.titleEn : lesson.titleTh}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">{lesson.duration}</span>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={handleStartQuiz}
              className="w-full py-3.5 bg-purple-500 text-xs font-bold rounded-xl text-white shadow-md hover:bg-purple-600 cursor-pointer"
            >
              {user.language === 'en' ? "Skip to Certification Quiz" : "เริ่มทำแบบทดสอบเพื่อรับใบประกาศ"}
            </button>
          </div>
        )}
      </div>
    );
  }

  // Render general list and Breathing Box Exercise
  return (
    <div id="learning-hub-view" className="space-y-6">
      <div className="space-y-1.5">
        <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">{t.academy.title}</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">{t.academy.subtitle}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Course Syllabus column (2/3 space) */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.academy.courses}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {courses.map((course) => {
              const alreadyHasCert = certificates.some(c => c.courseNameEn === course.titleEn);
              return (
                <div 
                  key={course.id}
                  className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800/60 dark:bg-slate-900 shadow-sm flex flex-col justify-between hover:border-purple-200 transition-all hover:shadow-md cursor-pointer"
                  onClick={() => handleStartCourse(course.id)}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/20">
                        <BookOpen className="h-4 w-4" />
                      </div>
                      {alreadyHasCert && (
                        <span className="flex items-center space-x-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
                          <CheckCircle className="h-3 w-3" />
                          <span>Certified</span>
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                        {user.language === 'en' ? course.titleEn : course.titleTh}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-3">
                        {user.language === 'en' ? course.descEn : course.descTh}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 mt-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{course.duration} • {course.lessons.length} Lessons</span>
                    <span className="font-bold text-purple-600">{t.academy.startCourse} &rarr;</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Breathing Box guided exercise (1/3 space) */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.academy.meditations}</h3>
          
          <div className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800/60 dark:bg-slate-900 shadow-sm text-center space-y-6">
            <div className="flex items-center space-x-2 border-b border-slate-50 dark:border-slate-800 pb-3 text-left">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20">
                <Compass className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">{t.academy.breathingTitle}</h4>
                <p className="text-[9px] text-slate-400">Soothe Nervous System</p>
              </div>
            </div>

            {/* Pulsing expand-contract circle */}
            <div className="flex flex-col items-center justify-center py-4">
              <div className="relative h-32 w-32 flex items-center justify-center">
                
                {/* Micro-animated visual breathing rings */}
                <div 
                  className={`absolute inset-0 rounded-full border border-purple-300 dark:border-purple-900 bg-purple-100/20 dark:bg-purple-950/5 transition-all duration-1000 ${
                    breathPhase === 'in' ? 'scale-110 opacity-90' :
                    breathPhase === 'hold1' ? 'scale-110 opacity-100 border-2 border-indigo-400' :
                    breathPhase === 'out' ? 'scale-75 opacity-60' : 'scale-75 opacity-80 border-2 border-indigo-400'
                  }`}
                />
                
                <div className="text-center z-10">
                  <span className="text-xs font-black text-purple-700 dark:text-purple-400 block transition-all">
                    {breathPhase === 'in' ? t.academy.breathIn :
                     breathPhase === 'hold1' ? t.academy.breathHold :
                     breathPhase === 'out' ? t.academy.breathOut : t.academy.breathHold}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold mt-0.5 block">{breathSeconds}s</span>
                </div>

              </div>
            </div>

            <p className="text-[10px] text-slate-400 leading-relaxed text-left">
              {t.academy.breathingDesc}
            </p>

          </div>
        </div>

      </div>

    </div>
  );
}
