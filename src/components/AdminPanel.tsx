/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Lock, 
  Unlock, 
  KeyRound, 
  Plus, 
  Edit, 
  Trash2, 
  Pin, 
  Eye, 
  FileText, 
  User, 
  Image, 
  ChevronLeft, 
  AlertCircle,
  ArrowRight
} from "lucide-react";
import { WartaCote } from "../types";
import { 
  insertChronicle, 
  updateChronicle, 
  deleteChronicle, 
  getAdminPassword, 
  setAdminPassword
} from "../lib/supabase";
import { ImperialCorners, ImperialDivider } from "./ImperialBorder";

interface AdminPanelProps {
  chronicles: WartaCote[];
  onRefresh: () => void;
  onClose: () => void;
}

const UN_PRESETS = [
  { name: "Istana Megah", url: "https://images.unsplash.com/photo-1599727497674-80dc02617a32?auto=format&fit=crop&q=80&w=800" },
  { name: "Militer Klasik", url: "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&q=80&w=800" },
  { name: "Kertas Kuno", url: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=800" },
  { name: "Meja Diplomat", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800" },
  { name: "Gerbang Emas", url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=800" },
];

export const AdminPanel: React.FC<AdminPanelProps> = ({ chronicles, onRefresh, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");

  // Change Password State
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [pwdMessage, setPwdMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Manage News State
  const [activeTab, setActiveTab] = useState<"list" | "form">("list");
  const [editingItem, setEditingItem] = useState<WartaCote | null>(null);

  // Form input states
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState<WartaCote["category"]>("Berita");
  const [formExcerpt, setFormExcerpt] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formAuthor, setFormAuthor] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formIsPinned, setFormIsPinned] = useState(false);
  const [formError, setFormError] = useState("");
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  // Custom alert & confirm modal states
  const [modalAlert, setModalAlert] = useState<{ 
    isOpen: boolean; 
    title: string; 
    message: string; 
  } | null>(null);

  const [modalConfirm, setModalConfirm] = useState<{ 
    isOpen: boolean; 
    title: string; 
    message: string; 
    onConfirm: () => void;
  } | null>(null);

  const showAlert = (title: string, message: string) => {
    setModalAlert({ isOpen: true, title, message });
  };

  const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    setModalConfirm({ isOpen: true, title, message, onConfirm });
  };

  // Handle Authentication Gate
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const currentPwd = getAdminPassword();
    if (passwordInput === currentPwd) {
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Sandi tidak selaras dengan catatan Kerajaan.");
    }
  };

  // Handle Change Password Form
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    const activePwd = getAdminPassword();
    if (oldPassword !== activePwd) {
      setPwdMessage({ text: "Sandi lama salah.", isError: true });
      return;
    }
    if (newPassword.length < 4) {
      setPwdMessage({ text: "Sandi baru minimal terdiri dari 4 karakter.", isError: true });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPwdMessage({ text: "Sandi baru dan konfirmasi tidak cocok.", isError: true });
      return;
    }

    setAdminPassword(newPassword);
    setPwdMessage({ text: "Sandi Berhasil Diperbarui!", isError: false });
    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  // Open the creation form
  const openCreateForm = () => {
    setEditingItem(null);
    setFormTitle("");
    setFormCategory("Berita");
    setFormExcerpt("");
    setFormContent("");
    setFormAuthor("Staff Scribe");
    setFormImageUrl(UN_PRESETS[0].url);
    setFormIsPinned(false);
    setFormError("");
    setActiveTab("form");
  };

  // Open the edit form
  const openEditForm = (item: WartaCote) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormCategory(item.category);
    setFormExcerpt(item.excerpt);
    setFormContent(item.content);
    setFormAuthor(item.author);
    setFormImageUrl(item.image_url || "");
    setFormIsPinned(!!item.is_pinned);
    setFormError("");
    setActiveTab("form");
  };

  // Handle Create or Update operations
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formTitle.trim() || !formExcerpt.trim() || !formContent.trim() || !formAuthor.trim()) {
      setFormError("Semua dokumen Kekaisaran wajib diisi dengan lengkap.");
      return;
    }

    setIsSubmitLoading(true);

    const payload = {
      title: formTitle,
      category: formCategory,
      excerpt: formExcerpt,
      content: formContent,
      author: formAuthor,
      image_url: formImageUrl,
      is_pinned: formIsPinned,
      created_at: editingItem ? editingItem.created_at : new Date().toISOString(),
    };

    try {
      if (editingItem) {
        const res = await updateChronicle(editingItem.id, payload);
        if (res.success) {
          onRefresh();
          setActiveTab("list");
        } else {
          setFormError(res.error || "Gagal memperbarui catatan warta.");
        }
      } else {
        const res = await insertChronicle(payload);
        if (res.success) {
          onRefresh();
          setActiveTab("list");
        } else {
          setFormError(res.error || "Gagal menambahkan warta baru.");
        }
      }
    } catch (err: any) {
      setFormError(`Kendala operasional: ${err.message || err}`);
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    showConfirm(
      "KONFIRMASI ARSIP", 
      "Apakah anda yakin ingin menghapus warta sejarah ini untuk selamanya dari catatan kerajaan?", 
      async () => {
        const res = await deleteChronicle(id);
        if (res.success) {
          onRefresh();
          showAlert("UPACARA BERHASIL", "Lembaran warta sejarah berhasil dimusnahkan dari arsip!");
        } else {
          showAlert("KENDALA SISTEM", res.error || "Gagal menghapus warta.");
        }
      }
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="w-full max-w-md mx-auto my-12 p-8 rounded bg-gradient-to-b from-imperial-paper to-royal-dark border border-gold/30 shadow-2xl relative text-center">
        <ImperialCorners />
        
        <div className="mx-auto w-16 h-16 rounded-full border border-gold/45 flex items-center justify-center bg-royal-crimson/35 mb-4">
          <Lock className="w-8 h-8 text-gold-light" />
        </div>

        <h2 className="font-heading text-lg tracking-widest text-[#d4af37] mb-2 uppercase">GERBANG ADMINISTRATOR</h2>
        <p className="text-[11px] text-gold-light/60 max-w-sm mx-auto mb-6 leading-relaxed">
          Masukkan kata sandi untuk mengelola lembaran warta sejarah dan rubrik edukatif.
        </p>

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-gold-light/70 mb-1.5 font-mono">
              Kata Sandi Kerajaan
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Kata Sandi"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full text-xs bg-royal-dark border border-gold/25 focus:border-gold px-4 py-2.5 rounded text-gold-light placeholder-gold/30 focus:outline-none focus:ring-1 focus:ring-gold/30 font-mono"
                required
              />
              <KeyRound className="absolute right-3 top-3 w-4 h-4 text-gold/30" />
            </div>
          </div>

          {authError && (
            <div className="p-2.5 bg-royal-crimson/25 border border-royal-crimson rounded flex items-start gap-2 text-[11px] text-red-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gold-dark via-gold to-gold-dark text-royal-dark font-heading text-xs uppercase tracking-widest font-semibold hover:brightness-110 active:scale-[0.99] transition-all rounded shadow-md cursor-pointer"
          >
            <span>MASUK SESI</span>
            <Unlock className="w-4 h-4" />
          </button>
        </form>

        <ImperialDivider className="my-6 opacity-40" />

        <button
          onClick={onClose}
          className="text-[10px] text-gold/60 uppercase tracking-widest hover:text-gold transition font-mono"
        >
          Kembali ke Beranda Utama
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="relative w-full rounded bg-imperial-paper border border-gold/20 shadow-2xl p-6 md:p-8 min-h-[500px]" id="cote-admin-dashboard">
        <ImperialCorners />

      {/* Header Dashboard */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gold/10 pb-6 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ChevronLeft 
              onClick={onClose} 
              className="w-5 h-5 text-gold cursor-pointer hover:text-gold-light hover:scale-110 transition shrink-0" 
            />
            <h1 className="font-heading text-lg tracking-widest text-[#d4af37] uppercase">MAJLIS ARSIP (ADMIN PANEL)</h1>
          </div>
          <p className="text-[11px] text-gold-light/60 font-mono">
            Kelola lembaran warta, rubrik edukatif, dan informasi langsung.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="text-[11px] px-3.5 py-1.5 border border-gold/30 hover:border-gold hover:text-gold text-gold-light rounded transition bg-royal-dark font-mono uppercase"
          >
            Kembali Ke Utama
          </button>
        </div>
      </div>

      {/* Dashboard Grid & Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-3.5 bg-royal-dark/90 border border-gold/10 rounded flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-gold/5 flex items-center justify-center text-gold">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[9px] text-gold-light/50 font-mono uppercase">Total Warta</div>
            <div className="text-sm font-heading font-bold text-gold">{chronicles.length} Dokumen</div>
          </div>
        </div>

        <div className="p-3.5 bg-royal-dark/90 border border-gold/10 rounded flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-gold/5 flex items-center justify-center text-gold">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[9px] text-gold-light/50 font-mono uppercase">Kunjungan Warta</div>
            <div className="text-sm font-heading font-bold text-gold">
              {chronicles.reduce((acc, c) => acc + (c.views || 0), 0)} Kali Dibaca
            </div>
          </div>
        </div>

        <div className="p-3.5 bg-royal-dark/90 border border-gold/10 rounded flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-gold/5 flex items-center justify-center text-gold">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[9px] text-gold-light/50 font-mono uppercase font-bold">Autentikasi</div>
            <div className="text-xs text-gold font-mono uppercase">Proteksi Sandi Aktif</div>
          </div>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="flex border-b border-gold/10 mb-6 gap-2">
        <button
          onClick={() => setActiveTab("list")}
          className={`px-4 py-2 text-xs font-heading font-medium tracking-wider uppercase transition-colors relative cursor-pointer ${activeTab === "list" ? "text-gold border-b-2 border-gold" : "text-gold-light/55 hover:text-gold-light"}`}
        >
          Daftar Konten Warta
        </button>
        <button
          onClick={openCreateForm}
          className={`px-4 py-2 text-xs font-heading font-medium tracking-wider uppercase transition-colors relative cursor-pointer ${activeTab === "form" && !editingItem ? "text-gold border-b-2 border-gold" : "text-gold-light/55 hover:text-gold-light"}`}
        >
          <span className="flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" /> Tambah Warta Baru
          </span>
        </button>
      </div>

      {/* TAB 1: MANUSCRIPT LIST */}
      {activeTab === "list" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-xs tracking-wider text-gold-light font-medium uppercase">Lembaran Warta Terdaftar</h3>
            <button
              onClick={openCreateForm}
              className="flex items-center gap-1.5 px-3 py-1 bg-gold/10 hover:bg-gold/20 border border-gold/30 text-gold text-[10px] uppercase font-mono tracking-widest rounded transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Konten
            </button>
          </div>

          {chronicles.length === 0 ? (
            <div className="text-center py-12 bg-royal-dark/30 border border-gold/5 rounded flex flex-col items-center justify-center">
              <FileText className="w-12 h-12 text-gold/20 mb-3" />
              <p className="text-xs text-gold-light/60 font-sans">Belum ada konten warta yang tercetak.</p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-gold/10 rounded bg-royal-dark/20">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-royal-dark border-b border-gold/10 text-gold font-mono text-[10px] uppercase tracking-wider">
                    <th className="p-3">Judul & Ilustrasi</th>
                    <th className="p-3">Kategori</th>
                    <th className="p-3">Pencatat</th>
                    <th className="p-3 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold/5">
                  {chronicles.map((item) => (
                    <tr key={item.id} className="hover:bg-gold/5 transition-colors group">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded border border-gold/20 shrink-0 overflow-hidden relative flex items-center justify-center bg-royal-dark/95">
                            <span className="text-[10px] text-gold/30 select-none">⚜</span>
                            <img
                              src={item.image_url || "https://images.unsplash.com/photo-1599727497674-80dc02617a32?auto=format&fit=crop&q=80&w=200"}
                              alt={item.title}
                              className="absolute inset-0 w-full h-full object-cover z-10"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          </div>
                          <div className="min-w-0 max-w-[280px]">
                            <div className="flex items-center gap-1.5">
                              {item.is_pinned && <Pin className="w-3.5 h-3.5 text-gold self-center" />}
                              <span className="font-heading text-xs text-gold-light font-medium truncate uppercase block">{item.title}</span>
                            </div>
                            <span className="text-[10px] text-gold-light/40 block font-mono truncate">{item.excerpt}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 text-[9px] font-mono tracking-widest rounded-full border ${
                          item.category === 'Berita' ? 'border-sky-500/20 text-sky-400 bg-sky-500/5' :
                          item.category === 'Edukasi' ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' :
                          item.category === 'Informasi' ? 'border-amber-500/20 text-amber-400 bg-amber-500/5' :
                          'border-rose-500/20 text-rose-400 bg-rose-500/5'
                        }`}>
                          {item.category.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-[10px] text-gold-light/70">{item.author}</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditForm(item)}
                            className="p-1 px-2 border border-gold/20 hover:border-gold text-gold-light hover:text-gold rounded flex items-center gap-1 cursor-pointer transition text-[10px]"
                          >
                            <Edit className="w-3 h-3" /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1 px-2 border border-red-500/20 hover:border-red-500/60 text-red-400 hover:bg-red-500/5 rounded flex items-center gap-1 cursor-pointer transition text-[10px]"
                          >
                            <Trash2 className="w-3 h-3" /> Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Sandi update */}
          <div className="pt-6 border-t border-gold/10 mt-8">
            <h3 className="font-heading text-xs tracking-wider text-[#d4af37] mb-4 uppercase">PENGATURAN KUNCI SANDI</h3>
            
            <form onSubmit={handleChangePassword} className="max-w-xl p-5 bg-royal-dark/30 border border-gold/10 rounded space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-gold-light/70 mb-1.5 font-mono">Sandi Lama</label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Sandi Lama"
                    className="w-full text-xs bg-royal-dark border border-gold/20 focus:border-gold px-3 py-1.5 rounded text-gold-light font-mono focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-gold-light/70 mb-1.5 font-mono">Sandi Baru</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Sandi Baru"
                    className="w-full text-xs bg-royal-dark border border-gold/20 focus:border-gold px-3 py-1.5 rounded text-gold-light font-mono focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-gold-light/70 mb-1.5 font-mono">Konfirmasi Sandi</label>
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Ulangi Sandi"
                    className="w-full text-xs bg-royal-dark border border-gold/20 focus:border-gold px-3 py-1.5 rounded text-gold-light font-mono focus:outline-none"
                    required
                  />
                </div>
              </div>

              {pwdMessage && (
                <p className={`text-[11px] font-mono ${pwdMessage.isError ? "text-red-400" : "text-emerald-400"}`}>
                  {pwdMessage.isError ? "⚠ " : "✓ "} {pwdMessage.text}
                </p>
              )}

              <button
                type="submit"
                className="px-4 py-1.5 bg-gold/10 hover:bg-gold/20 border border-gold/40 hover:border-gold text-gold rounded font-mono text-[10px] tracking-widest uppercase transition-all cursor-pointer"
              >
                Ganti Sandi Panel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: WRITE / EDIT FORM */}
      {activeTab === "form" && (
        <form onSubmit={handleSubmitForm} className="space-y-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab("list")}
              className="p-1 cursor-pointer text-gold/70 hover:text-gold hover:scale-105 transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="font-heading text-xs tracking-widest text-[#d4af37] uppercase">
              {editingItem ? `Mengedit Warta: ${editingItem.title}` : "Menulis Warta Baru"}
            </h3>
          </div>

          {formError && (
            <div className="p-3 bg-royal-crimson/25 border border-royal-crimson rounded text-[11px] text-red-200">
              ⚠ {formError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4 md:col-span-1 bg-royal-dark/20 p-4 border border-gold/10 rounded">
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-gold-light/70 mb-1.5 font-mono">Kategori Rubrik</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as WartaCote["category"])}
                  className="w-full text-xs bg-royal-dark border border-gold/20 focus:border-gold p-2 text-gold-light font-mono focus:outline-none focus:ring-1 focus:ring-gold/30 rounded"
                >
                  <option value="Berita">BERITA (Warta Aktual)</option>
                  <option value="Edukasi">EDUKASI (Materi Edukasi)</option>
                  <option value="Informasi">INFORMASI (Komunitas)</option>
                  <option value="Arsip">ARSIP (Catatan Sejarah)</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-wider text-gold-light/70 mb-1.5 font-mono">Penerbit (Author)</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    placeholder="e.g. Admin, Grand Archivist"
                    className="w-full text-xs bg-royal-dark border border-gold/20 focus:border-gold px-3 py-1.5 pl-8 rounded text-gold-light focus:outline-none"
                    required
                  />
                  <User className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gold/30" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[9px] uppercase tracking-wider text-gold-light/70 font-mono">Ilustrasi (Sampul)</label>
                  <span className="text-[8px] text-gold-light/40 font-mono">PRESET</span>
                </div>
                
                <div className="relative mb-2">
                  <input
                    type="text"
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full text-xs bg-royal-dark border border-gold/20 focus:border-gold px-3 py-1.5 pl-8 text-gold-light rounded focus:outline-none font-mono"
                    required
                  />
                  <Image className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gold/30" />
                </div>

                <div className="space-y-1.5">
                  {UN_PRESETS.map((preset, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setFormImageUrl(preset.url)}
                      className={`w-full text-left text-[9px] font-mono p-1 px-2 border rounded hover:border-gold hover:text-gold-light truncate transition block cursor-pointer ${formImageUrl === preset.url ? "border-gold text-gold bg-gold/5" : "border-gold/10 text-gold-light/40"}`}
                    >
                      Preset: {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-gold/10">
                <input
                  type="checkbox"
                  id="is_pinned_cb"
                  checked={formIsPinned}
                  onChange={(e) => setFormIsPinned(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border border-gold/30 bg-royal-dark text-gold focus:ring-transparent accent-gold cursor-pointer"
                />
                <label htmlFor="is_pinned_cb" className="text-[10px] font-mono text-gold-light/80 uppercase tracking-wide cursor-pointer select-none flex items-center gap-1">
                  <Pin className="w-3.5 h-3.5 text-gold" /> Sematkan Di Beranda
                </label>
              </div>
            </div>

            <div className="space-y-4 md:col-span-2">
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-gold-light/70 mb-1.5 font-mono">Judul</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Tulis judul warta..."
                  className="w-full text-sm bg-royal-dark border border-gold/20 focus:border-gold px-3 py-2 text-gold font-heading tracking-wide rounded focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-wider text-gold-light/70 mb-1.5 font-mono">Intisari (Excerpt - Maks 200 karakter)</label>
                <textarea
                  rows={2}
                  value={formExcerpt}
                  onChange={(e) => setFormExcerpt(e.target.value)}
                  placeholder="Ringkasan atau gambaran isi warta..."
                  className="w-full text-xs bg-royal-dark border border-gold/20 focus:border-gold p-3 text-gold-light leading-relaxed rounded focus:outline-none"
                  maxLength={200}
                  required
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-wider text-gold-light/70 mb-1.5 font-mono">Isi Warta Lengkap</label>
                <textarea
                  rows={10}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Tuliskan berita, artikel, atau materi edukasi yang ingin dibagikan..."
                  className="w-full text-xs bg-royal-dark border border-gold/20 focus:border-gold p-4 text-gold-light leading-relaxed rounded focus:outline-none font-sans"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-gold/10">
            <button
              type="button"
              onClick={() => setActiveTab("list")}
              className="px-4 py-2 border border-gold/20 hover:border-gold text-gold-light rounded font-mono text-[10px] uppercase tracking-wider transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitLoading}
              className="flex items-center gap-1.5 px-6 py-2 bg-gradient-to-r from-gold-dark via-gold to-gold-dark text-royal-dark font-heading font-semibold text-[10px] tracking-widest uppercase rounded cursor-pointer hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
            >
              {isSubmitLoading ? "Menyimpan..." : "Simpan Warta"} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      )}
      </div>

      {/* CUSTOM CONFIRM DIALOG - ESTETIKA COTE */}
      {modalConfirm && modalConfirm.isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-royal-dark/90 backdrop-blur-md">
          <div className="relative w-full max-w-sm bg-[#efebd8] text-amber-950 rounded shadow-2xl p-6 border-8 border-double border-amber-900/15 overflow-hidden select-none animate-fade-in text-center">
            <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-amber-900/30" />
            <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-amber-900/30" />
            <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-amber-900/30" />
            <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-amber-900/30" />

            <div className="mx-auto w-12 h-12 rounded-full border border-amber-900/40 flex items-center justify-center bg-amber-900/5 mb-3 text-amber-900 animate-bounce">
              <AlertCircle className="w-6 h-6" />
            </div>

            <h3 className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-amber-950 mb-2">
              {modalConfirm.title}
            </h3>
            
            <p className="text-[11px] text-amber-900/90 mb-5 leading-relaxed font-sans px-2">
              {modalConfirm.message}
            </p>

            <div className="flex gap-2.5 items-center justify-center">
              <button
                onClick={() => setModalConfirm(null)}
                className="px-4 py-1.5 bg-amber-950/10 hover:bg-amber-950/25 text-amber-950 font-mono text-[9px] uppercase tracking-wider rounded transition cursor-pointer"
              >
                BATALKAN
              </button>
              <button
                onClick={() => {
                  const callback = modalConfirm.onConfirm;
                  setModalConfirm(null);
                  callback();
                }}
                className="px-5 py-1.5 bg-amber-900 hover:bg-amber-950 text-[#efebd8] font-mono text-[9px] uppercase tracking-wider rounded transition shadow cursor-pointer"
              >
                YA, HAPUSKAN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM ALERT DIALOG - ESTETIKA COTE */}
      {modalAlert && modalAlert.isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-royal-dark/90 backdrop-blur-md">
          <div className="relative w-full max-w-sm bg-[#efebd8] text-amber-950 rounded shadow-2xl p-6 border-8 border-double border-amber-900/15 overflow-hidden select-none animate-fade-in text-center">
            <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-amber-900/30" />
            <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-amber-900/30" />
            <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-amber-900/30" />
            <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-amber-900/30" />

            <div className="mx-auto w-12 h-12 rounded-full border border-amber-900/30 flex items-center justify-center bg-amber-900/5 mb-3 text-amber-900">
              <Plus className="w-5 h-5 rotate-45" />
            </div>

            <h3 className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-amber-950 mb-2">
              {modalAlert.title}
            </h3>

            <p className="text-[11px] text-amber-900/90 mb-5 leading-relaxed font-sans px-3">
              {modalAlert.message}
            </p>

            <button
              onClick={() => setModalAlert(null)}
              className="px-6 py-1.5 bg-amber-900 hover:bg-amber-950 text-[#efebd8] font-heading font-semibold text-[9px] tracking-widest uppercase rounded cursor-pointer transition shadow"
            >
              MENGERTI
            </button>
          </div>
        </div>
      )}
    </>
  );
};
