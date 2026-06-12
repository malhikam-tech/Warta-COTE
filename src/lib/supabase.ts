/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from "@supabase/supabase-js";
import { WartaCote } from "../types";

// User-provided credentials
const SUPABASE_URL = "https://sydzbocajflmlnfhdupc.supabase.co";
const SUPABASE_KEY = "sb_publishable_bDjjInm8PRHA81YfMjdfTw_hT_vVecQ";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Default initial mock/demo chronicles matching the majestic imperial theme
export const DEFAULT_CHRONICLES: WartaCote[] = [
  {
    id: "cote-1",
    title: "Dekrit Kaisar: Hari Jadi ke-5 Chronicles Of The Empire",
    category: "Informasi",
    excerpt: "Sebuah perayaan megah akan diselenggarakan di Aula Utama Korps Kekaisaran untuk memperingati lima tahun kejayaan komunitas.",
    content: "Salam sejahtera bagi seluruh warga Kekaisaran. Atas perintah Dewan Mahkota, dengan ini diumumkan bahwa perayaan Hari Jadi ke-5 CHRONICLES OF THE EMPIRE (COTE) akan diselenggarakan dalam formasi parade akbar secara virtual. Semua fraksi diimbau menggunakan lencana emas dan seragam dinasti masing-masing. Bersiaplah untuk menorehkan sejarah baru dalam epik panjang perjuangan kita di dunia klasik.",
    image_url: "https://images.unsplash.com/photo-1599727497674-80dc02617a32?auto=format&fit=crop&q=80&w=800",
    author: "Grand Archivist",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    views: 142,
    is_pinned: true,
  },
  {
    id: "cote-2",
    title: "Materi Edukasi: Strategi Kepemimpinan Militer Romawi Kuno",
    category: "Edukasi",
    excerpt: "Pelajari bagaimana taktik disiplin legiuner dan formasi kura-kura (testudo) memenangkan pertempuran legendaris di Eropa.",
    content: "Di dalam bab edukasi komparatif militer klasik ini, kita membedah taktik Romawi Kuno yang menginspirasi struktur pertahanan COTE. Kedisiplinan adalah pilar utama. Strategi 'Testudo' (perisai kura-kura) menunjukkan bagaimana kerja sama mutlak antar prajurit dapat menciptakan benteng berjalan yang kebal terhadap panah hujan musuh. Taktik ini mengajari kita bahwa ego harus tunduk di bawah keselamatan legiun.",
    image_url: "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&q=80&w=800",
    author: "High Scholar",
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
    views: 389,
    is_pinned: false,
  },
  {
    id: "cote-3",
    title: "Warta Hubungan Luar Negeri: Perjanjian Damai Aliansi Utara",
    category: "Berita",
    excerpt: "COTE resmi menandatangani pakta non-agresi dengan Dinasti Nusantara bagian timur guna kelestarian arsip sejarah bersama.",
    content: "Setelah negosiasi diplomatik yang panjang di meja emas kekaisaran, kedua belah pihak sepakat menjaga netralitas arsip bersejarah. Perjanjian ini menjamin akses bebas ilmu pengetahuan bagi sejarawan dari kedua kubu. Ini merupakan langkah besar dalam menjaga keseimbangan kekuasaan dan memperluas cakrawala pendidikan budaya klasik bagi seluruh anggota.",
    image_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
    author: "Chamberlain",
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(), // 2 days ago
    views: 215,
    is_pinned: false,
  },
  {
    id: "cote-4",
    title: "Arsip Kronologi: Jatuhnya Konstantinopel dan Refleksinya bagi Dunia Modern",
    category: "Arsip",
    excerpt: "Ulasan mendalam mengenai rincian taktik pengepungan tahun 1453 dan bagaimana meriam raksasa mengubah seni bertahan selamanya.",
    content: "Penjelajahan sejarah klasik kali ini menyoroti runtuhnya tembok legendaris Theodosian. Penggunaan meriam Basilika yang dirancang oleh insinyur Orban menjadi garis demarkasi runtuhnya era kastil abad pertengahan dan dimulainya era senjata api modern. Memahami sejarah ini memberi inspirasi bagi strategi adaptasi pertahanan digital komunitas kita dalam menghadapi badai modernisasi.",
    image_url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=800",
    author: "Grand Archivist",
    created_at: new Date(Date.now() - 3600000 * 72).toISOString(), // 3 days ago
    views: 521,
    is_pinned: false,
  },
];

