import { Construction } from 'lucide-react'
import { Card } from '@/components/ui/card'
export function FeaturePlaceholderPage({ feature }: { feature: string }) {
  const label = feature === 'qrcenter' ? 'QR Center' : feature === 'putaway' ? 'Put-Away' : feature[0].toUpperCase() + feature.slice(1)
  return <><div><p className="eyebrow">FROST WMS</p><h1 className="page-title">{label}</h1></div><Card className="mt-8 flex min-h-72 flex-col items-center justify-center text-center"><Construction className="mb-4 size-10 text-blue-600" /><h2 className="text-lg font-semibold text-slate-900">Module foundation ready</h2><p className="mt-2 text-sm text-slate-500">This workspace is ready for the {label} workflow.</p></Card></>
}
