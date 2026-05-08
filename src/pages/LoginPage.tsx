import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../ui/Button'
import { useAuth } from '../state/auth'

type LocationState = { from?: string } | null

export function LoginPage() {
  const auth = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [name, setName] = useState(auth.user?.name ?? '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const redirectTo = useMemo(() => {
    const state = location.state as LocationState
    return state?.from && state.from.startsWith('/') ? state.from : '/orders'
  }, [location.state])

  function submit() {
    setError(null)
    const n = name.trim()
    if (!n) return setError('Please enter a name.')
    if (!password.trim()) return setError('Please enter a password.')

    // Demo authentication: accept any non-empty password.
    auth.login(n)
    navigate(redirectTo, { replace: true })
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="rounded-3xl border border-black/5 bg-white/70 p-8 shadow-sm">
        <p className="text-sm font-semibold text-slate-600">Manager requested</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">Login</h1>
        <p className="mt-2 text-slate-600">
          This is a UI/demo login (no real backend). It unlocks Checkout and Orders.
        </p>

        <div className="mt-6 grid gap-4">
          <label className="block">
            <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Name
            </span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Lucky"
              className="mt-1 w-full rounded-2xl bg-white/70 px-3 py-2 text-sm font-semibold text-slate-900 ring-1 ring-black/10 outline-none focus:ring-2 focus:ring-pink-500"
            />
          </label>

          <label className="block">
            <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="any password (demo)"
              className="mt-1 w-full rounded-2xl bg-white/70 px-3 py-2 text-sm font-semibold text-slate-900 ring-1 ring-black/10 outline-none focus:ring-2 focus:ring-pink-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') submit()
              }}
            />
          </label>

          {error ? (
            <div className="rounded-2xl bg-rose-600/10 px-4 py-3 text-sm font-semibold text-rose-700">
              {error}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button onClick={submit}>Sign in</Button>
            <Link to="/menu">
              <Button variant="secondary">Back to menu</Button>
            </Link>
          </div>

          <p className="text-xs text-slate-500">
            Redirect after login: <span className="font-semibold">{redirectTo}</span>
          </p>
        </div>
      </div>
    </div>
  )
}

