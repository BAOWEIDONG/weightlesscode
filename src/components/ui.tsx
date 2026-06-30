import React from 'react';
import { cn } from '../lib/utils';
import { ChevronLeft } from 'lucide-react';

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost', size?: 'sm' | 'md' | 'lg' }>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-[#07C160] text-white hover:bg-[#06ad56] active:bg-[#05964a] shadow-sm',
      secondary: 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 active:bg-gray-100',
      outline: 'border border-gray-300 text-gray-700 bg-transparent hover:bg-gray-50',
      ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
    };
    const sizes = {
      sm: 'h-8 px-3 text-sm rounded-lg',
      md: 'h-11 px-4 text-base rounded-xl',
      lg: 'h-12 px-6 text-lg rounded-full font-medium',
    };
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#07C160]/20 focus:border-[#07C160] transition-all disabled:cursor-not-allowed disabled:opacity-50 shadow-sm',
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export const Card = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('rounded-2xl bg-white p-4 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] border border-gray-100/50', className)} {...props}>
    {children}
  </div>
);

export const NavBar = ({ title, onBack, right, className }: { title: string; onBack?: () => void; right?: React.ReactNode; className?: string }) => (
  <div className={cn("sticky top-0 z-50 flex h-14 items-center justify-between bg-white/80 backdrop-blur-md px-4 border-b border-gray-100/50", className)}>
    <div className="flex w-16 items-center">
      {onBack && (
        <button onClick={onBack} className="p-2 -ml-2 text-gray-900 hover:bg-gray-100 rounded-full transition-colors active:bg-gray-200">
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}
    </div>
    <div className="text-[17px] font-medium text-gray-900">{title}</div>
    <div className="flex w-16 justify-end">{right}</div>
  </div>
);
