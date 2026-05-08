import React, { createContext, useContext, useMemo, useReducer } from 'react'
import { readJson, writeJson } from '../lib/storage'

const STORAGE_KEY = 'bakery_auth_v1'

type AuthState = {
  user: { name: string } | null
}

type AuthAction =
  | { type: 'login'; name: string }
  | { type: 'logout' }

function reduce(_state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'login':
      return { user: { name: action.name } }
    case 'logout':
      return { user: null }
  }
}

type AuthApi = {
  user: { name: string } | null
  isAuthed: boolean
  login: (name: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthApi | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reduce, undefined, () =>
    readJson<AuthState>(STORAGE_KEY, { user: null }),
  )

  React.useEffect(() => {
    writeJson(STORAGE_KEY, state)
  }, [state])

  const api = useMemo<AuthApi>(() => {
    return {
      user: state.user,
      isAuthed: state.user != null,
      login: (name) => dispatch({ type: 'login', name: name.trim() }),
      logout: () => dispatch({ type: 'logout' }),
    }
  }, [state.user])

  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

