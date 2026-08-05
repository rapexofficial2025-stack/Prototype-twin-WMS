import { initializeApp, getApps } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
}

export const isFirebaseConfigured = Boolean(config.databaseURL)

export const firebaseApp = isFirebaseConfigured ? (getApps()[0] ?? initializeApp(config)) : null
export const realtimeDb = firebaseApp ? getDatabase(firebaseApp) : null
