import axios from 'axios'

const API_BASE = process.env.API_URL || 'https://meatproserver-production-6328.up.railway.app/api'

export default async function ({ app, route, redirect }) {
  // Public routes — no check needed
  const publicRoutes = ['/','/dashboard',, '/login', '/register', '/setup', '/subscription']
  if (publicRoutes.includes(route.path)) return

  // Pro-only routes
  const proRoutes = ['/reports']
  const isProRoute = proRoutes.some(r => route.path.startsWith(r))
  if (!isProRoute) return

  try {
    const user = app.$fire.auth.currentUser
    if (!user) return redirect('/login')

    // Use native axios instead of $axios
    const { data } = await axios.get(`${API_BASE}/subscriptions/status`, {
      params: { firebase_uid: user.uid }
    })

    // Block if expired and not on starter
    if (!data.is_active && data.subscription?.plan_name !== 'starter') {
      return redirect('/subscription?expired=true')
    }
  } catch (e) {
    console.error('Subscription check failed', e.message)
    // Allow access on error (fail open) or redirect on error (fail closed)
    // return redirect('/subscription?error=true')
  }
}