import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, ZoomIn, ZoomOut, Download } from 'lucide-react';

interface HighlightedText {
  field: string;
  text: string;
  position: { top: number; left: number; width: number; height: number };
  color: string;
}

const mockHighlights: HighlightedText[] = [
  {
    field: 'Counterparty',
    text: 'ABC Bank Ltd.',
    position: { top: 15, left: 20, width: 12, height: 2 },
    color: 'bg-green-400/30 border-green-400'
  },
  {
    field: 'Notional Amount',
    text: '$100,000,000',
    position: { top: 25, left: 45, width: 15, height: 2 },
    color: 'bg-blue-400/30 border-blue-400'
  },
  {
    field: 'Trade Date',
    text: '2024-01-15',
    position: { top: 35, left: 30, width: 10, height: 2 },
    color: 'bg-teal-400/30 border-teal-400'
  },
  {
    field: 'Missing Interest Rate',
    text: '[MISSING]',
    position: { top: 45, left: 25, width: 18, height: 2 },
    color: 'bg-red-400/30 border-red-400'
  }
];

interface DocumentPreviewProps {
  documentName?: string;
  onHighlightHover?: (field: string | null) => void;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ 
  documentName = "deal-contract-2024.pdf",
  onHighlightHover 
}) => {
  const [zoom, setZoom] = useState(100);
  const [selectedHighlight, setSelectedHighlight] = useState<string | null>(null);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden h-full"
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className="h-5 w-5 text-teal-400" />
          <span className="text-white font-medium">{documentName}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleZoomOut}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ZoomOut className="h-4 w-4 text-white" />
          </button>
          <span className="text-white/70 text-sm min-w-[3rem] text-center">
            {zoom}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ZoomIn className="h-4 w-4 text-white" />
          </button>
          <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
            <Download className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>

      {/* Document Preview */}
      <div className="p-4 h-full overflow-auto">
        <div 
          className="relative bg-white rounded-lg shadow-lg mx-auto"
          style={{ 
            width: `${(8.5 * zoom) / 100 * 96}px`,
            minHeight: `${(11 * zoom) / 100 * 96}px`,
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center'
          }}
        >
          {/* Mock Document Content */}
          <div className="p-8 text-gray-800 text-sm leading-relaxed">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">DERIVATIVE TRANSACTION CONFIRMATION</h1>
              <p className="text-gray-600">Trade Reference: DTC-2024-001</p>
            </div>

            <div className="space-y-4">
              <p>
                This confirms the terms of the derivative transaction entered into between 
                <span className="font-semibold"> ABC Bank Ltd.</span> and XYZ Corporation on 
                <span className="font-semibold"> January 15, 2024</span>.
              </p>

              <div className="grid grid-cols-2 gap-4 my-6">
                <div>
                  <h3 className="font-semibold mb-2">Transaction Details:</h3>
                  <p>Notional Amount: <span className="font-semibold">$100,000,000</span></p>
                  <p>Currency: USD</p>
                  <p>Trade Date: <span className="font-semibold">2024-01-15</span></p>
                  <p>Maturity Date: 2025-01-15</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Settlement:</h3>
                  <p>Settlement Date: 2024-01-17</p>
                  <p>Collateral: Government Bonds</p>
                  <p className="text-red-600">Interest Rate: [TO BE CONFIRMED]</p>
                </div>
              </div>

              <p className="text-sm text-gray-600 mt-8">
                This confirmation is subject to the terms and conditions of the ISDA Master Agreement 
                dated as of [DATE] between the parties.
              </p>
            </div>
          </div>

          {/* Highlights Overlay */}
          {mockHighlights.map((highlight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.2 }}
              className={`absolute border-2 rounded cursor-pointer transition-all duration-200 ${highlight.color} ${
                selectedHighlight === highlight.field ? 'opacity-80 scale-105' : 'opacity-60 hover:opacity-80'
              }`}
              style={{
                top: `${highlight.position.top}%`,
                left: `${highlight.position.left}%`,
                width: `${highlight.position.width}%`,
                height: `${highlight.position.height}%`,
              }}
              onClick={() => setSelectedHighlight(
                selectedHighlight === highlight.field ? null : highlight.field
              )}
              onMouseEnter={() => onHighlightHover?.(highlight.field)}
              onMouseLeave={() => onHighlightHover?.(null)}
            >
              {selectedHighlight === highlight.field && (
                <div className="absolute -top-8 left-0 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                  {highlight.field}: {highlight.text}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="p-4 border-t border-white/10">
        <h4 className="text-white font-medium mb-2">Extracted Fields</h4>
        <div className="flex flex-wrap gap-2">
          {mockHighlights.map((highlight, index) => (
            <button
              key={index}
              onClick={() => setSelectedHighlight(
                selectedHighlight === highlight.field ? null : highlight.field
              )}
              className={`px-2 py-1 rounded text-xs border transition-all ${highlight.color} ${
                selectedHighlight === highlight.field ? 'opacity-100' : 'opacity-70 hover:opacity-100'
              }`}
            >
              {highlight.field}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default DocumentPreview;