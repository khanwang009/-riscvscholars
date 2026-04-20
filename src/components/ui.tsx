import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Button({ className, variant = "primary", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "outline" | "ghost" }) {
  const base = "inline-flex items-center justify-center transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest border";
  const variants = {
    primary: "bg-primary text-white hover:bg-black border-primary hover:border-black",
    outline: "bg-transparent text-primary border-primary hover:bg-primary hover:text-white",
    ghost: "bg-transparent text-primary hover:bg-surface-alt border-transparent",
  };
  return <button className={cn(base, variants[variant], className)} {...props} />;
}

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("bg-white", className)} {...props} />;
}

export function Badge({ className, variant = "default", ...props }: React.HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "warning" | "success" | "outline" }) {
  const base = "inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold uppercase";
  const variants = {
    default: "bg-primary text-white",
    warning: "bg-accent/20 text-primary",
    success: "bg-surface-alt text-black border border-border border-dashed",
    outline: "bg-surface-alt text-gray-500",
  };
  return <span className={cn(base, variants[variant], className)} {...props} />
}
