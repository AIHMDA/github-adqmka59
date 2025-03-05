import React from 'react';

interface MetricCardProps {
  label: string;
  value: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ label, value }) => {
  return (
    <div className="border rounded-lg p-4">
      <div className="text-sm text-gray-600 mb-1">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
};