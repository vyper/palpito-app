import React, { Component } from 'react';
import { Button, FlatList, ScrollView, Text, View } from 'react-native';

import { fetchGroups } from '../actions/groups';
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
    return (
      <View>
        <Text>{item.championship.name}</Text>
        <Text style={{ fontSize: 12, color: 'gray' }}>{item.name}</Text>
      </View>
    );
  }

  render() {
    return (
      <ScrollView>
        <Text style={{ color: '#fff', backgroundColor: '#333' }}>Palpito</Text>

        <FlatList
          data={this.state.groups}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem.bind(this)}
        />

        <Button
          title="Sair"
          onPress={() => {
            onSignOut().then(() => navigation.navigate('SignedOut'));
          }}
        />
      </ScrollView>
    );
  }
}
