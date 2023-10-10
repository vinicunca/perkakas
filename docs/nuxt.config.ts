import { createResolver } from '@nuxt/kit';

const { resolve } = createResolver(import.meta.url);

export default defineNuxtConfig({
  devServer: {
    port: 3001,
  },

  components: [
    {
      path: '~~/domains/docs/components',
      pathPrefix: false,
      global: true,
    },
  ],

  modules: [
    '@nuxt/devtools',
    '@nuxtjs/color-mode',
    '@nuxt/content',
    '@unocss/nuxt',
    // 'nuxt-gtag',
    resolve('./app/content-post-process'),
  ],

  css: [
    '@unocss/reset/tailwind.css',
    '~~/designs/styles/index.css',
    '~~/designs/styles/docs.css',
  ],

  colorMode: {
    classSuffix: '',
    dataValue: 'theme',
  },

  content: {
    documentDriven: {
      injectPage: false,
    },

    highlight: {
      theme: 'one-dark-pro',
    },

    markdown: {
      anchorLinks: false,

      toc: {
        depth: 2,
      },
    },

    navigation: {
      fields: ['icon'],
    },
  },

  // gtag: {
  //   id: 'G-38W7J3MEER',
  // },

  postcss: {
    plugins: {
      'postcss-nested': {},
    },
  },
});
