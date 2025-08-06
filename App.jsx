import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Toast from 'react-native-toast-message';
import FinalScreen from './screens/FinalScreen';
import LoginScreen from './screens/LoginScreen';
import RoleCheckScreen from './screens/RoleCheckScreen';
import SeatCheckScreen from './screens/SeatCheckScreen';
import SurveyScreen from './screens/SurveyScreen';
import TeamCheckScreen from './screens/TeamCheckScreen';
import VideoScreen from './screens/VideoScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SeatCheck" component={SeatCheckScreen} />
        <Stack.Screen name="Survey" component={SurveyScreen} />
       <Stack.Screen name="Final" component={FinalScreen} />
       <Stack.Screen name="RoleCheck" component={RoleCheckScreen} />
       <Stack.Screen name="TeamCheck" component={TeamCheckScreen} />
       <Stack.Screen name="Video" component={VideoScreen} />
      </Stack.Navigator>
       <Toast />
    </NavigationContainer>
  );
}
