import React, { useState, useRef } from 'react';
import { AppView, Tree } from '../types';
import { verifyTreeImage } from '../services/geminiService';
import { Spinner, CameraIcon } from '../components/Icons';

interface PlantTreeProps {
  onPlant: (tree: Tree) => void;
  onCancel: () => void;
}

export const PlantTree: React.FC<PlantTreeProps> = ({ onPlant, onCancel }) => {
  const [step, setStep] = useState<'camera' | 'verifying' | 'details' | 'success'>('camera');
  const [image, setImage] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nickname, setNickname] = useState('');
  const [aiData, setAiData] = useState<{ species: string; advice: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setError(null);
      setStep('verifying');
      
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        setImage(base64);

        // Get Location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude
              });
              // Trigger AI Verification once we have location (or in parallel)
              verifyImageWithAI(base64);
            },
            (err) => {
              console.error(err);
              setError("Could not fetch location. GPS is required to plant.");
              setStep('camera');
            },
            { enableHighAccuracy: true }
          );
        } else {
          setError("Geolocation is not supported by this browser.");
          setStep('camera');
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  const verifyImageWithAI = async (base64: string) => {
    try {
      const result = await verifyTreeImage(base64);
      
      if (!result.isTree) {
        setError("AI check failed: This doesn't look like a tree or sapling. Please try again.");
        setStep('camera');
        return;
      }

      setAiData({ species: result.species, advice: result.advice });
      setStep('details');
    } catch (err) {
      setError("AI Service unavailable. Please try again.");
      setStep('camera');
    }
  };

  const handleSubmit = () => {
    if (!image || !location || !aiData) return;

    const newTree: Tree = {
      id: crypto.randomUUID(),
      nickname: nickname || aiData.species,
      species: aiData.species,
      plantedDate: new Date().toISOString(),
      location: { latitude: location.lat, longitude: location.lng },
      imageUrl: image,
      checkIns: [],
      lastCheckInDate: new Date().toISOString(),
      status: 'healthy'
    };

    onPlant(newTree);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col pt-6 pb-20 px-6">
      <div className="flex items-center mb-6">
        <button onClick={onCancel} className="text-slate-400 mr-4">Back</button>
        <h1 className="text-xl font-bold text-white">Plant a Tree</h1>
      </div>

      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {step === 'camera' && (
        <div className="flex-1 flex flex-col items-center justify-center space-y-6">
          <div className="w-full aspect-square bg-slate-800 rounded-2xl border-2 border-dashed border-slate-600 flex flex-col items-center justify-center text-slate-500">
            <CameraIcon className="w-12 h-12 mb-2" />
            <p className="text-sm">Tap to capture</p>
          </div>
          
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            ref={fileInputRef}
            onChange={handleCapture}
            className="hidden"
          />
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg shadow-green-900/50 active:scale-95 transition-transform"
          >
            Take Photo
          </button>
          <p className="text-xs text-slate-500 text-center px-4">
            Ensure GPS is enabled. We verify your location to track global reforestation.
          </p>
        </div>
      )}

      {step === 'verifying' && (
        <div className="flex-1 flex flex-col items-center justify-center">
            {image && <img src={image} alt="Preview" className="w-48 h-48 rounded-xl object-cover mb-8 opacity-50" />}
            <Spinner />
            <p className="mt-4 text-green-400 font-medium">Analyzing with AI...</p>
            <p className="text-xs text-slate-500 mt-2">Identifying species & verifying location</p>
        </div>
      )}

      {step === 'details' && aiData && (
        <div className="flex-1 flex flex-col space-y-6 animate-in slide-in-from-bottom-10 fade-in duration-500">
          <img src={image!} alt="Preview" className="w-full h-48 rounded-2xl object-cover" />
          
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <span className="text-xs text-green-400 font-bold uppercase tracking-wider">AI Identification</span>
            <p className="text-xl text-white font-semibold mt-1">{aiData.species}</p>
            <p className="text-sm text-slate-400 mt-2 italic">"{aiData.advice}"</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-300 ml-1">Give it a nickname</label>
            <input 
              type="text" 
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="e.g. Backyard Oak"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors"
            />
          </div>

          <div className="flex-1"></div>

          <button 
            onClick={handleSubmit}
            className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg shadow-green-900/50"
          >
            Plant & Register
          </button>
        </div>
      )}
    </div>
  );
};