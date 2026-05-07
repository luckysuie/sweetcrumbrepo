import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { categories, products } from '../data/products'
import { formatMoney } from '../lib/money'
import { useCart } from '../state/cart'
import { Button } from '../ui/Button'

export function MenuPage() {
  const cart = useCart()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string>('All')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter((p) => {
      const matchesCategory = category === 'All' ? true : p.category === category
      const matchesQuery =
        q.length === 0
          ? true
          : `${p.name} ${p.description} ${p.tags.join(' ')}`.toLowerCase().includes(q)
      return matchesCategory && matchesQuery
    })
  }, [query, category])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Menu</h1>
          <p className="mt-1 text-sm text-slate-600">
            Search, filter, and add items to your cart.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="flex items-center gap-2 rounded-2xl bg-white/70 p-2 ring-1 ring-black/5">
            <span className="pl-2 text-sm font-semibold text-slate-700">Search</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="croissant, sourdough, chocolate…"
              className="w-full bg-transparent px-2 py-2 text-sm outline-none placeholder:text-slate-400 sm:w-72"
            />
          </div>

          <div className="flex items-center gap-2 rounded-2xl bg-white/70 p-2 ring-1 ring-black/5">
            <span className="pl-2 text-sm font-semibold text-slate-700">Category</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-transparent px-2 py-2 text-sm font-semibold text-slate-900 outline-none"
            >
              <option value="All">All</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="rounded-3xl border border-black/5 bg-white/70 p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="text-4xl leading-none">{p.emoji}</div>
              <span className="rounded-full bg-black/5 px-2 py-1 text-xs font-semibold text-slate-700">
                {p.category}
              </span>
            </div>
            <h3 className="mt-3 text-lg font-extrabold tracking-tight text-slate-900">
              {p.name}
            </h3>
            <p className="mt-1 text-sm text-slate-600">{p.description}</p>

            <div className="mt-3 flex flex-wrap gap-2">
              {p.tags.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-pink-500/10 px-2 py-1 text-xs font-semibold text-pink-700"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-slate-900">
                {formatMoney(p.priceCents)}
              </span>
              <div className="flex items-center gap-2">
                <Link to={`/p/${p.id}`}>
                  <Button variant="ghost" className="px-3 py-1.5">
                    Details
                  </Button>
                </Link>
                <Button
                  onClick={() => cart.add(p.id, 1)}
                  className="px-3 py-1.5"
                  aria-label={`Add ${p.name} to cart`}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-black/5 bg-white/60 p-8 text-center text-slate-700">
          No items found. Try a different search or category.
        </div>
      ) : null}
    </div>
  )
}

