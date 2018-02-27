import React, { Component } from 'react';
import {
  Body,
  Button,
  Col,
  Container,
  Content,
  Icon,
  Input,
  Item,
  Form,
  Header,
  Grid,
  Left,
  Right,
  Row,
  Spinner,
  Text,
  Title
} from 'native-base';
import { Alert, Image, StyleSheet } from 'react-native';

import { currentSignedUser } from '../actions/auth';

export default class Bet extends Component {
  state = {
    teamHomeGoals: '',
    teamAwayGoals: '',
    isBettable: false,
    loading:    false,
  }

  componentWillMount() {
    const bet = this.props.navigation.state.params.bet;

    this.setState({
      teamHomeGoals: bet.team_home_goals.toString(),
      teamAwayGoals: bet.team_away_goals.toString(),
      isBettable:    bet.is_bettable,
    });
  }

  async saveBet() {
    this.setState({ loading: true });
    const bet = this.props.navigation.state.params.bet;
    const body = { ...bet, team_home_goals: this.state.teamHomeGoals, team_away_goals: this.state.teamAwayGoals };
    const accessToken = await currentSignedUser();
    const headers = { Authorization: 'Bearer ' + accessToken, 'Content-Type': 'application/json' };

    await fetch(`http://palpito.com.br/bets/${bet.id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: headers,
    });
    this.setState({ loading: false });

    Alert.alert('Palpite salvo com sucesso');
  }

  render() {
    const bet = this.props.navigation.state.params.bet;
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>

          <Body>
            <Title>Palpite</Title>
          </Body>

          <Right />
        </Header>

        <Content padder>
          <Form>
            <Grid>
              <Row style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text>{`${bet.weekday}, ${bet.date} ${bet.time}`}</Text>
              </Row>

              <Row>
                <Col style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <Image
                    source={{ uri: `http:${bet.team_home_image_url}` }}
                    style={{ width: 50, height: 50 }}
                  />

                  <Text>{bet.team_home}</Text>

                  <Item>
                    <Input
                      placeholder="gols do mandante"
                      keyboardType={'numeric'}
                      style={{ textAlign: 'center' }}
                      value={this.state.teamHomeGoals}
                      editable={this.state.isBettable}
                      onChangeText={teamHomeGoals => this.setState({ teamHomeGoals })}
                    />
                  </Item>
                </Col>
                <Col style={{ alignItems: 'center', justifyContent: 'center' }}>
                  {!this.state.isBettable &&
                    <Text style={[styles.playedScore, styles[bet.label]]}>{bet.game_team_home_goals} x {bet.game_team_away_goals}</Text>
                  }
                  {!this.state.isBettable &&
                    <Text style={{ textAlign: 'center', fontSize: 30 }}>{bet.points}</Text>
                  }
                </Col>
                <Col style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <Image
                    source={{ uri: `http:${bet.team_away_image_url}` }}
                    style={{ width: 50, height: 50 }}
                  />

                  <Text>{bet.team_away}</Text>

                  <Item>
                    <Input
                      placeholder="gols do visitante"
                      keyboardType={'numeric'}
                      style={{ textAlign: 'center' }}
                      value={this.state.teamAwayGoals}
                      editable={this.state.isBettable}
                      onChangeText={teamAwayGoals => this.setState({ teamAwayGoals })}
                    />
                  </Item>
                </Col>
              </Row>
            </Grid>

            <Button
              full
              disabled={!this.state.isBettable}
              onPress={() => this.saveBet()}
            >
              {this.state.loading ?
                <Spinner /> :
                <Text>Salvar palpite</Text>}
            </Button>
          </Form>
        </Content>
      </Container>
    );
  }
}

styles = StyleSheet.create({
  playedScore: {
    color: 'white',
    fontWeight: 'bold',
    padding: 2,
    fontSize: 12,
    textAlign: 'center',
  },
  danger: {
    backgroundColor: '#d9534f',
  },
  warning: {
    backgroundColor: '#f0ad4e',
  },
  success: {
    backgroundColor: '#5cb85c',
  },
})
