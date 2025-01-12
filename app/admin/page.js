"use client";

import { useSession, signIn } from "next-auth/react";
import { useState, useEffect } from 'react';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'requestedAt', direction: 'desc' });
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    if (session) {
      fetchSubmissions();
    }
  }, [session]);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('https://my-linktree-email-api.rufussweeney.workers.dev/api/submissions', {
        headers: {
          'Authorization': `Bearer ${session.user.email}`
        }
      });
      const data = await response.json();
      setSubmissions(data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Sorting function
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filtering and sorting logic
  const filteredAndSortedSubmissions = submissions
    .filter(submission => {
      const searchMatch = (
        submission.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const typeMatch = filterType === 'all' || submission.spreadsheetId === filterType;
      return searchMatch && typeMatch;
    })
    .sort((a, b) => {
      if (sortConfig.key === 'requestedAt') {
        return sortConfig.direction === 'asc' 
          ? new Date(a[sortConfig.key]) - new Date(b[sortConfig.key])
          : new Date(b[sortConfig.key]) - new Date(a[sortConfig.key]);
      }
      return sortConfig.direction === 'asc'
        ? a[sortConfig.key] > b[sortConfig.key] ? 1 : -1
        : b[sortConfig.key] > a[sortConfig.key] ? 1 : -1;
    });

  if (status === "loading") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <button
          onClick={() => signIn("google")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Spreadsheet Requests</h1>
          <div className="text-sm text-gray-500">
            Signed in as {session.user.email}
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by name or email..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Spreadsheets</option>
            <option value="budgeting">Budgeting</option>
            <option value="retirement">Retirement</option>
            <option value="rentVsBuy">Rent vs. Buy</option>
          </select>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    onClick={() => requestSort('requestedAt')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Date
                    {sortConfig.key === 'requestedAt' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th 
                    onClick={() => requestSort('firstName')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Name
                    {sortConfig.key === 'firstName' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th 
                    onClick={() => requestSort('email')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Email
                    {sortConfig.key === 'email' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th 
                    onClick={() => requestSort('spreadsheetId')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Spreadsheet
                    {sortConfig.key === 'spreadsheetId' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedSubmissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(submission.requestedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {submission.firstName} {submission.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a href={`mailto:${submission.email}`} className="text-blue-600 hover:text-blue-800">
                        {submission.email}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {submission.spreadsheetId}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}