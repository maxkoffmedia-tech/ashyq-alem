"use client";

import { forwardRef } from "react";

const Card = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => (
  <div ref={ref} {...props} className="p-4 border rounded-lg bg-white">
    {children}
  </div>
));
Card.displayName = "Card";

const CardContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => (
  <div ref={ref} {...props} className="p-4">
    {children}
  </div>
));
CardContent.displayName = "CardContent";

export { Card, CardContent };