import React from 'react';
import { Tree } from '../types';

interface TreeCardProps {
  tree: Tree;
  onClick: (tree: Tree) => void;
}

export const TreeCard: React.FC<TreeCardProps> = ({ tree, onClick }) => {
  const daysSinceCheckIn = Math.floor((Date.now() - new Date(tree.lastCheckInDate).getTime()) / (1000 * 60 * 60 * 24));
  const daysUntilNextCheckIn = Math.max(0, 30 - daysSinceCheckIn);

  return (
    <div 
      onClick={() => onClick(tree)}
      className="bg-slate-800 rounded-2xl overflow-hidden shadow-md border border-slate-700 active:scale-98 transition-transform cursor-pointer"
    >
      <div className="relative h-32 w-full">
        <img src={tree.imageUrl} alt={tree.nickname} className="w-full h-full object-cover" />
        <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 backdrop-blur-md rounded-md text-xs text-white font-medium">
          {tree.status.toUpperCase()}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-white">{tree.nickname}</h3>
        <p className="text-slate-400 text-sm mb-3">{tree.species}</p>
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">Planted {new Date(tree.plantedDate).toLocaleDateString()}</span>
          {daysUntilNextCheckIn === 0 ? (
            <span className="text-green-400 font-bold animate-pulse">Check-in Ready!</span>
          ) : (
            <span className="text-blue-400">{daysUntilNextCheckIn} days to check-in</span>
          )}
        </div>
        
        <div className="mt-3 w-full bg-slate-700 rounded-full h-1.5">
          <div 
            className="bg-green-500 h-1.5 rounded-full" 
            style={{ width: `${Math.min(100, (tree.checkIns.length * 10))}%` }}
          ></div>
        </div>
        <div className="mt-1 text-[10px] text-slate-500 text-right">Progress</div>
      </div>
    </div>
  );
};