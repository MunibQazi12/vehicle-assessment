import Link from "next/link"

export default function NotFound() {
  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-24 lg:py-32 text-center">
          {/* 404 Large Number */}
          <div className="mb-8">
            <h1 className="font-sans font-bold text-[120px] sm:text-[180px] lg:text-[240px] leading-none text-[#151B49] opacity-10">
              404
            </h1>
          </div>

          {/* Error Message */}
          <div className="mb-12 -mt-16 sm:-mt-24 lg:-mt-32">
            <h2 className="font-sans font-bold text-3xl sm:text-4xl lg:text-5xl text-[#151B49] mb-4">Page Not Found</h2>
            <p className="font-sans text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Sorry, we couldn&apos;t find the page you&apos;re looking for. The page may have been moved or no longer exists.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/"
              className="inline-block bg-[#151B49] text-white font-sans font-semibold px-8 py-4 hover:bg-[#72c6f5] transition-all duration-300 text-center min-w-[200px]"
            >
              Back to Homepage
            </Link>
            <Link
              href="/inventory"
              className="inline-block bg-[#72c6f5] text-white font-sans font-semibold px-8 py-4 hover:bg-[#151B49] transition-all duration-300 text-center min-w-[200px]"
            >
              View Inventory
            </Link>
          </div>

          {/* Decorative Element */}
          <div className="mt-16 lg:mt-24">
            <div className="inline-block w-24 h-1 bg-[#72c6f5] rounded-full"></div>
          </div>
        </div>
      </main>
    </>
  )
}
