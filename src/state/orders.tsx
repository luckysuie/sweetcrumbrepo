import React, { createContext, useContext, useMemo, useReducer } from 'react'
import type { Order } from '../types'
import { readJson, writeJson } from '../lib/storage'

const STORAGE_KEY = 'bakery_orders_v1'

type OrdersState = {
  orders: Order[]
}

type OrdersAction =
  | { type: 'add'; order: Order }
  | { type: 'clear' }

function reduce(state: OrdersState, action: OrdersAction): OrdersState {
  switch (action.type) {
    case 'add':
      return { orders: [action.order, ...state.orders].slice(0, 50) }
    case 'clear':
      return { orders: [] }
  }
}

type OrdersApi = {
  orders: Order[]
  addOrder: (order: Order) => void
  clearOrders: () => void
}

const OrdersContext = createContext<OrdersApi | null>(null)

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reduce, undefined, () =>
    readJson<OrdersState>(STORAGE_KEY, { orders: [] }),
  )

  React.useEffect(() => {
    writeJson(STORAGE_KEY, state)
  }, [state])

  const api = useMemo<OrdersApi>(
    () => ({
      orders: state.orders,
      addOrder: (order) => dispatch({ type: 'add', order }),
      clearOrders: () => dispatch({ type: 'clear' }),
    }),
    [state.orders],
  )

  return <OrdersContext.Provider value={api}>{children}</OrdersContext.Provider>
}

export function useOrders() {
  const ctx = useContext(OrdersContext)
  if (!ctx) throw new Error('useOrders must be used within OrdersProvider')
  return ctx
}

