import React from 'react';

const faqs = [
  { q: 'What is CivicScan?', a: 'CivicScan is a platform that makes legal information accessible and understandable for everyone.' },
  { q: 'Is the information provided legal advice?', a: 'No, the information is for general guidance only. For specific legal matters, consult a qualified attorney.' },
  { q: 'How do I use CivicScan?', a: 'Simply enter your legal question or upload a document, select your country and region, and get tailored information.' },
  { q: 'Is my data secure?', a: 'Yes, we take privacy and security seriously. Your data is protected and never shared without your consent.' },
];

const FAQ = () => (
  <div className="container mx-auto p-8 max-w-2xl">
    <h1 className="text-3xl font-bold mb-4">Frequently Asked Questions</h1>
    <p className="mb-6 text-gray-700">Find answers to common questions about CivicScan and how to use our platform.</p>
    <div className="space-y-6">
      {faqs.map((faq, idx) => (
        <div key={idx} className="bg-white rounded shadow p-4">
          <h2 className="font-semibold text-purple-700 mb-2">Q: {faq.q}</h2>
          <p className="text-gray-800">A: {faq.a}</p>
        </div>
      ))}
    </div>
  </div>
);

export default FAQ; 