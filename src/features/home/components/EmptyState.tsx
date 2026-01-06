import React from 'react';
import { Music2, Sparkles, ListMusic } from 'lucide-react';

interface EmptyStateProps {
  icon?: 'music' | 'sparkles' | 'list';
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const iconMap = {
  music: Music2,
  sparkles: Sparkles,
  list: ListMusic,
};

const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon = 'music', 
  title, 
  description,
  action 
}) => {
  const Icon = iconMap[icon];
  
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-[#13132b]/50 border border-white/5 flex items-center justify-center mb-4">
        <Icon size={36} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-gray-400 max-w-md mb-4">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-full font-medium transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
