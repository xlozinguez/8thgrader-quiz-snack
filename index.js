import { AppRegistry, Platform } from 'react-native';
import App from './App';

console.log('index.js: Starting app registration, Platform:', Platform.OS);

const appName = 'main';

if (Platform.OS === 'web') {
  console.log('index.js: Registering for web platform');
  AppRegistry.registerComponent(appName, () => App);
  
  if (typeof document !== 'undefined') {
    console.log('index.js: Running web application');
    AppRegistry.runApplication(appName, {
      rootTag: document.getElementById('root'),
    });
  }
} else {
  console.log('index.js: Registering for native platform');
  const { registerRootComponent } = require('expo');
  registerRootComponent(App);
}

console.log('index.js: App registration complete');
