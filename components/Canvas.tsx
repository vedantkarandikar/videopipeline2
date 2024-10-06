"use client"

import { useEffect, useRef, useState } from 'react';

interface Block {
  id: number;
  type: string;
  category: string;
  x: number;
  y: number;
}

interface CanvasProps {
  blocks: Block[];
  onUpdateBlocks: (blocks: Block[]) => void;
}

export default function Canvas({ blocks, onUpdateBlocks }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [draggedBlock, setDraggedBlock] = useState<Block | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawCanvas = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw dotted background
      ctx.fillStyle = '#f0f0f0';
      for (let x = 0; x < canvas.width; x += 20) {
        for (let y = 0; y < canvas.height; y += 20) {
          ctx.fillRect(x, y, 1, 1);
        }
      }

      // Draw blocks
      blocks.forEach((block) => {
        ctx.fillStyle = getColorForCategory(block.category);
        ctx.strokeStyle = '#000';
        ctx.fillRect(block.x, block.y, 120, 80);
        ctx.strokeRect(block.x, block.y, 120, 80);

        ctx.fillStyle = '#000';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(block.type, block.x + 60, block.y + 40);
      });

      // Draw connections
      ctx.beginPath();
      blocks.forEach((block, index) => {
        if (index > 0) {
          const prevBlock = blocks[index - 1];
          ctx.moveTo(prevBlock.x + 120, prevBlock.y + 40);
          ctx.lineTo(block.x, block.y + 40);
        }
      });
      ctx.stroke();
    };

    drawCanvas();
  }, [blocks]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedBlock = blocks.find(
      (block) =>
        x >= block.x &&
        x <= block.x + 120 &&
        y >= block.y &&
        y <= block.y + 80
    );

    if (clickedBlock) {
      setDraggedBlock(clickedBlock);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!draggedBlock) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const updatedBlocks = blocks.map((block) =>
      block.id === draggedBlock.id ? { ...block, x, y } : block
    );

    onUpdateBlocks(updatedBlocks);
  };

  const handleMouseUp = () => {
    setDraggedBlock(null);
  };

  function getColorForCategory(category: string): string {
    switch (category) {
      case 'Input':
        return '#90cdf4';
      case 'Processing':
        return '#9ae6b4';
      case 'Output':
        return '#fbd38d';
      default:
        return '#e2e8f0';
    }
  }

  return (
    <div className="flex-1 bg-gray-100 overflow-auto">
      <canvas
        ref={canvasRef}
        width={2000}
        height={1000}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
}