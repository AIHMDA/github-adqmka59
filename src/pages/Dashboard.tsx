import React from 'react';
import { Users, Calendar, FileText, Bell } from 'lucide-react';

export const Dashboard = () => {
  const recentActivities = [
    { text: 'New guard application submitted - John Doe', time: '2 hours ago' },
    { text: 'Shift report completed - Location A', time: '3 hours ago' },
    { text: 'Schedule updated for next week', time: '4 hours ago' },
    { text: 'New incident report filed', time: '5 hours ago' }
  ];

  const upcomingShifts = [
    { location: 'Mall of Arabia', time: '08:00 - 16:00', guards: 12 },
    { location: 'King Abdullah Financial District', time: '12:00 - 20:00', guards: 8 },
    { location: 'Riyadh Front', time: '16:00 - 00:00', guards: 15 }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-500">Welcome back, Admin</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Guards</p>
              <p className="text-2xl font-semibold">124</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Shifts</p>
              <p className="text-2xl font-semibold">45</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Reports</p>
              <p className="text-2xl font-semibold">12</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <FileText className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Alerts</p>
              <p className="text-2xl font-semibold">3</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <Bell className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities and Upcoming Shifts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                <span className="flex-1">{activity.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Shifts */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Upcoming Shifts</h3>
          <div className="space-y-4">
            {upcomingShifts.map((shift, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{shift.location}</p>
                  <p className="text-sm text-gray-500">{shift.time}</p>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="w-4 h-4 mr-1" />
                  {shift.guards}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};