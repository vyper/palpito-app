import React, { Component } from 'react';
import { Alert, RefreshControl, View } from 'react-native';
import { Button, Container, Content, List, ListItem, Text } from 'native-base';

import { setActiveGroup, fetchGroups } from '../actions/groups';
import { onSignOut } from '../actions/auth';

export class DrawerMenu extends Component {
  state = {
    groups: [],
    refreshing: false,
  }

  componentWillMount() {
    this.refreshGroups();
  }

  async refreshGroups() {
    this.setState({ refreshing: true });
    let groups = await fetchGroups();
    this.setState({ groups, refreshing: false });
  }

  _renderRow(group) {
    const { navigate } = this.props.navigation;

    return (
      <ListItem
        button
        onPress={ () => {
          setActiveGroup(group.id).then(res => navigate('Bets', { groupId: group.id }))
        }}
      >
        <Text style={{ fontSize: 15 }}>{group.championship.name}</Text>
        <Text style={{ fontSize: 10, color: 'gray' }}>{group.name}</Text>
      </ListItem>
    );
  }

  render() {
    return (
      <Container style={{ paddingTop: 20 }}>
        <Content
          padder
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => this.refreshGroups()}
              title="Carregando..."
            />
          }>
          <List
            dataArray={this.state.groups}
            renderRow={this._renderRow.bind(this)}
          />

          <Button
            full
            onPress={() => {
              onSignOut().then(() => this.props.navigation.navigate('SignedOut'));
            }}
          >
            <Text>Sair</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}
