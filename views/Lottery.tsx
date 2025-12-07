import React from 'react';
import { Tree } from '../types';

interface LotteryProps {
  trees: Tree[];
}

export const Lottery: React.FC<LotteryProps> = ({ trees }) => {
  // Mock data for the "Global" state
  const prizePool = 15000;
  const nextDrawDays = 12;
  
  const eligibleTrees = trees.filter(t => t.status === 'healthy').length;
  const totalTickets = eligibleTrees; // 1 Healthy tree = 1 Ticket

  return (
    <div className="pb-24 pt-8 px-6 min-h-screen bg-slate-900">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-2">
          Green Lottery
        </h1>
        <p className="text-slate-400 text-sm">Make the planet better, win rewards.</p>
      </div>

      {/* Prize Card */}
      <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl shadow-orange-900/20 mb-8 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-yellow-100 text-sm font-medium mb-1">This Month's Prize Pool</p>
          <div className="text-5xl font-black tracking-tight">${prizePool.toLocaleString()}</div>
          <div className="mt-4 flex items-center space-x-2 text-sm bg-black/20 w-fit px-3 py-1 rounded-full">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span>Draw in {nextDrawDays} days</span>
          </div>
        </div>
        {/* Decorative circles */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-black/10 rounded-full blur-xl"></div>
      </div>

      {/* User Stats */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-8">
        <h2 className="text-white font-bold mb-4 flex items-center">
          <span className="mr-2">🎟️</span> Your Entries
        </h2>
        
        <div className="flex justify-between items-end mb-2">
          <span className="text-slate-400 text-sm">Healthy Trees</span>
          <span className="text-2xl font-bold text-white">{eligibleTrees}</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2 mb-4">
          <div className="bg-green-500 h-2 rounded-full w-full opacity-50"></div>
        </div>
        
        <p className="text-xs text-slate-500 leading-relaxed">
          Every healthy tree you maintain grants you 1 ticket into the monthly draw. 
          Upload a progress photo every 30 days to keep your tickets active.
        </p>
      </div>

      {/* Leaderboard / Winners */}
      <div>
        <h3 className="text-slate-300 font-bold mb-4 uppercase text-xs tracking-wider">Last Month's Winners</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-green-400 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
                  {String.fromCharCode(64 + i)}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Planter {1000 + i}</p>
                  <p className="text-slate-500 text-xs">Maintained 12 trees</p>
                </div>
              </div>
              <span className="text-yellow-500 font-bold text-sm">${(5000 / i).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};