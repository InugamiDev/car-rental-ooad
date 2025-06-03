import React, { useId } from 'react';
import { clsx } from 'clsx';
import { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  fullWidth?: boolean;
  variant?: 'default' | 'filled' | 'outline';
  inputSize?: 'sm' | 'md' | 'lg';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    type = 'text',
    label,
    error,
    helperText,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    fullWidth = false,
    variant = 'default',
    inputSize = 'md',
    id,
    ...props
  }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    const containerClasses = clsx(
      'relative',
      fullWidth ? 'w-full' : 'w-auto'
    );

    const inputBaseClasses = [
      'transition-all duration-200 ease-out-custom',
      'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'placeholder:text-muted-foreground'
    ];

    const variantClasses = {
      default: [
        'border-2 border-border bg-background text-foreground',
        'hover:border-primary/50',
        'focus:border-primary'
      ],
      filled: [
        'border-0 bg-muted text-foreground',
        'hover:bg-muted/80',
        'focus:bg-background focus:ring-2'
      ],
      outline: [
        'border-2 border-primary bg-transparent text-foreground',
        'hover:bg-primary/5',
        'focus:bg-background'
      ]
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm rounded-md',
      md: 'px-4 py-2 text-base rounded-lg',
      lg: 'px-5 py-3 text-lg rounded-lg'
    };

    const iconPadding = {
      sm: LeftIcon ? 'pl-9' : RightIcon ? 'pr-9' : '',
      md: LeftIcon ? 'pl-10' : RightIcon ? 'pr-10' : '',
      lg: LeftIcon ? 'pl-12' : RightIcon ? 'pr-12' : ''
    };

    const errorClasses = error ? [
      'border-error focus:border-error focus:ring-error',
      'text-error placeholder:text-error/60'
    ] : [];

    const inputClasses = clsx(
      inputBaseClasses,
      variantClasses[variant],
      sizeClasses[inputSize],
      iconPadding[inputSize],
      errorClasses,
      fullWidth ? 'w-full' : '',
      className
    );

    const iconSizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };

    const iconPositionClasses = {
      sm: 'top-2',
      md: 'top-2.5',
      lg: 'top-3.5'
    };

    const leftIconClasses = clsx(
      'absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none',
      iconSizeClasses[inputSize]
    );

    const rightIconClasses = clsx(
      'absolute right-3 transform translate-y-1/2 text-muted-foreground pointer-events-none',
      iconSizeClasses[inputSize],
      iconPositionClasses[inputSize]
    );

    return (
      <div className={containerClasses}>
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground mb-2"
          >
            {label}
            {props.required && (
              <span className="text-error ml-1">*</span>
            )}
          </label>
        )}
        
        <div className="relative">
          {LeftIcon && (
            <LeftIcon className={leftIconClasses} />
          )}
          
          <input
            type={type}
            className={inputClasses}
            ref={ref}
            id={inputId}
            {...props}
          />
          
          {RightIcon && (
            <RightIcon className={rightIconClasses} />
          )}
        </div>

        {(error || helperText) && (
          <div className="mt-1">
            {error && (
              <p className="text-sm text-error">{error}</p>
            )}
            {helperText && !error && (
              <p className="text-sm text-muted-foreground">{helperText}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;