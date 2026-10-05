import React, { useState } from "react";
import { Database, ShieldAlert, FileText, CheckCircle, Trash2, TrendingUp, Users } from "lucide-react";
import { UserProfile, Certificate } from "../types";
import { translations } from "../translations";

interface AdminViewProps {
  user: UserProfile;
  certificates: Certificate[];
}

export default function AdminView({ user, certificates }: AdminViewProps) {
  const t = translations[user.language];

  // Dummy flagged posts for moderation simulation
  const [flaggedItems, setFlaggedItems] = useState([
    { id: "flag-1", author: "Anonymous", content: "I hate my study course so much, feeling stupid and useless.", reason: "Self-harm/harsh speech filter trigger", severity: "medium" },
    { id: "flag-2", author: "Student32", content: "Don't worry, you are not alone in exam stress. Try some breathing.", reason: "User reported: Misclassified as spam", severity: "low" }
  ]);

  const handleApprove = (id: string) => {
    setFlaggedItems(flaggedItems.filter(item => item.id !== id));
  };

  const handleDelete = (id: string) => {
    setFlaggedItems(flaggedItems.filter(item => item.id !== id));
  };

  return (
    <div id="admin-telemetry-main" className="space-y-6">
      
      <div className="space-y-1.5">
        <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">{t.nav.admin}</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {user.language === 'en' ? "Simulate platform health, evaluate AI moderation cues, and review active credentials." : "จำลองการตรวจสอบสุขภาพแพลตฟอร์ม ตรวจสอบระบบคัดกรองเนื้อหาอัตโนมัติ และสถิติใบรับรอง"}
        </p>
      </div>

      {/* 1. Metric widgets */}
      <div className="grid gap-4 sm:grid-cols-4">
        
        <div className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800/60 dark:bg-slate-900 shadow-sm">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active Students</p>
          <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mt-1">14,250</h3>
          <p className="text-[9px] text-emerald-500 mt-1">&uarr; 12% vs last week</p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800/60 dark:bg-slate-900 shadow-sm">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Working Adults</p>
          <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mt-1">5,420</h3>
          <p className="text-[9px] text-emerald-500 mt-1">&uarr; 8% vs last week</p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800/60 dark:bg-slate-900 shadow-sm">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Certificates Issued</p>
          <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mt-1">1,480</h3>
          <p className="text-[9px] text-slate-400 mt-1">{certificates.length} earned in this session</p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800/60 dark:bg-slate-900 shadow-sm">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">AI Filter Actions</p>
          <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mt-1">34</h3>
          <p className="text-[9px] text-rose-500 mt-1">8 toxic posts withheld</p>
        </div>

      </div>

      {/* 2. Grid split of Flagged Posts and Active certificates */}
      <div className="grid gap-6 md:grid-cols-2">
        
        {/* Flagged items queue */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800/60 dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-50 dark:border-slate-800 pb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-500 dark:bg-orange-950/20">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">AI Toxicity Moderation Queue</h4>
              <p className="text-[9px] text-slate-400">Posts caught or flagged by community users</p>
            </div>
          </div>

          <div className="space-y-3">
            {flaggedItems.length === 0 ? (
              <div className="py-8 text-center text-[11px] text-slate-400">
                🎉 All clean! No flagged entries in queue.
              </div>
            ) : (
              flaggedItems.map((item) => (
                <div key={item.id} className="p-4 border border-slate-100 bg-slate-50/25 rounded-xl dark:border-slate-800/40 dark:bg-slate-800/10 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold text-slate-600 dark:text-slate-300">Author: {item.author}</span>
                    <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[9px] font-bold">Reason: {item.reason}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 bg-white p-3 rounded-lg dark:bg-slate-900 italic">"{item.content}"</p>
                  
                  {/* Actions buttons */}
                  <div className="flex justify-end space-x-2 pt-1 text-[10px]">
                    <button 
                      onClick={() => handleApprove(item.id)}
                      className="flex items-center space-x-1 px-2.5 py-1.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100/50 cursor-pointer"
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span>Approve & Post</span>
                    </button>
                    
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="flex items-center space-x-1 px-2.5 py-1.5 rounded bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100/50 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete permanently</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* E-Certificates log list */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800/60 dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-50 dark:border-slate-800 pb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-500 dark:bg-purple-950/20">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">Live Credentials Issued</h4>
              <p className="text-[9px] text-slate-400">Verifiable certificates unlocked in this session</p>
            </div>
          </div>

          <div className="space-y-2">
            {certificates.length === 0 ? (
              <div className="py-12 text-center text-[11px] text-slate-400 space-y-1">
                <span>📖</span>
                <p>No certificates earned yet. Pass courses in the Academy first!</p>
              </div>
            ) : (
              certificates.map((cert) => (
                <div key={cert.id} className="flex items-center justify-between p-3.5 border border-slate-50 rounded-xl dark:border-slate-800/40 text-xs">
                  <div>
                    <h5 className="font-bold text-slate-700 dark:text-slate-200">{cert.userName}</h5>
                    <p className="text-[9px] text-slate-400">{user.language === 'en' ? cert.courseNameEn : cert.courseNameTh}</p>
                  </div>
                  <span className="font-mono text-[9px] bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 px-2.5 py-1 rounded-lg font-bold">
                    {cert.certificateId}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
