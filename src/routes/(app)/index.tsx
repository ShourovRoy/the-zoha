import { Button } from '@/components/ui/button'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/')({ component: App })

function App() {
  return (
    <>
      {/* hero section */}
      <section className="relative h-[60vh] w-full overflow-hidden bg-[url(/images/101748.jpeg)]">
        <div className="container mx-auto h-full">
          <div className="grid grid-cols-12 h-full">
            {/* left */}
            <div className="col-span-5 flex items-center h-full">
              <div className="py-4">
                <h4 className="text-base font-semibold">Big Fashion Sale</h4>
                <h1 className="text-5xl font-semibold py-3">
                  Limited Time Offer!
                  <br />
                  Up to <i className="text-primary">30%</i> OFF!
                </h1>
                <p className="text-lg">Redefine Your Everyday Skin</p>

                <div className="py-3">
                  <Link to="/shop/products">
                    <Button size="lg">View our collections</Button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-span-7"></div>
          </div>
        </div>
      </section>

      {/* best selling product categories */}
      <section className="py-4 bg-white">
        <div className="container mx-auto flex items-center space-x-4 justify-around">
          {Array.from({ length: 6 }, (_, index) => index + 1).map((number) => (
            <div
              key={number}
              className="h-20 w-20 bg-primary-400/25 rounded-full"
            ></div>
          ))}
        </div>
      </section>
    </>
  )
}
