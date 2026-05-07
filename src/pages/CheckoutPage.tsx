import { type ReactNode, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { productsById } from '../data/products'
import { formatMoney } from '../lib/money'
import { useCart } from '../state/cart'
import { useOrders } from '../state/orders'
import type { OrderType } from '../types'
import { Button } from '../ui/Button'

export function CheckoutPage() {
  const cart = useCart()
  const orders = useOrders()
  const navigate = useNavigate()

  const [type, setType] = useState<OrderType>('Pickup')
  const [customerName, setCustomerName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const resolved = useMemo(() => {
    return cart.lines.flatMap((l) => {
      const product = productsById.get(l.productId)
      if (!product) return []
      return [
        {
          product,
          qty: l.qty,
          lineTotalCents: product.priceCents * l.qty,
        },
      ]
    })
  }, [cart.lines])

  const subtotalCents = resolved.reduce((sum, r) => sum + r.lineTotalCents, 0)

  async function submit() {
    setError(null)
    if (resolved.length === 0) {
      setError('Your cart is empty.')
      return
    }

    const name = customerName.trim()
    const phoneTrim = phone.trim()
    const addr = address.trim()
    if (!name) return setError('Please enter your name.')
    if (!phoneTrim) return setError('Please enter a phone number.')
    if (type === 'Delivery' && !addr) return setError('Please enter a delivery address.')

    setSubmitting(true)
    try {
      const order = {
        id: crypto.randomUUID(),
        createdAtIso: new Date().toISOString(),
        type,
        customerName: name,
        phone: phoneTrim,
        address: type === 'Delivery' ? addr : undefined,
        notes: notes.trim() || undefined,
        lines: resolved.map((r) => ({
          productId: r.product.id,
          qty: r.qty,
          priceCents: r.product.priceCents,
        })),
        subtotalCents,
      }

      orders.addOrder(order)
      cart.clear()
      navigate('/orders', { replace: true })
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Link to="/cart" className="text-sm font-semibold text-slate-700 hover:text-slate-900">
          ← Back to cart
        </Link>
        <Link to="/menu" className="text-sm font-semibold text-slate-700 hover:text-slate-900">
          Browse menu
        </Link>
      </div>

      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Checkout</h1>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-3xl border border-black/5 bg-white/70 p-6 shadow-sm">
          <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Details</h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Order type">
              <select
                value={type}
                onChange={(e) => setType(e.target.value as OrderType)}
                className="w-full rounded-2xl bg-white/70 px-3 py-2 text-sm font-semibold text-slate-900 ring-1 ring-black/10 outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="Pickup">Pickup</option>
                <option value="Delivery">Delivery</option>
              </select>
            </Field>
            <Field label="Phone">
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +1 555 0123"
                className="w-full rounded-2xl bg-white/70 px-3 py-2 text-sm font-semibold text-slate-900 ring-1 ring-black/10 outline-none focus:ring-2 focus:ring-pink-500"
              />
            </Field>
            <Field label="Name">
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-2xl bg-white/70 px-3 py-2 text-sm font-semibold text-slate-900 ring-1 ring-black/10 outline-none focus:ring-2 focus:ring-pink-500"
              />
            </Field>

            <Field label="Notes (optional)">
              <input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Allergies, no nuts, extra warm…"
                className="w-full rounded-2xl bg-white/70 px-3 py-2 text-sm font-semibold text-slate-900 ring-1 ring-black/10 outline-none focus:ring-2 focus:ring-pink-500"
              />
            </Field>

            {type === 'Delivery' ? (
              <div className="sm:col-span-2">
                <Field label="Delivery address">
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    placeholder="Street, building, area, city…"
                    className="w-full resize-none rounded-2xl bg-white/70 px-3 py-2 text-sm font-semibold text-slate-900 ring-1 ring-black/10 outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </Field>
              </div>
            ) : null}
          </div>

          {error ? (
            <div className="mt-4 rounded-2xl bg-rose-600/10 px-4 py-3 text-sm font-semibold text-rose-700">
              {error}
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={submit} disabled={submitting}>
              {submitting ? 'Placing order…' : 'Place order'}
            </Button>
            <Link to="/orders">
              <Button variant="secondary">View orders</Button>
            </Link>
          </div>
        </section>

        <aside className="rounded-3xl border border-black/5 bg-white/70 p-6 shadow-sm h-fit">
          <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Order summary</h2>

          <div className="mt-4 space-y-3">
            {resolved.map((r) => (
              <div key={r.product.id} className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 truncate">
                    {r.product.emoji} {r.product.name}
                  </p>
                  <p className="text-sm text-slate-600">Qty {r.qty}</p>
                </div>
                <p className="text-sm font-extrabold tabular-nums text-slate-900">
                  {formatMoney(r.lineTotalCents)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 border-t border-black/5 pt-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-600">Subtotal</span>
            <span className="text-lg font-extrabold tabular-nums text-slate-900">
              {formatMoney(subtotalCents)}
            </span>
          </div>

          <p className="mt-3 text-xs text-slate-500">
            Demo only: no payments are processed.
          </p>
        </aside>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  )
}

