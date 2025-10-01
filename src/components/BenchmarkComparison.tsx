import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface BenchmarkField {
  field: string;
  standard: string;
  extracted: string;
  status: 'compliant' | 'warning' | 'violation';
  description: string;
}

const mockBenchmarkData: BenchmarkField[] = [
  {
    field: 'Interest Rate Specification',
    standard: 'Required (ISDA 2002)',
    extracted: 'Missing',
    status: 'violation',
    description: 'All derivative contracts must specify interest rate terms'
  },
  {
    field: 'Termination Clause',
    standard: '30 days notice',
    extracted: 'Missing',
    status: 'warning',
    description: 'Standard market practice requires termination provisions'
  },
  {
    field: 'Currency Denomination',
    standard: 'ISO 4217 format',
    extracted: 'USD (Compliant)',
    status: 'compliant',
    description: 'Currency code follows international standards'
  },
  {
    field: 'Settlement Period',
    standard: 'T+2 (Standard)',
    extracted: 'T+2 (Compliant)',
    status: 'compliant',
    description: 'Settlement timing aligns with market conventions'
  },
  {
    field: 'Notional Amount Format',
    standard: 'Numeric with currency',
    extracted: '$100,000,000',
    status: 'compliant',
    description: 'Amount format meets documentation standards'
  },
  {
    field: 'Counterparty Identification',
    standard: 'Full legal entity name',
    extracted: 'ABC Bank Ltd.',
    status: 'compliant',
    description: 'Entity properly identified in documentation'
  }
];

const BenchmarkComparison = () => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'violation':
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-500/10 border-green-400/30 text-green-300';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-400/30 text-yellow-300';
      case 'violation':
        return 'bg-red-500/10 border-red-400/30 text-red-300';
      default:
        return '';
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium border";
    return (
      <span className={`${baseClasses} ${getStatusColor(status)}`}>
        {status === 'compliant' ? 'Compliant' : 
         status === 'warning' ? 'Warning' : 'Violation'}
      </span>
    );
  };

  const compliantCount = mockBenchmarkData.filter(item => item.status === 'compliant').length;
  const warningCount = mockBenchmarkData.filter(item => item.status === 'warning').length;
  const violationCount = mockBenchmarkData.filter(item => item.status === 'violation').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden"
    >
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-6 w-6 text-teal-400" />
            <div>
              <h2 className="text-xl font-semibold text-white">
                Industry Benchmark Comparison
              </h2>
              <p className="text-white/70 text-sm">
                Compare extracted data against market standards
              </p>
            </div>
          </div>
          
          {/* Summary Stats */}
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-lg font-bold text-green-400">{compliantCount}</div>
              <div className="text-white/70 text-xs">Compliant</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-400">{warningCount}</div>
              <div className="text-white/70 text-xs">Warnings</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-400">{violationCount}</div>
              <div className="text-white/70 text-xs">Violations</div>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <th className="px-6 py-3 text-left text-white font-medium">Field</th>
              <th className="px-6 py-3 text-left text-white font-medium">Industry Standard</th>
              <th className="px-6 py-3 text-left text-white font-medium">Extracted Value</th>
              <th className="px-6 py-3 text-left text-white font-medium">Compliance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {mockBenchmarkData.map((item, index) => (
              <motion.tr
                key={item.field}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="hover:bg-white/5 transition-colors"
              >
                <td className="px-6 py-4">
                  <div>
                    <div className="text-white font-medium">{item.field}</div>
                    <div className="text-white/60 text-sm">{item.description}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-white/80">{item.standard}</td>
                <td className="px-6 py-4">
                  <span className={`font-medium ${
                    item.status === 'compliant' ? 'text-white' : 
                    item.status === 'warning' ? 'text-yellow-300' : 'text-red-300'
                  }`}>
                    {item.extracted}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(item.status)}
                    {getStatusBadge(item.status)}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Compliance Score */}
      <div className="p-6 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold">Overall Compliance Score</h3>
            <p className="text-white/70 text-sm">Based on industry benchmarks</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-yellow-400">
              {Math.round((compliantCount / mockBenchmarkData.length) * 100)}%
            </div>
            <div className="w-32 bg-white/20 rounded-full h-2 mt-1">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-green-400 h-2 rounded-full" 
                style={{ width: `${(compliantCount / mockBenchmarkData.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BenchmarkComparison;