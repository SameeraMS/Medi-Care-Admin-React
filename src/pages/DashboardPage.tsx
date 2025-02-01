import React from 'react';
import { LayoutDashboard, Users, Guitar as Hospital, Radical as Medical } from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    { icon: Medical, label: 'Total Doctors', value: '45', change: '+5%' },
    { icon: Hospital, label: 'Hospitals', value: '12', change: '+2%' },
    { icon: Users, label: 'Active Users', value: '1,234', change: '+12%' },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-2 text-gray-600">Welcome back! Here's what's happening.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="p-6 bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-50">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
                <div className="ml-auto">
                  <span className="text-sm font-medium text-green-600">{stat.change}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add more dashboard content here */}
    </div>
  );
}