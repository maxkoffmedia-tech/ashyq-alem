'use client'

import React from 'react';

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export default function PrimaryButton({ 
  children, 
  onClick, 
  className = '', 
  type = "button" 
}: PrimaryButtonProps) {
  return (
    <button 
      type={type}
      onClick={onClick}
      className={`
        px-6 py-2 
        bg-[#f4a261] 
        text-[#1a0f00] 
        rounded-full 
        font-bold 
        hover:opacity-80 
        active:scale-95
        transition-all 
        shadow-md
        ${className}
      `}
    >
      {children}
    </button>
  );
}