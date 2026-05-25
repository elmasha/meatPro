export default function ({ store, app, route, redirect }) {
  const publicRoutes = ['/', '/login', '/register', '/forgot-password']
  const isPublic = publicRoutes.includes(route.path)
  const isLoggedIn = app.$fire.auth.currentUser !== null

  // 1. Redirect AUTHENTICATED users away from login page
  if (isLoggedIn && route.path === '/login') {
    return redirect('/dashboard')
  }

  // 2. Redirect UNAUTHENTICATED users away from protected routes
  if (!isLoggedIn && !isPublic) {
    return redirect('/login')
  }

  // 3. (Optional) Redirect root to dashboard if logged in
  // Uncomment if you want "/" to act as dashboard when logged in
  // if (isLoggedIn && route.path === '/') {
  //   return redirect('/dashboard')
  // }
}