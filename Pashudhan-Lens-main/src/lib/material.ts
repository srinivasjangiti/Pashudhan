// Material Design utilities and classes
export const materialShadows = {
  elevation1: 'shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.24)]',
  elevation2: 'shadow-[0_3px_6px_rgba(0,0,0,0.16),0_3px_6px_rgba(0,0,0,0.23)]',
  elevation3: 'shadow-[0_10px_20px_rgba(0,0,0,0.19),0_6px_6px_rgba(0,0,0,0.23)]',
  elevation4: 'shadow-[0_14px_28px_rgba(0,0,0,0.25),0_10px_10px_rgba(0,0,0,0.22)]',
  elevation5: 'shadow-[0_19px_38px_rgba(0,0,0,0.30),0_15px_12px_rgba(0,0,0,0.22)]',
  
  // Colored shadows for specific themes
  emerald1: 'shadow-[0_1px_3px_rgba(16,185,129,0.12),0_1px_2px_rgba(16,185,129,0.24)]',
  emerald2: 'shadow-[0_3px_6px_rgba(16,185,129,0.16),0_3px_6px_rgba(16,185,129,0.23)]',
  emerald3: 'shadow-[0_10px_20px_rgba(16,185,129,0.19),0_6px_6px_rgba(16,185,129,0.23)]',
  
  // Floating action button style
  fab: 'shadow-[0_6px_10px_rgba(0,0,0,0.14),0_1px_18px_rgba(0,0,0,0.12),0_3px_5px_rgba(0,0,0,0.20)]',
  fabHover: 'shadow-[0_8px_16px_rgba(0,0,0,0.16),0_4px_24px_rgba(0,0,0,0.14),0_6px_8px_rgba(0,0,0,0.22)]'
};

export const materialTransitions = {
  // Standard material duration and easing - using built-in Tailwind easings
  standard: 'transition-all duration-300 ease-out',
  fast: 'transition-all duration-200 ease-out',
  slow: 'transition-all duration-500 ease-out',
  
  // Specific property transitions
  transform: 'transition-transform duration-300 ease-out',
  opacity: 'transition-opacity duration-200 ease-out',
  shadow: 'transition-shadow duration-200 ease-out',
  colors: 'transition-colors duration-200 ease-out',
  
  // Material motion curves using built-in Tailwind easings
  decelerate: 'ease-out',
  accelerate: 'ease-in',
  sharp: 'ease-in-out'
};

export const materialRipple = {
  base: 'relative overflow-hidden before:absolute before:inset-0 before:bg-white/10 before:opacity-0 before:transition-opacity before:duration-200',
  hover: 'hover:before:opacity-100',
  active: 'active:before:opacity-50 active:before:duration-75'
};

export const materialCards = {
  outlined: 'border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm',
  filled: 'bg-white rounded-xl',
  elevated: `bg-white rounded-xl ${materialShadows.elevation2}`,
  
  // Wildlife themed cards
  wildlifeOutlined: 'border border-emerald-200/50 rounded-xl bg-white/80 backdrop-blur-sm',
  wildlifeElevated: `bg-white/90 backdrop-blur-sm rounded-xl ${materialShadows.emerald2}`,
  wildlifeFilled: 'bg-gradient-to-br from-emerald-50/80 to-green-50/80 backdrop-blur-sm rounded-xl'
};

export const materialButtons = {
  filled: `bg-emerald-600 text-white rounded-xl px-6 py-3 font-medium ${materialShadows.elevation2} ${materialTransitions.standard} hover:${materialShadows.elevation3} hover:bg-emerald-700 active:${materialShadows.elevation1}`,
  outlined: `border-2 border-emerald-600 text-emerald-600 rounded-xl px-6 py-3 font-medium ${materialTransitions.standard} hover:bg-emerald-50 active:bg-emerald-100`,
  text: `text-emerald-600 rounded-xl px-6 py-3 font-medium ${materialTransitions.standard} hover:bg-emerald-50 active:bg-emerald-100`,
  
  // Floating action button
  fab: `w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center ${materialShadows.fab} ${materialTransitions.standard} hover:${materialShadows.fabHover} hover:bg-emerald-700 active:scale-95`,
  
  // Icon buttons
  icon: `w-12 h-12 flex items-center justify-center rounded-full ${materialTransitions.standard} hover:bg-black/5 active:bg-black/10`,
  iconColored: `w-12 h-12 flex items-center justify-center rounded-full ${materialTransitions.standard} hover:bg-emerald-50 active:bg-emerald-100 text-emerald-600`
};

export const materialInputs = {
  outlined: `border border-gray-300 rounded-xl px-4 py-3 bg-white/80 backdrop-blur-sm ${materialTransitions.standard} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none`,
  filled: `bg-gray-50 border-b-2 border-gray-300 px-4 py-3 rounded-t-xl ${materialTransitions.standard} focus:border-emerald-500 focus:bg-white focus:outline-none`
};

// Material Design spacing system (based on 8dp grid)
export const materialSpacing = {
  xs: '0.25rem', // 4dp
  sm: '0.5rem',  // 8dp
  md: '1rem',    // 16dp
  lg: '1.5rem',  // 24dp
  xl: '2rem',    // 32dp
  '2xl': '3rem', // 48dp
  '3xl': '4rem', // 64dp
  '4xl': '6rem'  // 96dp
};

// Material Design breakpoints
export const materialBreakpoints = {
  xs: '600px',
  sm: '960px',
  md: '1280px',
  lg: '1920px'
};

// Helper function to combine material classes
export const createMaterialComponent = (baseClasses: string, elevation: keyof typeof materialShadows = 'elevation1') => {
  return `${baseClasses} ${materialShadows[elevation]} ${materialTransitions.standard}`;
};

// Material Design color palette for wildlife theme
export const materialColors = {
  primary: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981', // Main emerald
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b'
  },
  surface: {
    background: '#fafafa',
    paper: '#ffffff',
    disabled: '#f5f5f5'
  },
  text: {
    primary: '#1f2937',
    secondary: '#6b7280',
    disabled: '#9ca3af'
  }
};

export default {
  shadows: materialShadows,
  transitions: materialTransitions,
  ripple: materialRipple,
  cards: materialCards,
  buttons: materialButtons,
  inputs: materialInputs,
  spacing: materialSpacing,
  breakpoints: materialBreakpoints,
  colors: materialColors,
  createComponent: createMaterialComponent
};
