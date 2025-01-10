"use client";

import React, { useState } from "react";

export default function EmailForm() {
  const [email, setEmail] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponse("Submitting...");
    try {
      const res = await fetch('https://my-linktree-email-api.rufussweeney.workers.dev/', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, spreadsheetId: "spreadsheet_1" }),
      });
      
      const data = await res.json();
      if (data.success) {
        setEmail(""); // Clear the form
        setResponse("Email sent successfully!");
      } else {
        setResponse(data.message || "Failed to send email.");  // Use data.message instead of data.error
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setResponse("An error occurred. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-6 bg-white rounded shadow-md w-full max-w-md mx-auto mt-8"
    >
      <label htmlFor="email" className="text-lg font-semibold">
        Enter your email:
      </label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="example@domain.com"
        className="p-2 border border-gray-300 rounded"
        required
      />
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Submit
      </button>
      <p className="text-sm text-gray-600">{response}</p>
    </form>
  );
}
