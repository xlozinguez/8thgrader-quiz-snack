import { AppRegistry } from 'react-native';
import App from './App';

const appName = 'main';

AppRegistry.registerComponent(appName, () => App);

if (typeof document !== 'undefined') {
  AppRegistry.runApplication(appName, {
    rootTag: document.getElementById('root'),
  });
}