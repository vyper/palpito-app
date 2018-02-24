import React from 'react';
import { Platform, StatusBar } from 'react-native';
import { DrawerNavigator, StackNavigator } from 'react-navigation';

import { DrawerMenu } from '../components';
import { Bet, Bets, SignIn } from '../screens';

const headerStyle = {
  marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
};

export const SignedOut = StackNavigator({
  SignIn: {
    screen: SignIn,
    navigationOptions: {
      title: 'Palpito',
      headerStyle
    }
  }
});

export const MainStack = StackNavigator({
  Bets: {
    screen: Bets,
    navigationOptions: {
      title: 'Seus palpites',
      headerStyle
    }
  },
  Bet: {
    screen: Bet,
    navigationOptions: {
      title: 'Palpite',
      headerStyle
    }
  },
});

const SignedIn = DrawerNavigator(
  {
    Main: { screen: MainStack }
  },
  {
    contentComponent: DrawerMenu,
  }
);

export const createRootNavigator = (signedIn = false) => {
  return StackNavigator(
    {
      SignedIn: {
        screen: SignedIn,
        navigationOptions: {
          gesturesEnabled: false
        }
      },
      SignedOut: {
        screen: SignedOut,
        navigationOptions: {
          gesturesEnabled: false
        }
      }
    },
    {
      headerMode: 'none',
      mode: 'modal',
      initialRouteName: signedIn ? 'SignedIn' : 'SignedOut'
    }
  );
};
