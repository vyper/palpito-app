import React, { Component } from 'react';
import { Button, Container, Content, Form, Input, Item, Header, Text } from 'native-base';

import { onSignIn } from '../actions/auth';

export default class SignIn extends Component {
  state = {
    email:    '',
    password: '',
    loading:  false,
  }

  _onPress() {
    this.setState({ loading: true });

    onSignIn(this.state.email, this.state.password)
      .then(accessToken => this.props.navigation.navigate('SignedIn'));

    this.setState({ loading: false });
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

            <Button full onPress={() => this._onPress()}>
              <Text>Entrar!</Text>
              {this.state.loading &&
                <Spinner />}
            </Button>
          </Form>
        </Content>
      </Container>
    );
  }
}
