import { useMemo } from 'react'

export default function Cover({ onStart, words }: { onStart: () => void; words: string[] }) {
  // Real vocabulary from the dataset drifts behind the title (decorative only)
  const rows = useMemo(() => [0, 1, 2].map(r => words.filter((_, i) => i % 3 === r).slice(0, 14)), [words])
  return (
    <main className="cover">
      <div className="blobs" aria-hidden />
      <div className="marq" aria-hidden>
        {rows.map((r, i) => r.length > 0 && <div key={i} className={'mrow' + (i === 1 ? ' rev' : '')}><div>{[...r, ...r].map((w, j) => <span key={j} lang="ar" dir="rtl">{w}</span>)}</div></div>)}
      </div>
      <p className="pill"><i />SMK Muhammadiyah Pencongan</p>
      <div className="cmid">
        <h1 className="giant" lang="ar" dir="rtl">لُغَتِي</h1>
        <h2>Lughati Vokasi</h2>
        <p>Kamus Digital Arab–Indonesia untuk Siswa SMK</p>
      </div>
      <div className="cbot">
        <button className="cta" onClick={onStart} autoFocus>Mulai Belajar <span aria-hidden>→</span></button>
        <small>Dibuat oleh Sultan Bagus Permadi</small>
      </div>
    </main>
  )
}
