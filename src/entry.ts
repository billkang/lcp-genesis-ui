import { App } from 'vue';
import { Button } from './components/Button';
import 'uno.css';

export { Button };

export default {
  install(app: App): void {
    app.component(Button.name, Button);
  },
};
