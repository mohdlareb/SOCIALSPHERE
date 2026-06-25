import React from 'react';
import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Bell, Moon, Sun, Shield, LogOut, ChevronRight, Info } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { useTheme } from '../context/useTheme';

interface SettingsRowProps {
  icon: ReactNode;
  label: string;
  description?: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  to?: string;
  trailing?: ReactNode;
}

function SettingsRow({ icon, label, description, onClick, to, trailing }: SettingsRowProps) {
  const content = (
    <div
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-dark-border/40 transition cursor-pointer select-none"
    >
      <div className="text-gray-600 dark:text-dark-text-secondary">{icon}</div>
      <div className="flex-1">
        <p className="text-sm text-gray-900 dark:text-dark-text-primary">{label}</p>
        {description && <p className="text-xs text-gray-400 dark:text-dark-text-secondary">{description}</p>}
      </div>
      {trailing ?? <ChevronRight size={18} className="text-gray-400 dark:text-dark-text-secondary" />}
    </div>
  );

  if (to) return <Link to={to}>{content}</Link>;
  return content;
}

export default function Settings() {
  const { username, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text-primary mb-6">Settings</h1>

      <div className="mb-6">
        <p className="text-xs font-semibold text-gray-400 dark:text-dark-text-secondary uppercase px-1 mb-2">Account</p>
        <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl overflow-hidden divide-y divide-gray-100 dark:divide-dark-border">
          <SettingsRow icon={<User size={18} />} label="Edit profile" description={`@${username}`} to="/profile/edit" />
          <SettingsRow icon={<Lock size={18} />} label="Password and security" description="Coming soon" />
          <SettingsRow icon={<Shield size={18} />} label="Privacy" description="Coming soon" />
        </div>
      </div>

      <div className="mb-6">
        <p className="text-xs font-semibold text-gray-400 dark:text-dark-text-secondary uppercase px-1 mb-2">Preferences</p>
        <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl overflow-hidden divide-y divide-gray-100 dark:divide-dark-border">
          <SettingsRow
            icon={isDark ? <Sun size={18} /> : <Moon size={18} />}
            label="Dark mode"
            description={isDark ? 'On' : 'Off'}
            onClick={toggleTheme}
            trailing={
              <div
                className={`w-10 h-5 rounded-full flex items-center px-0.5 transition-colors ${
                  isDark ? 'bg-purple-500 justify-end' : 'bg-gray-300 dark:bg-dark-border justify-start'
                }`}
              >
                <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
              </div>
            }
          />
          <SettingsRow icon={<Bell size={18} />} label="Notifications" description="Coming soon" />
        </div>
      </div>

      <div className="mb-6">
        <p className="text-xs font-semibold text-gray-400 dark:text-dark-text-secondary uppercase px-1 mb-2">About</p>
        <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl overflow-hidden">
          <SettingsRow icon={<Info size={18} />} label="About SocialSphere" description="v1.0 — built with Spring Boot & React" />
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 text-red-500 font-semibold py-3 rounded-xl border border-red-200 dark:border-red-900/40 hover:bg-red-50 dark:hover:bg-red-950/10 transition"
      >
        <LogOut size={18} /> Log out
      </button>
    </div>
  );
}