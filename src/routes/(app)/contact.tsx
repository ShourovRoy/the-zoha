import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/contact')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(app)/contact"!</div>
}
