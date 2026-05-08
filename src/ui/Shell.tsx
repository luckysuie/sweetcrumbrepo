import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../state/auth'
import { useCart } from '../state/cart'
import { Button } from './Button'

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ')
}

export function Shell({ children }: { children: React.ReactNode }) {
  const cart = useCart()
  const auth = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="sticky top-0 z-20 border-b border-black/5 bg-white/70 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-pink-500 text-white">
              🍞
            </span>
            <span className="text-slate-900">SweetCrumb</span>
          </Link>

          <nav className="ml-auto flex items-center gap-1 text-sm">
            <NavItem to="/menu">Menu</NavItem>
            <NavItem to="/orders">Orders</NavItem>
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                cx(
                  'ml-1 inline-flex items-center gap-2 rounded-xl px-3 py-2 font-medium transition',
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'bg-white/60 text-slate-900 hover:bg-white',
                )
              }
            >
              <span>Cart</span>
              <span className="inline-flex min-w-7 justify-center rounded-lg bg-black/5 px-2 py-0.5 text-xs tabular-nums">
                {cart.totalItems}
              </span>
            </NavLink>

            {auth.isAuthed ? (
              <div className="ml-2 flex items-center gap-2">
                <span className="hidden sm:inline text-xs font-semibold text-slate-600">
                  Hi, {auth.user?.name}
                </span>
                <Button
                  variant="ghost"
                  className="px-3 py-2 text-sm"
                  onClick={() => {
                    auth.logout()
                    navigate('/menu')
                  }}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <NavItem to="/login">Login</NavItem>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>

      <footer className="border-t border-black/5 bg-white/50">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-slate-600 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Baked fresh daily. Built as a demo app—orders are stored locally in your browser.
          </p>
          <p className="text-slate-500">
            <a
              className="underline underline-offset-4 hover:text-slate-700"
              href="https://vite.dev/"
              target="_blank"
              rel="noreferrer"
            >
              Vite
            </a>{' '}
            + React + Tailwind
          </p>
        </div>
      </footer>
    </div>
  )
}

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cx(
          'inline-flex items-center rounded-xl px-3 py-2 font-medium transition',
          isActive ? 'text-slate-900' : 'text-slate-600 hover:text-slate-900',
        )
      }
    >
      {children}
    </NavLink>
  )
}

