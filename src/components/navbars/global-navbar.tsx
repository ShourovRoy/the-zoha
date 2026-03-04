import { Link } from '@tanstack/react-router'
import { Menu, ShoppingBasket, User2 } from 'lucide-react'
import { Button } from '../ui/button'
import type { SessionData } from '@/utils/session-utils'
import { useServerFn } from '@tanstack/react-start'
import { getCartItems } from '@/utils/cart-utils'
import { useQuery } from '@tanstack/react-query'
import { CartSheet } from '../cart/cart-sheet'
import type { CartWithProduct } from '@/db/schema'

const GlobalNavbar = ({ user }: { user: SessionData | null }) => {
  const cartItems = useServerFn(getCartItems)

  const { data, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: () =>
      cartItems({
        data: {
          userId: user?.userId || null,
        },
      }),
  })

  return (
    <nav className="h-12 bg-background border-b">
      <div className="container mx-auto h-full">
        <div className="flex items-center space-x-3 justify-between h-full">
          {/* left */}
          <div>
            <Link to="/admin">
              <h3>TheZoha</h3>
            </Link>
          </div>
          {/* middle */}
          <div className="lg:flex items-center space-x-4 hidden">
            <Link
              activeProps={{ className: 'text-primary' }}
              className="hover:text-primary focus:text-primary"
              to="/shop/products"
              search={{
                limit: 5,
                page: 1,
              }}
            >
              Shop
            </Link>
            <Link
              activeProps={{ className: 'text-primary' }}
              className="hover:text-primary focus:text-primary"
              to="/"
            >
              Categories
            </Link>
            <Link
              activeProps={{ className: 'text-primary' }}
              className="hover:text-primary focus:text-primary"
              to="/about"
            >
              About
            </Link>
            <Link
              activeProps={{ className: 'text-primary' }}
              className="hover:text-primary focus:text-primary"
              to="/contact"
            >
              Contact
            </Link>
          </div>
          {/* right */}
          <div className="flex items-center space-x-3">
            {user ? (
              <Button size="icon" variant="outline">
                <User2 />
              </Button>
            ) : (
              <div className="lg:flex items-center space-x-4 hidden">
                <Link
                  activeProps={{
                    className: 'text-primary',
                  }}
                  className="hover:text-primary focus:text-primary"
                  to="/auth/login"
                >
                  Login
                </Link>
                <Link
                  activeProps={{
                    className: 'text-primary',
                  }}
                  className="hover:text-primary focus:text-primary"
                  to="/auth/signup"
                >
                  Signup
                </Link>
              </div>
            )}

            <div className="flex items-center space-x-2 justify-between">
              <CartSheet
                btn={
                  <Button variant="outline" size="icon" className="relative">
                    <div className="absolute -top-1 -right-2 h-5 w-5 bg-primary text-white text-xs flex items-center justify-center rounded-full">
                      {isLoading ? 0 : data?.totalItems}
                    </div>

                    <ShoppingBasket />
                  </Button>
                }
                cartItems={data?.cartItems as CartWithProduct[]}
              />

              <Button className="block lg:hidden" variant="outline" size="icon">
                <Menu />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default GlobalNavbar
