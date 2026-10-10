import React from "react";
import { X, Download, Sparkles, CheckCircle2, Shield, Eye } from "lucide-react";

interface LogoModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: string;
}

export default function LogoModal({ isOpen, onClose, language = "th" }: LogoModalProps) {
  if (!isOpen) return null;

  const isEn = language === "en";

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/logo.png";
    link.download = "mind-merit-logo.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
          title={isEn ? "Close" : "ปิด"}
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1.5">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-gradient-to-r from-sky-50 via-teal-50 to-pink-50 dark:from-slate-800 dark:to-slate-800 text-sky-700 dark:text-sky-300 border border-sky-100 dark:border-slate-700 uppercase tracking-widest">
            <Sparkles className="h-3 w-3 text-amber-500 fill-current" />
            <span>MIND MERIT BRAND IDENTITY</span>
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            {isEn ? "Official Brand Logo" : "โลโก้อย่างเป็นทางการของ MIND MERIT"}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isEn 
              ? "Mental Health & Productivity Ecosystem Visual Assets" 
              : "อัตลักษณ์ภาพลักษณ์แบรนด์เพื่อสุขภาพจิตและพลังแห่งความสุข"}
          </p>
        </div>

        {/* Logo Display Showcase */}
        <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-gradient-to-tr from-sky-50/70 via-pink-50/50 via-amber-50/40 to-emerald-50/50 dark:from-slate-800/80 dark:via-sky-950/20 dark:to-slate-800/80 border border-slate-100 dark:border-slate-800 space-y-5">
          
          {/* Main Large Logo View */}
          <div className="relative group flex items-center justify-center">
            <div className="absolute -inset-2 bg-gradient-to-r from-sky-400 via-teal-400 via-pink-400 to-amber-400 rounded-3xl blur-md opacity-40 group-hover:opacity-75 transition duration-500"></div>
            
            <div className="relative h-36 w-36 sm:h-44 sm:w-44 rounded-3xl bg-white dark:bg-slate-900 p-2 shadow-xl border border-white/80 dark:border-slate-700 flex items-center justify-center overflow-hidden">
              <img 
                src="/logo.png" 
                alt="MIND MERIT Official Logo" 
                className="h-full w-full object-contain rounded-2xl"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.parentElement?.querySelector('.logo-fallback');
                  if (fallback) fallback.classList.remove('hidden');
                }}
              />
              <div className="logo-fallback hidden absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-tr from-sky-400 via-teal-400 to-emerald-400 text-white font-black">
                <span className="text-5xl">M</span>
                <span className="text-xs mt-1 tracking-widest uppercase">MIND MERIT</span>
              </div>
            </div>
          </div>

          {/* Square Format Display Tag */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 shadow-2xs">
            <span className="h-2 w-2 rounded-sm bg-sky-500"></span>
            <span>{isEn ? "Square Format (แบบสี่เหลี่ยม)" : "ตราสัญลักษณ์แบบสี่เหลี่ยม (Square Logo)"}</span>
          </div>
        </div>

        {/* Brand Meaning & Concept */}
        <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/70 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-1.5 font-bold text-slate-800 dark:text-slate-200 text-xs">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>{isEn ? "Brand Concept & Meaning" : "ความหมายและแนวคิดของตราสัญลักษณ์"}</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {isEn 
              ? "The MIND MERIT emblem unites mindful serenity (Mind) with purposeful empowerment (Merit). The soft harmonic pastel gradients represent calm breathing, inner balance, and scientific psychological reassurance." 
              : "โลโก้ MIND MERIT สื่อถึงการผสานพลังแห่ง 'สุขภาพใจ' (Mind) และ 'คุณค่าแห่งความดีงามและความสำเร็จ' (Merit) ผ่านโทนสีพาสเทลที่ให้ความสงบ ผ่อนคลาย สะท้อนความปลอดภัย และความน่าเชื่อถือทางวิทยาศาสตร์"}
          </p>

          {/* Color Palette Indicators */}
          <div className="flex items-center space-x-2 pt-1 text-[10px]">
            <span className="font-bold text-slate-500">โทนสีหลัก:</span>
            <div className="flex items-center space-x-1.5">
              <span className="h-3 w-3 rounded-full bg-sky-500 shadow-xs" title="Sky Blue (ปัญญา/ความแจ่มใส)" />
              <span className="h-3 w-3 rounded-full bg-emerald-500 shadow-xs" title="Mint Green (ความสบายใจ/การฟื้นฟู)" />
              <span className="h-3 w-3 rounded-full bg-pink-500 shadow-xs" title="Blossom Pink (ความอบอุ่น/การดูแล)" />
              <span className="h-3 w-3 rounded-full bg-amber-400 shadow-xs" title="Sunlight Yellow (พลังบวก/ความหวัง)" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-1">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {isEn ? "Close" : "ปิดหน้าต่าง"}
          </button>

          <button
            onClick={handleDownload}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white font-bold text-xs shadow-md shadow-sky-500/20 transition-all cursor-pointer flex items-center justify-center space-x-2 active:scale-95"
          >
            <Download className="h-4 w-4" />
            <span>{isEn ? "Download Logo PNG" : "ดาวน์โหลดไฟล์ภาพโลโก้"}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
