import React, { Component } from 'react';
import { Button, Container, Content, Form, Input, Item, Header, Spinner, Text } from 'native-base';
import { LoginButton } from 'react-native-fbsdk';

import { onFacebookSignIn, onSignIn } from '../actions/auth';

export default class SignIn extends Component {
  state = {
    email:    '',
    password: '',
    loginLoading:  false,
    facebookLoginLoading:  false,
  }

  async facebookLogin() {
    this.setState({ facebookLoginLoading: true });

    const isLogged = await onFacebookSignIn();
    if (isLogged) this.props.navigation.navigate('SignedIn');

    this.setState({ facebookLoginLoading: false });
  }

  async login() {
    this.setState({ loginLoading: true });

    const isLogged = await onSignIn(this.state.email, this.state.password);
    if (isLogged) this.props.navigation.navigate('SignedIn');

    this.setState({ loginLoading: false });
  }

  render() {
    return (
      <Container>
        <Header />

        <Content padder>
          <Form>
            <Item>
              <Input
                placeholder="E-mail"
                autoCorrect={false}
                autoFocus={true}
                autoCapitalize={'none'}
                value={this.state.email}
                onChangeText={email => this.setState({ email })}
              />
            </Item>

            <Item>
              <Input
                placeholder="Senha"
                secureTextEntry
                value={this.state.password}
                onChangeText={password => this.setState({ password })}
              />
            </Item>

            <Button full onPress={() => this.login()}>
              <Text>Entrar</Text>
              {this.state.loginLoading &&
                <Spinner />}
            </Button>

            <Button full style={{ marginTop: 10, backgroundColor: '#3b5998' }} onPress={() => this.facebookLogin()}>
              <Text>Entrar com Facebook</Text>
              {this.state.facebookLoginLoading &&
                <Spinner />}
            </Button>
          </Form>
        </Content>
      </Container>
    );
  }
}
