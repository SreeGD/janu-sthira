import { useRef, useState } from 'react'
import { disclaimer } from '../content/safety'
import { Page, Section, WarningBanner } from '../components/ui'
import { useSettings } from '../hooks/useSettings'
import { backupFileName, exportBackup, importBackup, importMerge, previewMerge, type ImportSummary } from '../storage/backup'

export default function Settings() {
  const { settings, update, reload } = useSettings()
  const [msg, setMsg] = useState('')
  const [pending, setPending] = useState<{ json: string; summary: ImportSummary } | null>(null)
  const [mode, setMode] = useState<'merge' | 'replace'>('merge')
  const [confirmReplace, setConfirmReplace] = useState(false)
  const [pasteOpen, setPasteOpen] = useState(false)
  const [pasted, setPasted] = useState('')
  const file = useRef<HTMLInputElement>(null)

  const makeJson = async () => JSON.stringify(await exportBackup(), null, 2)

  async function saveFile() {
    const json = await makeJson()
    const blob = new Blob([json], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = backupFileName()
    a.click()
    URL.revokeObjectURL(a.href)
    await reload()
    setMsg('Backup file downloaded. Move it to your other device (AirDrop, WhatsApp, email, cloud drive).')
  }

  async function shareFile() {
    const json = await makeJson()
    const f = new File([json], backupFileName(), { type: 'application/json' })
    try {
      if (navigator.canShare?.({ files: [f] })) {
        await navigator.share({ files: [f], title: 'Jānu Setu backup' })
        await reload()
        setMsg('Shared.')
        return
      }
    } catch (e) {
      if ((e as Error).name === 'AbortError') return
    }
    await saveFile()
  }

  async function copyText() {
    try {
      await navigator.clipboard.writeText(await makeJson())
      await reload()
      setMsg('Backup text copied. On the other device use "Paste backup text".')
    } catch {
      setMsg('Could not copy. Use "Save backup file" instead.')
    }
  }

  async function stage(json: string) {
    try {
      const summary = await previewMerge(json)
      setPending({ json, summary })
      setMode('merge')
      setConfirmReplace(false)
      setMsg('')
    } catch (e) {
      setPending(null)
      setMsg(`Import failed: ${(e as Error).message}`)
    }
  }

  async function apply() {
    if (!pending) return
    try {
      if (mode === 'merge') {
        const s = await importMerge(pending.json)
        setMsg(`Merged: ${s.daysNew} new and ${s.daysMerged} combined days, ${s.weeksChanged} weekly reviews. Nothing on this device was deleted.`)
      } else {
        const n = await importBackup(pending.json)
        setMsg(`Replaced this device's data with ${n} days from the file.`)
      }
      await reload()
      setPending(null)
      setPasted('')
      setPasteOpen(false)
    } catch (e) {
      setMsg(`Import failed: ${(e as Error).message}`)
    }
  }

  const s = pending?.summary

  return (
    <Page title="Settings and backup">
      <Section title="Theme">
        <select aria-label="Theme" value={settings.theme} onChange={(e) => update({ theme: e.target.value as 'system' | 'light' | 'dark' })}>
          <option value="system">Match system</option><option value="light">Light</option><option value="dark">Dark</option>
        </select>
      </Section>
      <Section title="Walk target">
        <p className="muted mb-2 text-sm">Current target {settings.walkTarget} min. Grows by 5 min after a calm morning, up to the maximum.</p>
        <label className="block text-sm font-semibold">Current target (min)
          <input type="number" min={settings.walkMin} max={settings.walkMax} value={settings.walkTarget} onChange={(e) => update({ walkTarget: Math.min(settings.walkMax, Math.max(settings.walkMin, Number(e.target.value) || settings.walkMin)) })} />
        </label>
      </Section>

      <Section title="Move to another device">
        <p className="muted mb-2 text-sm">Your data lives only on this device and is never uploaded. To use the tracker on a phone and a laptop, export here and import there. Importing merges by default, so it never wipes the other device.{settings.backupLastAt ? ` Last export: ${settings.backupLastAt.slice(0, 10)}.` : ' No export yet.'}</p>

        <h3 className="mt-2 text-sm font-bold">1. Export from this device</h3>
        <div className="mt-1 flex flex-wrap gap-2">
          <button type="button" className="btn btn-primary flex-1" onClick={shareFile}>Share backup file</button>
          <button type="button" className="btn flex-1" onClick={saveFile}>Save file</button>
          <button type="button" className="btn flex-1" onClick={copyText}>Copy as text</button>
        </div>

        <h3 className="mt-4 text-sm font-bold">2. Import on the other device</h3>
        <div className="mt-1 flex gap-2">
          <button type="button" className="btn flex-1" onClick={() => file.current?.click()}>Choose backup file</button>
          <button type="button" className="btn flex-1" aria-expanded={pasteOpen} onClick={() => setPasteOpen((o) => !o)}>Paste backup text</button>
        </div>
        <input ref={file} type="file" accept="application/json,.json" hidden onChange={async (e) => { const f = e.target.files?.[0]; if (f) await stage(await f.text()); e.target.value = '' }} />
        {pasteOpen && (
          <div className="mt-2 flex flex-col gap-2">
            <textarea rows={4} aria-label="Backup text" placeholder="Paste the backup text here" value={pasted} onChange={(e) => setPasted(e.target.value)} />
            <button type="button" className="btn" disabled={!pasted.trim()} onClick={() => stage(pasted)}>Check backup text</button>
          </div>
        )}

        {s && (
          <div className="panel-soft mt-3 text-sm" role="region" aria-label="Import preview">
            <div className="font-bold">Backup from {s.exportedAt.slice(0, 10)}</div>
            <ul className="mt-1 list-disc pl-5">
              <li>{s.daysInFile} days in the file: {s.daysNew} new to this device, {s.daysMerged} that would be combined with this device's entry, {s.daysSame} with nothing new to add.</li>
              <li>{s.weeksInFile} weekly reviews ({s.weeksChanged} would be added or updated).</li>
              <li>Settings: {s.settingsFromFile ? 'the file was used more recently, so its walk target and start date are used' : 'this device was used more recently, so its walk target and start date are kept'}; notes, shopping ticks and supplement choices are combined.</li>
            </ul>
            <fieldset className="mt-3">
              <legend className="font-semibold">How to import</legend>
              <label className="flex items-start gap-2 py-1"><input type="radio" name="mode" className="mt-1 h-5 w-5" checked={mode === 'merge'} onChange={() => { setMode('merge'); setConfirmReplace(false) }} /><span><strong>Merge (recommended)</strong>: combine both devices. Ticks, meals and notes from both are kept, nothing is overwritten or deleted.</span></label>
              <label className="flex items-start gap-2 py-1"><input type="radio" name="mode" className="mt-1 h-5 w-5" checked={mode === 'replace'} onChange={() => setMode('replace')} /><span><strong>Replace everything</strong>: erase this device's data and use the file.</span></label>
            </fieldset>
            {mode === 'replace' && (
              <div className="mt-2">
                <WarningBanner level="warn">This deletes everything currently on this device. Export first if you are not sure.</WarningBanner>
                <label className="mt-2 flex items-center gap-2"><input type="checkbox" className="h-5 w-5" checked={confirmReplace} onChange={(e) => setConfirmReplace(e.target.checked)} />I understand, replace this device's data</label>
              </div>
            )}
            <div className="mt-3 flex gap-2">
              <button type="button" className="btn btn-primary flex-1" disabled={mode === 'replace' && !confirmReplace} onClick={apply}>{mode === 'merge' ? 'Merge into this device' : 'Replace this device'}</button>
              <button type="button" className="btn flex-1" onClick={() => setPending(null)}>Cancel</button>
            </div>
          </div>
        )}
        {msg && <p role="status" className="mt-3 text-sm">{msg}</p>}
        <p className="muted mt-3 text-xs">Tip: the file contains your health notes. Send it only to yourself, and delete it from chats and downloads afterwards.</p>
      </Section>
      <p className="muted text-sm">{disclaimer}</p>
    </Page>
  )
}
