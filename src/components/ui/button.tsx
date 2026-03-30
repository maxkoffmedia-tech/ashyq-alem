"use client";

import { forwardRef } from "react";

const Button = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, ...props }, ref) => (
  <button ref={ref} {...props} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
    {children}
  </button>
));
Button.displayName = "Button";

export { Button };