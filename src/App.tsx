import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './pages/Dashboard';
import { ShiftScheduler } from './pages/ShiftScheduler';
import { UserManagement } from './pages/UserManagement';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ShiftProvider } from './contexts/ShiftContext';

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <ShiftProvider>
            <div className="min-h-screen bg-gray-50 flex">
              <Sidebar />
              <div className="flex-1 lg:pl-64">
                <Header />
                <main className="p-6 max-w-6xl mx-auto">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/scheduler" element={<ShiftScheduler />} />
                    <Route path="/users" element={<UserManagement />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </main>
              </div>
            </div>
          </ShiftProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;