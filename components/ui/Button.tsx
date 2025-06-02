import React from 'react';
import { clsx } from 'clsx';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    icon: Icon,
    iconPosition = 'left',
    fullWidth = false,
    children,
    disabled,
    ...props
  }, ref) => {
    const baseClasses = [
      'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ease-out-custom',
      'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
      'active:scale-95'
    ];

    const variantClasses = {
      primary: [
        'bg-primary text-primary-foreground shadow-sm',
        'hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25',
        'active:translate-y-0 active:scale-95'
      ],
      secondary: [
        'border-2 border-primary text-primary bg-transparent',
        'hover:bg-primary hover:text-primary-foreground hover:shadow-md',
        'active:scale-95'
      ],
      outline: [
        'border-2 border-border text-foreground bg-background',
        'hover:bg-accent hover:text-accent-foreground hover:border-primary/50',
        'active:scale-95'
      ],
      ghost: [
        'text-foreground bg-transparent',
        'hover:bg-accent hover:text-accent-foreground hover:scale-105',
        'active:scale-95'
      ],
      destructive: [
        'bg-destructive text-destructive-foreground shadow-sm',
        'hover:bg-destructive/90 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-destructive/25',
        'active:translate-y-0 active:scale-95'
      ]
    };

    const sizeClasses = {
      sm: 'h-9 px-3 py-1.5 text-sm min-w-[80px]',
      md: 'h-10 px-4 py-2 text-base min-w-[100px]',
      lg: 'h-12 px-6 py-3 text-lg min-w-[120px]'
    };

    const widthClasses = fullWidth ? 'w-full' : '';

    const classes = clsx(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      widthClasses,
      className
    );

    const iconClasses = clsx(
      'flex-shrink-0',
      size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5',
      children && (iconPosition === 'left' ? 'mr-2' : 'ml-2')
    );

    return (
      <button
        className={classes}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <div className={clsx(iconClasses, 'animate-spin')}>
              <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
            {children && <span>Loading...</span>}
          </>
        ) : (
          <>
            {Icon && iconPosition === 'left' && (
              <Icon className={iconClasses} />
            )}
            {children}
            {Icon && iconPosition === 'right' && (
              <Icon className={iconClasses} />
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;