/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface WartaCote {
  id: string; // UUID or local ID
  title: string;
  category: "Berita" | "Edukasi" | "Informasi" | "Arsip";
  excerpt: string;
  content: string;
  image_url: string;
  author: string;
  created_at: string;
  views: number;
  is_pinned?: boolean;
}

export interface AdminSettings {
  admin_password_hash: string; // We'll store standard or hashed, default is 'COTE 2026'
  empire_motto: string;
  empire_era: string;
}

export interface EpicQuote {
  id: number;
  text: string;
  author: string;
}
