import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { UserPlus, Upload, Activity, Shield } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState('onboarding');

  return (
    <div className="p-6 max-w-7xl bg-white rounded-lg shadow">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-gray-600">Manage guards, roles, and permissions</p>
        </div>
        <Button variant="default">
          <UserPlus className="w-4 h-4 mr-2" />
          Add New Guard
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-transparent border-b w-full justify-start">
          <TabsTrigger 
            value="onboarding"
            className="data-[state=active]:border-b-2 data-[state=active]:border-gray-900 rounded-none px-4"
          >
            Onboarding
          </TabsTrigger>
          <TabsTrigger 
            value="roles"
            className="data-[state=active]:border-b-2 data-[state=active]:border-gray-900 rounded-none px-4"
          >
            Roles & Permissions
          </TabsTrigger>
          <TabsTrigger 
            value="performance"
            className="data-[state=active]:border-b-2 data-[state=active]:border-gray-900 rounded-none px-4"
          >
            Performance
          </TabsTrigger>
        </TabsList>

        {/* Onboarding Tab */}
        <TabsContent value="onboarding" className="space-y-6">
          <div className="bg-white rounded-lg">
            <h2 className="text-lg font-semibold">Guard Onboarding Process</h2>
            <p className="text-gray-600">Track and manage guard documentation and verification status</p>

            {/* Required Documents */}
            <div className="mt-6 space-y-6">
              <div className="bg-white rounded-lg">
                <h3 className="font-semibold mb-4">Required Documents</h3>
                <div className="border rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-blue-600 mr-3">📄</div>
                    <div>
                      <div className="font-medium">Government ID</div>
                      <div className="text-gray-600 text-sm">National ID or passport required (Verification Required)</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </div>

              {/* Optional Documents */}
              <div className="bg-white rounded-lg">
                <h3 className="font-semibold mb-4">Optional Documents & Certifications</h3>
                <div className="space-y-4">
                  {[
                    { name: 'Security License', desc: 'Optional verification' },
                    { name: 'Training Certificate', desc: 'Optional verification' },
                    { name: 'Additional Certifications', desc: 'Optional verification' }
                  ].map(doc => (
                    <div key={doc.name} className="border rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-blue-600 mr-3">📄</div>
                        <div>
                          <div className="font-medium">{doc.name}</div>
                          <div className="text-gray-600 text-sm">{doc.desc}</div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Roles & Permissions Tab */}
        <TabsContent value="roles" className="space-y-6">
          <div className="bg-white rounded-lg">
            <h2 className="text-lg font-semibold">Role Management</h2>
            <p className="text-gray-600">Define and manage security roles and their permissions</p>

            {/* Available Roles */}
            <div className="mt-6">
              <h3 className="font-semibold mb-4">Available Roles</h3>
              <div className="space-y-2">
                {['Senior Guard', 'Regular Guard', 'Trainee'].map(role => (
                  <div key={role} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 mr-2 text-blue-600" />
                      <span className="font-medium">{role}</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Permission Matrix */}
            <div className="mt-6">
              <h3 className="font-semibold mb-4">Permission Matrix</h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Permission</th>
                      <th className="text-center p-3">Senior Guard</th>
                      <th className="text-center p-3">Regular Guard</th>
                      <th className="text-center p-3">Trainee</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3">View Schedules</td>
                      <td className="text-center">✓</td>
                      <td className="text-center">✓</td>
                      <td className="text-center">✓</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">Submit Reports</td>
                      <td className="text-center">✓</td>
                      <td className="text-center">✓</td>
                      <td className="text-center">-</td>
                    </tr>
                    <tr>
                      <td className="p-3">Approve Shifts</td>
                      <td className="text-center">✓</td>
                      <td className="text-center">-</td>
                      <td className="text-center">-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="bg-white rounded-lg">
            <h2 className="text-lg font-semibold">Guard Performance Analytics</h2>
            <p className="text-gray-600">Track and analyze guard performance metrics</p>

            {/* Performance Metrics */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              {[
                { label: 'Shifts Completed', value: '145.0' },
                { label: 'Attendance Rate', value: '98.5%' },
                { label: 'Incident Reports', value: '3.0' },
                { label: 'Rating', value: '4.8/5.0' }
              ].map(metric => (
                <div key={metric.label} className="border rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">{metric.label}</div>
                  <div className="text-2xl font-semibold">{metric.value}</div>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="mt-6">
              <h3 className="font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  { text: 'Completed shift at Mall of Arabia', time: '2 hours ago' },
                  { text: 'Submitted incident report', time: 'Yesterday' },
                  { text: 'Training completion: Emergency Response', time: '3 days ago' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b">
                    <div className="flex items-center">
                      <Activity className="w-4 h-4 mr-2 text-blue-600" />
                      <span>{activity.text}</span>
                    </div>
                    <span className="text-gray-500 text-sm">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}