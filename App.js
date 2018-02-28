import React, { Component } from 'react';
import { Root, Toast } from 'native-base';

import { createRootNavigator } from './src/config/router';
import { currentSignedUser } from './src/actions/auth';

export default class App extends Component {
  state = {
    signedIn:      false,
    checkedSignIn: false,
  }

  componentWillMount() {
    currentSignedUser()
      .then(res => this.setState({ signedIn: res, checkedSignIn: true }))
      .catch(err => {
        Toast.show({
          text: 'Ocorreu algum erro totalmente inesperado!',
          buttonText: 'Ok',
          type: 'danger',
        });
      });
  }

  render() {
    const { checkedSignIn, signedIn } = this.state;

    if (!checkedSignIn) {
      return null;
    }

    const Layout = createRootNavigator(signedIn);
    return (
      <Root>
        <Layout />
      </Root>
    );
  }
}
