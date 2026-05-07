import { Link } from 'react-router-dom'
import { productsById } from '../data/products'
import { formatMoney } from '../lib/money'
import { useCart } from '../state/cart'
import { Button } from '../ui/Button'

export function CartPage() {
  const cart = useCart()

  const items = cart.lines.flatMap((l) => {
    const product = productsById.get(l.productId)
    if (!product) return []
    const lineTotalCents = product.priceCents * l.qty
    return [{ ...l, product, lineTotalCents }]
  })

  const subtotalCents = items.reduce((sum, i) => sum + i.lineTotalCents, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Cart</h1>
          <p className="mt-1 text-sm text-slate-600">
            Review quantities, then checkout.
          </p>
        </div>
        <Link to="/menu" className="text-sm font-semibold text-slate-700 hover:text-slate-900">
          + Add more items
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-black/5 bg-white/70 p-10 text-center">
          <p className="text-lg font-bold text-slate-900">Your cart is empty.</p>
          <p className="mt-2 text-slate-600">Pick something delicious from the menu.</p>
          <div className="mt-6">
            <Link to="/menu">
              <Button>Browse menu</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-3">
            {items.map((i) => (
              <div
                key={i.productId}
                className="rounded-3xl border border-black/5 bg-white/70 p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl leading-none">{i.product.emoji}</div>
                    <div>
                      <Link
                        to={`/p/${i.product.id}`}
                        className="font-extrabold tracking-tight text-slate-900 hover:underline hover:underline-offset-4"
                      >
                        {i.product.name}
                      </Link>
                      <p className="mt-1 text-sm text-slate-600">{i.product.description}</p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        {formatMoney(i.product.priceCents)} each
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="inline-flex items-center rounded-2xl bg-white/70 ring-1 ring-black/10">
                      <button
                        className="px-3 py-2 text-sm font-bold text-slate-700 hover:text-slate-900"
                        onClick={() => cart.setQty(i.productId, i.qty - 1)}
                        aria-label={`Decrease ${i.product.name}`}
                      >
                        −
                      </button>
                      <input
                        className="w-12 bg-transparent text-center text-sm font-bold tabular-nums text-slate-900 outline-none"
                        value={i.qty}
                        inputMode="numeric"
                        onChange={(e) => cart.setQty(i.productId, Number(e.target.value))}
                      />
                      <button
                        className="px-3 py-2 text-sm font-bold text-slate-700 hover:text-slate-900"
                        onClick={() => cart.setQty(i.productId, i.qty + 1)}
                        aria-label={`Increase ${i.product.name}`}
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Total
                      </p>
                      <p className="text-sm font-extrabold tabular-nums text-slate-900">
                        {formatMoney(i.lineTotalCents)}
                      </p>
                    </div>

                    <Button variant="ghost" onClick={() => cart.remove(i.productId)}>
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="rounded-3xl border border-black/5 bg-white/70 p-6 shadow-sm h-fit">
            <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Summary</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Items</span>
                <span className="font-semibold tabular-nums text-slate-900">
                  {cart.totalItems}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-extrabold tabular-nums text-slate-900">
                  {formatMoney(subtotalCents)}
                </span>
              </div>
              <p className="pt-3 text-xs text-slate-500">
                Taxes/delivery not calculated in this demo.
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <Link to="/checkout" className="block">
                <Button className="w-full">Checkout</Button>
              </Link>
              <Button variant="secondary" className="w-full" onClick={() => cart.clear()}>
                Clear cart
              </Button>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}

