import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Plus, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  FileText,
  Eye
} from 'lucide-react';

interface Deal {
  id: string;
  dealId: string;
  counterparty: string;
  notionalAmount: string;
  currency: string;
  riskScore: number;
  status: 'pending' | 'approved' | 'flagged' | 'reviewing';
  lastUpdated: string;
  documentType: string;
}

const mockDeals: Deal[] = [
  {
    id: '1',
    dealId: 'DTC-2024-001',
    counterparty: 'ABC Bank Ltd.',
    notionalAmount: '$100,000,000',
    currency: 'USD',
    riskScore: 73,
    status: 'flagged',
    lastUpdated: '2024-01-15T14:32:15Z',
    documentType: 'Derivative Contract'
  },
  {
    id: '2',
    dealId: 'DTC-2024-002',
    counterparty: 'Global Finance Corp',
    notionalAmount: '$50,000,000',
    currency: 'EUR',
    riskScore: 28,
    status: 'approved',
    lastUpdated: '2024-01-14T09:15:30Z',
    documentType: 'Term Sheet'
  },
  {
    id: '3',
    dealId: 'DTC-2024-003',
    counterparty: 'International Bank',
    notionalAmount: '$75,000,000',
    currency: 'GBP',
    riskScore: 45,
    status: 'reviewing',
    lastUpdated: '2024-01-13T16:45:22Z',
    documentType: 'Confirmation'
  },
  {
    id: '4',
    dealId: 'DTC-2024-004',
    counterparty: 'Regional Credit Union',
    notionalAmount: '$25,000,000',
    currency: 'USD',
    riskScore: 15,
    status: 'approved',
    lastUpdated: '2024-01-12T11:20:45Z',
    documentType: 'Master Agreement'
  },
  {
    id: '5',
    dealId: 'DTC-2024-005',
    counterparty: 'Merchant Bank LLC',
    notionalAmount: '$200,000,000',
    currency: 'USD',
    riskScore: 89,
    status: 'flagged',
    lastUpdated: '2024-01-11T13:55:18Z',
    documentType: 'Derivative Contract'
  }
];

const DashboardPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const navigate = useNavigate();

  const filteredDeals = mockDeals.filter(deal => {
    const matchesSearch = deal.dealId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.counterparty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || deal.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'flagged':
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'reviewing':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-blue-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/20 text-green-300 border-green-400/30';
      case 'flagged':
        return 'bg-red-500/20 text-red-300 border-red-400/30';
      case 'reviewing':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30';
      case 'pending':
        return 'bg-blue-500/20 text-blue-300 border-blue-400/30';
      default:
        return '';
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score <= 30) return 'text-green-400';
    if (score <= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewDeal = (dealId: string) => {
    // Navigate to the analysis flow for this deal
    navigate('/upload');
  };

  const handleNewDeal = () => {
    navigate('/upload');
  };

  // Calculate summary stats
  const totalDeals = mockDeals.length;
  const approvedDeals = mockDeals.filter(d => d.status === 'approved').length;
  const flaggedDeals = mockDeals.filter(d => d.status === 'flagged').length;
  const avgRiskScore = Math.round(mockDeals.reduce((sum, deal) => sum + deal.riskScore, 0) / totalDeals);

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Deal Dashboard
              </h1>
              <p className="text-white/70">
                Monitor and manage all deal risk assessments
              </p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNewDeal}
              className="px-6 py-3 bg-gradient-to-r from-teal-500 to-primary-500 text-white font-semibold rounded-xl hover:from-teal-600 hover:to-primary-600 transition-all duration-200 shadow-lg flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>New Deal Analysis</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {[
            {
              title: 'Total Deals',
              value: totalDeals,
              icon: FileText,
              color: 'text-blue-400',
              bgColor: 'bg-blue-500/10 border-blue-400/30'
            },
            {
              title: 'Approved',
              value: approvedDeals,
              icon: CheckCircle,
              color: 'text-green-400',
              bgColor: 'bg-green-500/10 border-green-400/30'
            },
            {
              title: 'Flagged',
              value: flaggedDeals,
              icon: AlertTriangle,
              color: 'text-red-400',
              bgColor: 'bg-red-500/10 border-red-400/30'
            },
            {
              title: 'Avg Risk Score',
              value: avgRiskScore,
              icon: TrendingUp,
              color: getRiskScoreColor(avgRiskScore),
              bgColor: avgRiskScore <= 30 ? 'bg-green-500/10 border-green-400/30' : 
                       avgRiskScore <= 60 ? 'bg-yellow-500/10 border-yellow-400/30' : 
                       'bg-red-500/10 border-red-400/30'
            }
          ].map((stat, index) => (
            <div key={index} className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 md:p-6 ${stat.bgColor}`}>
              <div className="flex items-center space-x-3 mb-2">
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                <span className="text-white/70 font-medium">{stat.title}</span>
              </div>
              <div className={`text-3xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 md:p-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                <input
                  type="text"
                  placeholder="Search deals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-auto pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-teal-400 transition-colors"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-white/50" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full sm:w-auto bg-white/10 border border-white/20 rounded-lg text-white px-3 py-2 focus:outline-none focus:border-teal-400 transition-colors"
                >
                  <option value="all">All Status</option>
                  <option value="approved">Approved</option>
                  <option value="flagged">Flagged</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
            
            <div className="text-white/70 text-sm">
              Showing {filteredDeals.length} of {totalDeals} deals
            </div>
          </div>
        </motion.div>

        {/* Deals Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl"
        >
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-white/5 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left text-white font-semibold whitespace-nowrap">Deal ID</th>
                  <th className="px-4 py-3 text-left text-white font-semibold whitespace-nowrap">Counterparty</th>
                  <th className="px-4 py-3 text-left text-white font-semibold whitespace-nowrap">Notional</th>
                  <th className="px-4 py-3 text-left text-white font-semibold whitespace-nowrap">Risk Score</th>
                  <th className="px-4 py-3 text-left text-white font-semibold whitespace-nowrap">Status</th>
                  <th className="px-4 py-3 text-left text-white font-semibold whitespace-nowrap">Last Updated</th>
                  <th className="px-4 py-3 text-left text-white font-semibold whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredDeals.map((deal, index) => (
                  <motion.tr
                    key={deal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 + 0.4 }}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <div className="text-white font-medium">{deal.dealId}</div>
                        <div className="text-white/60 text-sm">{deal.documentType}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white">{deal.counterparty}</td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="text-white font-medium">{deal.notionalAmount}</div>
                        <div className="text-white/60 text-sm">{deal.currency}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className={`text-xl font-bold ${getRiskScoreColor(deal.riskScore)}`}>
                        {deal.riskScore}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(deal.status)}`}>
                        {getStatusIcon(deal.status)}
                        <span>{deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/70 text-sm">
                      {formatDate(deal.lastUpdated)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleViewDeal(deal.id)}
                        className="inline-flex items-center space-x-1 px-2 py-1 bg-white/10 hover:bg-white/20 text-white text-xs rounded-lg transition-colors whitespace-nowrap"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;