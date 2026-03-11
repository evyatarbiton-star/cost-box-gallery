import { Button } from 'glow-ds/components'

export function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-xl">
      <div className="max-w-md w-full flex flex-col gap-l">
        <h1 className="font-display font-medium text-[40px] leading-[48px]">
          Welcome to Glow
        </h1>
        <p className="font-default text-[16px] text-neutral-text-light">
          Start building your prototype. Edit this page or ask Claude Code
          to create new pages and flows using Glow DS components.
        </p>
        <div className="flex gap-s">
          <Button variant="primary" size="lg">
            Get Started
          </Button>
          <Button variant="secondary" size="lg">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  )
}
