/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { 
  fetchChronicles, 
  incrementViews 
} from "./lib/supabase";
import { WartaCote } from "./types";
import { 
  ImperialDivider, 
  ImperialCorners, 
  ImperialScrollQuote 
} from "./components/ImperialBorder";
import { AdminPanel } from "./components/AdminPanel";
import { 
  Search, 
  BookOpen, 
  Calendar, 
  User, 
  Eye, 
  ChevronRight, 
  Library,
  Pin,
  Menu,
  X
} from "lucide-react";

export default function App() {
  const [chronicles, setChronicles] = useState<WartaCote[]>([]);
  const [filteredChronicles, setFilteredChronicles] = useState<WartaCote[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Navigation View: "home" | "admin"
  const [view, setView] = useState<"home" | "admin">("home");

  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("Semua");

  const [selectedChronicle, setSelectedChronicle] = useState<WartaCote | null>(null);

  // Hamburger menu state
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // Initial load
  const loadChronicles = async () => {
    setIsLoading(true);
    try {
      const res = await fetchChronicles();
      setChronicles(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadChronicles();
  }, []);

  // Filter helper
  useEffect(() => {
    let result = [...chronicles];

    // Filter by category
    if (activeCategory !== "Semua") {
      result = result.filter(c => c.category === activeCategory);
    }

    // Filter by search text
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.title.toLowerCase().includes(query) || 
        c.excerpt.toLowerCase().includes(query) || 
        c.content.toLowerCase().includes(query) ||
        c.author.toLowerCase().includes(query)
      );
    }

    setFilteredChronicles(result);
  }, [chronicles, activeCategory, searchQuery]);

  // Handle opening an article
  const handleOpenChronicle = async (item: WartaCote) => {
    setSelectedChronicle(item);
    await incrementViews(item);
    
    // Update count immediately in memory
    setChronicles(prev => 
      prev.map(c => c.id === item.id ? { ...c, views: (c.views || 0) + 1 } : c)
    );
  };

  return (
    <div className="min-h-screen relative bg-royal-dark text-gold-light/95 selection:bg-gold-dark selection:text-royal-dark font-sans antialiased flex flex-col justify-between">
      
      {/* Decorative Golden Ambient Gradients & Background Patterns */}
      <div className="ambient-glow top-0 left-1/4" />
      <div className="ambient-glow-crimson top-1/3 right-10" />
      <div className="ambient-glow bottom-0 left-10" />

      {/* Decorative vintage pattern lines overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(215,175,55,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-50 z-0" />
      
      {/* Elegant Header with Minimalist COTE Logo & Top-right Navbar */}
      <header className="relative z-50 border-b border-gold-dark/15 bg-royal-dark/95 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between relative">
          
          {/* Left: Minimalist COTE logo */}
          <div 
            onClick={() => { setView("home"); setActiveCategory("Semua"); setSelectedChronicle(null); setIsMenuOpen(false); }}
            className="flex items-center gap-2 cursor-pointer group select-none z-50"
          >
            <span className="text-[#d4af37] text-base font-semibold tracking-wider group-hover:scale-110 transition duration-300">⚜</span>
            <span className="font-heading text-xs uppercase tracking-[0.3em] text-[#d4af37] font-semibold">
              COTE
            </span>
          </div>

          {/* Right: Hamburger Menu Trigger Button inside Header */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 border border-gold/25 hover:border-gold hover:text-gold text-gold-light/90 hover:bg-gold/5 rounded transition-all duration-300 z-50 cursor-pointer flex items-center justify-center gap-1.5"
              aria-label="Navigasi Menu"
            >
              <span className="font-mono text-[9px] uppercase tracking-wider text-gold-light/60">MENU</span>
              {isMenuOpen ? <X className="w-4 h-4 text-gold shrink-0" /> : <Menu className="w-4 h-4 text-gold-light shrink-0" />}
            </button>
          </div>

          {/* Hamburger Dropdown Drawer Panel */}
          {isMenuOpen && (
            <>
              {/* Overlay Backdrop to dismiss */}
              <div 
                className="fixed inset-0 z-40 bg-royal-dark/80 backdrop-blur-xs transition-opacity cursor-default"
                onClick={() => setIsMenuOpen(false)}
              />
              
              {/* Golden Medieval Styled Floating Drawer */}
              <div className="absolute right-4 md:right-8 top-[3.5rem] z-50 w-64 bg-royal-dark/95 border border-gold/30 rounded p-5 shadow-2xl text-left animate-fade-in">
                <ImperialCorners />
                
                {/* Decorative title */}
                <div className="flex items-center justify-between border-b border-gold/15 pb-2.5 mb-3 select-none">
                  <span className="text-[#d4af37] font-heading text-[10px] tracking-widest uppercase font-bold flex items-center gap-1.5">
                    <span>⚜</span> NAVIGASI ARSIP
                  </span>
                </div>
                
                <div className="flex flex-col gap-1">
                  <button 
                    onClick={() => { setView("home"); setActiveCategory("Semua"); setSelectedChronicle(null); setIsMenuOpen(false); }}
                    className={`w-full text-left font-mono tracking-wider text-xs px-3 py-2 transition-all rounded flex items-center justify-between cursor-pointer ${view === "home" && activeCategory === "Semua" ? "text-gold bg-gold/10 font-bold border-l-2 border-gold" : "text-gold-light/75 hover:text-gold hover:bg-gold/5"}`}
                  >
                    <span>📜 BERANDA</span>
                    <span className="text-[8px] text-gold/40 font-mono">UTAMA</span>
                  </button>
                  
                  <button 
                    onClick={() => { setView("home"); setActiveCategory("Berita"); setSelectedChronicle(null); setIsMenuOpen(false); }}
                    className={`w-full text-left font-mono tracking-wider text-xs px-3 py-2 transition-all rounded flex items-center justify-between cursor-pointer ${view === "home" && activeCategory === "Berita" ? "text-gold bg-gold/10 font-bold border-l-2 border-gold" : "text-gold-light/75 hover:text-gold hover:bg-gold/5"}`}
                  >
                    <span>📰 BERITA</span>
                    <span className="text-[8px] text-gold/45 font-mono">NEWS</span>
                  </button>
                  
                  <button 
                    onClick={() => { setView("home"); setActiveCategory("Edukasi"); setSelectedChronicle(null); setIsMenuOpen(false); }}
                    className={`w-full text-left font-mono tracking-wider text-xs px-3 py-2 transition-all rounded flex items-center justify-between cursor-pointer ${view === "home" && activeCategory === "Edukasi" ? "text-gold bg-gold/10 font-bold border-l-2 border-gold" : "text-gold-light/75 hover:text-gold hover:bg-gold/5"}`}
                  >
                    <span>📘 EDUKASI</span>
                    <span className="text-[8px] text-gold/45 font-mono">Materi</span>
                  </button>
                  
                  <button 
                    onClick={() => { setView("home"); setActiveCategory("Informasi"); setSelectedChronicle(null); setIsMenuOpen(false); }}
                    className={`w-full text-left font-mono tracking-wider text-xs px-3 py-2 transition-all rounded flex items-center justify-between cursor-pointer ${view === "home" && activeCategory === "Informasi" ? "text-[#d4af37] bg-gold/10 font-bold border-l-2 border-[#d4af37]" : "text-gold-light/75 hover:text-gold hover:bg-gold/5"}`}
                  >
                    <span>👥 KOMUNITAS</span>
                    <span className="text-[8px] text-gold/45 font-mono">Klub</span>
                  </button>
                  
                  <button 
                    onClick={() => { setView("home"); setActiveCategory("Arsip"); setSelectedChronicle(null); setIsMenuOpen(false); }}
                    className={`w-full text-left font-mono tracking-wider text-xs px-3 py-2 transition-all rounded flex items-center justify-between cursor-pointer ${view === "home" && activeCategory === "Arsip" ? "text-gold bg-gold/10 font-bold border-l-2 border-gold" : "text-gold-light/75 hover:text-gold hover:bg-gold/5"}`}
                  >
                    <span>🏛 ARSIP</span>
                    <span className="text-[8px] text-gold/45 font-mono">Sejarah</span>
                  </button>
                  
                  {/* Fine divider */}
                  <div className="h-[1px] bg-gold-dark/15 my-2.5" />
                  
                  <button
                    onClick={() => { setView("admin"); setSelectedChronicle(null); setIsMenuOpen(false); }}
                    className={`w-full text-left font-mono tracking-wider text-xs px-3 py-2 border transition-all rounded flex items-center justify-between cursor-pointer ${
                      view === "admin" 
                        ? "border-gold text-gold bg-gold/15 font-bold" 
                        : "border-gold/30 text-[#d4af37] bg-royal-crimson/5 hover:bg-gold/10 hover:border-gold"
                    }`}
                  >
                    <span>🔒 PORTAL REDAKSI</span>
                    <span className="text-[8px] text-gold-dark font-semibold">ADMIN</span>
                  </button>
                </div>
              </div>
            </>
          )}

        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-grow max-w-7xl mx-auto w-full px-4 md:px-8 py-8 md:py-12">
        {view === "admin" ? (
          <section className="animate-fade-in my-4">
            <AdminPanel
              chronicles={chronicles}
              onRefresh={loadChronicles}
              onClose={() => setView("home")}
            />
          </section>
        ) : (
          <>
            <section className="text-center max-w-4xl mx-auto mb-10 relative">
              {/* Golden Calligraphy Logo without Crest logo */}
              <h1 className="font-heading text-xl sm:text-2xl md:text-3xl font-extrabold tracking-[0.3em] uppercase mb-4 text-gold-text-gradient select-none">
                CHRONICLES OF THE EMPIRE
              </h1>
              
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-gold" />
                <span className="font-heading text-[11px] font-medium tracking-[0.4em] text-gold-light/80 uppercase">C O T E</span>
                <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-gold" />
              </div>

              <p className="text-xs text-gold-light/75 max-w-2xl mx-auto leading-relaxed font-sans mb-6">
                Portal warta resmi klan <strong className="text-gold">CHRONICLES OF THE EMPIRE</strong>.
              </p>

              <ImperialScrollQuote />
            </section>

            {/* Search Desk & Custom Filters */}
            <section className="mb-8 max-w-3xl mx-auto" id="cote-warta-search">
              <div className="relative p-1.5 rounded bg-royal-dark/85 border border-gold/20 flex flex-col sm:flex-row items-center gap-2 shadow-xl">
                <div className="relative w-full flex-grow">
                  <input
                    type="text"
                    placeholder="Cari berita, edukasi, atau informasi warta..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs bg-transparent border-0 py-2.5 pl-9 pr-4 text-gold-light placeholder-gold-dark/40 focus:outline-none focus:ring-0"
                  />
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gold/40" />
                </div>

                <div className="shrink-0 flex items-center gap-2 px-3 text-[10px] font-mono text-gold-light/40 border-t sm:border-t-0 sm:border-l border-gold/15 py-1.5 sm:py-0">
                  DITEMUKAN: <span className="text-gold font-bold">{filteredChronicles.length}</span> / {chronicles.length}
                </div>
              </div>

              {/* Responsive Category Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 mt-4">
                {["Semua", "Berita", "Edukasi", "Informasi", "Arsip"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3.5 py-1 text-[10px] font-heading font-medium tracking-widest uppercase transition-all rounded duration-300 cursor-pointer ${
                      activeCategory === cat
                        ? "bg-gradient-to-r from-gold-dark to-gold text-royal-dark font-semibold shadow-md"
                        : "bg-royal-dark/40 border border-gold/20 hover:border-gold text-gold-light/70 hover:text-gold hover:bg-gold/5"
                    }`}
                  >
                    {cat === "Semua" ? "📜 Semua Teks" : cat}
                  </button>
                ))}
              </div>
            </section>

            <ImperialDivider className="opacity-40" />

            {/* Chronicles List Grid Section */}
            <section id="warta-cote-grid" className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1.5">
                  <Library className="w-4 h-4 text-gold shrink-0" />
                  <h2 className="font-heading text-xs tracking-widest text-[#d4af37] uppercase font-bold">DAFTAR KONTEN WARTA ({activeCategory.toUpperCase()})</h2>
                </div>
                <span className="text-[9px] font-mono text-gold-light/40 text-right">COTE ARCHIVE</span>
              </div>

              {isLoading ? (
                <div className="py-24 text-center">
                  <div className="inline-block w-8 h-8 rounded-full border-2 border-gold border-t-transparent animate-spin mb-4" />
                  <p className="font-heading text-xs tracking-widest text-gold/60 uppercase">Membuka Gulungan Sejarah...</p>
                </div>
              ) : filteredChronicles.length === 0 ? (
                <div className="py-16 text-center border border-gold/10 rounded bg-royal-dark/20 max-w-xl mx-auto">
                  <BookOpen className="w-12 h-12 text-gold-dark/20 mx-auto mb-3" />
                  <p className="text-xs text-gold-light/60">Tidak ada konten warta yang tersedia untuk kategori ini.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredChronicles.map((item) => {
                    const isPinned = !!item.is_pinned;
                    return (
                      <article 
                        key={item.id}
                        id={`post-${item.id}`}
                        onClick={() => handleOpenChronicle(item)}
                        className={`relative rounded overflow-hidden cursor-pointer group transition-all duration-300 flex flex-col justify-between border ${isPinned ? "border-gold/50 bg-royal-crimson/10" : "border-gold/15 bg-imperial-paper/50 hover:bg-imperial-paper hover:border-gold/40 shadow-md"} hover:shadow-xl hover:-translate-y-1`}
                      >
                        <ImperialCorners />

                        {/* Image Header */}
                        <div className="relative h-40 overflow-hidden bg-royal-dark/40 border-b border-gold/10 shrink-0">
                          <img
                            src={item.image_url || "https://images.unsplash.com/photo-1599727497674-80dc02617a32?auto=format&fit=crop&q=80&w=400"}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-royal-dark via-transparent to-transparent opacity-80" />
                          
                          {/* Floating Pinned & Category status */}
                          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                            <span className={`px-2 py-0.5 text-[8px] font-mono tracking-widest uppercase border rounded-full backdrop-blur-md ${
                              item.category === "Berita" ? "border-sky-500/40 text-sky-300 bg-sky-950/70" :
                              item.category === "Edukasi" ? "border-emerald-500/40 text-emerald-300 bg-emerald-950/70" :
                              item.category === "Informasi" ? "border-amber-500/40 text-amber-300 bg-amber-950/70" :
                              "border-rose-500/40 text-rose-300 bg-rose-950/70"
                            }`}>
                              {item.category}
                            </span>

                            {isPinned && (
                              <span className="flex items-center gap-1 px-2 py-0.5 text-[8px] font-mono tracking-widest bg-gold/15 text-gold border border-gold/40 rounded-full backdrop-blur-md">
                                <Pin className="w-2.5 h-2.5 shrink-0 animate-bounce" /> PINNED
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Card Content Area */}
                        <div className="p-4 flex-grow flex flex-col justify-between">
                          <div>
                            {/* Meta lines */}
                            <div className="flex items-center gap-2 text-[9px] text-gold-light/45 font-mono mb-2">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-gold-dark/60 shrink-0" />
                                {new Date(item.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                              </span>
                              <span className="w-1 h-1 bg-gold/20 rounded-full" />
                              <span className="flex items-center gap-1">
                                <User className="w-3 h-3 text-gold-dark/60 shrink-0" />
                                {item.author}
                              </span>
                            </div>

                            {/* Title */}
                            <h3 className="font-heading text-xs uppercase text-gold font-bold tracking-wider mb-2 line-clamp-2 leading-snug group-hover:text-gold-light transition">
                              {item.title}
                            </h3>

                            {/* Excerpt paragraph */}
                            <p className="text-[11px] text-gold-light/65 leading-relaxed font-sans line-clamp-3 mb-4">
                              {item.excerpt}
                            </p>
                          </div>

                          {/* Footer Stats Row inside Article Card */}
                          <div className="pt-3 border-t border-gold/5 flex items-center justify-between text-[10px] font-mono text-gold-light/40 mt-auto">
                            <div className="flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5 text-gold/30 shrink-0" />
                              <span>{item.views || 0} READS</span>
                            </div>
                            <span className="text-gold/50 flex items-center gap-0.5 group-hover:translate-x-1 group-hover:text-gold transition">
                              BACA <ChevronRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-gold-dark/15 bg-royal-dark py-8 text-center" id="cote-footer">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-3">
          <p className="text-xs text-gold-light/60 font-mono tracking-widest uppercase">
            © 2026 COTE COMMUNITY
          </p>

          <div className="flex items-center justify-center gap-4 text-xs font-mono">
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="text-[10px] tracking-widest text-[#d4af37]/65 hover:text-gold transition uppercase cursor-pointer"
            >
              KEMBALI KE PUNCAK
            </button>
          </div>
        </div>
      </footer>

      {/* LORE READER MODAL (Ancient parchment scroll style) */}
      {selectedChronicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-royal-dark/90 backdrop-blur-md p-4">
          <div className="relative w-full max-w-2xl bg-[#efebd8] text-amber-950 rounded shadow-2xl p-6 md:p-10 border-8 border-double border-amber-900/15 overflow-hidden select-text animate-fade-in my-8 max-h-[90vh] overflow-y-auto imperial-scroll relative">
            
            {/* Scroll filigree anchors / corners */}
            <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-amber-900/30" />
            <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-amber-900/30" />
            <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-amber-900/30" />
            <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-amber-900/30" />

            {/* Absolute close "X" button */}
            <button
              onClick={() => setSelectedChronicle(null)}
              className="absolute top-4 right-4 text-amber-950/60 hover:text-amber-950 hover:bg-amber-900/10 p-2.5 rounded-full transition-all duration-200 cursor-pointer z-20"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Heading area inside parchment scroll */}
            <div className="flex items-center justify-between border-b border-amber-900/20 pb-4 mb-6 pr-8">
              <span className="font-mono text-[9px] tracking-widest uppercase text-amber-900/60 font-bold">
                KATEGORI: {selectedChronicle.category.toUpperCase()}
              </span>
            </div>

            {/* Parchment Title */}
            <h2 className="font-heading text-lg md:text-xl font-bold uppercase tracking-wide text-amber-950 mb-3 text-center border-b-2 border-dotted border-amber-900/15 pb-4 pr-6">
              {selectedChronicle.title}
            </h2>

            {/* Author sign-offs details */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] font-mono text-amber-900/70 mb-6">
              <span className="flex items-center gap-1.5 bg-amber-950/5 px-2.5 py-1 rounded">
                <User className="w-3.5 h-3.5" /> PENERBIT: {selectedChronicle.author}
              </span>
              <span className="flex items-center gap-1.5 bg-amber-950/5 px-2.5 py-1 rounded">
                <Calendar className="w-3.5 h-3.5" /> DIRILIS: {new Date(selectedChronicle.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
              </span>
              <span className="flex items-center gap-1.5 bg-amber-950/5 px-2.5 py-1 rounded">
                <Eye className="w-3.5 h-3.5" /> PEMBACA: {selectedChronicle.views} KALI
              </span>
            </div>

            {/* Big cover photo within reader */}
            <div className="w-full h-56 rounded border border-amber-900/20 overflow-hidden mb-6 shadow-md shadow-amber-950/10">
              <img
                src={selectedChronicle.image_url || "https://images.unsplash.com/photo-1599727497674-80dc02617a32?auto=format&fit=crop&q=80&w=800"}
                alt={selectedChronicle.title}
                className="w-full h-full object-cover grayscale-[10%] hover:grayscale-0 transition"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Intisari (Excerpt Block in blockquote italic format) */}
            <div className="p-4 bg-amber-900/5 border-l-4 border-amber-800 rounded-r mb-6 select-text text-amber-900 text-xs italic tracking-wide leading-relaxed font-sans">
              "{selectedChronicle.excerpt}"
            </div>

            {/* Document Content with large initial dropcap letter */}
            <div className="text-xs leading-relaxed font-serif text-amber-950/90 whitespace-pre-line space-y-4 tracking-wide select-text">
              <p className="first-letter:text-4xl first-letter:float-left first-letter:font-heading first-letter:font-extrabold first-letter:mr-2.5 first-letter:text-amber-900 first-letter:leading-[0.8] clear-both leading-relaxed font-sans">
                {selectedChronicle.content}
              </p>
            </div>

            {/* Scribe authentications seal */}
            <div className="mt-8 pt-6 border-t border-amber-900/20 flex flex-col items-center gap-2 select-none">
              <div className="w-8 h-8 rounded-full border border-amber-900/30 flex items-center justify-center text-amber-900 opacity-60">
                ⚜
              </div>
              <span className="font-heading text-[8px] tracking-[0.3em] text-amber-900/50 uppercase">
                TEMBOK ARSIP SCRIPTUM AGUNG
              </span>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
