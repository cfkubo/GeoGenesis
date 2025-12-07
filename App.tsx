import React, { useState, useEffect } from 'react';
import { AppView, Tree } from './types';
import { Dashboard } from './views/Dashboard';
import { PlantTree } from './views/PlantTree';
import { TreeDetail } from './views/TreeDetail';
import { Lottery } from './views/Lottery';
import { Navigation } from './components/Navigation';

const STORAGE_KEY = 'geogenesis_trees_v1';

const App = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [trees, setTrees] = useState<Tree[]>([]);
  const [selectedTree, setSelectedTree] = useState<Tree | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setTrees(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load trees", e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (trees.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trees));
    }
  }, [trees]);

  const handlePlantTree = (newTree: Tree) => {
    const updatedTrees = [newTree, ...trees];
    setTrees(updatedTrees);
    setCurrentView(AppView.DASHBOARD);
  };

  const handleUpdateTree = (updatedTree: Tree) => {
    const updatedTrees = trees.map(t => t.id === updatedTree.id ? updatedTree : t);
    setTrees(updatedTrees);
    setSelectedTree(updatedTree); // Update current view data
  };

  const handleSelectTree = (tree: Tree) => {
    setSelectedTree(tree);
    setCurrentView(AppView.TREE_DETAILS);
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return (
          <Dashboard 
            trees={trees} 
            onSelectTree={handleSelectTree} 
            onChangeView={setCurrentView}
          />
        );
      case AppView.PLANT:
        return (
          <PlantTree 
            onPlant={handlePlantTree} 
            onCancel={() => setCurrentView(AppView.DASHBOARD)} 
          />
        );
      case AppView.TREE_DETAILS:
        if (!selectedTree) return <Dashboard trees={trees} onSelectTree={handleSelectTree} onChangeView={setCurrentView} />;
        return (
          <TreeDetail 
            tree={selectedTree} 
            onBack={() => setCurrentView(AppView.DASHBOARD)}
            onUpdateTree={handleUpdateTree}
          />
        );
      case AppView.LOTTERY:
        return <Lottery trees={trees} />;
      default:
        return <Dashboard trees={trees} onSelectTree={handleSelectTree} onChangeView={setCurrentView} />;
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen text-slate-50 font-sans selection:bg-green-500 selection:text-white">
      {renderView()}
      
      {/* Hide nav on planting/detail screens for immersion, or keep it. Let's hide on Plant/Detail for focus. */}
      {(currentView === AppView.DASHBOARD || currentView === AppView.LOTTERY) && (
        <Navigation currentView={currentView} onChangeView={setCurrentView} />
      )}
    </div>
  );
};

export default App;