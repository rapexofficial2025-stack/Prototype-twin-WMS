import { useSyncExternalStore } from 'react'
import { ledgerEntries as seedEntries } from '@/features/inventory/services/inventory.mock'
import type { LedgerEntry } from '@/features/inventory/types'

// A tiny reactive store so Withdrawal search and the Ledger's "edit pallet"
// screen see the same live numbers, without a backend. Corrections and
// withdrawals both APPEND a new entry rather than mutating history, so the
// ledger stays an audit trail — a tag's current state is always derived by
// summing its entries, never edited in place.
let entries: LedgerEntry[] = [...seedEntries]
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((listener) => listener())

export function useLedgerEntries(): LedgerEntry[] {
  return useSyncExternalStore(
    (listener) => { listeners.add(listener); return () => listeners.delete(listener) },
    () => entries,
  )
}

export interface TagSnapshot {
  tagNo: string
  itemName: string
  batch: string
  location: string
  customerName: string
  quantity: number
  avgWeight: number
  productionDate: string
  expirationDate: string
}

export function deriveTags(list: LedgerEntry[]): TagSnapshot[] {
  const byTag = new Map<string, TagSnapshot>()
  for (const entry of list) {
    const current = byTag.get(entry.tagNo)
    const quantity = (current?.quantity ?? 0) + entry.quantity
    byTag.set(entry.tagNo, {
      tagNo: entry.tagNo, itemName: entry.itemDescription, batch: entry.batch, location: entry.location,
      customerName: entry.customerName, quantity, avgWeight: entry.avgWeight,
      productionDate: entry.productionDate, expirationDate: entry.expirationDate,
    })
  }
  return Array.from(byTag.values())
}

export function useTags(): TagSnapshot[] {
  return deriveTags(useLedgerEntries())
}

let nextId = seedEntries.length + 1

function append(entry: Omit<LedgerEntry, 'id' | 'date' | 'runningBalance'>) {
  const previousBalance = [...entries].reverse().find((e) => e.tagNo === entry.tagNo)?.runningBalance ?? 0
  entries = [
    { ...entry, id: `LED-${nextId++}`, date: new Date().toISOString().slice(0, 10), runningBalance: previousBalance + entry.quantity },
    ...entries,
  ]
  emit()
}

export function withdrawTag(tag: TagSnapshot, quantity: number) {
  append({
    documentNo: `OUT-${Date.now().toString().slice(-6)}`, type: 'withdrawal', batch: tag.batch, tagNo: tag.tagNo,
    location: tag.location, itemDescription: tag.itemName, quantity: -quantity, packing: 'Box', avgWeight: tag.avgWeight,
    weight: -quantity * tag.avgWeight, productionDate: tag.productionDate, expirationDate: tag.expirationDate, customerName: tag.customerName,
  })
}

export function reverseWithdrawal(tag: TagSnapshot, quantity: number) {
  append({
    documentNo: `REV-${Date.now().toString().slice(-6)}`, type: 'adjustment', batch: tag.batch, tagNo: tag.tagNo,
    location: tag.location, itemDescription: tag.itemName, quantity, packing: 'Box', avgWeight: tag.avgWeight,
    weight: quantity * tag.avgWeight, productionDate: tag.productionDate, expirationDate: tag.expirationDate, customerName: tag.customerName,
  })
}

export function correctTag(tag: TagSnapshot, changes: { quantity?: number; location?: string }) {
  const newQuantity = changes.quantity ?? tag.quantity
  const delta = newQuantity - tag.quantity
  append({
    documentNo: `ADJ-${Date.now().toString().slice(-6)}`, type: 'adjustment', batch: tag.batch, tagNo: tag.tagNo,
    location: changes.location ?? tag.location, itemDescription: tag.itemName, quantity: delta, packing: 'Box',
    avgWeight: tag.avgWeight, weight: delta * tag.avgWeight, productionDate: tag.productionDate,
    expirationDate: tag.expirationDate, customerName: tag.customerName,
  })
}
