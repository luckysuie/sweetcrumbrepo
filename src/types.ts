export type ProductCategory = 'Breads' | 'Cakes' | 'Pastries' | 'Cookies' | 'Drinks'

export type Product = {
  id: string
  name: string
  description: string
  category: ProductCategory
  tags: string[]
  priceCents: number
  emoji: string
  isFeatured?: boolean
}

export type CartLine = {
  productId: string
  qty: number
}

export type OrderType = 'Pickup' | 'Delivery'

export type Order = {
  id: string
  createdAtIso: string
  type: OrderType
  customerName: string
  phone: string
  address?: string
  notes?: string
  lines: Array<{ productId: string; qty: number; priceCents: number }>
  subtotalCents: number
}

