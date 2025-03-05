import React, { useState } from 'react';
import { FileText, Filter, AlertTriangle, Calendar, User, MapPin, Search, X, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { generatePDF } from '@/utils/pdf-generator';

interface Report {
  id: string;
  title: string;
  type: 'incident' | 'daily' | 'maintenance';
  severity?: 'low' | 'medium' | 'high';
  location: string;
  guard: string;
  date: string;
  status: 'pending' | 'reviewed' | 'archived';
  description?: string;
}

export const Reports = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isNewReportOpen, setIsNewReportOpen] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    severity: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    location: '',
    guard: ''
  });
  
  const [reports, setReports] = useState<Report[]>([
    {
      id: '1',
      title: 'Suspicious Activity',
      type: 'incident',
      severity: 'medium',
      location: 'Main Entrance',
      guard: 'John Smith',
      date: '2024-02-15',
      status: 'pending'
    },
    {
      id: '2',
      title: 'Daily Security Report',
      type: 'daily',
      location: 'Building A',
      guard: 'Sarah Johnson',
      date: '2024-02-15',
      status: 'reviewed'
    }
  ]);

  const [newReport, setNewReport] = useState({
    title: '',
    type: 'incident',
    severity: 'low',
    location: '',
    description: ''
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      severity: '',
      status: '',
      dateFrom: '',
      dateTo: '',
      location: '',
      guard: ''
    });
  };

  const handleNewReport = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new report object
    const report: Report = {
      id: `report-${Date.now()}`,
      title: newReport.title,
      type: newReport.type as 'incident' | 'daily' | 'maintenance',
      severity: newReport.type === 'incident' ? newReport.severity as 'low' | 'medium' | 'high' : undefined,
      location: newReport.location,
      guard: 'Current User', // This should come from authentication context
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      description: newReport.description
    };

    // Add new report to the list
    setReports(prev => [report, ...prev]);
    
    // Show success message
    const message = document.createElement('div');
    message.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50';
    message.textContent = 'Report created successfully!';
    document.body.appendChild(message);
    setTimeout(() => message.remove(), 3000);

    // Close dialog and reset form
    setIsNewReportOpen(false);
    setNewReport({
      title: '',
      type: 'incident',
      severity: 'low',
      location: '',
      description: ''
    });
  };

  const handlePrintReport = () => {
    generatePDF(reports, filters);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'reviewed':
        return 'text-green-600 bg-green-50';
      case 'archived':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports</h2>
          <p className="text-gray-500">View and manage security reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsFilterOpen(true)}>
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" onClick={handlePrintReport}>
            <Printer className="w-4 h-4 mr-2" />
            Print Report
          </Button>
          <Button onClick={() => setIsNewReportOpen(true)}>
            <FileText className="w-4 h-4 mr-2" />
            New Report
          </Button>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search reports..."
              className="pl-10"
            />
          </div>
        </div>

        <div className="border-t">
          {reports.map((report) => (
            <div key={report.id} className="border-b p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{report.title}</h3>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {report.date}
                    </span>
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {report.guard}
                    </span>
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {report.location}
                    </span>
                  </div>
                  {report.description && (
                    <p className="mt-2 text-sm text-gray-600">{report.description}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {report.severity && (
                    <span className={`px-2 py-1 rounded-full text-xs ${getSeverityColor(report.severity)}`}>
                      {report.severity.charAt(0).toUpperCase() + report.severity.slice(1)}
                    </span>
                  )}
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(report.status)}`}>
                    {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Dialog */}
      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filter Reports</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <select
                className="w-full rounded-md border border-gray-200 p-2"
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <option value="">All Types</option>
                <option value="incident">Incident</option>
                <option value="daily">Daily</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Severity</label>
              <select
                className="w-full rounded-md border border-gray-200 p-2"
                value={filters.severity}
                onChange={(e) => handleFilterChange('severity', e.target.value)}
              >
                <option value="">All Severities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date From</label>
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date To</label>
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end space-x-2">
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
              <Button onClick={() => setIsFilterOpen(false)}>
                Apply Filters
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Report Dialog */}
      <Dialog open={isNewReportOpen} onOpenChange={setIsNewReportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Report</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleNewReport} className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={newReport.title}
                onChange={(e) => setNewReport(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter report title"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <select
                className="w-full rounded-md border border-gray-200 p-2"
                value={newReport.type}
                onChange={(e) => setNewReport(prev => ({ ...prev, type: e.target.value as any }))}
                required
              >
                <option value="incident">Incident Report</option>
                <option value="daily">Daily Report</option>
                <option value="maintenance">Maintenance Report</option>
              </select>
            </div>

            {newReport.type === 'incident' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Severity</label>
                <select
                  className="w-full rounded-md border border-gray-200 p-2"
                  value={newReport.severity}
                  onChange={(e) => setNewReport(prev => ({ ...prev, severity: e.target.value as any }))}
                  required
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Input
                value={newReport.location}
                onChange={(e) => setNewReport(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Enter location"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                className="w-full min-h-[100px] rounded-md border border-gray-200 p-2"
                value={newReport.description}
                onChange={(e) => setNewReport(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter detailed description"
                required
              />
            </div>

            <div className="pt-4 flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsNewReportOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Create Report
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};