# UI Style Guide - Car Rental Platform

## Overview
This document defines the comprehensive design system for our car rental platform, ensuring a consistent and unified user experience across all components and pages.

## Design Philosophy
- **Consistency**: Every component follows the same visual language
- **Accessibility**: All components meet WCAG 2.1 guidelines
- **Performance**: Optimized for fast loading and smooth interactions
- **Scalability**: Modular components that can be easily extended

## Color System

### Primary Colors
```css
--primary-50: #eff6ff
--primary-100: #dbeafe
--primary-200: #bfdbfe
--primary-300: #93c5fd
--primary-400: #60a5fa
--primary-500: #3b82f6 (Main Brand)
--primary-600: #2563eb
--primary-700: #1d4ed8
--primary-800: #1e40af
--primary-900: #1e3a8a
```

### Semantic Colors
```css
--success: #22c55e
--warning: #f59e0b
--error: #ef4444
--info: #3b82f6
```

### Neutral Colors
```css
--neutral-50: #f8fafc
--neutral-100: #f1f5f9
--neutral-200: #e2e8f0
--neutral-300: #cbd5e1
--neutral-400: #94a3b8
--neutral-500: #64748b
--neutral-600: #475569
--neutral-700: #334155
--neutral-800: #1e293b
--neutral-900: #0f172a
```

## Typography

### Font Family
- **Primary**: Inter (sans-serif)
- **Monospace**: JetBrains Mono

### Text Hierarchy
```css
h1, .text-h1: 2.25rem (36px) - Bold - Letter spacing: -0.025em
h2, .text-h2: 1.875rem (30px) - Semibold - Letter spacing: -0.025em  
h3, .text-h3: 1.5rem (24px) - Semibold
h4, .text-h4: 1.25rem (20px) - Semibold
body-lg: 1.125rem (18px) - Regular
body: 1rem (16px) - Regular
body-sm: 0.875rem (14px) - Regular
caption: 0.75rem (12px) - Medium - Uppercase - Letter spacing: 0.05em
```

## Spacing System

### Base Unit: 4px
```css
spacing-0: 0px
spacing-1: 4px
spacing-2: 8px  
spacing-3: 12px
spacing-4: 16px
spacing-5: 20px
spacing-6: 24px
spacing-8: 32px
spacing-10: 40px
spacing-12: 48px
spacing-16: 64px
spacing-20: 80px
spacing-24: 96px
spacing-32: 128px
```

## Component Guidelines

### Buttons

#### Variants
- **Primary**: Main actions (Book Now, Submit, etc.)
- **Secondary**: Secondary actions (outline style)
- **Outline**: Neutral actions with border
- **Ghost**: Minimal actions without background
- **Destructive**: Delete or cancel actions

#### Sizes
- **Small**: 8px padding, 14px font
- **Medium**: 12px padding, 16px font (default)
- **Large**: 16px padding, 18px font

#### States
- **Default**: Base appearance
- **Hover**: Slight lift (-2px transform) + shadow
- **Active**: Scale down (95%) + no transform
- **Disabled**: 50% opacity + no interactions
- **Loading**: Spinner + disabled state

### Cards

#### Variants
- **Default**: Standard shadow and padding
- **Elevated**: Stronger shadow for important content
- **Outline**: Border instead of shadow
- **Glass**: Backdrop blur effect

#### Padding Options
- **None**: No internal padding
- **Small**: 16px padding
- **Medium**: 24px padding (default)
- **Large**: 32px padding

#### Interactive States
- **Hover**: Slight lift + stronger shadow
- **Interactive**: Cursor pointer + hover effects

### Form Inputs

#### Variants
- **Default**: Border with background
- **Filled**: Solid background, no border
- **Outline**: Prominent border styling

#### Sizes
- **Small**: 12px padding, 14px font
- **Medium**: 16px padding, 16px font (default)
- **Large**: 20px padding, 18px font

#### States
- **Default**: Light border
- **Focus**: Primary border + ring shadow
- **Error**: Red border + error message
- **Disabled**: Reduced opacity + no interaction

## Layout Patterns

### Container Styles
```css
.container-responsive: Max-width 1280px, responsive padding
.section-spacing: 48px vertical padding (desktop), 32px (mobile)
```

### Grid Systems
- **Card Grids**: 1-4 columns responsive
- **Form Layouts**: Single column with proper spacing
- **Navigation**: Horizontal with proper touch targets

