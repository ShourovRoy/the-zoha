import { Link } from '@tanstack/react-router'
import { Menu, ShoppingBasket } from 'lucide-react'
import { Button } from '../ui/button'

const AuthNav = () => {
  return (
    <nav className="h-12 bg-white border-b">
      <div className="container mx-auto h-full">
        <div className="flex items-center space-x-3 justify-between h-full">
          {/* left */}
          <div>
            <Link to="/">
              <h3>TheZoha</h3>
            </Link>
          </div>

          {/* right */}
          <div className="flex items-center space-x-6">
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
                className="hover:text-primary focus:text-primary "
                to="/auth/signup"
              >
                Signup
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="outline" size="icon">
                <ShoppingBasket />
              </Button>
              <Button variant="outline" size="icon">
                <Menu />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default AuthNav
