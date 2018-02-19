import React, { Component } from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  Button,
  Text,
  View
} from 'react-native';

import Bets from './Bets';
import LoginForm from './LoginForm';

export default class App extends Component {
  state = {
    logged:      false,
    loading:     true,
    loginError:  '',
    accessToken: '',
  }

  componentDidMount = async () =>  {
    let accessToken = await this.getAccessToken();

    if (accessToken !== null) {
      this.setState({
        accessToken: accessToken,
        logged: accessToken.length > 1 ? true : false,
      });
    }

    this.setState({ loading: false });
  }

  getAccessToken() {
    try {
      return AsyncStorage.getItem('@Palpito:AccessToken');;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  login = async (email, password) => {
    // TODO Improve validation
    if (email.length > 1 && password.length > 1) {
      this.setState({ loading: true });

      auth = await this.requestLogin(email, password);
      try {
        console.log(auth);

        if (auth.error) {
          this.setState({ loginError: 'Usuário e/ou senha inválidos' });
        } else {
          AsyncStorage.setItem('@Palpito:AccessToken', auth.access_token);
          this.setState({ logged: true, loginError: '' });
        }
      } catch (error) {
        this.setState({ loginError: 'Ocorreu algum erro na conexão!' });
        console.log(error);
      }

      this.setState({ loading: false });
    }
  }

  requestLogin(email, password) {
    const formData = new FormData();
    formData.append('username',   email);
    formData.append('password',   password);
    formData.append('grant_type', 'password');
    console.log(formData);

    return fetch('http://www.palpito.com.br/oauth/token', { method: 'POST', body: formData })
            .then((response) => response.json())
            .catch(console.error);
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={{ marginTop: 50 }}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    if (!this.state.logged) {
      return (
        <LoginForm action={this.login} loading={this.state.loading} error={this.state.loginError} />
      );
    }

    return (
      <View style={{ marginTop: 50 }}>
        <Bets accessToken={ this.state.accessToken } />

        <Button
          title='Clear'
          onPress={ () => { AsyncStorage.clear() }}
        />
      </View>
    );
  }
}