// Clear old cache storage keys to prevent conflicts
try {
  localStorage.removeItem("cote_chronicles_fallback");
  localStorage.removeItem("cote_deleted_ids");
} catch (e) {
  // Ignore
}

const PWD_KEY = "cote_admin_password_hash_v2";

/**
 * Gets admin password. Default is "COTE 2026"
 */
export function getAdminPassword(): string {
  const custom = localStorage.getItem(PWD_KEY);
  return custom || "COTE 2026";
}

/**
 * Saves a new admin password
 */
export function setAdminPassword(newPassword: string): void {
  localStorage.setItem(PWD_KEY, newPassword);
}

// SQL Schema code to be shown in the UI
export const SQL_SCHEMA_BLUEPRINT = `-- EKSEKUSI DI SUPABASE SQL EDITOR UNTUK AKSI REAL-TIME:

-- Create Table for Warta COTE content
CREATE TABLE IF NOT EXISTS warta_cote (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Berita', 'Edukasi', 'Informasi', 'Arsip')),
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  author TEXT NOT NULL DEFAULT 'Archivist',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  views INTEGER DEFAULT 0 NOT NULL,
  is_pinned BOOLEAN DEFAULT false NOT NULL
);

-- Enable Row Level Security (RLS) for anonymous reading and admin writing
ALTER TABLE warta_cote ENABLE ROW LEVEL SECURITY;

-- Policy: Allow everyone (anonymous & authenticated) to read articles
CREATE POLICY "Allow public read access" 
ON warta_cote 
FOR SELECT 
USING (true);

-- Policy: Allow all operations (inserts, updates, deletes) with public API matches 
-- Because we manage authentication directly cleanly inside the Admin portal password,
-- we can enable full insert/update/delete permissions for demonstration.
-- (Or you can use a service role key for stricter rules).
CREATE POLICY "Allow public full access" 
ON warta_cote 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Seed Initial High-Quality Classic Chronicles
INSERT INTO warta_cote (title, category, excerpt, content, image_url, author, views, is_pinned) 
VALUES 
('Dekrit Kaisar: Hari Jadi ke-5 Chronicles Of The Empire', 'Informasi', 'Sebuah perayaan megah akan diselenggarakan di Aula Utama Korps Kekaisaran untuk memperingati lima tahun kejayaan komunitas.', 'Salam sejahtera bagi seluruh warga Kekaisaran. Atas perintah Dewan Mahkota, dengan ini diumumkan bahwa perayaan Hari Jadi ke-5 CHRONICLES OF THE EMPIRE (COTE) akan diselenggarakan dalam formasi parade akbar secara virtual. Semua fraksi diimbau menggunakan lencana emas dan seragam dinasti masing-masing. Bersiaplah untuk menorehkan sejarah baru dalam epik panjang perjuangan kita di dunia klasik.', 'https://images.unsplash.com/photo-1599727497674-80dc02617a32?auto=format&fit=crop&q=80&w=800', 'Grand Archivist', 142, true),
('Materi Edukasi: Strategi Kepemimpinan Militer Romawi Kuno', 'Edukasi', 'Pelajari bagaimana taktik disiplin legiuner dan formasi kura-kura (testudo) memenangkan pertempuran legendaris di Eropa.', 'Di dalam bab edukasi komparatif militer klasik ini, kita membedah taktik Romawi Kuno yang menginspirasi struktur pertahanan COTE. Kedisiplinan adalah pilar utama. Strategi ''Testudo'' (perisai kura-kura) menunjukkan bagaimana kerja sama mutlak antar prajurit dapat menciptakan benteng berjalan yang kebal terhadap panah hujan musuh. Taktik ini mengajari kita bahwa ego harus tunduk di bawah keselamatan legiun.', 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&q=80&w=800', 'High Scholar', 389, false),
('Warta Hubungan Luar Negeri: Perjanjian Damai Aliansi Utara', 'Berita', 'COTE resmi menandatangani pakta non-agresi dengan Dinasti Nusantara bagian timur guna kelestarian arsip sejarah bersama.', 'Setelah negosiasi diplomatik yang panjang di meja emas kekaisaran, kedua belah pihak sepakat menjaga netralitas arsip bersejarah. Perjanjian ini menjamin akses bebas ilmu pengetahuan bagi sejarawan dari kedua kubu. Ini merupakan langkah besar dalam menjaga keseimbangan kekuasaan dan memperluas cakrawala pendidikan budaya klasik bagi seluruh anggota.', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800', 'Chamberlain', 215, false);
`;

