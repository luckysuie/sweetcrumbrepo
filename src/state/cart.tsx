import React, { createContext, useContext, useMemo, useReducer } from 'react'
import type { CartLine } from '../types'
import { readJson, writeJson } from '../lib/storage'

const STORAGE_KEY = 'bakery_cart_v1'

type CartState = {
  lines: CartLine[]
}

type CartAction =
  | { type: 'add'; productId: string; qty?: number }
  | { type: 'setQty'; productId: string; qty: number }
  | { type: 'remove'; productId: string }
  | { type: 'clear' }

function reduce(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'add': {
      const qtyToAdd = action.qty ?? 1
      const existing = state.lines.find((l) => l.productId === action.productId)
      if (existing) {
        return {
          lines: state.lines.map((l) =>
            l.productId === action.productId
              ? { ...l, qty: clampQty(l.qty + qtyToAdd) }
              : l,
          ),
        }
      }
      return { lines: [...state.lines, { productId: action.productId, qty: clampQty(qtyToAdd) }] }
    }
    case 'setQty': {
      const qty = clampQty(action.qty)
      if (qty === 0) return { lines: state.lines.filter((l) => l.productId !== action.productId) }
      return {
        lines: state.lines.map((l) =>
          l.productId === action.productId ? { ...l, qty } : l,
        ),
      }
    }
    case 'remove':
      return { lines: state.lines.filter((l) => l.productId !== action.productId) }
    case 'clear':
      return { lines: [] }
  }
}

function clampQty(qty: number) {
  if (!Number.isFinite(qty)) return 1
  return Math.max(0, Math.min(99, Math.trunc(qty)))
}

type CartApi = {
  lines: CartLine[]
  totalItems: number
  add: (productId: string, qty?: number) => void
  setQty: (productId: string, qty: number) => void
  remove: (productId: string) => void
  clear: () => void
}

const CartContext = createContext<CartApi | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reduce, undefined, () =>
    readJson<CartState>(STORAGE_KEY, { lines: [] }),
  )

  React.useEffect(() => {
    writeJson(STORAGE_KEY, state)
  }, [state])

  const api = useMemo<CartApi>(() => {
    const totalItems = state.lines.reduce((sum, l) => sum + l.qty, 0)
    return {
      lines: state.lines,
      totalItems,
      add: (productId, qty) => dispatch({ type: 'add', productId, qty }),
      setQty: (productId, qty) => dispatch({ type: 'setQty', productId, qty }),
      remove: (productId) => dispatch({ type: 'remove', productId }),
      clear: () => dispatch({ type: 'clear' }),
    }
  }, [state.lines])

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

