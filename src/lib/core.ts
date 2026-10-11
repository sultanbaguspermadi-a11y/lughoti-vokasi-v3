import { useEffect, useState } from 'react'

/* ---------- storage (falls back to memory when localStorage is blocked) ---------- */
const mem = new Map<string, string>()
export function load<T>(k: string, d: T): T {
  try { const v = localStorage.getItem('lv:' + k); if (v != null) return JSON.parse(v) } catch { /* ignore */ }
  try { return mem.has(k) ? JSON.parse(mem.get(k)!) : d } catch { return d }
}
export function save(k: string, v: unknown) {
  const s = JSON.stringify(v); mem.set(k, s)
  try { localStorage.setItem('lv:' + k, s) } catch { /* storage unavailable: memory only */ }
}
export function usePersisted<T>(k: string, d: T) {
  const [v, set] = useState<T>(() => load(k, d))
  useEffect(() => save(k, v), [k, v])
  return [v, set] as const
}

/* ---------- data model ---------- */
export type Major = 'RPL' | 'TBKR' | 'Akuntansi' | 'TSM' | 'Umum'
export const MAJORS: { key: Major; full: string }[] = [
  { key: 'RPL', full: 'Software Engineering' },
  { key: 'TBKR', full: 'Automotive Body Repair' },
  { key: 'Akuntansi', full: 'Akuntansi' },
  { key: 'TSM', full: 'Motorcycle Engineering' },
  { key: 'Umum', full: 'Kosakata umum' },
]
export interface Word {
  id: string; major: Major; ar: string; tr: string; mean: string; topic: string; exAr: string; exId: string
  n: { ar: string; tr: string; mean: string; ex: string }
}
export interface Similar { a1: string; t1: string; m1: string; a2: string; t2: string; m2: string; tip: string; scope: string }

/* ---------- Arabic-aware normalisation (display text is never modified) ---------- */
const STRIP = /[\u064B-\u065F\u0670\u06D6-\u06ED\u0640\u0300-\u036f]/g
export const norm = (s: string) =>
  s.normalize('NFD').replace(STRIP, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/[’'‘ʿʾ`]/g, '').toLowerCase()

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')

/* Row format (words.json _meta.format): [arab, latin, arti, kategori, contoh_arab, contoh_indonesia].
   ID = "<jurusan>:<posisi baris>", stable because new entries are appended at the end of each list. */
export function parseDataset(raw: unknown) {
  const words: Word[] = []; const similar: Similar[] = []; let skipped = 0
  if (!raw || typeof raw !== 'object') throw new Error('Format words.json tidak dikenali (harus berupa objek).')
  const o = raw as Record<string, unknown>
  for (const { key } of MAJORS) {
    const list = o[key]; if (!Array.isArray(list)) continue
    list.forEach((r, i) => {
      if (!Array.isArray(r)) { skipped++; return }
      const [ar, tr, mean, topic, exAr, exId] = [0, 1, 2, 3, 4, 5].map(j => str(r[j]))
      if (!ar || !mean) { skipped++; return }
      words.push({ id: `${key}:${i}`, major: key, ar, tr, mean, topic, exAr, exId,
        n: { ar: norm(ar), tr: norm(tr), mean: norm(mean), ex: norm(exAr + ' ' + exId) } })
    })
  }
  if (Array.isArray(o.Mirip)) for (const r of o.Mirip) {
    if (Array.isArray(r) && r.length >= 7) { const [a1, t1, m1, a2, t2, m2, tip, scope] = r.map(str); similar.push({ a1, t1, m1, a2, t2, m2, tip, scope }) }
  }
  if (!words.length) throw new Error('Tidak ada entri kata yang valid di words.json.')
  return { words, similar, skipped }
}

/* ---------- search & ranking ---------- */
export interface Hit { w: Word; s: number }
export function search(words: Word[], q: string): Hit[] {
  const nq = norm(q).trim()
  if (!nq) return words.map(w => ({ w, s: 0 }))
  const out: Hit[] = []
  for (const w of words) {
    const { ar, mean, tr, ex } = w.n
    let s = ar === nq ? 100 : ar.startsWith(nq) ? 85 : ar.includes(nq) ? 65 : 0
    const m = mean === nq ? 95 : mean.split(/[\s/,()]+/).includes(nq) ? 80 : mean.startsWith(nq) ? 75 : mean.includes(nq) ? 55 : 0
    s = Math.max(s, m)
    if (!s && tr.includes(nq)) s = 40
    if (!s && ex.includes(nq)) s = 10
    if (s) out.push({ w, s })
  }
  return out.sort((a, b) => b.s - a.s) // stable: ties keep dataset order
}

/* Stable "daily word": hash of the local calendar date */
export function dailyWord(words: Word[]) {
  const d = new Date(); const k = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
  let h = 0; for (const c of k) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return words[h % words.length]
}

/* ---------- preferences ---------- */
export const ACCENTS = [['Zamrud', '#0B6B52'], ['Emas', '#A07A12'], ['Safir', '#2F5DA8'], ['Mawar', '#B23A5B'], ['Arang', '#3C4540']] as const
export const AR_FONTS: Record<string, string> = {
  Amiri: '"Amiri","Noto Naskh Arabic","Traditional Arabic",serif',
  'Noto Naskh': '"Noto Naskh Arabic","Amiri","Traditional Arabic",serif',
  Sistem: '"Geeza Pro","Segoe UI",Tahoma,"Noto Sans Arabic",sans-serif',
}
export const ID_FONTS: Record<string, string> = {
  'Plus Jakarta Sans': '"Plus Jakarta Sans",system-ui,-apple-system,"Segoe UI",sans-serif',
  'Source Serif': '"Source Serif 4",Georgia,"Times New Roman",serif',
  Sistem: 'system-ui,-apple-system,"Segoe UI",Roboto,sans-serif',
}
export const DEFAULTS = { theme: 'system' as 'system' | 'light' | 'dark', accent: '#0B6B52', arFont: 'Amiri', idFont: 'Plus Jakarta Sans',
  arSize: 2.4, idSize: 1.05, subSize: 0.85, lh: 1.6, width: 1100, compact: false, calm: false }
export type Prefs = typeof DEFAULTS

export const MCOLOR: Record<Major, string> = { RPL: '#1F7A8C', TBKR: '#C2791C', Akuntansi: '#8A4F7D', TSM: '#B4432E', Umum: '#0B6B52' }
