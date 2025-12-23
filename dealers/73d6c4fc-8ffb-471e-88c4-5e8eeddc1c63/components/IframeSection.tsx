/**
 * IframeSection - Server Component
 * Renders an iframe with configurable styling.
 * No client-side interactivity required.
 */

interface IframeSectionProps {
  src: string
  title: string
  height?: string
  backgroundColor?: "white" | "gray"
  fullViewport?: boolean
}

export default function IframeSection({
  src,
  title,
  height = "1900px",
  backgroundColor = "gray",
  fullViewport = false,
}: IframeSectionProps) {
  const bgClasses = {
    white: "bg-white",
    gray: "bg-gray-50",
  }

  if (fullViewport) {
    return (
      <iframe
        src={src}
        title={title}
        scrolling="yes"
        // @ts-expect-error - seamless is a valid HTML attribute
        seamless="seamless"
        className="w-full border-0"
        style={{
          width: "100vw",
          height: "calc(100vh - var(--headerHeight, 80px))",
        }}
      />
    )
  }

  return (
    <section className={`py-12 ${bgClasses[backgroundColor]}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <iframe src={src} width="100%" height={height} className="w-full border-0" title={title} loading="lazy" />
        </div>
      </div>
    </section>
  )
}
