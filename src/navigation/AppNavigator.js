import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';

import LoginScreen from '../view/LoginScreen';
import RegisterScreen from '../view/RegisterScreen';
import WelcomeScreen from '../view/WelcomeScreen';
import QuizScreen from '../view/QuizScreen';
import ScoreHistoryScreen from '../view/ScoreHistoryScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const user = useSelector((state) => state.auth.user);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={user ? 'Welcome' : 'Login'}
        screenOptions={{
          headerShown: false, // optional: hide headers for a cleaner UI
        }}
      >
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Quiz" component={QuizScreen} />
            <Stack.Screen name="History" component={ScoreHistoryScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
