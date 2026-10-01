import { createStore, del, get, keys, set } from 'idb-keyval'

const memory = new Map<string, unknown>()
let store: ReturnType<typeof createStore> | undefined
let broken = false

function getStore() {
  // Legacy database name kept on purpose so data saved under the old app name is not lost.
  if (!store) store = createStore('jaanu-setu', 'kv')
  return store
}

export async function kvGet<T>(key: string): Promise<T | undefined> {
  if (!broken) {
    try {
      return await get<T>(key, getStore())
    } catch {
      broken = true
    }
  }
  return memory.get(key) as T | undefined
}

export async function kvSet(key: string, value: unknown): Promise<void> {
  if (!broken) {
    try {
      await set(key, value, getStore())
      return
    } catch {
      broken = true
    }
  }
  memory.set(key, value)
}

export async function kvDel(key: string): Promise<void> {
  if (!broken) {
    try {
      await del(key, getStore())
      return
    } catch {
      broken = true
    }
  }
  memory.delete(key)
}

export async function kvKeys(): Promise<string[]> {
  if (!broken) {
    try {
      return (await keys(getStore())).map(String)
    } catch {
      broken = true
    }
  }
  return [...memory.keys()]
}

export function requestPersistence(): void {
  try {
    void navigator.storage?.persist?.()
  } catch {
    /* ignore */
  }
}
