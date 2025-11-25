const { execSync } = require('child_process')

console.log('🚀 Pokretam Next.js build za Netlify...')

try {
  console.log('🔨 Pokretam Next.js build...')
  execSync('npm run build', { stdio: 'inherit' })
  console.log('✅ Build uspješan!')
  console.log('🎉 Gotovo! Out direktorij je spreman za Netlify.')
} catch (error) {
  console.error('❌ Build neuspješan:', error.message)
  process.exit(1)
}
