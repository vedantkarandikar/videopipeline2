"use client"

import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Image, Mic, Video, Database, Globe, Brain, Speaker, Clapperboard, Wand2, Scissors, Music, Sliders, Palette, Layout, Type, Music2, Mic2, GitBranch, Repeat, Zap, Clock, AlertTriangle, Variable, Plug, Share2, BarChart2, Webhook, Eye, Download, FileOutput, Cog, Shield, CheckSquare, FormInput, MessageSquare, Bell, Users, GitMerge, Share, Lock, ClipboardList, Calendar, Box } from 'lucide-react';

const blockCategories = [
  {
    name: 'Input',
    blocks: [
      { type: 'Image Upload', icon: Image, color: 'bg-blue-100 hover:bg-blue-200' },
      { type: 'Audio Upload', icon: Mic, color: 'bg-blue-100 hover:bg-blue-200' },
      { type: 'Video Upload', icon: Video, color: 'bg-blue-100 hover:bg-blue-200' },
      { type: 'Data Import', icon: Database, color: 'bg-blue-100 hover:bg-blue-200' },
      { type: 'Web Content Fetch', icon: Globe, color: 'bg-blue-100 hover:bg-blue-200' },
    ],
  },
  {
    name: 'Processing',
    blocks: [
      { type: 'Text Analyzer', icon: Brain, color: 'bg-purple-100 hover:bg-purple-200' },
      { type: 'Storyboard Creator', icon: Layout, color: 'bg-purple-100 hover:bg-purple-200' },
      { type: 'Scene Divider', icon: Scissors, color: 'bg-purple-100 hover:bg-purple-200' },
      { type: 'Asset Matcher', icon: Palette, color: 'bg-purple-100 hover:bg-purple-200' },
      { type: 'Audio Transcriber', icon: Speaker, color: 'bg-purple-100 hover:bg-purple-200' },
    ],
  },
  {
    name: 'AI Generation',
    blocks: [
      { type: 'Text-to-Speech Converter', icon: Speaker, color: 'bg-green-100 hover:bg-green-200' },
      { type: 'Text-to-Video Generator', icon: Clapperboard, color: 'bg-green-100 hover:bg-green-200' },
      { type: 'Image Animator', icon: Image, color: 'bg-green-100 hover:bg-green-200' },
      { type: 'Video Synthesizer', icon: Video, color: 'bg-green-100 hover:bg-green-200' },
      { type: 'Character Animator', icon: Users, color: 'bg-green-100 hover:bg-green-200' },
      { type: 'Background Creator', icon: Image, color: 'bg-green-100 hover:bg-green-200' },
    ],
  },
  {
    name: 'Editing & Enhancement',
    blocks: [
      { type: 'Video Editor', icon: Video, color: 'bg-yellow-100 hover:bg-yellow-200' },
      { type: 'Audio Editor', icon: Music, color: 'bg-yellow-100 hover:bg-yellow-200' },
      { type: 'Transition Effects', icon: Wand2, color: 'bg-yellow-100 hover:bg-yellow-200' },
      { type: 'Visual Effects', icon: Wand2, color: 'bg-yellow-100 hover:bg-yellow-200' },
      { type: 'Subtitle Adder', icon: Type, color: 'bg-yellow-100 hover:bg-yellow-200' },
      { type: 'Color Corrector', icon: Palette, color: 'bg-yellow-100 hover:bg-yellow-200' },
      { type: 'Speed Adjuster', icon: Sliders, color: 'bg-yellow-100 hover:bg-yellow-200' },
    ],
  },
  {
    name: 'Customization',
    blocks: [
      { type: 'Style Selector', icon: Palette, color: 'bg-pink-100 hover:bg-pink-200' },
      { type: 'Branding Adder', icon: Image, color: 'bg-pink-100 hover:bg-pink-200' },
      { type: 'Layout Designer', icon: Layout, color: 'bg-pink-100 hover:bg-pink-200' },
      { type: 'Font Selector', icon: Type, color: 'bg-pink-100 hover:bg-pink-200' },
      { type: 'Background Music', icon: Music2, color: 'bg-pink-100 hover:bg-pink-200' },
      { type: 'Voice Selector', icon: Mic2, color: 'bg-pink-100 hover:bg-pink-200' },
    ],
  },
  {
    name: 'Logic & Control',
    blocks: [
      { type: 'Conditional Logic', icon: GitBranch, color: 'bg-indigo-100 hover:bg-indigo-200' },
      { type: 'Loop', icon: Repeat, color: 'bg-indigo-100 hover:bg-indigo-200' },
      { type: 'Parallel Processor', icon: Zap, color: 'bg-indigo-100 hover:bg-indigo-200' },
      { type: 'Delay Timer', icon: Clock, color: 'bg-indigo-100 hover:bg-indigo-200' },
      { type: 'Error Handler', icon: AlertTriangle, color: 'bg-indigo-100 hover:bg-indigo-200' },
      { type: 'Variable Setter', icon: Variable, color: 'bg-indigo-100 hover:bg-indigo-200' },
    ],
  },
  {
    name: 'Integration',
    blocks: [
      { type: 'API Connector', icon: Plug, color: 'bg-cyan-100 hover:bg-cyan-200' },
      { type: 'Social Media Uploader', icon: Share2, color: 'bg-cyan-100 hover:bg-cyan-200' },
      { type: 'Analytics Tracker', icon: BarChart2, color: 'bg-cyan-100 hover:bg-cyan-200' },
      { type: 'Webhook Trigger', icon: Webhook, color: 'bg-cyan-100 hover:bg-cyan-200' },
    ],
  },
  {
    name: 'Output',
    blocks: [
      { type: 'Preview Viewer', icon: Eye, color: 'bg-red-100 hover:bg-red-200' },
      { type: 'Export', icon: Download, color: 'bg-red-100 hover:bg-red-200' },
      { type: 'Format Converter', icon: FileOutput, color: 'bg-red-100 hover:bg-red-200' },
      { type: 'Publisher', icon: Share2, color: 'bg-red-100 hover:bg-red-200' },
      { type: 'Download', icon: Download, color: 'bg-red-100 hover:bg-red-200' },
    ],
  },
  {
    name: 'AI Model Configuration',
    blocks: [
      { type: 'Model Selector', icon: Cog, color: 'bg-violet-100 hover:bg-violet-200' },
      { type: 'Parameter Tuner', icon: Sliders, color: 'bg-violet-100 hover:bg-violet-200' },
      { type: 'Custom Model Trainer', icon: Brain, color: 'bg-violet-100 hover:bg-violet-200' },
    ],
  },
  {
    name: 'Content Moderation',
    blocks: [
      { type: 'Content Filter', icon: Shield, color: 'bg-orange-100 hover:bg-orange-200' },
      { type: 'Compliance Checker', icon: CheckSquare, color: 'bg-orange-100 hover:bg-orange-200' },
      { type: 'Quality Assurance', icon: CheckSquare, color: 'bg-orange-100 hover:bg-orange-200' },
    ],
  },
  {
    name: 'User Interaction',
    blocks: [
      { type: 'Form Input', icon: FormInput, color: 'bg-teal-100 hover:bg-teal-200' },
      { type: 'Feedback Collector', icon: MessageSquare, color: 'bg-teal-100 hover:bg-teal-200' },
      { type: 'Notification Sender', icon: Bell, color: 'bg-teal-100 hover:bg-teal-200' },
    ],
  },
  {
    name: 'Collaboration',
    blocks: [
      { type: 'Commenting', icon: MessageSquare, color: 'bg-lime-100 hover:bg-lime-200' },
      { type: 'Version Controller', icon: GitMerge, color: 'bg-lime-100 hover:bg-lime-200' },
      { type: 'Project Sharer', icon: Share, color: 'bg-lime-100 hover:bg-lime-200' },
    ],
  },
  {
    name: 'Miscellaneous',
    blocks: [
      { type: 'Encryptor', icon: Lock, color: 'bg-gray-100 hover:bg-gray-200' },
      { type: 'Logger', icon: ClipboardList, color: 'bg-gray-100 hover:bg-gray-200' },
      { type: 'Scheduler', icon: Calendar, color: 'bg-gray-100 hover:bg-gray-200' },
      { type: 'Resource Manager', icon: Box, color: 'bg-gray-100 hover:bg-gray-200' },
    ],
  },
];

interface BlockCatalogProps {
  onDragStart: (event: React.DragEvent<HTMLDivElement>, blockType: string) => void;
}

export default function BlockCatalog({ onDragStart }: BlockCatalogProps) {
  const [expandedCategory, setExpandedCategory] = useState('Input');

  return (
    <div className="w-64 bg-white border-r shadow-sm">
      <ScrollArea className="h-full">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Block Catalog</h2>
          <Accordion type="single" collapsible value={expandedCategory} onValueChange={setExpandedCategory}>
            {blockCategories.map((category) => (
              <AccordionItem key={category.name} value={category.name}>
                <AccordionTrigger>{category.name}</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-2">
                    {category.blocks.map((block) => (
                      <div
                        key={block.type}
                        className={`${block.color} p-2 rounded-lg cursor-move flex flex-col items-center justify-center transition-colors duration-200 shadow-sm hover:shadow-md`}
                        draggable
                        onDragStart={(event) => onDragStart(event, block.type)}
                      >
                        <block.icon className="w-6 h-6 mb-1" />
                        <span className="text-xs text-center">{block.type}</span>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </ScrollArea>
    </div>
  );
}