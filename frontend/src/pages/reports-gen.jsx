import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'

function ReportsGen() {
  const [reports, setReports] = useState({
    totalRecords: 0,
    currentPage: 1,
    totalPages: 1,
    records: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exportFormat, setExportFormat] = useState('csv');
  const [exporting, setExporting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/reports');
      setReports(data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    try {
      setExporting(true);
      const response = await axios.get(`/reports/export?format=${format}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `vaccination-report.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setIsDropdownOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to export report');
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-4">Vaccination Reports</h1>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200"
            disabled={exporting}
          >
            {exporting ? 'Exporting...' : 'Download Report'}
            <svg 
              className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              <div className="py-1">
                <button
                  onClick={() => handleExport('csv')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <span className="font-medium">CSV</span>
                  <span className="text-gray-500 text-xs">.csv</span>
                </button>
                <button
                  onClick={() => handleExport('pdf')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <span className="font-medium">PDF</span>
                  <span className="text-gray-500 text-xs">.pdf</span>
                </button>
                <button
                  onClick={() => handleExport('xlsx')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <span className="font-medium">Excel</span>
                  <span className="text-gray-500 text-xs">.xlsx</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Student ID</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Class</th>
              <th className="px-4 py-2 border">Vaccine Name</th>
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Drive ID</th>
            </tr>
          </thead>
          <tbody>
            {reports.records.map((record) => (
              <tr key={record.studentID} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{record.studentID}</td>
                <td className="px-4 py-2 border">{record.name}</td>
                <td className="px-4 py-2 border">{record.class}</td>
                <td className="px-4 py-2 border">{record.vaccineName}</td>
                <td className="px-4 py-2 border">
                  {new Date(record.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 border">{record.driveId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-sm text-gray-600">
        Total Records: {reports.totalRecords}
      </div>
    </div>
  )
}

export default ReportsGen
