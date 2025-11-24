// Helper za API pozive koji radi i lokalno i na Netlify
const getApiUrl = (path: string): string => {
  // Na Netlify, koristi Netlify Functions
  if (typeof window !== 'undefined') {
    // Client-side: koristi relativni path za Netlify Functions
    return `/api${path}`
  }
  // Server-side (ne bi trebalo biti potrebno za statički export)
  return `/api${path}`
}

export default getApiUrl

