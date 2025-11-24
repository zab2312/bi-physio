const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const apiDir = path.join(__dirname, '..', 'app', 'api')
const tempApiDir = path.join(__dirname, '..', 'app', '_api_temp')

// Helper funkcija za kopiranje direktorija
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true })
  }
  const entries = fs.readdirSync(src, { withFileTypes: true })
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

console.log('🚀 Priprema za Netlify build...')

// Privremeno premjesti API direktorij (kopiraj i obriši)
if (fs.existsSync(apiDir)) {
  console.log('📦 Premještam API direktorij...')
  if (fs.existsSync(tempApiDir)) {
    fs.rmSync(tempApiDir, { recursive: true, force: true })
  }
  // Kopiraj direktorij
  copyDir(apiDir, tempApiDir)
  // Obriši originalni
  fs.rmSync(apiDir, { recursive: true, force: true })
  console.log('✅ API direktorij premješten')
}

try {
  console.log('🔨 Pokretam Next.js build...')
  execSync('npm run build', { stdio: 'inherit' })
  console.log('✅ Build uspješan!')
} catch (error) {
  console.error('❌ Build neuspješan:', error.message)
  process.exit(1)
} finally {
  // Vrati API direktorij
  if (fs.existsSync(tempApiDir)) {
    console.log('📦 Vraćam API direktorij...')
    if (fs.existsSync(apiDir)) {
      fs.rmSync(apiDir, { recursive: true, force: true })
    }
    // Kopiraj natrag
    copyDir(tempApiDir, apiDir)
    // Obriši privremeni
    fs.rmSync(tempApiDir, { recursive: true, force: true })
    console.log('✅ API direktorij vraćen')
  }
}

console.log('🎉 Gotovo! Out direktorij je spreman za Netlify.')

