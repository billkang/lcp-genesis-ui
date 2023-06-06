import Theme from 'vitepress/dist/client/theme-default/index';
import Demo from 'vitepress-theme-demoblock/dist/client/components/Demo.vue';
import DemoBlock from 'vitepress-theme-demoblock/dist/client/components/DemoBlock.vue';
import GenesisUI from '../../../src/entry';

import 'vitepress-theme-demoblock/dist/theme/styles/index.css';

export default {
  ...Theme,
  enhanceApp({ app }) {
    app.component('Demo', Demo);
    app.component('DemoBlock', DemoBlock);
    app.use(GenesisUI);
  },
};
