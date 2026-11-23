// Cloudflare Workers 1MiB bundle 限制：清空不兼容/未使用的依赖入口。
// src/index.js 已通过 setCustomLibs 注入 DOMPurify、nodemailer 的替代实现，
// 这些包在运行时不会被真正 require，因此可安全清空以减小 bundle 体积。
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.dirname(fileURLToPath(import.meta.url))
const targets = [
  'node_modules/jsdom/lib/api.js',
  'node_modules/nodemailer/lib/nodemailer.js',
  'node_modules/tencentcloud-sdk-nodejs/tencentcloud/index.js',
  'node_modules/tencentcloud-sdk-nodejs-tms/tencentcloud/index.js'
]

for (const rel of targets) {
  try {
    writeFileSync(path.join(root, rel), '', 'utf8')
    console.log('[slim] cleared ' + rel)
  } catch (e) {
    console.log('[slim] skipped (not found) ' + rel)
  }
}
