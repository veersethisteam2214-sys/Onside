import type { ReactNode } from 'react'

/**
 * Phone frame on desktop, full screen on a real phone. Holds the soft sky backdrop
 * the glass surfaces refract, and the SVG lens filter used by `.liquid`.
 */
export default function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-full w-full flex items-center justify-center p-0 sm:p-8">
      <svg aria-hidden className="absolute h-0 w-0">
        <filter id="liquid-lens" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.009 0.013" numOctaves="2" seed="11" result="noise" />
          <feGaussianBlur in="noise" stdDeviation="2.5" result="soft" />
          <feDisplacementMap in="SourceGraphic" in2="soft" scale="36" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <div
        className="
          relative w-full sm:w-[390px] h-[100dvh] sm:h-[800px] overflow-hidden text-ink backdrop
          sm:rounded-[3rem]
          sm:shadow-[0_0_0_10px_#fbfcfe,0_0_0_11px_rgba(20,50,110,0.10),0_50px_100px_-30px_rgba(30,60,130,0.45),0_20px_40px_-20px_rgba(30,60,130,0.25)]
        "
      >
        {/* drifting sky light the glass sits on */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="orb orb-a h-72 w-72 -left-20 -top-10 bg-[#9cc9ff]" />
          <div className="orb orb-b h-80 w-80 -right-28 top-60 bg-[#c3bbff]" />
          <div className="orb orb-c h-64 w-64 left-6 bottom-[-50px] bg-[#9ee7ff]" />
        </div>
        <div className="relative h-full">{children}</div>
      </div>
    </div>
  )
}
