import React, { Component } from 'react';
import { Button, Text, TextInput, View } from 'react-native';

import { onSignIn } from '../auth';

export default class SignIn extends Component {
  state = {
    email: '',
    password: '',
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View>
        <TextInput
          placeholder="E-mail"
          autoCorrect={false}
          autoFocus={true}
          autoCapitalize={'none'}
          value={this.state.email}
          onChangeText={email => this.setState({ email })}
        />

        <TextInput
          placeholder="Senha"
          secureTextEntry
          value={this.state.password}
          onChangeText={password => this.setState({ password })}
        />

        <Button
          title="Sign In"
          onPress={() => {
            onSignIn(this.state.email, this.state.password).then(accessToken => navigate('SignedIn'));
          }}
        />
      </View>
    );
  }
}
