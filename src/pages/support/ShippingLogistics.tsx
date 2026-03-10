import React from 'react';
import { FaGlobe, FaTruck, FaPlane, FaRoute, FaBox, FaMapMarkedAlt, FaCheckCircle, FaWarehouse, FaPallet, FaBuilding, FaTruckLoading } from 'react-icons/fa';
import { MdLocalShipping } from 'react-icons/md';

const BTN_GRAD = 'linear-gradient(to right, #FF6B3D, #FFB444)';

const ShippingLogistics: React.FC = () => {
  return (
    <div className="bg-white text-gray-900 pb-12 overflow-hidden">
      {/* ─── Hero ─── */}
      <section className="border-b border-gray-100 bg-white">
        <div className="container mx-auto px-6 py-8 md:py-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Overline label */}
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="h-px w-6 bg-gray-200" />
              <span className="text-xs font-semibold tracking-[0.18em] uppercase text-gray-400">
                Logistics Center
              </span>
              <span className="h-px w-6 bg-gray-200" />
            </div>

            <h1 className="text-3xl md:text-5xl font-semibold leading-tight tracking-tight text-gray-900 mb-4">
              Shipping &{' '}
              <span style={{ background: BTN_GRAD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Delivery
              </span>
            </h1>

            <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-lg mx-auto">
              Understand delivery options, timelines, and exactly how your bulk inventory is tracked.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 max-w-5xl relative z-20 pt-8 md:pt-10">
        {/* ─── Main Content Split (Timelines & Tracking) ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 mb-10">
          
          {/* Timelines: Typographic Layout (5 columns) */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Estimated Timelines</h2>
              <p className="text-gray-500 text-sm leading-relaxed">Delivery speeds vary based on your location and the selected shipping method.</p>
            </div>

            <div className="space-y-10 pl-5 border-l-2 border-orange-100">
              <div className="relative">
                <div className="absolute -left-[25px] top-1.5 w-3 h-3 rounded-full bg-[#FF6B3D] ring-4 ring-white shadow-sm" />
                <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-1">Domestic</h4>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter">3-7</span>
                  <span className="text-base font-bold text-gray-400">Days</span>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-[25px] top-1.5 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-white shadow-sm" />
                <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-1">International</h4>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter">7-14</span>
                  <span className="text-base font-bold text-gray-400">Days</span>
                </div>
                <div className="mt-3">
                  <span className="text-[10px] text-gray-500 font-semibold bg-gray-100 px-3 py-1.5 rounded-lg uppercase tracking-wider">Depending on customs</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tracking: Interactive-looking stepped node path (7 columns) */}
          <div className="lg:col-span-7 bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 md:p-10 relative group">
            {/* Background decorative grid */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50 rounded-tr-[2rem]" />
            
            <h2 className="text-2xl font-bold text-gray-900 mb-8 relative z-10">Tracking Process</h2>
            
            <div className="relative z-10 pl-2">
              {/* Connecting dashed line */}
              <div className="absolute left-8 top-8 bottom-8 w-px border-l-2 border-dashed border-gray-200" />

              <div className="space-y-8">
                
                <div className="flex items-start gap-6 group/step">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-gray-400 border-2 border-gray-100 relative z-10 group-hover/step:border-[#FF6B3D] group-hover/step:text-[#FF6B3D] transition-all duration-300 shadow-sm group-hover/step:shadow-md transform group-hover/step:scale-110 shrink-0">
                    <FaBox className="text-lg" />
                  </div>
                  <div className="pt-2">
                    <h3 className="font-bold text-gray-900 text-base mb-1">Order Ships</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">Your bulk items are palletized and dispatched from the seller's facility.</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group/step">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-gray-400 border-2 border-gray-100 relative z-10 group-hover/step:border-[#FF6B3D] group-hover/step:text-[#FF6B3D] transition-all duration-300 shadow-sm group-hover/step:shadow-md transform group-hover/step:scale-110 shrink-0">
                    <FaMapMarkedAlt className="text-lg" />
                  </div>
                  <div className="pt-2">
                    <h3 className="font-bold text-gray-900 text-base mb-1">Tracking Number</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">A unique tracking number is generated and attached to your order dashboard.</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group/step">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-gray-400 border-2 border-gray-100 relative z-10 group-hover/step:border-[#FF6B3D] group-hover/step:text-[#FF6B3D] transition-all duration-300 shadow-sm group-hover/step:shadow-md transform group-hover/step:scale-110 shrink-0">
                    <FaCheckCircle className="text-lg" />
                  </div>
                  <div className="pt-2">
                    <h3 className="font-bold text-gray-900 text-base mb-1">Real-Time Updates</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">Use the carrier's portal for live, up-to-the-minute geolocation and status updates.</p>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* ─── Freight & Bulk Shipments (Dark Premium Style) ─── */}
        <div className="relative mt-10 md:mt-12 bg-[#0A0A0A] rounded-[2.5rem] p-8 md:p-14 overflow-hidden shadow-2xl group border border-gray-900">
          {/* Ambient lighting */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#FF6B3D]/10 rounded-full blur-[100px] group-hover:bg-[#FF6B3D]/20 transition-all duration-700 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px] group-hover:bg-blue-500/20 transition-all duration-700 pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row gap-12 relative z-10">
            {/* Title Section */}
            <div className="lg:w-1/3 flex flex-col justify-center">
              <span className="inline-block px-4 py-1.5 bg-white/5 border border-white/10 text-gray-300 text-[10px] font-bold tracking-[0.2em] uppercase rounded-full w-max mb-6">
                Specialized Handling
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-[1.15] tracking-tight">
                Freight & <br className="hidden lg:block" /> Bulk Orders
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Expert logistics for large-scale B2B operations. From precise palletization to final dock delivery, we coordinate the heavy lifting.
              </p>
            </div>
            
            {/* Features List (Sleek Horizontal Rows) */}
            <div className="lg:w-2/3 flex flex-col gap-4">
              {[
                { icon: <FaPallet />, title: 'Freight Class & Palletization', desc: 'Classification completely determined by item size and volumetric weight to ensure perfectly safe transit.' },
                { icon: <FaBuilding />, title: 'Commercial Dock Appointments', desc: 'Secure reliable scheduling available seamlessly for standard commercial and industrial business addresses.' },
                { icon: <FaTruckLoading />, title: 'Specialized Delivery Services', desc: 'Liftgate requirements and inside-delivery unboxing options can be added easily before finalizing checkout.' }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 flex items-center justify-center text-[#FF6B3D] text-xl shrink-0 shadow-inner">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base md:text-lg mb-1.5">{item.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ShippingLogistics;