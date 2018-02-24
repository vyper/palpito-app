import React, { Component } from 'react';
import { ActivityIndicator, Alert, Button, Image, FlatList, Text, TouchableHighlight, View } from 'react-native';

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
    let filter = groupId === null ? '' : `group_id=${groupId}`;

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
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
          <Image
            source={{ uri: `http:${item.team_home_image_url}` }}
            style={{ width: 50, height: 50 }}
          />
          <Text style={{ fontSize: 20, paddingTop: 15, paddingBottom: 15, flex: 5, textAlign: 'right' }}>{item.team_home_short}</Text>
          <Text style={{ fontSize: 20, paddingTop: 15, paddingBottom: 15, flex: 1, textAlign: 'right' }}>{item.team_home_goals}</Text>
          <Text style={{ fontSize: 10, paddingTop: 15, paddingBottom: 15, flex: 1, textAlign: 'center' }}>x</Text>
          <Text style={{ fontSize: 20, paddingTop: 15, paddingBottom: 15, flex: 1, textAlign: 'left' }}>{item.team_away_goals}</Text>
          <Text style={{ fontSize: 20, paddingTop: 15, paddingBottom: 15, flex: 5, textAlign: 'left' }}>{item.team_away_short}</Text>
          <Image
            source={{ uri: `http:${item.team_away_image_url}` }}
            style={{ width: 50, height: 50 }}
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
