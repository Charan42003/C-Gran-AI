import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Home from './src/screens/home';
import Welcome from './src/screens/welcome';

function App(): React.JSX.Element {

  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen
          name={"Home"}
          component={Home}
        />
        <Stack.Screen
          name={"Welcome"}
          component={Welcome}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


export default App;
