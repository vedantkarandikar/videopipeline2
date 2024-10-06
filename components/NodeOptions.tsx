"use client"

import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NodeOptionsProps {
  node: any;
  onClose: () => void;
}

const NodeOptions: React.FC<NodeOptionsProps> = ({ node, onClose }) => {
  return (
    <div className="w-64 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Node Options</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      {node && (
        <div>
          <p className="mb-2"><strong>Type:</strong> {node.type}</p>
          <p className="mb-2"><strong>Label:</strong> {node.data.label}</p>
          {/* Add more node options here */}
        </div>
      )}
    </div>
  );
};

export default NodeOptions;