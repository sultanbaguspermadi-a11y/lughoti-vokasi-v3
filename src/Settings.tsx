import { ACCENTS, AR_FONTS, ID_FONTS, DEFAULTS, type Prefs } from './lib/core'

type P = { p: Prefs; set: (p: Prefs) => void }
const Range = ({ label, k, min, max, step, unit, p, set }: P & { label: string; k: keyof Prefs; min: number; max: number; step: number; unit: string }) => (
  <label className="row"><span>{label} <output>{String(p[k])}{unit}</output></span>
    <input type="range" min={min} max={max} step={step} value={p[k] as number} onChange={e => set({ ...p, [k]: +e.target.value })} /></label>
)
const Sel = ({ label, k, opts, p, set }: P & { label: string; k: 'arFont' | 'idFont'; opts: string[] }) => (
  <label className="row"><span>{label}</span>
    <select value={p[k]} onChange={e => set({ ...p, [k]: e.target.value })}>{opts.map(o => <option key={o}>{o}</option>)}</select></label>
)

export default function Settings({ p, set }: P) {
  return (
    <div className="settings">
      <section className="preview" aria-label="Pratinjau langsung">
        <div className="ar" lang="ar" dir="rtl">حَاسُوب مَحْمُول</div>
        <div className="mean">laptop</div><div className="sub">ḥāsūb maḥmūl · Komputer dan perangkat</div>
      </section>
      <fieldset><legend>Tampilan</legend>
        <div className="seg" role="group" aria-label="Tema">
          {(['system', 'light', 'dark'] as const).map(t => <button key={t} aria-pressed={p.theme === t} onClick={() => set({ ...p, theme: t })}>{{ system: 'Sistem', light: 'Terang', dark: 'Gelap' }[t]}</button>)}
        </div>
        <div className="swatches" role="group" aria-label="Warna aksen">
          {ACCENTS.map(([n, c]) => <button key={c} title={n} aria-label={n} aria-pressed={p.accent === c} style={{ background: c }} onClick={() => set({ ...p, accent: c })} />)}
        </div>
        <div className="seg" role="group" aria-label="Kepadatan kartu">
          <button aria-pressed={!p.compact} onClick={() => set({ ...p, compact: false })}>Nyaman</button>
          <button aria-pressed={p.compact} onClick={() => set({ ...p, compact: true })}>Ringkas</button>
        </div>
        <label className="check"><input type="checkbox" checked={p.calm} onChange={e => set({ ...p, calm: e.target.checked })} /> Kurangi animasi</label>
      </fieldset>
      <fieldset><legend>Huruf</legend>
        <Sel label="Font Arab" k="arFont" opts={Object.keys(AR_FONTS)} p={p} set={set} />
        <Sel label="Font Indonesia" k="idFont" opts={Object.keys(ID_FONTS)} p={p} set={set} />
        <Range label="Ukuran Arab" k="arSize" min={1.4} max={4} step={0.1} unit="rem" p={p} set={set} />
        <Range label="Ukuran terjemahan" k="idSize" min={0.85} max={1.7} step={0.05} unit="rem" p={p} set={set} />
        <Range label="Ukuran transliterasi & teks pendukung" k="subSize" min={0.7} max={1.3} step={0.05} unit="rem" p={p} set={set} />
        <Range label="Tinggi baris" k="lh" min={1.3} max={2.1} step={0.05} unit="" p={p} set={set} />
        <Range label="Lebar konten" k="width" min={720} max={1400} step={20} unit="px" p={p} set={set} />
      </fieldset>
      <button className="btn-ghost" onClick={() => set(DEFAULTS)}>Pulihkan pengaturan awal</button>
    </div>
  )
}
