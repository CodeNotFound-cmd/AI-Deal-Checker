import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Mail, FileText, Share2, Printer, CheckCircle, ExternalLink } from 'lucide-react';

interface ExportOption {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  action: () => void;
  color: string;
}

const ExportOptions = () => {
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [exportComplete, setExportComplete] = useState<string | null>(null);

  const handleExport = async (optionId: string, action: () => void) => {
    setIsExporting(optionId);
    
    // Simulate export process
    setTimeout(() => {
      setIsExporting(null);
      setExportComplete(optionId);
      action();
      
      // Clear success state after 3 seconds
      setTimeout(() => {
        setExportComplete(null);
      }, 3000);
    }, 2000);
  };

  const exportOptions: ExportOption[] = [
    {
      id: 'pdf-report',
      title: 'Download PDF Report',
      description: 'Complete analysis with charts',
      icon: Download,
      color: 'from-red-500 to-red-600',
      action: () => {
        // Simulate PDF download
        const link = document.createElement('a');
        link.href = '#';
        link.download = 'risk-assessment-report.pdf';
        link.click();
      }
    },
    {
      id: 'email-summary',
      title: 'Email Summary',
      description: 'Send to stakeholders',
      icon: Mail,
      color: 'from-blue-500 to-blue-600',
      action: () => {
        // Simulate email sending
        alert('Summary email sent to stakeholders');
      }
    },
    {
      id: 'print-report',
      title: 'Print Report',
      description: 'Physical copy for records',
      icon: Printer,
      color: 'from-slate-500 to-slate-600',
      action: () => {
        window.print();
      }
    },
    {
      id: 'share-link',
      title: 'Share Link',
      description: 'Secure team collaboration',
      icon: ExternalLink,
      color: 'from-emerald-500 to-emerald-600',
      action: () => {
        navigator.clipboard.writeText('https://app.aidealchecker.com/share/abc123');
        alert('Secure link copied to clipboard');
      }
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl"
    >
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-2 bg-gradient-to-r from-teal-500 to-primary-500 rounded-lg">
          <Share2 className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-white">
          Export & Share
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {exportOptions.map((option, index) => {
          const Icon = option.icon;
          const isCurrentlyExporting = isExporting === option.id;
          const isComplete = exportComplete === option.id;
          
          return (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleExport(option.id, option.action)}
              disabled={isCurrentlyExporting || isComplete}
              className={`
                group relative flex flex-col items-center justify-center p-6 h-32 rounded-xl 
                bg-white/8 backdrop-blur-md border border-white/15 text-center 
                transition-all duration-300 ease-out
                hover:bg-white/12 hover:border-white/30 hover:shadow-xl
                ${isComplete 
                  ? 'border-emerald-400/60 bg-emerald-500/15 shadow-emerald-500/20 shadow-lg' 
                  : ''
                }
                ${isCurrentlyExporting ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}
              `}
            >
              {/* Icon Container */}
              <div className={`
                relative p-2.5 rounded-lg bg-gradient-to-r ${option.color} mb-3 
                w-12 h-12 flex items-center justify-center shadow-lg
                transition-transform duration-300 group-hover:scale-110
                ${isCurrentlyExporting ? 'animate-pulse' : ''}
              `}>
                {isComplete ? (
                  <CheckCircle className="h-6 w-6 text-white drop-shadow-sm" />
                ) : (
                  <Icon className="h-6 w-6 text-white drop-shadow-sm" />
                )}
              </div>
              
              {/* Title */}
              <h3 className="font-semibold text-white text-sm mb-1 leading-tight">
                {isComplete ? 'Complete!' : option.title}
              </h3>
              
              {/* Description */}
              <p className="text-xs text-white/70 leading-tight px-1">
                {isComplete ? 'Successfully exported' : option.description}
              </p>
              
              {/* Loading Progress */}
              {isCurrentlyExporting && (
                <div className="absolute bottom-2 left-4 right-4">
                  <div className="w-full bg-white/20 rounded-full h-1 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 2 }}
                      className="bg-gradient-to-r from-white to-white/80 h-1 rounded-full"
                    />
                  </div>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="pt-6 border-t border-white/10">
        <h3 className="text-white/90 font-medium mb-4 text-sm">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          <button className="px-3 py-1.5 bg-white/8 hover:bg-white/15 text-white/80 hover:text-white text-xs rounded-lg transition-all duration-200 border border-white/10 hover:border-white/20">
            Save to Favorites
          </button>
          <button className="px-3 py-1.5 bg-white/8 hover:bg-white/15 text-white/80 hover:text-white text-xs rounded-lg transition-all duration-200 border border-white/10 hover:border-white/20">
            Add to Watchlist
          </button>
          <button className="px-3 py-1.5 bg-white/8 hover:bg-white/15 text-white/80 hover:text-white text-xs rounded-lg transition-all duration-200 border border-white/10 hover:border-white/20">
            Schedule Review
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ExportOptions;