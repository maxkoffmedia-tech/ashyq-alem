import React from 'react';

// Main container component
export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="max-w-4xl mx-auto flex flex-col min-h-screen p-4 md:p-8">
      {children}
    </main>
  );
}
