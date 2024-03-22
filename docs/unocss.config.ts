import {
  defineConfig,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss';

const CUBIC_BEZIER = 'cubic-bezier(0.16, 1, 0.3, 1)';

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      collections: {
        vin: async (iconName) => {
          if (iconName === 'eslint-style') {
            return await fetch('https://eslint.style/logo.svg').then((res) => res.text());
          } else if (iconName === 'yaml') {
            return await fetch('https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/main/icons/yaml.svg').then((res) => res.text());
          }
        },
      },
      scale: 1.5,

      warn: true,
    }),
  ],

  safelist: [
    'i-simple-icons:eslint',
    'i-logos:javascript',
    'i-fa-regular:comments',
    'i-logos:nodejs-icon-alt',
    'i-simple-line-icons:docs',
    'i-carbon:document-import',
    'i-openmoji:unicorn',
    'i-logos:typescript-icon',
    'i-vin:eslint-style',
    'i-file-icons:test-generic',
    'i-logos:vue',
    'i-carbon:json',
    'i-logos:nodejs-icon',
    'i-vscode-icons:file-type-tsconfig',
    'i-vin:yaml',
    'i-simple-icons:markdown',
    'i-logos:react',
  ],

  shortcuts: {
    'border-base': 'border-$vp-c-divider',
    'button-action': 'flex flex-inline gap-2 items-center justify-center px-3 py-0.5 rounded hover:color-$vp-c-brand-2 hover:bg-$vp-c-default-soft',
  },

  theme: {
    animation: {
      durations: {
        'collapsible-slide-down': '0.3s',
        'collapsible-slide-up': '0.3s',
        'enter-from-left': '0.25s',
        'enter-from-right': '0.25s',
        'exit-to-left': '0.25s',
        'exit-to-right': '0.25s',
        'fade-in': '0.2s',
        'fade-out': '0.2s',
        'scale-in': '0.2s',
        'scale-out': '0.2s',
        'slide-down-and-fade': '0.4s',
        'slide-left-and-fade': '0.4s',
        'slide-right-and-fade': '0.4s',
        'slide-up-and-fade': '0.4s',
      },

      keyframes: {
        'collapsible-slide-down': '{from {height: 0} to {height: var(--radix-collapsible-content-height)}}',
        'collapsible-slide-up': '{from {height: var(--radix-collapsible-content-height)} to {height: 0}}',
        'enter-from-left': '{from{opacity:0;transform:translateX(-200px)}to{opacity:1;transform:translateX(0)}}',
        'enter-from-right': '{from{opacity:0;transform:translateX(200px)}to{opacity:1;transform:translateX(0)}}',
        'exit-to-left': '{from{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(-200px)}}',
        'exit-to-right': '{from{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(200px)}}',
        'fade-in': '{from{opacity:0}to{opacity:1}}',
        'fade-out': '{from{opacity:1}to{opacity:0}}',
        'scale-in': '{from{opacity:0;transform:rotateX(-10deg) scale(0.9)}to{opacity:1;transform:rotateX(0deg) scale(1)}}',
        'scale-out': '{from{opacity:1;transform:rotateX(0deg) scale(1)}to{opacity:0;transform:rotateX(-10deg) scale(0.95)}}',
        'slide-down-and-fade': '{from {opacity: 0;transform:translateY(-2px)} to {opacity: 1;transform: translateY(0)}}',
        'slide-left-and-fade': '{from {opacity: 0;transform:translateX(2px)} to {opacity: 1;transform: translateX(0)}}',
        'slide-right-and-fade': '{from {opacity: 0;transform:translateX(-2px)} to {opacity: 1;transform: translateX(0)}}',
        'slide-up-and-fade': '{from {opacity: 0;transform:translateY(2px)} to {opacity: 1;transform: translateY(0)}}',
      },

      timingFns: {
        'collapsible-slide-down': 'ease-out',
        'collapsible-slide-up': 'ease-out',
        'enter-from-left': 'ease',
        'enter-from-right': 'ease',
        'exit-to-left': 'ease',
        'exit-to-right': 'ease',
        'fade-in': 'ease',
        'fade-out': 'ease',
        'scale-in': 'ease',
        'scale-out': 'ease',
        'slide-down-and-fade': CUBIC_BEZIER,
        'slide-left-and-fade': CUBIC_BEZIER,
        'slide-right-and-fade': CUBIC_BEZIER,
        'slide-up-and-fade': CUBIC_BEZIER,
      },
    },

    boxShadow: {
      1: '0 1px 2px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)',
      2: '0 3px 12px rgba(0, 0, 0, 0.07), 0 1px 4px rgba(0, 0, 0, 0.07)',
      3: '0 12px 32px rgba(0, 0, 0, 0.1), 0 2px 6px rgba(0, 0, 0, 0.08)',
      4: '0 14px 44px rgba(0, 0, 0, 0.12), 0 3px 9px rgba(0, 0, 0, 0.12)',
      5: '0 18px 56px rgba(0, 0, 0, 0.16), 0 4px 12px rgba(0, 0, 0, 0.16)',
    },

    colors: {
      primary: '#3eaf7c',
    },

    fontFamily: {
      mono: 'var(--vp-font-family-mono)',
    },
  },

  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
});
