import React, { Component } from 'react';
import { Alert, Button, Image, View, Text, TextInput } from 'react-native';

import { currentSignedUser } from '../auth';

export default class Bet extends Component {
  state = {
    team_home_goals: '',
    team_away_goals: '',
  }

  componentWillMount() {
    const bet = this.props.navigation.state.params.bet;

    this.setState({
      team_home_goals: bet.team_home_goals.toString(),
      team_away_goals: bet.team_away_goals.toString()
    });
  }

  async saveBet() {
    const bet = this.props.navigation.state.params.bet;
    const body = { ...bet, team_home_goals: this.state.team_home_goals, team_away_goals: this.state.team_away_goals };
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
      <View style={{ flex: 1 }}>
        <Text>Bet</Text>
        <Text>{bet.id}</Text>

        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Image
              source={{ uri: `http:${bet.team_home_image_url}` }}
              style={{ width: 50, height: 50 }}
            />
            <Text>{bet.team_home}</Text>
            <TextInput
              placeholder="gols do mandante"
              keyboardType={'numeric'}
              value={this.state.team_home_goals}
              onChangeText={team_home_goals => this.setState({ team_home_goals })}
            />
          </View>

          <View style={{ flex: 1, alignItems: 'center' }}>
            <Image
                source={{ uri: `http:${bet.team_away_image_url}` }}
                style={{ width: 50, height: 50 }}
              />
            <Text>{bet.team_away}</Text>
            <TextInput
              placeholder="gols do visitante"
              keyboardType={'numeric'}
              value={this.state.team_away_goals}
              onChangeText={team_away_goals => this.setState({ team_away_goals })}
            />
          </View>
        </View>

        <Button
          title="Salvar palpite"
          onPress={() => this.saveBet()}
        />
      </View>
    );
  }
}
