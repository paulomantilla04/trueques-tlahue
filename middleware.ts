import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {

  const { supabaseResponse, user } = await updateSession(request)

  const { pathname } = request.nextUrl

  const protectedRoutes = ['/profile', '/messages', '/dashboard', '/offers']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/signup')


  // Caso A: Usuario no registrado intentando acceder a una ruta protegida
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    
    url.searchParams.set('redirect_to', pathname) 
    
    return NextResponse.redirect(url)
  }

  // Caso B: Usuario que ya tiene sesión intentando ir al login o registro
  if (user && isAuthRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }


  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}