import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import type { CartWithProduct } from '@/db/schema/carts'

export function CartSheet({
  btn,
  cartItems,
}: {
  btn: React.ReactElement
  cartItems?: CartWithProduct[]
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>{btn}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          {cartItems?.map((cart, index) => (
            <div
              key={cart.id || index}
              className="grid gap-3 bg-gray-300 rounded"
            >
              <img
                src={cart.productImage!}
                width={30}
                height={30}
                alt={cart.productImage!}
                className="object-cover h-10 w-10 rounded"
              />
              <h4>{cart.product.productName}</h4>
              <p>{cart.category}</p>

              <h4>{cart.quantity}</h4>
              <h4>{cart.basePrice}</h4>
              <h4>{cart.totalPrice}</h4>
            </div>
          ))}
        </div>
        <SheetFooter>
          <Button type="submit">Save changes</Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
