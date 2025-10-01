import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Mail, FileText, Share2, Printer, CheckCircle } from 'lucide-react';

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
      description: 'Complete risk assessment with charts and recommendations',
      icon: FileText,
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
      description: 'Send executive summary to stakeholders',
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
      description: 'Print-friendly version of the full analysis',
      icon: Printer,
      color: 'from-gray-500 to-gray-600',
      action: () => {
        window.print();
      }
    },
    {
      id: 'share-link',
      title: 'Share Link',
      description: 'Generate secure link for team collaboration',
      icon: Share2,
      color: 'from-green-500 to-green-600',
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
      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <Download className="h-6 w-6 text-teal-400" />
        <h2 className="text-xl font-semibold text-white">
          Export & Share
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleExport(option.id, option.action)}
              disabled={isCurrentlyExporting || isComplete}
              className={`
                relative p-4 rounded-xl border border-white/20 text-left transition-all duration-200
                ${isComplete 
                  ? 'bg-green-500/20 border-green-400/30' 
                  : 'bg-white/5 hover:bg-white/10'
                }
                ${isCurrentlyExporting ? 'cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className="flex items-start space-x-4">
                <div className={`
                  p-3 rounded-lg bg-gradient-to-r ${option.color} flex-shrink-0
                  ${isCurrentlyExporting ? 'animate-pulse' : ''}
                `}>
                  {isComplete ? (
                    <CheckCircle className="h-5 w-5 text-white" />
                  ) : (
                    <Icon className="h-5 w-5 text-white" />
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-1">
                    {isComplete ? 'Export Complete!' : option.title}
                  </h3>
                  <p className="text-white/70 text-sm">
                    {isComplete ? 'Successfully exported' : option.description}
                  </p>
                  
                  {isCurrentlyExporting && (
                    <div className="mt-2">
                      <div className="w-full bg-white/20 rounded-full h-1">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 2 }}
                          className="bg-white h-1 rounded-full"
                        />
                      </div>
                      <p className="text-white/60 text-xs mt-1">Preparing export...</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <h3 className="text-white font-medium mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          <button className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors">
            Save to Favorites
          </button>
          <button className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors">
            Add to Watchlist
          </button>
          <button className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors">
            Schedule Review
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ExportOptions;