import React from 'react';
import { Tree, AppView } from '../types';
import { TreeCard } from '../components/TreeCard';

interface DashboardProps {
  trees: Tree[];
  onSelectTree: (tree: Tree) => void;
  onChangeView: (view: AppView) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ trees, onSelectTree, onChangeView }) => {
  return (
    <div className="pb-24 pt-8 px-6 space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">
            GeoGenesis
          </h1>
          <p className="text-slate-400 text-sm">Welcome back, Planter.</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
            <span className="text-lg">🌍</span>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
          <div className="text-3xl font-bold text-white">{trees.length}</div>
          <div className="text-xs text-slate-400">Trees Planted</div>
        </div>
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
          <div className="text-3xl font-bold text-green-400">{trees.length * 10}</div>
          <div className="text-xs text-slate-400">Impact Points</div>
        </div>
      </div>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white">Your Forest</h2>
        </div>
        
        {trees.length === 0 ? (
          <div className="text-center py-12 bg-slate-800/50 rounded-2xl border border-dashed border-slate-700">
            <div className="text-4xl mb-3">🌱</div>
            <h3 className="text-white font-medium mb-1">Start your journey</h3>
            <p className="text-slate-400 text-sm mb-4 px-8">Plant your first tree to enter the lottery and save the planet.</p>
            <button 
              onClick={() => onChangeView(AppView.PLANT)}
              className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors"
            >
              Plant Now
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {trees.map(tree => (
              <TreeCard key={tree.id} tree={tree} onClick={onSelectTree} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};