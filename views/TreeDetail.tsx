import React, { useState, useRef } from 'react';
import { Tree, TreeCheckIn } from '../types';
import { checkTreeProgress } from '../services/geminiService';
import { Spinner, CameraIcon } from '../components/Icons';

interface TreeDetailProps {
  tree: Tree;
  onBack: () => void;
  onUpdateTree: (updatedTree: Tree) => void;
}

export const TreeDetail: React.FC<TreeDetailProps> = ({ tree, onBack, onUpdateTree }) => {
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const daysSinceCheckIn = Math.floor((Date.now() - new Date(tree.lastCheckInDate).getTime()) / (1000 * 60 * 60 * 24));
  const canCheckIn = daysSinceCheckIn >= 30 || tree.checkIns.length === 0; // Allow instant check-in for demo purposes if 0 checkins
  
  // For demo, we might want to override the 30 day rule to test functionality
  const DEMO_MODE = true; 
  const checkInAvailable = DEMO_MODE || canCheckIn;

  const handleCheckInCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsCheckingIn(true);
      setIsAnalyzing(true);
      
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64 = reader.result as string;
        
        try {
          const result = await checkTreeProgress(base64, tree.species);
          
          const newCheckIn: TreeCheckIn = {
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
            imageUrl: base64,
            aiHealthAnalysis: result.message,
            isHealthy: result.healthStatus === 'healthy'
          };

          const updatedTree: Tree = {
            ...tree,
            lastCheckInDate: newCheckIn.date,
            status: result.healthStatus === 'dead' ? 'needs-attention' : 'healthy', // Simplified status logic
            checkIns: [newCheckIn, ...tree.checkIns]
          };

          onUpdateTree(updatedTree);
          setIsAnalyzing(false);
          setIsCheckingIn(false);
        } catch (err) {
          console.error(err);
          alert("Failed to analyze progress. Please try again.");
          setIsAnalyzing(false);
          setIsCheckingIn(false);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 pb-24">
      {/* Header Image */}
      <div className="relative h-72 w-full">
        <img src={tree.imageUrl} alt={tree.nickname} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 bg-black/30 backdrop-blur-md text-white p-2 px-4 rounded-lg text-sm"
        >
          ← Back
        </button>
        <div className="absolute bottom-6 left-6 right-6">
          <h1 className="text-3xl font-bold text-white">{tree.nickname}</h1>
          <p className="text-green-400 font-medium">{tree.species}</p>
        </div>
      </div>

      <div className="px-6 mt-6 space-y-8">
        {/* Status Section */}
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-400 text-sm">Current Status</p>
              <p className={`text-xl font-bold ${tree.status === 'healthy' ? 'text-green-400' : 'text-orange-400'}`}>
                {tree.status === 'healthy' ? 'Thriving' : 'Needs Attention'}
              </p>
            </div>
            <div className="text-right">
               <p className="text-slate-400 text-sm">Next Check-in</p>
               <p className="text-xl font-bold text-white">
                 {checkInAvailable ? 'Available Now' : `${30 - daysSinceCheckIn} days`}
               </p>
            </div>
          </div>
          
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            ref={fileInputRef}
            className="hidden"
            onChange={handleCheckInCapture}
          />
          
          {isAnalyzing ? (
            <div className="w-full py-3 bg-slate-700 rounded-xl flex items-center justify-center space-x-3">
              <Spinner />
              <span className="text-slate-300">AI Analyzing Growth...</span>
            </div>
          ) : (
            <button 
              onClick={() => checkInAvailable && fileInputRef.current?.click()}
              disabled={!checkInAvailable}
              className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all ${
                checkInAvailable 
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/40' 
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              <CameraIcon className="w-5 h-5" />
              <span>{checkInAvailable ? 'Record Monthly Growth' : 'Check-in Locked'}</span>
            </button>
          )}
          {DEMO_MODE && !checkInAvailable && <p className="text-xs text-slate-600 text-center mt-2">(Demo: Limits ignored)</p>}
        </div>

        {/* History Timeline */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Growth History</h2>
          <div className="space-y-6 border-l-2 border-slate-700 pl-6 ml-3 relative">
            {/* Current State */}
            <div className="relative">
              <div className="absolute -left-[31px] bg-green-500 w-4 h-4 rounded-full border-2 border-slate-900"></div>
              <p className="text-sm text-slate-400 mb-1">Started: {new Date(tree.plantedDate).toLocaleDateString()}</p>
              <p className="text-white">Tree planted at {tree.location.latitude.toFixed(4)}, {tree.location.longitude.toFixed(4)}</p>
            </div>

            {/* Check-ins */}
            {tree.checkIns.map((checkIn) => (
              <div key={checkIn.id} className="relative">
                 <div className="absolute -left-[31px] bg-blue-500 w-4 h-4 rounded-full border-2 border-slate-900"></div>
                 <p className="text-sm text-slate-400 mb-2">{new Date(checkIn.date).toLocaleDateString()}</p>
                 <div className="bg-slate-800 rounded-xl p-3 border border-slate-700">
                    <img src={checkIn.imageUrl} alt="Progress" className="w-full h-32 object-cover rounded-lg mb-3" />
                    <p className="text-sm text-white italic">"{checkIn.aiHealthAnalysis}"</p>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};