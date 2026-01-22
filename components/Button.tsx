
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'cyan';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  fullWidth = false,
  className = "",
  ...props 
}) => {
  const baseStyles = "flex items-center justify-center gap-3 font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg rounded-2xl border";
  
  const variants = {
    primary: "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10",
    secondary: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20",
    cyan: "bg-cyan-500 border-cyan-400 text-black hover:bg-cyan-400",
    danger: "bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20",
    ghost: "bg-transparent border-transparent text-slate-500 hover:text-slate-300",
    outline: "bg-transparent border-white/10 text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400"
  };

  const sizes = {
    sm: "px-3 py-2 text-[10px]",
    md: "px-5 py-4 text-xs",
    lg: "px-8 py-6 text-sm",
    xl: "px-10 py-8 text-base"
  };

  return (
    <button 
      className={`
        ${baseStyles} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${fullWidth ? 'w-full' : ''} 
        ${className}
      `}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
