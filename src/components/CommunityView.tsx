import React, { useState } from "react";
import { MessageSquare, Heart, Sparkles, UserCheck, CheckCircle2, ShieldAlert, Smile, Send } from "lucide-react";
import { UserProfile, Post, Buddy } from "../types";
import { translations } from "../translations";

interface CommunityViewProps {
  user: UserProfile;
  onRewardXP: (amount: number) => void;
  posts: Post[];
  onAddPost: (post: Post) => void;
  onAddComment: (postId: string, commentText: string) => void;
  onLikePost: (postId: string) => void;
}

export default function CommunityView({ 
  user, 
  onRewardXP, 
  posts, 
  onAddPost, 
  onAddComment, 
  onLikePost 
}: CommunityViewProps) {
  const t = translations[user.language];

  // Matching states
  const [matchingStatus, setMatchingStatus] = useState<'idle' | 'searching' | 'matched'>('idle');
  const [matchedBuddy, setMatchedBuddy] = useState<Buddy | null>(null);

  // Post form states
  const [newPostContent, setNewPostContent] = useState<string>("");
  const [anonymous, setAnonymous] = useState<boolean>(true);
  const [warningMessage, setWarningMessage] = useState<string>("");

  // Comments form state
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState<string>("");

  // Daily Poll states
  const [pollVoted, setPollVoted] = useState<boolean>(false);
  const [pollOptions, setPollOptions] = useState([
    { textEn: "Box breathing in nature", textTh: "ฝึกหายใจท่ามกลางธรรมชาติ", votes: 34 },
    { textEn: "Writing in a personal journal", textTh: "จดบันทึกเขียนระบายความรู้สึก", votes: 52 },
    { textEn: "Calling a close friend", textTh: "คุยโทรศัพท์ระบายกับเพื่อนสนิท", votes: 29 }
  ]);

  // Simulated peer buddies database
  const peerBuddies: Buddy[] = [
    {
      id: "buddy-1",
      name: "Tarn (ตาล)",
      age: 20,
      role: "student",
      wellbeingScore: 78,
      stressLevel: 4,
      interestsEn: ["Meditation", "Journaling", "Exam Prep"],
      interestsTh: ["ทำสมาธิ", "เขียนไดอารี่", "เตรียมสอบ"],
      languages: ["th", "en"],
      streak: 12,
      lastMood: "good",
      avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop"
    },
    {
      id: "buddy-2",
      name: "Pete (พีท)",
      age: 22,
      role: "student",
      wellbeingScore: 65,
      stressLevel: 6,
      interestsEn: ["Podcast", "Exercise", "Work balance"],
      interestsTh: ["ฟังพอดแคสต์", "ออกกำลังกาย", "บาลานซ์ชีวิต"],
      languages: ["th"],
      streak: 8,
      lastMood: "neutral",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop"
    }
  ];

  const handleMatchBuddy = () => {
    setMatchingStatus('searching');
    setTimeout(() => {
      // Pick a suitable buddy
      const chosen = peerBuddies[Math.floor(Math.random() * peerBuddies.length)];
      setMatchedBuddy(chosen);
      setMatchingStatus('matched');
      onRewardXP(40);
    }, 2000);
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    // AI Moderator / Toxicity check
    const contentLower = newPostContent.toLowerCase();
    const badWords = [
      "สัส", "เหี้ย", "ควย", "โง่", "ชั่ว", "ฆ่าตัวตาย", "suicide", "hate", "ugly", "stupid", "die"
    ];

    const containsToxicity = badWords.some(word => contentLower.includes(word));
    if (containsToxicity) {
      setWarningMessage(
        user.language === 'en' 
          ? "AI Moderator Warning: Please write warm, supportive, and safe messages. Hostile terms are prohibited." 
          : "ระบบคัดกรอง AI: โปรดเขียนข้อความที่ให้เกียรติ อบอุ่น และสร้างสรรค์ งดใช้ถ้อยคำที่รุนแรงหรือไม่เหมาะสม"
      );
      return;
    }

    const post: Post = {
      id: Math.random().toString(36).substr(2, 9),
      author: anonymous ? (user.language === 'en' ? "Anonymous Bunny" : "กระต่ายไม่ประสงค์ออกนาม") : user.name,
      anonymous,
      content: newPostContent,
      timestamp: "Just now",
      likes: 0,
      comments: []
    };

    onAddPost(post);
    setNewPostContent("");
    setWarningMessage("");
    onRewardXP(20);
  };

  const handleVotePoll = (index: number) => {
    if (pollVoted) return;
    const updated = [...pollOptions];
    updated[index].votes += 1;
    setPollOptions(updated);
    setPollVoted(true);
    onRewardXP(15);
  };

  const handlePostCommentSubmit = (postId: string) => {
    if (!newCommentText.trim()) return;
    onAddComment(postId, newCommentText);
    setNewCommentText("");
    setActiveCommentPostId(null);
    onRewardXP(10);
  };

  const totalPollVotes = pollOptions.reduce((acc, curr) => acc + curr.votes, 0);

  return (
    <div id="community-view-main" className="space-y-6">
      
      <div className="space-y-1.5">
        <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">{t.community.title}</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">{t.community.subtitle}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column (Takes 2/3 space) - Support posts */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Create Post Card */}
          <form onSubmit={handleCreatePost} className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800/60 dark:bg-slate-900 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {user.language === 'en' ? "Create a Support Post" : "เขียนโพสต์ส่งกำลังใจ"}
            </h3>
            
            <textarea
              rows={3}
              required
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder={t.community.createPostPlaceholder}
              className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs focus:ring-1 focus:ring-purple-400 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
            />

            {warningMessage && (
              <div className="rounded-xl bg-rose-50 p-3 flex items-start space-x-2 text-[10px] text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-100/20">
                <ShieldAlert className="h-4 w-4 shrink-0 text-rose-500" />
                <span>{warningMessage}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-1">
              <label className="flex items-center space-x-2 text-xs text-slate-500 cursor-pointer mb-3 sm:mb-0">
                <input
                  type="checkbox"
                  checked={anonymous}
                  onChange={(e) => setAnonymous(e.target.checked)}
                  className="rounded border-slate-200 accent-purple-500 cursor-pointer"
                />
                <span>{t.community.postBtn}</span>
              </label>

              <button
                type="submit"
                className="rounded-xl bg-purple-500 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-purple-600 transition cursor-pointer"
              >
                {user.language === 'en' ? "Post Board" : "โพสต์ลงกระดาน"}
              </button>
            </div>
          </form>

          {/* Posts list */}
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800/60 dark:bg-slate-900 shadow-sm space-y-4">
                
                {/* Author row */}
                <div className="flex items-center space-x-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50 text-purple-600 text-xs font-bold border border-purple-100 dark:bg-purple-950/20 dark:text-purple-300 dark:border-purple-900/40">
                    {post.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-700 dark:text-slate-200">{post.author}</h4>
                    <p className="text-[9px] text-slate-400">{post.timestamp}</p>
                  </div>
                </div>

                {/* Content */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{post.content}</p>

                {/* Likes / Comments action buttons */}
                <div className="flex items-center space-x-4 border-t border-b border-slate-50 dark:border-slate-800/60 py-2.5 text-[11px] text-slate-500">
                  <button 
                    onClick={() => onLikePost(post.id)}
                    className="flex items-center space-x-1.5 hover:text-rose-500 transition cursor-pointer"
                  >
                    <Heart className={`h-4 w-4 ${post.likedByUser ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span>{post.likes} {t.community.likes}</span>
                  </button>
                  
                  <button 
                    onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                    className="flex items-center space-x-1.5 hover:text-purple-500 transition cursor-pointer"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>{post.comments.length} {t.community.comments}</span>
                  </button>
                </div>

                {/* Comments Thread */}
                {post.comments.length > 0 && (
                  <div className="space-y-2 pl-3 border-l-2 border-slate-100 dark:border-slate-800">
                    {post.comments.map((comm) => (
                      <div key={comm.id} className="text-[11px] space-y-0.5">
                        <span className="font-bold text-slate-700 dark:text-slate-200 mr-1.5">{comm.author}:</span>
                        <span className="text-slate-500 dark:text-slate-400">{comm.content}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Open comment typing panel */}
                {activeCommentPostId === post.id && (
                  <div className="flex space-x-2 pt-1">
                    <input
                      type="text"
                      required
                      placeholder={t.community.addComment}
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      className="flex-1 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-[11px] focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
                    />
                    <button
                      onClick={() => handlePostCommentSubmit(post.id)}
                      className="px-3 bg-purple-500 text-white rounded-lg hover:opacity-90 transition cursor-pointer flex items-center justify-center"
                    >
                      <Send className="h-3 w-3" />
                    </button>
                  </div>
                )}

              </div>
            ))}
          </div>

        </div>

        {/* Right Column (Takes 1/3 space) - Matcher & Poll */}
        <div className="space-y-6">
          
          {/* AI Buddy Matcher Box */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800/60 dark:bg-slate-900 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-50 dark:border-slate-800 pb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/20">
                <Smile className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">{t.community.buddyMatching}</h4>
                <p className="text-[9px] text-slate-400">Match based on interests & stress</p>
              </div>
            </div>

            {matchingStatus === 'idle' && (
              <div className="space-y-4 text-center py-4">
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {user.language === 'en' 
                    ? "Connect with a supportive peer matched securely according to identical interests and stress index profiles." 
                    : "ระบบจะทำการจับคู่คุณกับเพื่อนบัดดี้ที่มีระดับคะแนนความเครียดและความสนใจตรงกันเพื่อแชร์ความก้าวหน้าร่วมกัน"}
                </p>
                <button
                  onClick={handleMatchBuddy}
                  className="w-full py-2.5 bg-purple-500 hover:bg-purple-600 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  {t.community.matchingBtn}
                </button>
              </div>
            )}

            {matchingStatus === 'searching' && (
              <div className="text-center py-8 space-y-3">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-purple-100 border-t-purple-500" />
                <p className="text-[10px] text-slate-400 animate-pulse">
                  {user.language === 'en' ? "Searching wellness synergy partners..." : "กำลังค้นหาคู่หูบัดดี้ช่วยเหลือใจ..."}
                </p>
              </div>
            )}

            {matchingStatus === 'matched' && matchedBuddy && (
              <div className="space-y-4 pt-1">
                <div className="flex items-center space-x-3 rounded-xl bg-purple-50/20 dark:bg-purple-950/5 p-3 border border-purple-100/30">
                  <img 
                    src={matchedBuddy.avatarUrl} 
                    alt="Buddy Avatar" 
                    className="h-10 w-10 rounded-full object-cover border border-purple-200"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 dark:text-slate-100">{matchedBuddy.name}</h5>
                    <p className="text-[9px] text-slate-400">🔥 {matchedBuddy.streak} Day Streak • Stress Level: {matchedBuddy.stressLevel}/10</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-500">{user.language === 'en' ? 'Matching Interests:' : 'ความสนใจร่วมกัน:'}</p>
                  <div className="flex flex-wrap gap-1">
                    {(user.language === 'en' ? matchedBuddy.interestsEn : matchedBuddy.interestsTh).map((tag, idx) => (
                      <span key={idx} className="rounded-full bg-slate-50 px-2 py-0.5 text-[9px] text-slate-400">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl bg-emerald-50 p-2 text-center text-[10px] font-semibold text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
                  🎉 {t.community.matchSuccess}
                </div>

                <button
                  onClick={() => setMatchingStatus('idle')}
                  className="w-full py-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-[10px] font-bold rounded-xl text-slate-600 dark:text-slate-300 transition-all cursor-pointer text-center"
                >
                  {user.language === 'en' ? "Rematch" : "จับคู่ใหม่"}
                </button>
              </div>
            )}

          </div>

          {/* Daily Well-being Poll */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800/60 dark:bg-slate-900 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t.community.pollTitle}
            </h3>

            <p className="text-xs font-bold text-slate-700 dark:text-slate-200 leading-normal">
              {user.language === 'en' ? "What is your go-to quick calming ritual?" : "เมื่อรู้สึกว้าวุ่นใจ วิธีระงับอารมณ์ที่คุณชอบใช้ที่สุดคือข้อใด?"}
            </p>

            <div className="space-y-2">
              {pollOptions.map((opt, i) => {
                const percent = Math.round((opt.votes / totalPollVotes) * 100);
                return (
                  <button
                    key={i}
                    onClick={() => handleVotePoll(i)}
                    className="w-full text-left relative overflow-hidden rounded-xl border border-slate-50 bg-slate-50/20 p-3.5 hover:border-purple-200 transition-all cursor-pointer text-xs"
                  >
                    {/* Render voting percentage background bar */}
                    {pollVoted && (
                      <div 
                        className="absolute left-0 top-0 bottom-0 bg-purple-50/50 dark:bg-purple-950/10 transition-all duration-500" 
                        style={{ width: `${percent}%` }}
                      />
                    )}
                    <div className="relative z-10 flex justify-between font-semibold">
                      <span>{user.language === 'en' ? opt.textEn : opt.textTh}</span>
                      {pollVoted && <span className="text-purple-600 font-extrabold">{percent}%</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
