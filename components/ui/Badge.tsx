import React from 'react';
import { clsx } from 'clsx';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ 
    className,
    variant = 'default',
    size = 'md',
    dot = false,
    children,
    ...props
  }, ref) => {
    const baseClasses = [
      'inline-flex items-center font-medium rounded-full transition-all duration-200 ease-out-custom'
    ];

    const variantClasses = {
      default: [
        'bg-muted text-muted-foreground border border-border'
      ],
      primary: [
        'bg-primary text-primary-foreground shadow-sm'
      ],
      success: [
        'bg-green-500 text-white shadow-sm'
      ],
      warning: [
        'bg-warning text-warning-foreground shadow-sm'
      ],
      error: [
        'bg-error text-error-foreground shadow-sm'
      ],
      info: [
        'bg-info text-info-foreground shadow-sm'
      ],
      neutral: [
        'bg-neutral-100 text-neutral-700 border border-neutral-200'
      ]
    };

    const sizeClasses = {
      sm: dot ? 'w-2 h-2' : 'px-2 py-0.5 text-xs',
      md: dot ? 'w-2.5 h-2.5' : 'px-2.5 py-1 text-sm',
      lg: dot ? 'w-3 h-3' : 'px-3 py-1.5 text-base'
    };

    const classes = clsx(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      dot && 'rounded-full',
      className
    );

    return (
      <span
        className={classes}
        ref={ref}
        {...props}
      >
        {!dot && children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;