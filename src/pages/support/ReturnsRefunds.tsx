import React from 'react';
import { FaCheckCircle, FaBan, FaBoxOpen, FaCamera, FaEdit } from 'react-icons/fa';
import { MdAccessTimeFilled } from 'react-icons/md';

const BTN_GRAD = 'linear-gradient(to right, #FF6B3D, #FFB444)';

const ReturnsRefunds: React.FC = () => {
  return (
    <div className="bg-white text-gray-900">
      {/* ─── Hero ─── */}
      <section className="border-b border-gray-100 bg-white">
        <div className="container mx-auto px-6 py-10 md:py-12">
          <div className="max-w-3xl mx-auto text-center">
            {/* Overline label */}
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="h-px w-6 bg-gray-200" />
              <span className="text-xs font-semibold tracking-[0.18em] uppercase text-gray-400">
                Support Center
              </span>
              <span className="h-px w-6 bg-gray-200" />
            </div>

            <h1 className="text-3xl md:text-5xl font-semibold leading-tight tracking-tight text-gray-900 mb-4">
              Returns &{' '}
              <span style={{ background: BTN_GRAD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Refunds
              </span>
            </h1>

            <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-lg mx-auto">
              Learn about eligibility, process, and refund timelines.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Content Sections ─── */}
      <section className="py-10 md:py-12 bg-gray-50">
        <div className="container mx-auto px-6 max-w-5xl">
          
          {/* ─── Policy Guidelines (Eligibility & Timing) ─── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Eligibility Block */}
            <div className="relative bg-gradient-to-br from-orange-50/80 to-white p-8 md:p-10 rounded-[2rem] border border-orange-100/50 shadow-sm overflow-hidden group hover:shadow-md transition-shadow duration-300">
              {/* Decorative Background Icon */}
              <FaCheckCircle className="absolute -right-8 -bottom-8 text-[140px] text-orange-500/5 transform transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[#FF6B3D] shadow-[0_4px_12px_-4px_rgba(255,107,61,0.2)] border border-orange-50">
                    <FaCheckCircle className="text-xl" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Eligibility</h2>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed max-w-[90%] md:max-w-[85%] mt-auto">
                  New/unused items and DOA cases may qualify within <strong className="text-gray-900">7 days of delivery</strong>. See product page for specifics.
                </p>
              </div>
            </div>

            {/* Refund Timing Block */}
            <div className="relative bg-gradient-to-br from-blue-50/80 to-white p-8 md:p-10 rounded-[2rem] border border-blue-100/50 shadow-sm overflow-hidden group hover:shadow-md transition-shadow duration-300">
              {/* Decorative Background Icon */}
              <MdAccessTimeFilled className="absolute -right-6 -bottom-6 text-[150px] text-blue-500/5 transform transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-12 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-blue-500 shadow-[0_4px_12px_-4px_rgba(59,130,246,0.2)] border border-blue-50">
                    <MdAccessTimeFilled className="text-xl" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Refund Timing</h2>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed max-w-[90%] md:max-w-[85%] mt-auto">
                  Most refunds are processed <strong className="text-gray-900">3–5 business days</strong> after inspection.
                </p>
              </div>
            </div>
          </div>

          {/* ─── Process ─── */}
          <div className="mb-10">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="h-px w-4 bg-gray-300" />
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">Step by Step</span>
                <span className="h-px w-4 bg-gray-300" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Process</h2>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 relative">
              {/* Decorative line connecting nodes behind the cards */}
              <div className="hidden md:block absolute top-[52px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-gray-200 to-transparent z-0" />

              {[
                { num: '01', icon: <FaEdit />, title: 'Open a case via the order details page' },
                { num: '02', icon: <FaCamera />, title: 'Provide photos/videos and description' },
                { num: '03', icon: <FaBoxOpen />, title: 'Receive RMA label and ship back' },
              ].map((step, i) => (
                <div key={i} className="flex-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.02)] relative z-10 group hover:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.04)] transition-all flex flex-col items-center text-center">
                  <div className="w-14 h-14 flex items-center justify-center rounded-2xl text-white text-xl shadow-sm mb-4 transform transition-transform group-hover:scale-105" style={{ background: BTN_GRAD }}>
                    {step.icon}
                  </div>
                  <span className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-1">Step {step.num}</span>
                  <p className="text-sm font-semibold text-gray-900 leading-snug">{step.title}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ─── Non-Returnable Items Section ─── */}
          <div>
            <div className="bg-[#111827] rounded-[2rem] p-8 md:p-10 relative overflow-hidden flex flex-col md:flex-row gap-8 items-center justify-between border border-gray-800 shadow-xl group">
              {/* Blur accent glows */}
              <div className="absolute -left-20 -bottom-40 w-[300px] h-[300px] bg-[#FF6B3D]/10 rounded-full blur-[80px] pointer-events-none transition-opacity duration-700 group-hover:bg-[#FF6B3D]/20" />
              <div className="absolute right-0 top-0 w-[250px] h-[250px] bg-red-500/10 rounded-full blur-[60px] pointer-events-none transition-opacity duration-700 group-hover:bg-red-500/20" />
              
              <div className="relative z-10 md:w-1/3 text-center md:text-left">
                <div className="inline-flex items-center gap-2 mb-3">
                  <span className="h-px w-5 bg-gray-600 hidden md:block" />
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">Exceptions</span>
                  <span className="h-px w-5 bg-gray-600 block md:hidden" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">Non-Returnable Items</h2>
              </div>

              <div className="relative z-10 md:w-2/3 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    'Items sold “as-is” or marked final sale',
                    'Customized or perishable goods',
                    'Digital goods once accessed or downloaded'
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-xl hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center h-full">
                      <div className="w-8 h-8 rounded-lg bg-red-400/10 text-red-400 flex items-center justify-center mb-3 shrink-0">
                        <FaBan className="text-sm" />
                      </div>
                      <p className="text-gray-300 text-[11px] leading-relaxed mt-auto">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default ReturnsRefunds;