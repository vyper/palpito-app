import React, { Component } from 'react';
import { ActivityIndicator, Alert, Button, Image, FlatList, StyleSheet, Text, TouchableHighlight, View } from 'react-native';

import { Container } from '../components';
import { currentSignedUser } from '../actions/auth';
import { getActiveGroup } from '../actions/groups';

export default class Bets extends Component {
  state = {
    accessToken: '',
    bets: [],
    refreshing: true,
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
        <Button
          title="..."
          onPress={() => navigation.navigate('DrawerToggle')}
        />
      ),
    };
  };

  componentDidMount() {
    this.refreshBets();
  }

  async refreshBets() {
    let activeGroupId = await getActiveGroup();
    let accessToken = await currentSignedUser();

    this.setState({ accessToken, refreshing: true });
    let bets = await this.requestBets(activeGroupId);
    this.setState({ bets, refreshing: false });
  }

  requestBets(groupId = null) {
    let url = 'http://palpito.com.br/bets.json';
    let filter = isNaN(parseInt(groupId)) ? '' : `group_id=${groupId}`;

    return fetch(`${url}?${filter}`, {
      headers: { Authorization: `Bearer ${this.state.accessToken}` }
    }).then((response) => response.json())
    .catch((error) => {
      console.error('error: ', error);
    });
  }

  _keyExtractor = (item, index) => item.id.toString();

  _renderItem({ item }) {
    const { navigate } = this.props.navigation;

    return (
      <TouchableHighlight onPress={() => { navigate('Bet', { bet: item }) }}>
        <View style={{ marginBottom: 10, flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={{ alignSelf: 'stretch', textAlign: 'center', fontSize: 12, backgroundColor: '#dff0d8', fontWeight: 'bold' }}>{item.weekday}</Text>
            <Text style={{ alignSelf: 'stretch', textAlign: 'center', fontSize: 11 }}>{item.date}</Text>
            <Text style={{ alignSelf: 'stretch', textAlign: 'center', fontSize: 10, color: '#777777' }}>{item.time}</Text>
          </View>
          <Image
            source={{ uri: `http:${item.team_home_image_url}` }}
            style={{ flex: 1, width: 50, height: 50 }}
          />
          <Text style={{ fontSize: 20, paddingTop: 15, paddingBottom: 15, flex: 2, textAlign: 'right' }}>{item.team_home_short}</Text>
          <Text style={{ fontSize: 20, paddingTop: 15, paddingBottom: 15, flex: 1, textAlign: 'right' }}>{item.team_home_goals}</Text>
          <View style={{ flex: 1, marginRight: 5, marginLeft: 5 }}>
            <Text style={{ fontSize: 10, textAlign: 'center', paddingTop: 15, paddingBottom: 5, color: '#999' }}>x</Text>
            {!item.is_bettable &&
              <Text style={[styles.playedScore, styles[item.label]]}>{item.game_team_home_goals} x {item.game_team_away_goals}</Text>
            }
          </View>
          <Text style={{ fontSize: 20, paddingTop: 15, paddingBottom: 15, flex: 1, textAlign: 'left' }}>{item.team_away_goals}</Text>
          <Text style={{ fontSize: 20, paddingTop: 15, paddingBottom: 15, flex: 2, textAlign: 'left' }}>{item.team_away_short}</Text>
          <Image
            source={{ uri: `http:${item.team_away_image_url}` }}
            style={{ flex: 1, width: 50, height: 50 }}
          />
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    return (
      <Container>
        <FlatList
          data={this.state.bets}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem.bind(this)}
          refreshing={this.state.refreshing}
          onRefresh={() => { this.refreshBets() }}
        />
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
