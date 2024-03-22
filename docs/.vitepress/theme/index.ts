import TwoSlashFloatingVue from '@shikijs/vitepress-twoslash/client';
import '@shikijs/vitepress-twoslash/style.css';
import 'uno.css';
import DefaultTheme from 'vitepress/theme';

import './styles/override.css';
import './styles/reset.css';
import './styles/vars.css';

export default {
  ...DefaultTheme,

  enhanceApp(ctx: any) {
    ctx.app.use(TwoSlashFloatingVue);
  },
};
