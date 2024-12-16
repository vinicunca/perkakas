import { defineVinicuncaConfig } from '@vinicunca/unocss-preset';

export default defineVinicuncaConfig(
  {
    icons: {
      scale: 1.5,
      warn: true,
    },
  },
  {
    shortcuts: {
      'border-base': 'border-$vp-c-divider',
    },

    theme: {
      animation: {
        durations: {
          'collapsible-slide-down': '0.3s',
          'collapsible-slide-up': '0.3s',
          'scale-in': '0.2s',
          'scale-out': '0.2s',
        },

        keyframes: {
          'collapsible-slide-down': '{from {height: 0} to {height: var(--radix-collapsible-content-height)}}',
          'collapsible-slide-up': '{from {height: var(--radix-collapsible-content-height)} to {height: 0}}',
          'scale-in': '{from{opacity:0;transform:rotateX(-10deg) scale(0.9)}to{opacity:1;transform:rotateX(0deg) scale(1)}}',
          'scale-out': '{from{opacity:1;transform:rotateX(0deg) scale(1)}to{opacity:0;transform:rotateX(-10deg) scale(0.95)}}',
        },

        timingFns: {
          'collapsible-slide-down': 'ease-out',
          'collapsible-slide-up': 'ease-out',
          'scale-in': 'ease',
          'scale-out': 'ease',
        },
      },
    },
  },
);
