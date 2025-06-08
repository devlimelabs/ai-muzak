# AI Muzak Style Guide

## Design Philosophy

AI Muzak embodies the intersection of emotional intelligence and musical discovery. Our design philosophy centers around three core principles:

### 1. **Emotional Resonance**
- Visual elements should evoke the same emotions as music itself
- Use warm, inviting colors alongside Spotify's signature green
- Emphasize gradients and flowing designs that mirror sound waves and musical energy

### 2. **Intuitive Simplicity**
- Every interaction should feel as natural as humming a tune
- Reduce cognitive load while maintaining visual interest
- Prioritize content discovery over complex navigation

### 3. **Premium Experience**
- Elevate the music experience with polished, modern design
- Use subtle animations and micro-interactions
- Create depth through layering and sophisticated typography

## Color Palette

### Primary Colors
- **Spotify Green**: `#1DB954` - Call-to-action, success states, brand identity
- **Deep Black**: `#0D0D0D` - Primary background, creating depth
- **Rich Black**: `#191414` - Secondary backgrounds, cards
- **Warm Gray**: `#2A2A2A` - Elevated surfaces, input fields

### Accent Colors
- **Electric Blue**: `#667EEA` - Energy indicators, dynamic elements
- **Purple**: `#764BA2` - Emotion analysis, mood visualization
- **Coral**: `#FF6B6B` - Error states, passionate moods
- **Amber**: `#F59E0B` - Warning states, energetic moods
- **Mint**: `#10B981` - Success states, calm moods

### Text Colors
- **Pure White**: `#FFFFFF` - Primary text, headings
- **Light Gray**: `#D1D5DB` - Secondary text, descriptions
- **Medium Gray**: `#9CA3AF` - Tertiary text, placeholders
- **Dark Gray**: `#6B7280` - Subtle text, timestamps

## Typography

### Font System
- **Primary**: System fonts (SF Pro Display on macOS, Segoe UI on Windows)
- **Weight Scale**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### Type Scale
- **Hero**: 4rem/5rem (64px/80px) - Landing page headlines
- **H1**: 2.5rem/3rem (40px/48px) - Page titles
- **H2**: 2rem/2.5rem (32px/40px) - Section headers
- **H3**: 1.5rem/2rem (24px/32px) - Component titles
- **Body Large**: 1.125rem/1.75rem (18px/28px) - Important descriptions
- **Body**: 1rem/1.5rem (16px/24px) - Standard text
- **Small**: 0.875rem/1.25rem (14px/20px) - Labels, captions
- **Tiny**: 0.75rem/1rem (12px/16px) - Metadata, fine print

## Layout & Spacing

### Grid System
- **Container**: 1280px max-width with responsive padding
- **Columns**: Flexible grid with 16px/24px gutters
- **Breakpoints**: 
  - Mobile: 0-640px
  - Tablet: 641-1024px  
  - Desktop: 1025px+

### Spacing Scale (Tailwind-based)
- **xs**: 4px - Fine adjustments
- **sm**: 8px - Tight spacing
- **md**: 16px - Standard spacing
- **lg**: 24px - Generous spacing
- **xl**: 32px - Section spacing
- **2xl**: 48px - Large section spacing
- **3xl**: 64px - Page-level spacing

## Component Design Patterns

### Cards
- **Background**: Elevated surfaces with subtle gradients
- **Border Radius**: 12px for primary cards, 8px for secondary
- **Shadows**: Soft, multi-layer shadows for depth
- **Hover States**: Gentle scale transforms (1.02x) with shadow enhancement

### Buttons
- **Primary**: Spotify green with rounded corners, bold text
- **Secondary**: Outlined style with hover fill
- **Ghost**: Text-only with hover background
- **Icon**: Circular with subtle background

### Form Elements
- **Inputs**: Dark backgrounds with subtle borders
- **Focus States**: Spotify green accents with smooth transitions
- **Placeholders**: Warm, inviting copy

## Animation Guidelines

### Timing Functions
- **Entrance**: `cubic-bezier(0.4, 0, 0.2, 1)` - Gentle ease-out
- **Exit**: `cubic-bezier(0.4, 0, 1, 1)` - Quick ease-in
- **Elastic**: `cubic-bezier(0.68, -0.55, 0.265, 1.55)` - Playful interactions

### Duration Scale
- **Fast**: 150ms - Micro-interactions, hovers
- **Normal**: 300ms - Standard transitions
- **Slow**: 500ms - Page transitions, major state changes
- **Extra Slow**: 800ms - Hero animations, loading states

### Animation Types
- **Scale**: Gentle growth (1.02x-1.05x) for hover states
- **Slide**: Smooth Y-axis movement for reveals
- **Fade**: Opacity transitions for state changes
- **Pulse**: Breathing animation for loading states

## Accessibility Standards

### Color Contrast
- **AAA Standard**: Minimum 7:1 ratio for normal text
- **AA Standard**: Minimum 4.5:1 ratio for large text
- **Focus Indicators**: Visible 2px outlines in Spotify green

### Interactive Elements
- **Touch Targets**: Minimum 44px for mobile interactions
- **Keyboard Navigation**: Clear focus states for all interactive elements
- **Screen Reader**: Semantic HTML and proper ARIA labels

## Mobile Considerations

### Touch-First Design
- **Gesture Support**: Swipe interactions for playlist navigation
- **Thumb Zones**: Critical actions within thumb reach
- **Progressive Enhancement**: Mobile-first responsive design

### Performance
- **Image Optimization**: WebP formats with fallbacks
- **Animation Reduction**: Respect `prefers-reduced-motion`
- **Loading States**: Skeleton screens for better perceived performance

## Brand Voice in UI

### Microcopy
- **Encouraging**: "Create your perfect vibe"
- **Personal**: "Your music, your moment"
- **Intelligent**: "We understand your mood"
- **Inclusive**: "Music for every feeling"

### Error Messages
- **Helpful**: Clear explanation + solution
- **Friendly**: Warm tone without blame
- **Actionable**: Always provide next steps

## Dark Mode Strategy

AI Muzak is designed dark-first to match music listening environments and user preferences:

- **True Black**: For OLED optimization and better contrast
- **Layered Grays**: Create hierarchy without harsh whites
- **Vibrant Accents**: Colors pop against dark backgrounds
- **Eye Comfort**: Reduced strain during extended listening sessions

## Implementation Notes

### CSS Custom Properties
```css
:root {
  --color-spotify-green: #1DB954;
  --color-deep-black: #0D0D0D;
  --color-rich-black: #191414;
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --shadow-card: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
```

### Tailwind Extensions
- Custom color palette matching this guide
- Animation utilities for common patterns
- Component-specific utility classes
- Responsive design tokens

This style guide serves as the foundation for creating a cohesive, emotionally resonant, and technically excellent music discovery experience.