import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';
import UserProfile from './UserProfile';

interface HeaderProps {
  onHomeClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onHomeClick }) => {
  const { user, loading } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const handleAuthClick = () => {
    setAuthMode('signin');
    setAuthModalOpen(true);
  };

  const handleSignUpClick = () => {
    setAuthMode('signup');
    setAuthModalOpen(true);
  };

  const handleLogoClick = () => {
    if (onHomeClick) {
      onHomeClick();
    }
  };

  if (loading) {
    return (
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-gray-800">相性診断</span>
            </div>
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={handleLogoClick}
              className="flex items-center hover:opacity-80 transition-opacity cursor-pointer"
            >
              <span className="text-xl font-bold text-gray-800">相性診断</span>
            </motion.button>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              {user ? (
                <button
                  onClick={() => setProfileModalOpen(true)}
                  className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-full hover:shadow-lg transition-all duration-300"
                >
                  <User className="w-5 h-5" />
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAuthClick}
                    className="flex items-center justify-center w-10 h-10 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-all duration-300"
                  >
                    <LogIn className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleSignUpClick}
                    className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-full hover:shadow-lg transition-all duration-300"
                  >
                    <User className="w-5 h-5" />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />

      <UserProfile
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </>
  );
};

export default Header;