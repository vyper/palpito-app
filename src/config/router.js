import React from 'react';
import { Platform, StatusBar } from 'react-native';
import { DrawerNavigator, StackNavigator } from 'react-navigation';

import { DrawerMenu } from '../components';
import { Bet, Bets, SignIn } from '../screens';

export const SignedOut = StackNavigator(
  {
    SignIn: {
      screen: SignIn
    }
  },
  {
    headerMode: 'none',
  }
);

export const SignedIn = DrawerNavigator(
  {
    Bets: { screen: Bets },
    Bet:  { screen: Bet },
  },
  {
    headerMode: 'none',
    contentComponent: DrawerMenu,
  }
);

export const createRootNavigator = (signedIn = false) => {
  return StackNavigator(
    {
      SignedIn:  { screen: SignedIn },
      SignedOut: { screen: SignedOut }
    },
    {
      headerMode: 'none',
      mode: 'modal',
      initialRouteName: signedIn ? 'SignedIn' : 'SignedOut'
    }
  );
};
