import { AppRegistry } from 'react-native';
import App from './App';

import { StackNavigator } from 'react-navigation'

import ImageBrowser from './ImageBrowser'

const Navigation = StackNavigator({
    App: { screen: App },
    ImageBrowser: { screen: ImageBrowser }
});

AppRegistry.registerComponent('MobiliyaAssignments', () => Navigation);
