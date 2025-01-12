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
          message: "Your spreadsheet is on the way! 📊"
        });
        setTimeout(() => {
          onSuccess?.();
        }, 2000);
      } else {
        setStatus({
          type: "error",
          message: data.message || "Oops! Something went wrong. Please try again."
        });
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setStatus({
        type: "error",
        message: "Connection error. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 md:p-8 bg-white rounded-2xl shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
            className="w-full h-12 px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 
                     focus:ring-[#F08162] focus:border-transparent outline-none
                     text-base md:text-lg transition-shadow duration-200"
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
            className="w-full h-12 px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 
                     focus:ring-[#F08162] focus:border-transparent outline-none
                     text-base md:text-lg transition-shadow duration-200"
            required
            disabled={isSubmitting}
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className="w-full h-12 px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 
                   focus:ring-[#F08162] focus:border-transparent outline-none
                   text-base md:text-lg transition-shadow duration-200"
          required
          disabled={isSubmitting}
          placeholder="Enter your email"
        />
      </div>
      
      {status.message && (
        <div className={`p-4 rounded-xl text-center ${
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
        className={`w-full h-12 bg-[#F08162] text-white text-lg font-medium
          rounded-xl shadow-md hover:bg-[#e66d4d] 
          active:transform active:scale-[0.98]
          transition-all duration-200
          disabled:opacity-75 disabled:cursor-not-allowed
          ${isSubmitting ? 'animate-pulse' : ''}
        `}
      >
        {isSubmitting ? 'Sending...' : 'Get Spreadsheet'}
      </button>
    </form>
  );
}