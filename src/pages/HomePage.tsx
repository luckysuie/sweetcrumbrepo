import { Link } from 'react-router-dom'
import { products } from '../data/products'
import { formatMoney } from '../lib/money'
import { Button } from '../ui/Button'
import { useCart } from '../state/cart'

export function HomePage() {
  const featured = products.filter((p) => p.isFeatured).slice(0, 4)
  const cart = useCart()

  return (
    <div className="space-y-10">
      <section className="rounded-3xl border border-black/5 bg-white/70 p-8 shadow-sm">
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-pink-500/10 px-3 py-1 text-sm font-semibold text-pink-700">
              <span>Fresh bakes</span>
              <span className="text-slate-400">•</span>
              <span>Ready in minutes</span>
            </p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Your neighborhood bakery, one click away.
            </h1>
            <p className="mt-3 max-w-prose text-slate-600">
              Browse today’s menu, add your favorites to cart, and place a pickup or delivery
              order. This demo stores orders locally in your browser.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/menu">
                <Button>Explore menu</Button>
              </Link>
              <Link to="/cart">
                <Button variant="secondary">View cart ({cart.totalItems})</Button>
              </Link>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-pink-500/15 via-yellow-400/10 to-white p-6">
            <div className="grid grid-cols-2 gap-3">
              <Kpi label="Baked today" value="11 items" />
              <Kpi label="Avg. prep time" value="15–25 min" />
              <Kpi label="Pickup window" value="9am–8pm" />
              <Kpi label="Delivery" value="In-city" />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Featured</h2>
            <p className="text-sm text-slate-600">Popular picks people reorder.</p>
          </div>
          <Link to="/menu" className="text-sm font-semibold text-slate-900 underline underline-offset-4">
            See full menu
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl border border-black/5 bg-white/70 p-4 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="text-3xl">{p.emoji}</div>
                <span className="rounded-full bg-black/5 px-2 py-1 text-xs font-semibold text-slate-700">
                  {p.category}
                </span>
              </div>
              <h3 className="mt-3 font-bold text-slate-900">{p.name}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-slate-600">{p.description}</p>
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-slate-900">
                  {formatMoney(p.priceCents)}
                </span>
                <Link to={`/p/${p.id}`}>
                  <Button variant="secondary" className="px-3 py-1.5">
                    View
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/60 p-4 ring-1 ring-black/5">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-extrabold tracking-tight text-slate-900">{value}</p>
    </div>
  )
}

