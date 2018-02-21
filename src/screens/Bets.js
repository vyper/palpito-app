import React, { Component } from 'react';
import { ActivityIndicator, Alert, Button, FlatList, Text, TouchableHighlight, View } from 'react-native';

import { currentSignedUser, onSignOut } from '../auth';

export default class Bets extends Component {
  state = {
    accessToken: '',
    bets: [],
    loading: true,
  }

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};

    return {
      headerRight: (
        <Button
          title="Sign Out"
          onPress={() => {
            onSignOut().then(() => navigation.navigate('SignedOut'));
          }}
        />
      ),
    };
  };

  async componentDidMount() {
    let accessToken = await currentSignedUser();
    this.setState({ accessToken });
    let bets = await this.requestBets();
    console.log(bets);
    this.setState({ bets, loading: false });
  }

  requestBets() {
    return fetch('http://palpito.com.br/bets.json?group_id=13', {
      headers: { Authorization: 'Bearer ' + this.state.accessToken }
    }).then((response) => response.json())
    .catch((error) => {
      console.error('error: ', error);
    });
  }

  _keyExtractor = (item, index) => item.id.toString();

  _renderItem = ({item}) => (
    <TouchableHighlight onPress={() => { Alert.alert(`open ${item.id}`) }}>
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
        <Text style={{ fontSize: 20, paddingTop: 15, paddingBottom: 15, flex: 5, textAlign: 'right' }}>{item.team_home}</Text>
        <Text style={{ fontSize: 20, paddingTop: 15, paddingBottom: 15, flex: 1, textAlign: 'right' }}>{item.team_home_goals}</Text>
        <Text style={{ fontSize: 10, paddingTop: 15, paddingBottom: 15, flex: 1, textAlign: 'center' }}>x</Text>
        <Text style={{ fontSize: 20, paddingTop: 15, paddingBottom: 15, flex: 1, textAlign: 'left' }}>{item.team_away_goals}</Text>
        <Text style={{ fontSize: 20, paddingTop: 15, paddingBottom: 15, flex: 5, textAlign: 'left' }}>{item.team_away}</Text>
      </View>
    </TouchableHighlight>
  );

  render() {
    return (
      <View>
        { this.state.loading &&
          <ActivityIndicator size="large" />
        }

        <FlatList
          data={this.state.bets}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
        />
      </View>
    );
  }
}