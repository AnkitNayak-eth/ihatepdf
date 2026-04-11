'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HoverCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isActive?: boolean;
  comingSoon?: boolean;
  onClick?: () => void;
}

export const HoverCard = ({ title, description, icon, isActive, comingSoon, onClick }: HoverCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      onClick={!comingSoon ? onClick : undefined}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-black/40 p-8 backdrop-blur-sm transition-all duration-300",
        comingSoon 
          ? "border-white/5 opacity-60 cursor-not-allowed" 
          : isActive 
            ? "border-brand shadow-[0_0_20px_rgba(230,25,25,0.1)]" 
            : "border-white/10 hover:border-brand/40 cursor-pointer"
      )}
    >
      <div 
        className={cn(
          "absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100",
          comingSoon ? "hidden" : "bg-gradient-to-br from-brand/10 via-brand/0 to-transparent"
        )}
      />
      
      {/* Subtle Scanline Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

      <div className="relative z-10 flex h-full flex-col">
        <div className={cn(
          "mb-6 flex h-14 w-14 items-center justify-center rounded-xl transition-all duration-300",
          comingSoon 
            ? "bg-white/5 text-white/30" 
            : isActive 
              ? "bg-brand/20 text-brand shadow-[0_0_15px_rgba(230,25,25,0.2)]" 
              : "bg-white/10 text-zinc-100 group-hover:bg-brand/20 group-hover:text-brand"
        )}>
          {icon}
        </div>
        
        <div className="flex flex-1 flex-col">
          <h3 className="mb-3 flex items-center gap-2 text-xl font-bold text-white tracking-tight">
            {title}
            {comingSoon && (
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white/40">
                SOON
              </span>
            )}
          </h3>
          <p className="text-sm leading-relaxed text-zinc-400">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
