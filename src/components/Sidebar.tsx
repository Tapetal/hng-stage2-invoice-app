import React from 'react';

interface Props {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export default function Sidebar({ theme, onToggleTheme }: Props) {
  return (
    <nav className="sidebar" aria-label="App navigation">
      {/* Logo */}
      <div className="sidebar-logo-wrap" aria-hidden="true">
        <svg width="80" height="80" viewBox="0 0 103 103" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0H83C94.0457 0 103 8.9543 103 20V83C103 94.0457 94.0457 103 83 103H0V0Z" fill="#7C5DFA"/>
          <mask id="mask0_sb" style={{maskType:'luminance'}} maskUnits="userSpaceOnUse" x="0" y="0" width="103" height="103">
            <path d="M0 0H83C94.0457 0 103 8.9543 103 20V83C103 94.0457 94.0457 103 83 103H0V0Z" fill="white"/>
          </mask>
          <g mask="url(#mask0_sb)">
            <path d="M103 52H20C8.95431 52 0 60.9543 0 72V135C0 146.046 8.95431 155 20 155H103V52Z" fill="#9277FF"/>
          </g>
          <path fillRule="evenodd" clipRule="evenodd" d="M42.6942 33.2922L52 51.9999L61.3058 33.2922C67.6645 36.6407 72 43.314 72 50.9999C72 62.0456 63.0457 70.9999 52 70.9999C40.9543 70.9999 32 62.0456 32 50.9999C32 43.314 36.3355 36.6407 42.6942 33.2922Z" fill="white"/>
        </svg>
      </div>

      <div className="sidebar-right">
        {/* Theme toggle */}
        <button
          className="theme-btn"
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        >
          {theme === 'dark' ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M10 1v2M10 17v2M1 10h2M17 10h2M3.22 3.22l1.42 1.42M15.36 15.36l1.42 1.42M15.36 4.64l-1.42 1.42M4.64 15.36l-1.42 1.42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>

        <div className="sidebar-divider" aria-hidden="true" />

        {/* Avatar */}
        <div className="sidebar-avatar">
          <img
            src="/image_stage2.png"
            alt="User avatar"
            className="avatar-img"
            width="36"
            height="36"
          />
        </div>
      </div>
    </nav>
  );
}
