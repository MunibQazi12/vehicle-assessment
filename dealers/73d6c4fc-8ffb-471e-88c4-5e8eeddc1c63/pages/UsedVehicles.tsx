import Image from "next/image"
import Link from "next/link"

export default function UsedVehicles() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section with Background Image */}
      <section className="relative h-[400px] md:h-[500px] lg:h-[600px]">
        <Image
          src="/assets/images/imgi-38-in-car-with-dog.jpg"
          alt="Happy couple with dog in car"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 flex flex-col items-start justify-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <h1 className="font-sans font-bold text-white text-4xl md:text-5xl lg:text-6xl mb-4">Pre-Owned Vehicles</h1>
          <p className="font-body text-white text-lg md:text-xl lg:text-2xl">
            The largest selection of used cars for sale in Oregon
          </p>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-body text-gray-700 text-base md:text-lg leading-relaxed mb-8">
            Shopping for a used car can be overwhelming. From price to reliability and selection to safety, this sheer
            number of factors that determine your specific requirements make careful consideration paramount. At the
            Tonkin family of dealerships, we provide that unparalleled level of service. Our number one priority is to
            find you the perfect vehicle for your every need, and to ensure it falls within your budget. Visit any of
            our{" "}
            <Link href="/dealers" className="text-[#72c6f5] hover:text-[#151B49] font-semibold">
              18 Tonkin dealerships
            </Link>{" "}
            in the greater Portland metro area to discover the largest selection of used cars for sale in Oregon.
          </p>
          <Link
            href="/used-vehicles/"
            className="inline-block bg-[#72c6f5] text-white px-8 py-3 font-semibold hover:bg-[#151B49] transition-colors duration-300"
          >
            View our inventory
          </Link>
        </div>
      </section>

      {/* Care Before the Sale */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Image */}
            <div className="relative h-[300px] md:h-[400px] lg:h-[500px]">
              <Image
                src="/assets/images/imgi-39-woman-on-computer.jpg"
                alt="Woman shopping for cars online"
                fill
                className="object-cover"
              />
            </div>

            {/* Text Content */}
            <div className="bg-[#151B49] text-white p-8 md:p-10 lg:p-12">
              <h2 className="font-sans font-bold text-2xl md:text-3xl mb-6">Care before the sale</h2>
              <p className="font-body text-base md:text-lg leading-relaxed">
                Tonkin&apos;s simple and illuminating shopping experience begins before you even enter one of our
                dealerships. The Tonkin.com website, and its{" "}
                <Link href="/dealers" className="text-[#72c6f5] hover:text-white font-semibold underline">
                  dealership specific sites
                </Link>
                , are all designed to make finding your new or used vehicle a breeze. Shop by make, model or trim, or
                find your new ride by price, mileage or even by color.{" "}
                <Link href="/used-vehicles/" className="text-[#72c6f5] hover:text-white font-semibold underline">
                  View our inventory of used cars for sale in Oregon here.
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Care During the Sale */}
      <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Text Content */}
            <div className="order-2 lg:order-1 p-8 md:p-10 lg:p-12">
              <h2 className="font-sans font-bold text-[#151B49] text-2xl md:text-3xl mb-6">Care during the sale</h2>
              <p className="font-body text-gray-700 text-base md:text-lg leading-relaxed">
                When you purchase a used car from the Tonkin family of dealerships, you can be certain you&apos;re purchasing
                from experts. Our experienced staff of professionals, our dedicated sales staff takes pride in their
                knowledge of every car on the lot. What&apos;s more, their first concern is you and your family&apos;s
                satisfaction. This personal touch has been part of Tonkin&apos;s DNA since our inception, and continues to
                this day.
              </p>
            </div>

            {/* Image */}
            <div className="order-1 lg:order-2 relative h-[300px] md:h-[400px] lg:h-[500px]">
              <Image
                src="/assets/images/imgi-40-contact-tonkin-care-1.jpg"
                alt="Couple meeting with sales professional at dealership"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Care After the Sale */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Image */}
            <div className="relative h-[300px] md:h-[400px] lg:h-[500px]">
              <Image
                src="/assets/images/imgi-41-schedule-tech-visit.jpg"
                alt="Technicians working on vehicle maintenance"
                fill
                className="object-cover"
              />
            </div>

            {/* Text Content */}
            <div className="bg-[#151B49] text-white p-8 md:p-10 lg:p-12">
              <h2 className="font-sans font-bold text-2xl md:text-3xl mb-6">Care after the sale</h2>
              <p className="font-body text-base md:text-lg leading-relaxed">
                At Ron Tonkin family of dealerships, our service and care does not end after the purchase of a used car.
                Your relationship with us includes caring for your car for years to come with{" "}
                <Link href="/tonkincare" className="text-[#72c6f5] hover:text-white font-semibold underline">
                  TonkinCare
                </Link>
                , which includes two complimentary oil changes and 24-hour roadside assistance. So revel in the peace of
                mind that comes knowing you will be taken care of after your purchase.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
