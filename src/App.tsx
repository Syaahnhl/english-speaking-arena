import React from 'react';
import { ArenaProvider, useArena } from './context/ArenaContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { ToastNotification } from './components/common/ToastNotification';

// Pages / Views
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { SpeakingCardsView } from './components/speaking-cards/SpeakingCardsView';
import { SpeakingCartView } from './components/speaking-cart/SpeakingCartView';
import { RoleplayView } from './components/roleplay/RoleplayView';
import { RunningReadingView } from './components/running-reading/RunningReadingView';
import { SpeakingArenaView } from './components/arena/SpeakingArenaView';
import { InteractiveHubView } from './components/interactive/InteractiveHubView';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { ProfileProgressView } from './components/profile/ProfileProgressView';

const MainContent: React.FC = () => {
  const { activeTab, role } = useArena();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <StudentDashboard />;
      case 'cards':
        return <SpeakingCardsView />;
      case 'cart':
        return <SpeakingCartView />;
      case 'roleplay':
        return <RoleplayView />;
      case 'reading':
        return <RunningReadingView />;
      case 'arena':
        return <SpeakingArenaView />;
      case 'interactive':
        return <InteractiveHubView />;
      case 'teacher':
        return <TeacherDashboard />;
      case 'progress':
        return <ProfileProgressView />;
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Workspace with sidebar anchored to left */}
      <div className="flex-1 flex w-full">
        {/* Desktop Sidebar (Anchored Left) */}
        <Sidebar />

        {/* Content Pane */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-12 overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNav />

      {/* Reactive Toasts */}
      <ToastNotification />
    </div>
  );
};

export function App() {
  return (
    <ArenaProvider>
      <MainContent />
    </ArenaProvider>
  );
}

export default App;
