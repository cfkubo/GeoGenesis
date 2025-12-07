import React from 'react';
import { AppView } from '../types';
import { LeafIcon, TrophyIcon, PlusIcon } from './Icons';

interface NavigationProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onChangeView }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-lg border-t border-slate-700 px-6 py-4 pb-8 flex justify-between items-center z-50">
      <button
        onClick={() => onChangeView(AppView.DASHBOARD)}
        className={`flex flex-col items-center space-y-1 ${currentView === AppView.DASHBOARD ? 'text-green-400' : 'text-slate-400'}`}
      >
        <LeafIcon className="w-6 h-6" />
        <span className="text-xs font-medium">My Trees</span>
      </button>

      <button
        onClick={() => onChangeView(AppView.PLANT)}
        className="relative -top-5 bg-green-500 hover:bg-green-400 text-slate-900 rounded-full p-4 shadow-lg shadow-green-500/30 transition-transform active:scale-95 border-4 border-slate-900"
      >
        <PlusIcon className="w-8 h-8" />
      </button>

      <button
        onClick={() => onChangeView(AppView.LOTTERY)}
        className={`flex flex-col items-center space-y-1 ${currentView === AppView.LOTTERY ? 'text-yellow-400' : 'text-slate-400'}`}
      >
        <TrophyIcon className="w-6 h-6" />
        <span className="text-xs font-medium">Lottery</span>
      </button>
    </div>
  );
};