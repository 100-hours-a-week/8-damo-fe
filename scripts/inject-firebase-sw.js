import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const swPath = path.resolve(__dirname, '../public/sw.js')

if (!fs.existsSync(swPath)) {
  console.log('⏭️  sw.js 없음 (개발 환경 또는 serwist disabled), 주입 건너뜀')
  process.exit(0)
}

let content = fs.readFileSync(swPath, 'utf8')

content = content
  .replace('__FIREBASE_API_KEY__', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? '')
  .replace('__FIREBASE_AUTH_DOMAIN__', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '')
  .replace('__FIREBASE_PROJECT_ID__', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? '')
  .replace('__FIREBASE_STORAGE_BUCKET__', process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '')
  .replace('__FIREBASE_MESSAGING_SENDER_ID__', process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '')
  .replace(
    '__FIREBASE_APP_ID__',
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ??
      process.env.NEXT_PUBLIC_FIREBASE_APPID ??
      ''
  )

fs.writeFileSync(swPath, content)

console.log('✅ sw.js Firebase 설정 주입 완료')
