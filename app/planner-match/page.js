"use client";

import { useState } from 'react';

export default function PlannerMatch() {
  const [step, setStep] = useState(0); // 0 = entry, 1-3 = quiz steps
  const [formData, setFormData] = useState({
    careerStage: '',
    specialty: '',
    location: '',
    concerns: [],
    meetingTimes: [],
    meetingFormat: '',
    questions: '',
    name: '',
    email: '',
    phone: '',
    bestContactTime: ''
  });

  const specialties = [
    'Anesthesiology',
    'Cardiology',
    'Dermatology',
    'Emergency Medicine',
    'Family Medicine',
    'Internal Medicine',
    'Neurology',
    'Obstetrics & Gynecology',
    'Pediatrics',
    'Psychiatry',
    'Surgery',
    'Other',
    'Student'
  ];

  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  const handleConcernToggle = (concern) => {
    setFormData(prev => ({
      ...prev,
      concerns: prev.concerns.includes(concern)
        ? prev.concerns.filter(c => c !== concern)
        : [...prev.concerns, concern]
    }));
  };

  const renderQuizStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">Step 1 of 3</h2>
      <h3 className="text-xl text-gray-700">What is your stage of training?</h3>

      {/* Career Stage */}
      <div className="space-y-3">
        <label className="block text-gray-700 font-medium">Career Stage</label>
        <div className="space-y-2">
          {['Medical Student', 'Resident', 'Fellow', 'Early Career Attending', 'Established Attending'].map((stage) => (
            <label key={stage} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50">
              <input
                type="radio"
                name="careerStage"
                value={stage}
                checked={formData.careerStage === stage}
                onChange={(e) => setFormData(prev => ({ ...prev, careerStage: e.target.value }))}
                className="form-radio h-5 w-5 text-[#F08162]"
              />
              <span>{stage}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Specialty */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">Specialty</label>
        <select
          value={formData.specialty}
          onChange={(e) => setFormData(prev => ({ ...prev, specialty: e.target.value }))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F08162] focus:border-transparent"
        >
          <option value="">Select Specialty</option>
          {specialties.map(specialty => (
            <option key={specialty} value={specialty}>{specialty}</option>
          ))}
        </select>
      </div>

      {/* Location */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">Location</label>
        <select
          value={formData.location}
          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F08162] focus:border-transparent"
        >
          <option value="">Select State</option>
          {states.map(state => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </div>

      {/* Financial Concerns */}
      <div className="space-y-3">
        <label className="block text-gray-700 font-medium">Primary Financial Concerns</label>
        <div className="grid grid-cols-1 gap-2">
          {[
            'Student Loan Management',
            'Investment Strategy',
            'Contract Review',
            'Real Estate Decisions',
            'Retirement Planning',
            'Tax Strategy'
          ].map((concern) => (
            <label key={concern} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50">
              <input
                type="checkbox"
                checked={formData.concerns.includes(concern)}
                onChange={() => handleConcernToggle(concern)}
                className="form-checkbox h-5 w-5 text-[#F08162]"
              />
              <span>{concern}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-end pt-6">
        <button
          onClick={() => setStep(2)}
          disabled={!formData.careerStage || !formData.specialty || !formData.location || formData.concerns.length === 0}
          className="px-6 py-3 bg-[#F08162] text-white rounded-lg hover:bg-[#e66d4d] 
                   transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next Step →
        </button>
      </div>
    </div>
  );

  // Add these after renderQuizStep1 but before the return statement

const renderQuizStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">Step 2 of 3</h2>
      <h3 className="text-xl text-gray-700">Your Preferences</h3>
  
      {/* Meeting Times */}
      <div className="space-y-3">
        <label className="block text-gray-700 font-medium">Preferred Meeting Times</label>
        <div className="grid grid-cols-1 gap-2">
          {[
            'Weekday Mornings',
            'Weekday Evenings',
            'Weekends'
          ].map((time) => (
            <label key={time} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50">
              <input
                type="checkbox"
                checked={formData.meetingTimes.includes(time)}
                onChange={() => {
                  setFormData(prev => ({
                    ...prev,
                    meetingTimes: prev.meetingTimes.includes(time)
                      ? prev.meetingTimes.filter(t => t !== time)
                      : [...prev.meetingTimes, time]
                  }));
                }}
                className="form-checkbox h-5 w-5 text-[#F08162]"
              />
              <span>{time}</span>
            </label>
          ))}
        </div>
      </div>
  
      {/* Meeting Format */}
      <div className="space-y-3">
        <label className="block text-gray-700 font-medium">Meeting Format</label>
        <div className="space-y-2">
          {['Video Call', 'Phone Call', 'In Person', 'No Preference'].map((format) => (
            <label key={format} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50">
              <input
                type="radio"
                name="meetingFormat"
                value={format}
                checked={formData.meetingFormat === format}
                onChange={(e) => setFormData(prev => ({ ...prev, meetingFormat: e.target.value }))}
                className="form-radio h-5 w-5 text-[#F08162]"
              />
              <span>{format}</span>
            </label>
          ))}
        </div>
      </div>
  
      {/* Specific Questions */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Specific Questions or Concerns
        </label>
        <textarea
          value={formData.questions}
          onChange={(e) => setFormData(prev => ({ ...prev, questions: e.target.value }))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F08162] focus:border-transparent"
          rows={4}
          placeholder="Any specific questions or topics you'd like to discuss?"
        />
      </div>
  
      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <button
          onClick={() => setStep(1)}
          className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors duration-200"
        >
          ← Back
        </button>
        <button
          onClick={() => setStep(3)}
          disabled={!formData.meetingFormat || formData.meetingTimes.length === 0}
          className="px-6 py-3 bg-[#F08162] text-white rounded-lg hover:bg-[#e66d4d] 
                   transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next Step →
        </button>
      </div>
    </div>
  );
  
  const renderQuizStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">Step 3 of 3</h2>
      <h3 className="text-xl text-gray-700">Contact Information</h3>
  
      {/* Name */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">Full Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F08162] focus:border-transparent"
          placeholder="Your name"
          required
        />
      </div>
  
      {/* Email */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">Email Address</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F08162] focus:border-transparent"
          placeholder="your@email.com"
          required
        />
      </div>
  
      {/* Phone (Optional) */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Phone Number (Optional)
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F08162] focus:border-transparent"
          placeholder="Your phone number"
        />
      </div>
  
      {/* Best Time to Contact */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Best Time to Contact
        </label>
        <select
          value={formData.bestContactTime}
          onChange={(e) => setFormData(prev => ({ ...prev, bestContactTime: e.target.value }))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F08162] focus:border-transparent"
        >
          <option value="">Select Time</option>
          <option value="morning">Morning</option>
          <option value="afternoon">Afternoon</option>
          <option value="evening">Evening</option>
        </select>
      </div>
  
      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <button
          onClick={() => setStep(2)}
          className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors duration-200"
        >
          ← Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={!formData.name || !formData.email || !formData.bestContactTime}
          className="px-6 py-3 bg-[#F08162] text-white rounded-lg hover:bg-[#e66d4d] 
                   transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit
        </button>
      </div>
    </div>
  );

  const handleSubmit = async () => {
    try {
      // TODO: Add API call to save data
      console.log('Form submitted:', formData);
      // Show success message and reset form
      setStep(4); // We'll add the success screen next
    } catch (error) {
      console.error('Error submitting form:', error);
      // TODO: Add error handling
    }
  };

  const renderSuccessScreen = () => (
    <div className="text-center space-y-6 py-8">
      <div className="text-6xl mb-6">✨</div>
      <h2 className="text-3xl font-bold text-gray-900">Thank You!</h2>
      <div className="space-y-4 text-gray-600">
        <p>Your response has been received.</p>
        <p>Dr. Rufus will personally review your profile and match you with the best financial planner for your needs.</p>
      </div>
  
      <div className="mt-12 space-y-4">
        <h3 className="text-lg font-medium text-gray-900">While you wait</h3>
        <div className="space-y-3">
          <button
            onClick={() => window.location.href = '/'}
            className="w-full py-3 px-4 bg-[#F08162] text-white rounded-lg hover:bg-[#e66d4d] 
                     transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F08162]"
          >
            View Financial Resources
          </button>
          <p className="text-sm text-gray-500">
            Check out our free spreadsheets and calculators
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-xl mx-auto px-4">
        {/* Progress Indicator (only show if not on success screen) */}
        {step < 4 && (
          <div className="mb-8">
            <div className="flex justify-between">
              <div className={`h-3 w-3 rounded-full ${step >= 0 ? 'bg-[#F08162]' : 'bg-gray-300'}`}></div>
              <div className={`h-3 w-3 rounded-full ${step >= 1 ? 'bg-[#F08162]' : 'bg-gray-300'}`}></div>
              <div className={`h-3 w-3 rounded-full ${step >= 2 ? 'bg-[#F08162]' : 'bg-gray-300'}`}></div>
              <div className={`h-3 w-3 rounded-full ${step >= 3 ? 'bg-[#F08162]' : 'bg-gray-300'}`}></div>
            </div>
          </div>
        )}

        {/* Step 0: Entry Point */}
        {step === 0 && (
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-center mb-12">
              Dr. Rufus' Financial Resources
            </h1>

            {/* Original Spreadsheet Buttons */}
            <button
              className="w-full py-6 px-8 text-xl text-white bg-[#F08162] 
                       rounded-2xl shadow-lg hover:shadow-xl hover:bg-[#e66d4d] 
                       transform hover:-translate-y-1 transition-all duration-200
                       focus:outline-none focus:ring-4 focus:ring-[#F08162]/50"
            >
              Budgeting Spreadsheet
            </button>
            
            <button
              className="w-full py-6 px-8 text-xl text-white bg-[#F08162] 
                       rounded-2xl shadow-lg hover:shadow-xl hover:bg-[#e66d4d] 
                       transform hover:-translate-y-1 transition-all duration-200
                       focus:outline-none focus:ring-4 focus:ring-[#F08162]/50"
            >
              Retirement Calculator
            </button>
            
            <button
              className="w-full py-6 px-8 text-xl text-white bg-[#F08162] 
                       rounded-2xl shadow-lg hover:shadow-xl hover:bg-[#e66d4d] 
                       transform hover:-translate-y-1 transition-all duration-200
                       focus:outline-none focus:ring-4 focus:ring-[#F08162]/50"
            >
              Rent vs. Buy Calculator
            </button>

            {/* Divider */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
            </div>

            {/* New Planner Match Button */}
            <div className="relative bg-white p-6 rounded-2xl shadow-lg border-2 border-[#F08162] space-y-3">
              <div className="absolute -top-3 left-4 px-2 bg-white">
                <span className="text-[#F08162] font-semibold">NEW! ✨</span>
              </div>
              <button
                onClick={() => setStep(1)}
                className="w-full py-6 px-8 text-xl text-white bg-[#F08162] 
                         rounded-xl shadow-lg hover:shadow-xl hover:bg-[#e66d4d] 
                         transform hover:-translate-y-1 transition-all duration-200
                         focus:outline-none focus:ring-4 focus:ring-[#F08162]/50"
              >
                Find a Financial Planner
              </button>
              <p className="text-center text-gray-600">
                Matched specifically for physicians like you
              </p>
            </div>
          </div>
        )}
        
        {/* Step 1: Quiz */}
        {step === 1 && renderQuizStep1()}
        {/* Step 2: Preferences */}
        {step === 2 && renderQuizStep2()}        
        {/* Step 3: Contact Info */}
        {step === 3 && renderQuizStep3()}
        {step === 4 && renderSuccessScreen()}
      </div>
    </div>
  );
}
