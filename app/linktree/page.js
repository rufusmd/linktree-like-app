"use client";

import { useState } from 'react';
import EmailForm from '../components/email.form';

export default function LinktreePage() {
  const [selectedTool, setSelectedTool] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const tools = [
    { id: 'budgeting', name: 'Budgeting Spreadsheet' },
    { id: 'retirement', name: 'Retirement Savings Simulator' },
    { id: 'rentVsBuy', name: 'Rent vs. Buy Calculator' },
  ];

  const handleToolClick = (toolId) => {
    setSelectedTool(toolId);
    setShowForm(true);
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-5xl font-bold text-center mb-16">
        Dr. Rufus' Spreadsheets
      </h1>

      <div className="space-y-6">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => handleToolClick(tool.id)}
            className="w-full py-6 px-8 text-xl text-white bg-[#F08162] 
                    rounded-2xl shadow-lg hover:shadow-xl hover:bg-[#e66d4d] 
                    transform hover:-translate-y-1 transition-all duration-200
                    focus:outline-none focus:ring-4 focus:ring-[#F08162]/50"
          >
            {tool.name}
          </button>
        ))}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
         <div className="bg-white rounded-2xl p-8 w-full max-w-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">
             Get Your {tools.find(t => t.id === selectedTool)?.name}
            </h2>
            <button 
              onClick={() => setShowForm(false)}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
            ×
          </button>
        </div>
        <EmailForm 
          toolId={selectedTool} 
          onSuccess={() => setShowForm(false)} 
        />
      </div>
    </div>
    )}
    </div>
  );
}