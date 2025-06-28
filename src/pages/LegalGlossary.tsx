import React from 'react';

const glossary = [
  { term: 'Plaintiff', def: 'A person who brings a case against another in a court of law.' },
  { term: 'Defendant', def: 'An individual, company, or institution sued or accused in a court of law.' },
  { term: 'Affidavit', def: 'A written statement confirmed by oath or affirmation, for use as evidence in court.' },
  { term: 'Jurisdiction', def: 'The official power to make legal decisions and judgments.' },
];

const LegalGlossary = () => (
  <div className="container mx-auto p-8 max-w-2xl">
    <h1 className="text-3xl font-bold mb-4">Legal Glossary</h1>
    <p className="mb-6 text-gray-700">Browse our glossary of common legal terms to better understand legal documents and proceedings.</p>
    <dl className="space-y-6">
      {glossary.map((item, idx) => (
        <div key={idx} className="bg-white rounded shadow p-4">
          <dt className="font-semibold text-purple-700">{item.term}</dt>
          <dd className="text-gray-800 ml-2">{item.def}</dd>
        </div>
      ))}
    </dl>
  </div>
);

export default LegalGlossary; 