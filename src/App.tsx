import { Navigate, Route, Routes } from 'react-router-dom'
import { CartProvider } from './state/cart'
import { OrdersProvider } from './state/orders'
import { Shell } from './ui/Shell'
import { HomePage } from './pages/HomePage'
import { MenuPage } from './pages/MenuPage'
import { ProductPage } from './pages/ProductPage'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { OrdersPage } from './pages/OrdersPage'

export default function App() {
  return (
    <OrdersProvider>
      <CartProvider>
        <Shell>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/p/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Shell>
      </CartProvider>
    </OrdersProvider>
  )
}

