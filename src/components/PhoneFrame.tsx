import type { ReactNode } from 'react'

/** Phone frame on desktop (so the demo reads as a mobile app), full screen on a real phone. */
export default function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full w-full items-center justify-center p-0 sm:p-8">
      <div
        className="
          app-surface relative h-[100dvh] w-full overflow-hidden text-ink
          sm:h-[820px] sm:w-[390px] sm:rounded-[3.2rem]
          sm:shadow-[0_0_0_11px_#ffffff,0_0_0_12px_#d9dfe8,0_60px_120px_-40px_rgba(16,40,90,0.45),0_24px_48px_-24px_rgba(16,40,90,0.25)]
        "
      >
        {/* dynamic island */}
        <div className="pointer-events-none absolute left-1/2 top-2.5 z-[70] hidden h-[26px] w-[100px] -translate-x-1/2 rounded-full bg-black sm:block" />
        <div className="relative h-full">{children}</div>
      </div>
    </div>
  )
}
