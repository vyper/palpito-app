import React, { Component } from 'react';
import { Alert } from 'react-native';

import { createRootNavigator } from './src/config/router';
import { currentSignedUser } from './src/auth';

export default class App extends Component {
  state = {
    signedIn:      false,
    checkedSignIn: false,
  }

  componentWillMount() {
    currentSignedUser()
      .then(res => this.setState({ signedIn: res, checkedSignIn: true }))
      .catch(err => Alert.alert('Ocorreu algum erro inesperado'));
  }

  render() {
    const { checkedSignIn, signedIn } = this.state;

    if (!checkedSignIn) {
      return null;
    }

    const Layout = createRootNavigator(signedIn);
    return <Layout />;
  }
}
