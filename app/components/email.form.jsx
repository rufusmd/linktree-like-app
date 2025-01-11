"use client";

import React, { useState } from "react";

export default function EmailForm({ toolId, onSuccess }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch('https://my-linktree-email-api.rufussweeney.workers.dev/api/send-email', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          ...formData,
          toolId
        }),
      });
      
      const data = await res.json();
      if (data.success) {
        setFormData({ firstName: "", lastName: "", email: "" });
        setStatus({
          type: "success",
          message: "Email sent successfully! Check your inbox."
        });
        setTimeout(() => {
          onSuccess?.();
        }, 2000);
      } else {
        setStatus({
          type: "error",
          message: data.message || "Failed to send email."
        });
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setStatus({
        type: "error",
        message: "An error occurred. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 
                     focus:ring-[#F08162] focus:border-transparent outline-none"
            required
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 
                     focus:ring-[#F08162] focus:border-transparent outline-none"
            required
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 
                   focus:ring-[#F08162] focus:border-transparent outline-none"
          required
        />
      </div>
      
      {status.message && (
        <div className={`p-4 rounded-lg ${
          status.type === "success" 
            ? "bg-green-50 text-green-800" 
            : "bg-red-50 text-red-800"
        }`}>
          {status.message}
        </div>
      )}
      
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full bg-[#F08162] text-white py-3 px-6 rounded-xl font-medium
          hover:bg-[#e66d4d] transition duration-200
          ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}
        `}
      >
        {isSubmitting ? 'Sending...' : 'Get Spreadsheet'}
      </button>
    </form>
  );
}