## Animation Guidelines

### Timing Functions
```css
ease-out-custom: cubic-bezier(0.25, 0.46, 0.45, 0.94)
ease-in-out-custom: cubic-bezier(0.4, 0, 0.2, 1)
bounce-custom: cubic-bezier(0.68, -0.55, 0.265, 1.55)
```

### Duration Standards
- **Micro-interactions**: 200ms
- **Page transitions**: 300ms
- **Complex animations**: 400-600ms

### Transform Effects
- **Hover lift**: -2px to -4px translateY
- **Active press**: 95% scale
- **Loading states**: Rotate 360deg (1s linear infinite)

## Shadows

### Elevation System
```css
shadow-card: 0 1px 3px rgba(0, 0, 0, 0.1)
shadow-card-hover: 0 4px 12px rgba(0, 0, 0, 0.15)
shadow-car-card: 0 8px 25px rgba(0, 0, 0, 0.15)
shadow-button: 0 4px 12px rgba(59, 130, 246, 0.3)
shadow-focus: 0 0 0 3px rgba(59, 130, 246, 0.1)
```

## Accessibility Standards

### Color Contrast
- **Normal text**: Minimum 4.5:1 ratio
- **Large text**: Minimum 3:1 ratio
- **Interactive elements**: Minimum 3:1 ratio

### Focus States
- **Visible outline**: 2px ring with offset
- **High contrast**: Maintains visibility in all themes
- **Keyboard navigation**: Clear tab order

### ARIA Guidelines
- **Proper labeling**: All interactive elements
- **Role definitions**: Semantic HTML + ARIA roles
- **State communication**: Loading, error, success states

## Responsive Design

### Breakpoints
```css
xs: 480px
sm: 640px  
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

### Mobile-First Approach
- Base styles for mobile
- Progressive enhancement for larger screens
- Touch-friendly target sizes (minimum 44px)

## Dark Mode Support

### Implementation
- CSS custom properties for theme switching
- Automatic system preference detection
- Manual toggle option

### Color Adaptations
- **Backgrounds**: Dark variants of neutral colors
- **Text**: High contrast ratios maintained
- **Borders**: Subtle contrast adjustments

## Component Usage Examples

### Button Usage
```tsx
// Primary action
<Button variant="primary" size="md">Book Now</Button>

// Secondary action  
<Button variant="outline" size="sm">View Details</Button>

// With loading state
<Button variant="primary" loading>Processing...</Button>
```

### Card Usage
```tsx
// Interactive car card
<Card variant="default" padding="none" hover interactive>
  <CardContent>...</CardContent>
  <CardFooter>...</CardFooter>
</Card>

// Information card
<Card variant="elevated" padding="lg">
  <CardHeader title="Loyalty Program" />
  <CardContent>...</CardContent>
</Card>
```

### Input Usage
```tsx
// Standard form input
<Input 
  label="Email Address"
  type="email"
  placeholder="your@email.com"
  required
/>

// Input with validation
<Input 
  label="Phone Number"
  error="Please enter a valid phone number"
  leftIcon={Phone}
/>
```

## Brand Guidelines

### Logo Usage
- **Minimum size**: 120px width
- **Clear space**: Logo height on all sides
- **Color variants**: Primary, white, dark

### Voice and Tone
- **Professional**: Clear and trustworthy
- **Friendly**: Approachable and helpful  
- **Confident**: Reliable and experienced

## Quality Checklist

### Visual Consistency
- [ ] Uses design system colors
- [ ] Follows typography hierarchy
- [ ] Maintains proper spacing
- [ ] Implements consistent shadows

### Interaction Design
- [ ] Clear hover states
- [ ] Smooth animations
- [ ] Proper loading states
- [ ] Error state handling

### Accessibility
- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] Color contrast compliance
- [ ] Focus state visibility

### Performance
- [ ] Optimized images
- [ ] Minimal CSS/JS
- [ ] Fast loading times
- [ ] Smooth animations

## Maintenance

### Version Control
- Document changes in this guide
- Update component library accordingly
- Test across all breakpoints and themes

### Review Process
- Design system changes require team review
- Regular audits for consistency
- User testing for usability validation

---

*This style guide is a living document that evolves with our platform. For questions or suggestions, please consult the development team.*