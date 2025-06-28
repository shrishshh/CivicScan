import React from 'react';

const ContactSupport = () => (
  <div className="container mx-auto p-8 max-w-xl">
    <h1 className="text-3xl font-bold mb-4">Contact Support</h1>
    <p className="mb-6 text-gray-700">Need help or have questions? Fill out the form below and our support team will get back to you as soon as possible.</p>
    <form className="bg-white rounded shadow p-6 space-y-4">
      <div>
        <label className="block font-semibold mb-1">Your Name</label>
        <input type="text" className="w-full border rounded px-3 py-2" placeholder="Enter your name" />
      </div>
      <div>
        <label className="block font-semibold mb-1">Email Address</label>
        <input type="email" className="w-full border rounded px-3 py-2" placeholder="Enter your email" />
      </div>
      <div>
        <label className="block font-semibold mb-1">Message</label>
        <textarea className="w-full border rounded px-3 py-2" rows={4} placeholder="How can we help you?" />
      </div>
      <button type="submit" className="bg-purple-600 text-white px-6 py-2 rounded font-semibold hover:bg-purple-700 transition">Send Message</button>
    </form>
  </div>
);

export default ContactSupport; 