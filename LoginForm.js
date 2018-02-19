import React, { Component } from 'react';
import {
  ActivityIndicator,
  Button,
  View,
  Text,
  TextInput,
} from 'react-native';

export default class LoginForm extends Component {
  state = {
    email:        '',
    password:     '',
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

        <Text style={{ color: 'red' }}>{this.props.error}</Text>

        { this.props.loading
            ? <ActivityIndicator size="large" />
            : <Button title="Entrar!" onPress={() => this.props.action(this.state.email, this.state.password) } /> }
      </View>
    )
  }
}
