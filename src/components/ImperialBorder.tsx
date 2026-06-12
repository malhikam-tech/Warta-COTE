/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ShieldAlert, CheckCircle2, Award, Sparkles } from "lucide-react";

/**
 * A beautiful, medieval/classical golden divider with a central crest
 */
export const ImperialDivider: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`flex items-center justify-center gap-4 my-8 w-full select-none ${className}`}>
      <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-gold-dark/40 to-gold/70" />
      <div className="flex items-center gap-1.5 px-3 py-1 bg-royal-dark border border-gold-dark/40 rounded-full shadow-inner">
        <div className="w-1.5 h-1.5 bg-gold rotate-45" />
        <Award className="w-4 h-4 text-gold shrink-0 animate-pulse" />
        <div className="w-1.5 h-1.5 bg-gold rotate-45" />
      </div>
      <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent via-gold-dark/40 to-gold/70" />
    </div>
  );
};



export const ImperialCorners: React.FC = () => {
  return (
    <>
      {/* Top Left */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gold/60 pointer-events-none rounded-tl-[2px]" />
      <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-gold-light/40 pointer-events-none" />
      
      {/* Top Right */}
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gold/60 pointer-events-none rounded-tr-[2px]" />
      <div className="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-gold-light/40 pointer-events-none" />

      {/* Bottom Left */}
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gold/60 pointer-events-none rounded-bl-[2px]" />
      <div className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l border-gold-light/40 pointer-events-none" />

      {/* Bottom Right */}
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gold/60 pointer-events-none rounded-br-[2px]" />
      <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-gold-light/40 pointer-events-none" />
    </>
  );
};

/**
 * Imperial banner with quote of the day
 */
export const ImperialScrollQuote: React.FC = () => {
  const quotes = [
    {
      text: "Sejarah bukanlah beban ingatan, melainkan penerang masa depan. Kejayaan Kekaisaran diukir oleh pena para pencatat warta.",
      author: "Grand Archivist Aurelius"
    },
    {
      text: "Kekuasaan yang megah tegak berdiri bukan karena takhta yang berkilau, melainkan karena persatuan ilmu yang abadi.",
      author: "Emperor Charles COTE"
    },
    {
      text: "Legenda ditulis oleh mereka yang bertarung, tetapi keabadian dipegang oleh mereka yang mencatat jalannya peperangan.",
      author: "High Scribe Lysander"
    }
  ];

  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % quotes.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [quotes.length]);

  return (
    <div className="relative text-center px-6 py-4 rounded bg-gradient-to-b from-imperial-paper to-royal-dark border border-gold-dark/30 shadow-lg overflow-hidden max-w-2xl mx-auto">
      <div className="absolute top-1 left-1 opacity-10">
        <Sparkles className="w-12 h-12 text-gold" />
      </div>
      <p className="font-heading text-xs italic text-gold-light/90 leading-relaxed tracking-wider transition-all duration-700">
        "{quotes[index].text}"
      </p>
      <div className="mt-2 text-[10px] text-gold/60 font-mono tracking-widest uppercase">
        — {quotes[index].author}
      </div>
    </div>
  );
};
