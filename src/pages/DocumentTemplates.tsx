import React from 'react';

const templates = [
  { name: 'Rental Agreement', link: '#' },
  { name: 'Power of Attorney', link: '#' },
  { name: 'Employment Contract', link: '#' },
  { name: 'Non-Disclosure Agreement', link: '#' },
];

const DocumentTemplates = () => (
  <div className="container mx-auto p-8 max-w-2xl">
    <h1 className="text-3xl font-bold mb-4">Document Templates</h1>
    <p className="mb-6 text-gray-700">Download free, customizable legal document templates to help you with common legal needs. These templates are provided for informational purposes only.</p>
    <ul className="space-y-4">
      {templates.map((template, idx) => (
        <li key={idx} className="p-4 bg-white rounded shadow flex items-center justify-between">
          <span className="text-lg font-semibold text-purple-700">{template.name}</span>
          <a href={template.link} className="text-blue-600 hover:underline">Download</a>
        </li>
      ))}
    </ul>
  </div>
);

export default DocumentTemplates; 