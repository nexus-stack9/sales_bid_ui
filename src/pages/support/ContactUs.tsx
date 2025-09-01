import Layout from "@/components/layout/Layout";
import React from "react";

const ContactUs: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Contact Us</h1>
          <p className="text-lg text-slate-600">We’re here to help. Reach us through any of the channels below.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Email</h3>
            <p className="text-slate-600">support@salesbid.com</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Phone</h3>
            <p className="text-slate-600">+1 (555) 123-4567 (Mon–Fri, 9am–6pm)</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Address</h3>
            <p className="text-slate-600">123 Commerce St, Suite 400</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Submit a Request</h2>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="h-12 rounded-xl border border-gray-200 px-4 bg-white" placeholder="Full name" />
            <input className="h-12 rounded-xl border border-gray-200 px-4 bg-white" placeholder="Email address" />
            <input className="h-12 rounded-xl border border-gray-200 px-4 bg-white md:col-span-2" placeholder="Subject" />
            <textarea className="rounded-xl border border-gray-200 px-4 py-3 bg-white md:col-span-2" placeholder="How can we help?" rows={5} />
            <div className="md:col-span-2">
              <button type="button" className="h-12 px-6 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700">Send message</button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ContactUs;