import React, { Component } from 'react';
import {
  ActivityIndicator,
  AsyncStorage,Button,
  View,
  Text,
  TextInput,
} from 'react-native';

export default class LoginForm extends Component {
  state = {
    access_token: '',
    email:        '',
    password:     '',
    loading:      false,
  }

  login = async () => {
    // TODO Improve validation
    if (this.state.email.length > 1 && this.state.password.length > 1) {
      this.setState({ loading: true });

      auth = await this.requestLogin();
      try {
        AsyncStorage.setItem('@Palpito:AccessToken', auth.access_token);
        console.log(auth);
      } catch (error) {
        console.log(error);
      }

      this.setState({ loading: false });
    }
  }

  requestLogin() {
    const formData = new FormData();
    formData.append('username',   this.state.email);
    formData.append('password',   this.state.password);
    formData.append('grant_type', 'password');

    return fetch('http://www.palpito.com.br/oauth/token', { method: 'POST', body: formData })
            .then((response) => response.json())
            .catch(console.error);
  }

  render() {
    return (
      <View style={{ flex: 1, marginTop: 30 }}>
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

        { this.state.loading
            ? <ActivityIndicator size="large" />
            : <Button title="Entrar!" onPress={() => this.login() } /> }
      </View>
    )
  }
}
