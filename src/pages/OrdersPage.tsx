import { Link } from 'react-router-dom'
import { productsById } from '../data/products'
import { formatMoney } from '../lib/money'
import { useOrders } from '../state/orders'
import { Button } from '../ui/Button'

export function OrdersPage() {
  const { orders, clearOrders } = useOrders()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Orders</h1>
          <p className="mt-1 text-sm text-slate-600">
            Stored locally on this device/browser.
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/menu">
            <Button variant="secondary">Order more</Button>
          </Link>
          <Button variant="ghost" onClick={clearOrders} disabled={orders.length === 0}>
            Clear history
          </Button>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-3xl border border-black/5 bg-white/70 p-10 text-center">
          <p className="text-lg font-bold text-slate-900">No orders yet.</p>
          <p className="mt-2 text-slate-600">Place an order and it’ll show up here.</p>
          <div className="mt-6">
            <Link to="/menu">
              <Button>Browse menu</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div
              key={o.id}
              className="rounded-3xl border border-black/5 bg-white/70 p-6 shadow-sm"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    {new Date(o.createdAtIso).toLocaleString()}
                  </p>
                  <p className="mt-1 text-lg font-extrabold tracking-tight text-slate-900">
                    {o.type} • {o.customerName}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">{o.phone}</p>
                  {o.address ? (
                    <p className="mt-1 text-sm text-slate-600">{o.address}</p>
                  ) : null}
                  {o.notes ? (
                    <p className="mt-2 text-sm text-slate-600">
                      <span className="font-semibold text-slate-700">Notes:</span> {o.notes}
                    </p>
                  ) : null}
                </div>

                <div className="rounded-2xl bg-white/70 px-4 py-3 ring-1 ring-black/10">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Subtotal
                  </p>
                  <p className="mt-1 text-xl font-extrabold tabular-nums tracking-tight text-slate-900">
                    {formatMoney(o.subtotalCents)}
                  </p>
                </div>
              </div>

              <div className="mt-4 border-t border-black/5 pt-4">
                <ul className="space-y-2">
                  {o.lines.map((l, idx) => {
                    const p = productsById.get(l.productId)
                    return (
                      <li key={`${o.id}-${idx}`} className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-900">
                            {p ? `${p.emoji} ${p.name}` : l.productId}
                          </p>
                          <p className="text-sm text-slate-600">Qty {l.qty}</p>
                        </div>
                        <p className="text-sm font-extrabold tabular-nums text-slate-900">
                          {formatMoney(l.priceCents * l.qty)}
                        </p>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

