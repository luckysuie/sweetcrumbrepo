import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { productsById } from '../data/products'
import { formatMoney } from '../lib/money'
import { useCart } from '../state/cart'
import { Button } from '../ui/Button'

export function ProductPage() {
  const { id } = useParams()
  const product = useMemo(() => (id ? productsById.get(id) : undefined), [id])
  const cart = useCart()
  const [qty, setQty] = useState(1)

  if (!product) {
    return (
      <div className="rounded-3xl border border-black/5 bg-white/70 p-8 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
          Product not found
        </h1>
        <p className="mt-2 text-slate-600">Try going back to the menu.</p>
        <div className="mt-5">
          <Link to="/menu">
            <Button variant="secondary">Back to menu</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Link to="/menu" className="text-sm font-semibold text-slate-700 hover:text-slate-900">
          ← Menu
        </Link>
        <Link to="/cart" className="text-sm font-semibold text-slate-700 hover:text-slate-900">
          Cart ({cart.totalItems})
        </Link>
      </div>

      <section className="rounded-3xl border border-black/5 bg-white/70 p-8 shadow-sm">
        <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-start">
          <div className="rounded-3xl bg-gradient-to-br from-pink-500/15 via-yellow-400/10 to-white p-8">
            <div className="text-7xl">{product.emoji}</div>
            <p className="mt-4 inline-flex items-center rounded-full bg-black/5 px-3 py-1 text-sm font-semibold text-slate-700">
              {product.category}
            </p>
          </div>

          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              {product.name}
            </h1>
            <p className="mt-2 text-slate-600">{product.description}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {product.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-pink-500/10 px-2 py-1 text-xs font-semibold text-pink-700"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="rounded-2xl bg-white/70 px-4 py-3 ring-1 ring-black/10">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Price
                </p>
                <p className="mt-1 text-xl font-extrabold tracking-tight text-slate-900">
                  {formatMoney(product.priceCents)}
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-2xl bg-white/70 p-2 ring-1 ring-black/10">
                <span className="pl-2 text-sm font-semibold text-slate-700">Qty</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={99}
                  value={qty}
                  onChange={(e) => setQty(clampQty(Number(e.target.value)))}
                  className="w-20 bg-transparent px-2 py-2 text-sm font-semibold text-slate-900 outline-none"
                />
              </div>

              <Button onClick={() => cart.add(product.id, qty)}>Add to cart</Button>
              <Link to="/checkout">
                <Button variant="secondary">Checkout</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function clampQty(qty: number) {
  if (!Number.isFinite(qty)) return 1
  return Math.max(1, Math.min(99, Math.trunc(qty)))
}

