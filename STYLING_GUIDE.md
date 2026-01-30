# Unify Stories & Posts - Color Palette & Styling Guide

## 🎨 Brand Colors

### Primary Color
```
Hex: #0D2E5F
RGB: 13, 46, 95
CSS Variable: primary
Used for: Main buttons, avatars, links, primary actions
Tailwind: bg-primary, text-primary, border-primary
```

### Accent Color  
```
Hex: #E8B923
RGB: 232, 185, 35
CSS Variable: accent
Used for: Highlights, story borders, progress indicators, secondary actions
Tailwind: bg-accent, text-accent, border-accent
```

## 📐 Component Styling

### Story Component
```tsx
// Border gradient using logo colors
className="bg-gradient-to-tr from-accent via-primary to-accent-dark"

// Create story button
className="bg-primary"

// User avatar
className="bg-primary rounded-full"
```

### Post Component
```tsx
// User avatar
className="w-10 h-10 rounded-full bg-primary"

// Like button (when liked)
className="text-accent bg-accent/10"

// Save button (when saved)
className="text-primary bg-primary/10"

// Action buttons
className="text-gray-600 hover:bg-gray-100"
```

### PostCard Component
```tsx
// User avatar
className="bg-primary rounded-full"

// Like indicator
className="bg-primary text-white rounded-full"

// Like button highlight
className="text-primary bg-primary/10"

// Links and mentions
className="text-primary font-semibold"
```

## 🎯 Visual Hierarchy

### Size Scale
- Extra Large: 32px (headings, large avatars)
- Large: 24px (section titles)
- Medium: 16px (body text, buttons)
- Small: 14px (captions, secondary text)
- Extra Small: 12px (timestamps, metadata)

### Font Weights
- Bold (700): Headings, emphasis
- Semibold (600): Subheadings, buttons
- Regular (400): Body text
- Medium (500): Interactive elements

## 🎨 Color Combinations

### For Backgrounds
- Light Gray: `#f3f4f6` (bg-gray-100)
- White: `#ffffff` (bg-white)
- Gradient: primary → accent (for headers)

### For Text
- Dark Text: `#111827` (text-gray-900)
- Secondary Text: `#6b7280` (text-gray-500)
- Disabled Text: `#d1d5db` (text-gray-300)

### For Borders
- Light Border: `#e5e7eb` (border-gray-200)
- Medium Border: `#d1d5db` (border-gray-300)
- Primary Border: primary color

### For Hover States
- Primary: `primary/10` (subtle highlight)
- Accent: `accent/10` (subtle highlight)
- Gray: `bg-gray-100` (neutral hover)

## 📱 Responsive Breakpoints

```tailwind
Mobile: < 640px (full width with padding)
Tablet: 768px - 1024px (medium containers)
Desktop: > 1024px (max-width containers)
```

## ✨ Interactive States

### Buttons
```
Default: text-gray-600 hover:bg-gray-100
Active/Selected: text-primary bg-primary/10
Disabled: text-gray-400 cursor-not-allowed
```

### Links
```
Default: text-primary
Hover: text-primary/80 underline
Visited: text-primary/60
```

### Form Inputs
```
Default: border-gray-300 focus:ring-primary
Error: border-red-500 focus:ring-red-500
Disabled: bg-gray-100 text-gray-400
```

## 🌐 CSS Variables

Configured in `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    dark: '#0A2342',      // Darker shade
    DEFAULT: '#0D2E5F',   // Main
    light: '#1B3F7F',     // Lighter shade
  },
  accent: {
    dark: '#D4A017',      // Darker shade
    DEFAULT: '#E8B923',   // Main
    light: '#F5C842',     // Lighter shade
  },
  background: '#ffffff',
  foreground: '#000000',
  border: '#e5e7eb',
}
```

## 📝 Typography

### Headings (H1-H4)
- Font: System font stack
- Color: text-primary or text-gray-900
- Weight: Bold (700)
- Line Height: 1.2

### Body Text
- Font: System font stack
- Color: text-gray-900
- Weight: Regular (400)
- Line Height: 1.5

### Small Text (captions, metadata)
- Font: System font stack
- Color: text-gray-500 or text-gray-600
- Weight: Regular (400)
- Font Size: 12px or 14px

## 🎬 Animations & Transitions

### Duration Scale
- Fast: 200ms (hover effects, small interactions)
- Normal: 300ms (modal opens, transitions)
- Slow: 500ms (page transitions, delays)

### Easing
- ease-in: Slow start
- ease-out: Fast start
- ease-in-out: Smooth throughout
- linear: Consistent speed

### Common Effects
```tsx
// Fade in
animation: 'fade-in 0.3s ease-in-out'

// Slide up
animation: 'slide-up 0.3s ease-out'

// Scale in
animation: 'scale-in 0.2s ease-out'
```

## 🔍 Accessibility

### Color Contrast
- Text on Primary: Minimum 4.5:1 ratio (white on #0D2E5F ✓)
- Text on Accent: Minimum 4.5:1 ratio (dark text on #E8B923 ✓)
- Links: Underlined for visibility

### Focus States
- Keyboard navigation: Primary color ring
- Tab order: Logical flow left-to-right, top-to-bottom
- Screen reader: Proper ARIA labels

### Interactive Elements
- Minimum touch target: 44x44px
- Clear click areas
- Visual feedback on interaction

## 📊 Design Patterns

### Cards
```
bg-white rounded-lg shadow-md p-4
border-l-4 border-accent (optional accent border)
hover:shadow-lg transition-shadow
```

### Buttons
```
Primary: bg-primary text-white px-4 py-2 rounded-lg
Secondary: bg-white text-primary border border-primary
Ghost: text-gray-600 hover:bg-gray-100
```

### Badges/Tags
```
bg-primary/10 text-primary px-3 py-1 rounded-full text-sm
```

### Badges/Avatars
```
w-10 h-10 rounded-full bg-primary text-white
flex items-center justify-center font-semibold
```

---

**Last Updated**: January 29, 2026
**Version**: 1.0.0
**Status**: Complete & Validated
