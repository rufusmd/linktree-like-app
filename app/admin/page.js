"use client";

import { useSession, signIn } from "next-auth/react";
import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, 
  PieChart, Pie, Cell,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'requestedAt', direction: 'desc' });
  const [filterType, setFilterType] = useState('all');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [view, setView] = useState('submissions'); // 'submissions' or 'analytics'

  // Analytics data processing
  const getAnalytics = () => {
    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return {
      total: submissions.length,
      lastWeek: submissions.filter(s => new Date(s.requestedAt) > lastWeek).length,
      byType: {
        budgeting: submissions.filter(s => s.spreadsheetId === 'budgeting').length,
        retirement: submissions.filter(s => s.spreadsheetId === 'retirement').length,
        rentVsBuy: submissions.filter(s => s.spreadsheetId === 'rentVsBuy').length,
      },
      dailyTrend: getDailyTrend(),
    };
  };

  const getDailyTrend = () => {
    const days = {};
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Initialize days
    for (let d = new Date(thirtyDaysAgo); d <= now; d.setDate(d.getDate() + 1)) {
      days[d.toISOString().split('T')[0]] = 0;
    }

    // Count submissions per day
    submissions.forEach(submission => {
      const date = new Date(submission.requestedAt).toISOString().split('T')[0];
      if (days[date] !== undefined) {
        days[date]++;
      }
    });

    return Object.entries(days).map(([date, count]) => ({
      date,
      submissions: count
    }));
  };

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

  const downloadCSV = (submissions) => {
    const dateFilter = (submission) => {
      if (!dateRange.start && !dateRange.end) return true;
      const submissionDate = new Date(submission.requestedAt);
      const startDate = dateRange.start ? new Date(dateRange.start) : null;
      const endDate = dateRange.end ? new Date(dateRange.end) : null;
      
      if (startDate && endDate) {
        return submissionDate >= startDate && submissionDate <= endDate;
      }
      if (startDate) return submissionDate >= startDate;
      if (endDate) return submissionDate <= endDate;
      return true;
    };

    const filteredSubmissions = submissions.filter(dateFilter);
    
    // Convert submissions to CSV format
    const headers = ['Date', 'Name', 'Email', 'Spreadsheet'];
    const csvData = filteredSubmissions.map(sub => [
      new Date(sub.requestedAt).toLocaleDateString(),
      `${sub.firstName} ${sub.lastName}`,
      sub.email,
      sub.spreadsheetId
    ]);

    // Create CSV string
    const csvString = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `spreadsheet-requests-${new Date().toLocaleDateString()}.csv`;
    link.click();

    // Clean up
    URL.revokeObjectURL(link.href);
    setShowExportOptions(false);
    setDateRange({ start: '', end: '' });
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
  

  // ... previous code ...

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with view toggle */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {view === 'submissions' ? 'Spreadsheet Requests' : 'Analytics'}
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setView(view === 'submissions' ? 'analytics' : 'submissions')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {view === 'submissions' ? 'View Analytics' : 'View Submissions'}
            </button>
            <div className="text-sm text-gray-500">
              Signed in as {session.user.email}
            </div>
          </div>
        </div>

        {view === 'submissions' ? (
          <>
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
              <button
                onClick={() => setShowExportOptions(true)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Export Data
              </button>
            </div>

            {/* Export Modal */}
            {showExportOptions && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full">
                  <h3 className="text-lg font-semibold mb-4">Export Options</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => setShowExportOptions(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => downloadCSV(filteredAndSortedSubmissions)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      Export
                    </button>
                  </div>
                </div>
              </div>
            )}
            
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
          </>
        ) : (
          // Analytics View
          <div className="space-y-8">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900">Total Requests</h3>
                <p className="text-3xl font-bold text-blue-600 mt-2">{getAnalytics().total}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900">Last 7 Days</h3>
                <p className="text-3xl font-bold text-green-600 mt-2">{getAnalytics().lastWeek}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900">Most Requested</h3>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  {Object.entries(getAnalytics().byType)
                    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}
                </p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Trend Chart */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Requests</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={getAnalytics().dailyTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="submissions" stroke="#4263EB" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Spreadsheet Distribution */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Spreadsheet Distribution</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={Object.entries(getAnalytics().byType).map(([name, value]) => ({
                          name,
                          value
                        }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                      >
                        {Object.entries(getAnalytics().byType).map((entry, index) => (
                          <Cell key={index} fill={['#4263EB', '#32C766', '#F6AD55'][index]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}