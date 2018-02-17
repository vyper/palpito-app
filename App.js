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
        <LoginForm />
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