// Keep track of deleted Supabase IDs (no longer needed, we keep clean direct operation)
/**
 * Initialize / fetch content
 */
export async function fetchChronicles(): Promise<{ data: WartaCote[]; fromDb: boolean; error?: string }> {
  try {
    // Try to reach Supabase
    const { data, error } = await supabase
      .from("warta_cote")
      .select("*")
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase select error:", error);
      return { 
        data: [], 
        fromDb: false, 
        error: `Supabase Error: ${error.message} (Kode: ${error.code || "N/A"}). Silakan pastikan tabel dan kebijakan RLS telah dibuat menggunakan perintah SQL Blueprint.` 
      };
    }

    return { data: (data || []) as WartaCote[], fromDb: true };
  } catch (err: any) {
    console.error("Supabase endpoint unreachable:", err);
    return { data: [], fromDb: false, error: `Koneksi Gagal: ${err.message || err}` };
  }
}

/**
 * Handle adding a chronicle
 */
export async function insertChronicle(item: Omit<WartaCote, "id" | "views">): Promise<{ success: boolean; data?: WartaCote; error?: string }> {
  try {
    // Remove id from the spread to avoid inserting undefined or null primary keys
    const { id: _, ...cleanItem } = item as any;
    const newItem = {
      ...cleanItem,
      views: 0
    };

    // Try Supabase first
    const { data, error } = await supabase
      .from("warta_cote")
      .insert([newItem])
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      return { 
        success: false, 
        error: `Supabase inserter gagal: ${error.message} (Kode: ${error.code || "N/A"}). Pastikan tabel dan kebijakan RLS sudah dibuat.` 
      };
    }

    if (data && data[0]) {
      return { success: true, data: data[0] as WartaCote };
    }
    
    return { success: false, error: "Database tidak mengembalisi nilai atau baris kosong." };
  } catch (err: any) {
    console.error("Supabase catch error during insert:", err);
    return { success: false, error: `Koneksi Gagal: ${err.message || err}` };
  }
}

/**
 * Handle updating a chronicle
 */
export async function updateChronicle(id: string, updates: Partial<WartaCote>): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from("warta_cote")
      .update(updates)
      .eq("id", id);
    
    if (error) {
      console.error("Supabase update error:", error);
      return { success: false, error: `Supabase Error: ${error.message} (Kode: ${error.code || "N/A"})` };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Supabase update exception:", err);
    return { success: false, error: `Koneksi Gagal: ${err.message || err}` };
  }
}

/**
 * Delete a chronicle
 */
export async function deleteChronicle(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from("warta_cote")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Supabase delete error:", error);
      return { success: false, error: `Supabase Error: ${error.message} (Kode: ${error.code || "N/A"})` };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Supabase delete exception:", err);
    return { success: false, error: `Koneksi Gagal: ${err.message || err}` };
  }
}

/**
 * Increments page views
 */
export async function incrementViews(item: WartaCote): Promise<void> {
  const newViews = (item.views || 0) + 1;
  try {
    const { error } = await supabase
      .from("warta_cote")
      .update({ views: newViews })
      .eq("id", item.id);
    if (error) {
      console.error("Supabase view increment fail:", error);
    }
  } catch (err) {
    console.error("Supabase view increment exception:", err);
  }
}

