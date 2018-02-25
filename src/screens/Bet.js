import React, { Component } from 'react';
import { Alert, Button, Image, StyleSheet, Text, TextInput, View } from 'react-native';

import { Container } from '../components';
import { currentSignedUser } from '../actions/auth';

export default class Bet extends Component {
  state = {
    teamHomeGoals: '',
    teamAwayGoals: '',
    isBettable: false,
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
    const bet = this.props.navigation.state.params.bet;
    const body = { ...bet, team_home_goals: this.state.teamHomeGoals, team_away_goals: this.state.teamAwayGoals };
    const accessToken = await currentSignedUser();
    const headers = { Authorization: 'Bearer ' + accessToken, 'Content-Type': 'application/json' };

    await fetch(`http://palpito.com.br/bets/${bet.id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: headers,
    });

    Alert.alert('Palpite salvo com sucesso');
  }

  render() {
    const bet = this.props.navigation.state.params.bet;
    return (
      <Container>
        <View style={{ alignItems: 'center' }}>
          <Text>{`${bet.weekday}, ${bet.date} ${bet.time}`}</Text>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 5, alignItems: 'center' }}>
            <Image
              source={{ uri: `http:${bet.team_home_image_url}` }}
              style={{ width: 50, height: 50, marginBottom: 10 }}
            />
            <Text style={{ marginBottom: 10 }}>{bet.team_home}</Text>
            <TextInput
              style={{ fontSize: 18, textAlign: 'center', marginBottom: 10 }}
              placeholder="gols do mandante"
              keyboardType={'numeric'}
              value={this.state.teamHomeGoals}
              editable={this.state.isBettable}
              onChangeText={teamHomeGoals => this.setState({ teamHomeGoals })}
            />
          </View>

          <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
            {!this.state.isBettable &&
              <Text style={{ textAlign: 'center', fontSize: 30 }}>{bet.points}</Text>
            }

            <Text style={{ color: '#999' }}>x</Text>

            {!this.state.isBettable &&
              <Text style={[styles.playedScore, styles[bet.label]]}>{bet.game_team_home_goals} x {bet.game_team_away_goals}</Text>
            }
          </View>

          <View style={{ flex: 5, alignItems: 'center' }}>
            <Image
              source={{ uri: `http:${bet.team_away_image_url}` }}
              style={{ width: 50, height: 50, marginBottom: 10 }}
            />
            <Text style={{ marginBottom: 10 }}>{bet.team_away}</Text>
            <TextInput
              style={{ fontSize: 18, textAlign: 'center', marginBottom: 10 }}
              placeholder="gols do visitante"
              keyboardType={'numeric'}
              value={this.state.teamAwayGoals}
              editable={this.state.isBettable}
              onChangeText={teamAwayGoals => this.setState({ teamAwayGoals })}
            />
          </View>
        </View>

        <Button
          title="Salvar palpite"
          disabled={!this.state.isBettable}
          onPress={() => this.saveBet()}
        />
      </Container>
    );
  }
}

styles = StyleSheet.create({
  playedScore: {
    color: 'white',
    fontWeight: 'bold',
    padding: 3,
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
