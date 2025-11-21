import anime from 'animejs';
import { Variants } from 'framer-motion';

// Framer Motion Variants
export const orbVariants: Variants = {
  initial: {
    scale: 0.8,
    opacity: 0,
    boxShadow: '0 0 0px rgba(15, 118, 110, 0)',
  },
  animate: {
    scale: 1.5,
    opacity: 1,
    boxShadow: [
      '0 0 20px rgba(15, 118, 110, 0.5)',
      '0 0 40px rgba(15, 118, 110, 0.7)',
      '0 0 60px rgba(15, 118, 110, 0.9)',
      '0 0 80px rgba(15, 118, 110, 1)',
    ],
    transition: {
      duration: 3.5,
      ease: [0.42, 0, 0.58, 1], // easeInOutQuad
      boxShadow: {
        duration: 3.5,
        times: [0, 0.33, 0.66, 1],
        ease: 'easeInOut',
      },
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export const ascendantVariants: Variants = {
  initial: {
    x: '50vw',
    y: 0,
    scale: 0.5,
    opacity: 0,
  },
  animate: (index: number) => ({
    x: ['50vw', '50vw', '120vw'],
    y: [0, -150, -150],
    scale: [0.5, 1, 1],
    opacity: [0, 1, 0],
    transition: {
      duration: 2,
      delay: index * 0.1,
      ease: [0.25, 0.46, 0.45, 0.94], // easeOutQuart
      times: [0, 0.3, 1],
    },
  }),
};

export const welcomeVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.9,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1,
      delay: 0.5,
      ease: [0.42, 0, 0.58, 1], // easeInOutQuad
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.3,
    },
  },
};

export const questionVariants: Variants = {
  initial: {
    opacity: 0,
    x: 50,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: [0.42, 0, 0.58, 1],
    },
  },
  exit: {
    opacity: 0,
    x: -50,
    transition: {
      duration: 0.3,
    },
  },
};

export const statsVariants: Variants = {
  initial: {
    opacity: 0,
    y: 30,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.42, 0, 0.58, 1],
    },
  },
};

export const messageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 50,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94], // easeOutQuart
    },
  },
  exit: {
    opacity: 0,
    y: -30,
    transition: {
      duration: 0.3,
    },
  },
};

export const ascendantCardVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.9,
  },
  animate: (index: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      delay: index * 0.1,
      ease: [0.42, 0, 0.58, 1],
    },
  }),
  hover: {
    scale: 1.02,
    boxShadow: '0 0 20px rgba(15, 118, 110, 0.5)',
    transition: {
      duration: 0.2,
    },
  },
  selected: {
    scale: 1.05,
    boxShadow: '0 0 30px rgba(15, 118, 110, 0.8)',
    transition: {
      duration: 0.3,
    },
  },
};

// Anime.js Number Counter Animation
export interface AnimateNumberOptions {
  element: HTMLElement;
  from: number;
  to: number;
  duration?: number;
  delay?: number;
  easing?: string;
  round?: number;
  suffix?: string;
  prefix?: string;
  onUpdate?: (value: number) => void;
  onComplete?: () => void;
}

export function animateNumberCounter({
  element,
  from,
  to,
  duration = 2000,
  delay = 0,
  easing = 'easeOutQuart',
  round = 0,
  suffix = '',
  prefix = '',
  onUpdate,
  onComplete,
}: AnimateNumberOptions): anime.AnimeInstance {
  const obj = { value: from };

  return anime({
    targets: obj,
    value: to,
    duration,
    delay,
    easing,
    round,
    update: () => {
      const currentValue = obj.value;
      element.textContent = `${prefix}${currentValue.toLocaleString()}${suffix}`;
      if (onUpdate) {
        onUpdate(currentValue);
      }
    },
    complete: () => {
      if (onComplete) {
        onComplete();
      }
    },
  });
}

// Staggered Number Counter Animation
export function animateStaggeredNumbers(
  elements: { element: HTMLElement; from: number; to: number; suffix?: string; prefix?: string }[],
  staggerDelay = 300
): anime.AnimeInstance[] {
  return elements.map((config, index) =>
    animateNumberCounter({
      ...config,
      delay: index * staggerDelay,
      duration: 2000,
      easing: 'easeOutQuart',
    })
  );
}
