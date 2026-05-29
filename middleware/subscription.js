import axios from 'axios'

const API_BASE = 'https://meatproserver-production-6328.up.railway.app/api'

export default async function ({ app, route, redirect }) {
  // 1. Public routes - Anyone can access these
  const publicRoutes = ['/', '/login', '/register', '/forgot-password']
  if (publicRoutes.includes(route.path)) return

  // 2. Auth Check - Ensure user is logged in for everything else
  // This is usually handled by auth middleware, but we check here too for safety
  const user = app.$fire.auth.currentUser
  if (!user) return

  // 3. Setup & Subscription routes - Logged in users need these to get started
  const onboardingRoutes = ['/setup', '/subscription']
  if (onboardingRoutes.includes(route.path)) return

  // 4. Subscription Enforcement
  // We restrict Dashboard and Reports to PRO users only
  const restrictedRoutes = ['/dashboard', '/reports']
  const isRestricted = restrictedRoutes.some(r => route.path.startsWith(r))
  
  // If the user is trying to access a restricted route, check their status
  if (isRestricted) {
    try {
      const { data } = await axios.get(`${API_BASE}/subscriptions/status`, {
        params: { firebase_uid: user.uid }
      })

      // If not active, or not on a PRO plan, send them to the subscription page
      const planName = (data.subscription?.plan_name || '').toLowerCase()
      
      if (!data.is_active) {
        return redirect('/subscription?reason=expired')
      }
      
      if (planName !== 'pro') {
        return redirect('/subscription?reason=upgrade_required')
      }

    } catch (e) {
      console.error('Subscription check failed:', e.message)
      // On error, we usually allow access to avoid blocking users due to network issues
    }
  }
}
