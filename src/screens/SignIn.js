import React, { Component } from 'react';
import { Button, Text, TextInput, View } from 'react-native';

import { Container } from '../components';
import { onSignIn } from '../actions/auth';

export default class SignIn extends Component {
  state = {
    email: '',
    password: '',
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <Container>
        <TextInput
          placeholder="E-mail"
          autoCorrect={false}
          autoFocus={true}
          autoCapitalize={'none'}
          value={this.state.email}
          onChangeText={email => this.setState({ email })}
          style={{ marginTop: 15, marginBottom: 15 }}
        />

        <TextInput
          placeholder="Senha"
          secureTextEntry
          value={this.state.password}
          onChangeText={password => this.setState({ password })}
          style={{ marginBottom: 15 }}
        />

        <Button
          title="Entrar!"
          onPress={() => {
            onSignIn(this.state.email, this.state.password).then(accessToken => navigate('SignedIn'));
          }}
        />
      </Container>
    );
  }
}
