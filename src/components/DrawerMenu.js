import React, { Component } from 'react';
import { Alert, Button, FlatList, ScrollView, Text, TouchableHighlight, View } from 'react-native';

import { setActiveGroup, fetchGroups } from '../actions/groups';
import { onSignOut } from '../actions/auth';

export class DrawerMenu extends Component {
  state = {
    groups: []
  }

  componentDidMount() {
    fetchGroups().then(groups => this.setState({ groups }));
  }

  _keyExtractor = (item, index) => item.id.toString();

  _renderItem({ item }) {
    const { navigate } = this.props.navigation;

    return (
      <TouchableHighlight
        onPress={ () => {
          setActiveGroup(item.id).then(res => navigate('Bets', { groupId: item.id }))
        }}
      >
        <View style={{ margin: 10 }}>
          <Text style={{ fontSize: 15 }}>{item.championship.name}</Text>
          <Text style={{ fontSize: 12, color: 'gray' }}>{item.name}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <ScrollView style={{ paddingTop: 20 }}>
        <FlatList
          data={this.state.groups}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem.bind(this)}
        />

        <Button
          title="Sair"
          onPress={() => {
            onSignOut().then(() => navigate('SignedOut'));
          }}
        />
      </ScrollView>
    );
  }
}
