import { StackNavigator } from 'react-navigation'
import GifScreen from '../Containers/GifScreen'
import LaunchScreen from '../Containers/LaunchScreen'

import styles from './Styles/NavigationStyles'

// Manifest of possible screens
const PrimaryNav = StackNavigator({
  GifScreen: { screen: GifScreen },
  LaunchScreen: { screen: LaunchScreen }
}, {
  // Default config for all screens
  headerMode: 'none',
  initialRouteName: 'GifScreen',
  navigationOptions: {
    headerStyle: styles.header
  }
})

export default PrimaryNav
