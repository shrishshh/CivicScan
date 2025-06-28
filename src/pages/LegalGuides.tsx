import React from 'react';

const guides = [
  { title: 'Understanding Your Rights as a Tenant', link: '#' },
  { title: 'How to File a Small Claims Case', link: '#' },
  { title: 'Steps to Register a Business', link: '#' },
  { title: 'Basics of Family Law', link: '#' },
];

const LegalGuides = () => (
  <div className="container mx-auto p-8 max-w-2xl">
    <h1 className="text-3xl font-bold mb-4">Legal Guides</h1>
    <p className="mb-6 text-gray-700">Explore our collection of easy-to-understand legal guides designed to help you navigate common legal situations. Each guide is written in plain language and tailored for everyday citizens.</p>
    <ul className="space-y-4">
      {guides.map((guide, idx) => (
        <li key={idx} className="p-4 bg-white rounded shadow hover:bg-purple-50 transition">
          <a href={guide.link} className="text-lg font-semibold text-purple-700 hover:underline">{guide.title}</a>
        </li>
      ))}
    </ul>
  </div>
);

export default LegalGuides; 