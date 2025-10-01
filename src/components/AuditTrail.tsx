import React from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertTriangle, CheckCircle, User, FileText, Shield } from 'lucide-react';

interface AuditEvent {
  id: string;
  timestamp: string;
  type: 'upload' | 'extraction' | 'validation' | 'review' | 'approval';
  title: string;
  description: string;
  user: string;
  severity?: 'low' | 'medium' | 'high';
  status: 'completed' | 'flagged' | 'pending';
}

const mockAuditEvents: AuditEvent[] = [
  {
    id: '1',
    timestamp: '2024-01-15T14:32:15Z',
    type: 'upload',
    title: 'Document Uploaded',
    description: 'deal-contract-2024.pdf uploaded successfully',
    user: 'System',
    status: 'completed'
  },
  {
    id: '2',
    timestamp: '2024-01-15T14:32:28Z',
    type: 'extraction',
    title: 'Data Extraction Completed',
    description: '8 fields extracted with 92% confidence',
    user: 'AI Engine',
    status: 'completed'
  },
  {
    id: '3',
    timestamp: '2024-01-15T14:32:45Z',
    type: 'validation',
    title: 'Missing Interest Rate Detected',
    description: 'Critical field missing from document',
    user: 'Validation Engine',
    severity: 'high',
    status: 'flagged'
  },
  {
    id: '4',
    timestamp: '2024-01-15T14:33:02Z',
    type: 'validation',
    title: 'Counterparty Verification Warning',
    description: 'Entity not found in primary sanctions database',
    user: 'Compliance Engine',
    severity: 'medium',
    status: 'flagged'
  },
  {
    id: '5',
    timestamp: '2024-01-15T14:33:15Z',
    type: 'validation',
    title: 'Risk Score Calculated',
    description: 'Overall risk score: 73/100 (High Risk)',
    user: 'Risk Engine',
    severity: 'high',
    status: 'completed'
  },
  {
    id: '6',
    timestamp: '2024-01-15T14:35:22Z',
    type: 'review',
    title: 'Human Review Requested',
    description: 'Deal flagged for manual review due to high risk score',
    user: 'john.doe@company.com',
    status: 'pending'
  }
];

const AuditTrail = () => {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'upload':
        return <FileText className="h-4 w-4" />;
      case 'extraction':
        return <FileText className="h-4 w-4" />;
      case 'validation':
        return <Shield className="h-4 w-4" />;
      case 'review':
        return <User className="h-4 w-4" />;
      case 'approval':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string, severity?: string) => {
    if (status === 'flagged') {
      switch (severity) {
        case 'high':
          return 'text-red-400 bg-red-500/10 border-red-400/30';
        case 'medium':
          return 'text-yellow-400 bg-yellow-500/10 border-yellow-400/30';
        case 'low':
          return 'text-blue-400 bg-blue-500/10 border-blue-400/30';
        default:
          return 'text-yellow-400 bg-yellow-500/10 border-yellow-400/30';
      }
    } else if (status === 'completed') {
      return 'text-green-400 bg-green-500/10 border-green-400/30';
    } else {
      return 'text-blue-400 bg-blue-500/10 border-blue-400/30';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden"
    >
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <Clock className="h-6 w-6 text-teal-400" />
          <h2 className="text-xl font-semibold text-white">
            Audit Trail
          </h2>
        </div>
        <p className="text-white/70 text-sm mt-1">
          Complete timeline of all system actions and decisions
        </p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {mockAuditEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex items-start space-x-4 p-4 rounded-lg hover:bg-white/5 transition-colors"
            >
              {/* Timeline Line */}
              {index < mockAuditEvents.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-8 bg-white/20"></div>
              )}

              {/* Icon */}
              <div className={`flex-shrink-0 p-2 rounded-lg border ${getStatusColor(event.status, event.severity)}`}>
                {getEventIcon(event.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-white font-medium">
                    {event.title}
                  </h3>
                  <div className="flex items-center space-x-2">
                    {event.severity && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(event.status, event.severity)}`}>
                        {event.severity.toUpperCase()}
                      </span>
                    )}
                    <span className="text-white/60 text-sm">
                      {formatTimestamp(event.timestamp)}
                    </span>
                  </div>
                </div>
                
                <p className="text-white/70 text-sm mb-2">
                  {event.description}
                </p>
                
                <div className="flex items-center space-x-4 text-xs text-white/50">
                  <span>By: {event.user}</span>
                  <span className={`px-2 py-1 rounded-full ${getStatusColor(event.status, event.severity)}`}>
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-400">
                {mockAuditEvents.filter(e => e.status === 'completed').length}
              </div>
              <div className="text-white/70 text-sm">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">
                {mockAuditEvents.filter(e => e.status === 'flagged').length}
              </div>
              <div className="text-white/70 text-sm">Flagged</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">
                {mockAuditEvents.filter(e => e.status === 'pending').length}
              </div>
              <div className="text-white/70 text-sm">Pending</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AuditTrail;