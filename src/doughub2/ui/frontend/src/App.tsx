import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { DashboardScreen } from './components/DashboardScreen';
import { LearningPipelineScreen } from './components/LearningPipelineScreen';
import { BrowserScreen } from './components/BrowserScreen';
import { NotebookScreen } from './components/NotebookScreen';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-[#2C3134] flex flex-col">
      <Navigation currentTab={currentTab} onTabChange={setCurrentTab} />
      
      <div className="flex-1 overflow-hidden h-full">
        {currentTab === 'dashboard' && <DashboardScreen />}
        {currentTab === 'learning' && <LearningPipelineScreen />}
        {currentTab === 'browser' && <div className="h-full overflow-y-auto"><BrowserScreen /></div>}
        {currentTab === 'notebook' && <NotebookScreen />}
      </div>
    </div>
  );
}
