import React, { Component } from 'react';
import { FlatList, Text, View } from 'react-native';

export default class Bets extends Component {
  state = {
    bets: []
  }

  async componentWillMount() {
    const bets = await this.requestBets();
    this.setState({ bets });
  }

  requestBets() {
    return fetch('http://palpito.com.br/bets.json?day=2016-07-03+00%3A00%3A00+UTC', {
      headers: { Authorization: 'Bearer ' + this.props.accessToken }
    }).then((response) => response.json())
    .catch((error) => {
      console.error('error: ', error);
    });
  }

  _keyExtractor = (item, index) => item.id;

  _renderItem = ({item}) => (
    <Text>{item.team_home}</Text>
  );

  render() {
    return (
      <FlatList
        data={this.state.bets}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
      />
    );
  }
}
