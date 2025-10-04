import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, ZoomIn, ZoomOut, Download } from 'lucide-react';

interface HighlightedText {
  field: string;
  text: string;
  position: { top: number; left: number; width: number; height: number };
  color: string;
  confidence: number;
}

const mockHighlights: HighlightedText[] = [
  {
    field: 'Counterparty',
    text: 'ABC Bank Ltd.',
    position: { top: 15, left: 20, width: 12, height: 2 },
    color: 'bg-green-400/30 border-green-400',
    confidence: 98
  },
  {
    field: 'Notional Amount',
    text: '$100,000,000',
    position: { top: 25, left: 45, width: 15, height: 2 },
    color: 'bg-green-400/30 border-green-400',
    confidence: 95
  },
  {
    field: 'Trade Date',
    text: '2024-01-15',
    position: { top: 35, left: 30, width: 10, height: 2 },
    color: 'bg-green-400/30 border-green-400',
    confidence: 92
  },
  {
    field: 'Interest Rate',
    text: '[MISSING]',
    position: { top: 45, left: 25, width: 18, height: 2 },
    color: 'bg-red-400/30 border-red-400',
    confidence: 0
  },
  {
    field: 'Collateral',
    text: 'Government Bonds',
    position: { top: 55, left: 35, width: 16, height: 2 },
    color: 'bg-yellow-400/30 border-yellow-400',
    confidence: 67
  }
];

interface DocumentPreviewProps {
  documentName?: string;
  onHighlightHover?: (field: string | null) => void;
  hoveredField?: string | null;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ 
  documentName = "deal-contract-2024.pdf",
  onHighlightHover,
  hoveredField
}) => {
  const [zoom, setZoom] = useState(100);
  const [selectedHighlight, setSelectedHighlight] = useState<string | null>(null);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
        <div className="flex items-center space-x-3">
          <FileText className="h-5 w-5 text-gray-600" />
          <span className="text-gray-800 font-medium">{documentName}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleZoomOut}
            className="p-2 bg-white hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
          >
            <ZoomOut className="h-4 w-4 text-gray-600" />
          </button>
          <span className="text-gray-600 text-sm min-w-[3rem] text-center">
            {zoom}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-2 bg-white hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
          >
            <ZoomIn className="h-4 w-4 text-gray-600" />
          </button>
          <button className="p-2 bg-white hover:bg-gray-100 rounded-lg transition-colors border border-gray-200">
            <Download className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Document Preview */}
      <div className="flex-1 p-4 overflow-auto bg-gray-100">
        <div 
          className="relative bg-white rounded-lg shadow-lg mx-auto border border-gray-300"
          style={{ 
            width: `${(8.5 * zoom) / 100 * 96}px`,
            minHeight: `${(11 * zoom) / 100 * 96}px`,
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
                selectedHighlight === highlight.field || hoveredField === highlight.field 
                  ? 'opacity-90 scale-105 ring-2 ring-teal-400 shadow-lg' 
                  : 'opacity-60 hover:opacity-80'
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
              {(selectedHighlight === highlight.field || hoveredField === highlight.field) && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-12 left-0 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap z-10 shadow-lg"
                >
                  <div className="font-medium">{highlight.field}</div>
                  <div className="text-gray-300">{highlight.text} • {highlight.confidence}%</div>
                  <div className="absolute top-full left-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <h4 className="text-gray-800 font-medium mb-2">Extracted Fields</h4>
        <div className="flex flex-wrap gap-2">
          {mockHighlights.map((highlight, index) => (
            <button
              key={index}
              onClick={() => setSelectedHighlight(
                selectedHighlight === highlight.field ? null : highlight.field
              )}
              className={`px-3 py-1 rounded-full text-xs border transition-all ${
                highlight.confidence >= 90 ? 'bg-green-100 border-green-300 text-green-800' :
                highlight.confidence >= 70 ? 'bg-yellow-100 border-yellow-300 text-yellow-800' :
                'bg-red-100 border-red-300 text-red-800'
              } ${
                selectedHighlight === highlight.field || hoveredField === highlight.field 
                  ? 'opacity-100 ring-2 ring-teal-400' 
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              {highlight.field} ({highlight.confidence}%)
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentPreview;