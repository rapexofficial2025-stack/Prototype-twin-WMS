import { useRef, useState } from 'react'
import { Image, RotateCcw, Save } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { DEFAULT_BRANDING, useBranding } from '@/lib/branding'

export function SettingsPage() {
  const { logo, title, subtitle, setBranding, resetBranding } = useBranding()
  const [titleDraft, setTitleDraft] = useState(title)
  const [subtitleDraft, setSubtitleDraft] = useState(subtitle)
  const [logoDraft, setLogoDraft] = useState(logo)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const onLogoChange = (file: File | undefined) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setLogoDraft(reader.result as string)
    reader.readAsDataURL(file)
  }

  const onSave = () => setBranding({ logo: logoDraft, title: titleDraft, subtitle: subtitleDraft })

  const onReset = () => {
    resetBranding()
    setTitleDraft(DEFAULT_BRANDING.title)
    setSubtitleDraft(DEFAULT_BRANDING.subtitle)
    setLogoDraft(DEFAULT_BRANDING.logo)
  }

  return (
    <section>
      <div>
        <p className="eyebrow">Admin</p>
        <h1 className="page-title">Settings</h1>
        <p className="mt-2 text-sm text-slate-400">Branding shown across the sidebar and login screen.</p>
      </div>

      <Card className="mt-7 max-w-xl p-6">
        <h2 className="text-sm font-semibold text-slate-50">App Logo</h2>
        <div className="mt-3 flex items-center gap-4">
          <img src={logoDraft} alt="Logo preview" className="size-16 rounded-lg border border-slate-700 bg-slate-800 object-contain p-1" />
          <div>
            <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 rounded-lg border border-slate-600 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700">
              <Image className="size-4" />Upload logo
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => onLogoChange(e.target.files?.[0])} />
            <p className="mt-1 text-xs text-slate-500">PNG with transparent background recommended.</p>
          </div>
        </div>

        <h2 className="mt-6 text-sm font-semibold text-slate-50">App Title</h2>
        <input value={titleDraft} onChange={(e) => setTitleDraft(e.target.value)} className="mt-2 w-full rounded-lg border border-slate-600 px-3 py-2 text-sm outline-none focus:border-sky-400" placeholder="ANTARCTICA Cold Storage" />

        <h2 className="mt-4 text-sm font-semibold text-slate-50">Subtitle</h2>
        <input value={subtitleDraft} onChange={(e) => setSubtitleDraft(e.target.value)} className="mt-2 w-full rounded-lg border border-slate-600 px-3 py-2 text-sm outline-none focus:border-sky-400" placeholder="WMS BETA v1.0 Prototype Inventory System" />

        <div className="mt-6 flex gap-3">
          <button onClick={onSave} className="flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600">
            <Save className="size-4" />Save changes
          </button>
          <button onClick={onReset} className="flex items-center gap-2 rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700">
            <RotateCcw className="size-4" />Reset to default
          </button>
        </div>
      </Card>
    </section>
  )
}
