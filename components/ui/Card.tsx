import React from 'react';
import { clsx } from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outline' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
  hover?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className,
    variant = 'default',
    padding = 'md',
    interactive = false,
    hover = false,
    children,
    ...props
  }, ref) => {
    const baseClasses = [
      'rounded-xl transition-all duration-200 ease-out-custom'
    ];

    const variantClasses = {
      default: [
        'bg-card border border-border shadow-card'
      ],
      elevated: [
        'bg-card border border-border shadow-card-hover'
      ],
      outline: [
        'bg-card border-2 border-border'
      ],
      glass: [
        'glass-effect'
      ]
    };

    const paddingClasses = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8'
    };

    const interactiveClasses = interactive ? [
      'cursor-pointer',
      'hover:shadow-card-hover hover:-translate-y-0.5',
      'active:scale-98'
    ] : [];

    const hoverClasses = hover ? [
      'hover:shadow-card-hover hover:-translate-y-1',
      'transition-all duration-300'
    ] : [];

    const classes = clsx(
      baseClasses,
      variantClasses[variant],
      paddingClasses[padding],
      interactiveClasses,
      hoverClasses,
      className
    );

    return (
      <div
        className={classes}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card sub-components
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, title, subtitle, action, children, ...props }, ref) => {
    const classes = clsx(
      'flex items-start justify-between mb-4',
      className
    );

    if (children) {
      return (
        <div className={classes} ref={ref} {...props}>
          {children}
        </div>
      );
    }

    return (
      <div className={classes} ref={ref} {...props}>
        <div>
          {title && (
            <h3 className="text-h4 font-semibold text-foreground">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-body-sm text-muted-foreground mt-1">
              {subtitle}
            </p>
          )}
        </div>
        {action && (
          <div className="flex-shrink-0 ml-4">
            {action}
          </div>
        )}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => {
    const classes = clsx('text-foreground', className);
    return <div className={classes} ref={ref} {...props} />;
  }
);

CardContent.displayName = 'CardContent';

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  justify?: 'start' | 'center' | 'end' | 'between';
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, justify = 'end', ...props }, ref) => {
    const justifyClasses = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between'
    };

    const classes = clsx(
      'flex items-center gap-2 mt-6',
      justifyClasses[justify],
      className
    );
    
    return <div className={classes} ref={ref} {...props} />;
  }
);

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardContent, CardFooter };
export default Card;