import Link from "next/link"
import PageHero from "../components/PageHero"

export default function TonkinCareExclusions() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        {/* Hero Section */}
        <PageHero
          title="TonkinCare Exclusions"
          backgroundImage="https://cdn.dealertower.com/wp-content/uploads/sites/15/2025/12/05185041/imgi_34_Tonkincare-portland-oregon-3-o.jpg"
        />

        {/* Content Section */}
        <section className="py-12 md:py-16 lg:py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Excluded Makes */}
            <div className="mb-12">
              <h2 className="font-sans font-bold text-[#151B49] text-2xl md:text-3xl mb-6">Excluded Makes:</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  "Alfa Romeo",
                  "Aston Martin",
                  "Bentley",
                  "Ferrari",
                  "Fisker",
                  "Lamborghini",
                  "Lotus",
                  "Maserati",
                  "Maybach",
                  "McLaren",
                  "Rolls Royce",
                  "Tesla",
                ].map((make) => (
                  <div key={make} className="font-body text-gray-700 text-base py-2 px-4 bg-gray-50 rounded">
                    {make}
                  </div>
                ))}
              </div>
            </div>

            {/* Select Model Exclusions */}
            <div className="mb-12">
              <h2 className="font-sans font-bold text-[#151B49] text-2xl md:text-3xl mb-6">Select Model Exclusions:</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-body text-gray-700 text-base leading-relaxed">
                <div className="bg-gray-50 p-4 rounded">
                  <p className="font-semibold mb-2">Acura</p>
                  <p>NSX & NSX Hybrid</p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="font-semibold mb-2">Audi</p>
                  <p>R8 & RS E-Tron</p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="font-semibold mb-2">BMW</p>
                  <p>760Li (7 Series), Alpina B6 Grand Coupe, Alpina B7, Alpina XB7</p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="font-semibold mb-2">Cadillac</p>
                  <p>Escalade V</p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="font-semibold mb-2">Dodge</p>
                  <p>Demon</p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="font-semibold mb-2">Ford</p>
                  <p>GT</p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="font-semibold mb-2">Jaguar</p>
                  <p>XJR, XJL</p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="font-semibold mb-2">Lexus</p>
                  <p>LFA</p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="font-semibold mb-2">Mercedes-Benz</p>
                  <div className="space-y-1 mt-2">
                    <p>CL-Class: CL500, CL600, CL-63 AMG, CL-65 AMG</p>
                    <p>G-Class: G-55 AMG</p>
                    <p>S-Class: S600, S-63 AMG, S-65 AMG</p>
                    <p>SL-Class: SL-63 AMG, SL-65 AMG, McLaren, AMG</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="font-semibold mb-2">Nissan</p>
                  <p>GT-R</p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="font-semibold mb-2">Porsche</p>
                  <p>911 GT2, 911 GT3, 911 Turbo, 911 Speedster, Panamera Turbo, Taycan</p>
                </div>
              </div>
            </div>

            {/* Additional Exclusions */}
            <div className="mb-12">
              <h2 className="font-sans font-bold text-[#151B49] text-2xl md:text-3xl mb-6">Additional Exclusions:</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-body text-gray-700 text-base leading-relaxed">
                <div className="bg-gray-50 p-4 rounded">
                  <p>All EV Models</p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p>All Diesel Engines</p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p>Oversized Units (F-450, for example)</p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p>Vehicles with MSRP over $125,000</p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p>Vehicles not normally sold in the US market</p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="font-semibold">Additional exclusions may apply, see dealer for details</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center pt-8">
              <Link
                href="/tonkincare"
                className="cursor-pointer inline-block bg-[#72c6f5] text-white px-8 py-3 font-sans font-semibold text-base hover:bg-[#151B49] hover:shadow-md transition-all duration-200"
              >
                BACK TO TONKINCARE
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
