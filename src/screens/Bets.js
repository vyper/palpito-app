import React, { Component } from 'react';
import {
  Body,
  Button,
  Col,
  Container,
  Content,
  Icon,
  Form,
  Grid,
  Header,
  Left,
  List,
  ListItem,
  Picker,
  Right,
  Row,
  Title,
  Subtitle,
} from 'native-base';
import { Alert, Image, StyleSheet, Text, RefreshControl, View } from 'react-native';

import { currentSignedUser } from '../actions/auth';
import { getActiveGroup } from '../actions/groups';

export default class Bets extends Component {
  state = {
    accessToken: '',
    bets: [],
    refreshing: true,
    activeGroupId: '',
  }

  componentWillReceiveProps(nextProps) {
    let params = nextProps.navigation.state.params;
    let activeGroupId = params.groupId;

    this.setState({ activeGroupId });
    this.refreshBets();
  }

  componentDidMount() {
    this.refreshBets();
  }

  async refreshBets() {
    this.setState({ bets: [] });

    if (this.state.activeGroupId.length < 1) {
      let activeGroupId = await getActiveGroup();
      this.setState({ activeGroupId });
    }
    let accessToken = await currentSignedUser();

    this.setState({ accessToken, refreshing: true });
    let bets = await this.requestBets();
    this.setState({ bets, refreshing: false });
  }

  requestBets() {
    let groupId = this.state.activeGroupId;

    let url = 'http://palpito.com.br/bets.json';
    let filter = isNaN(parseInt(groupId)) ? '' : `group_id=${groupId}`;

    return fetch(`${url}?${filter}`, {
      headers: { Authorization: `Bearer ${this.state.accessToken}` }
    }).then((response) => response.json())
    .catch((error) => {
      console.error('error: ', error);
    });
  }

  _renderRow(bet) {
    const { navigate } = this.props.navigation;

    return (
      <ListItem onPress={() => { navigate('Bet', { bet }) }}>
        <Grid>
          <Col size={1}>
            <Row style={{ justifyContent: 'center', backgroundColor: '#dff0d8' }}>
              <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{bet.weekday}</Text>
            </Row>
            <Row style={{ justifyContent: 'center' }}>
              <Text style={{ fontSize: 11 }}>{bet.date}</Text>
            </Row>
            <Row style={{ justifyContent: 'center' }}>
              <Text style={{ fontSize: 10, color: '#777777' }}>{bet.time}</Text>
            </Row>
          </Col>

          <Col size={2} style={{  alignItems: 'center', justifyContent: 'center' }}>
            <Image
              source={{ uri: `http:${bet.team_home_image_url}` }}
              style={{ width: 50, height: 50 }}
            />
            <Text style={{ fontSize: 10 }}>{bet.team_home}</Text>
          </Col>
          <Col size={1} style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ textAlign: 'center', fontSize: 20 }}>{bet.team_home_goals}</Text>
          </Col>
          <Col size={2} style={{ alignItems: 'center', justifyContent: 'center' }}>
            {!bet.is_bettable &&
              <Text style={[styles.playedScore, styles[bet.label]]}>{bet.game_team_home_goals} x {bet.game_team_away_goals}</Text>
            }
            {!this.state.isBettable &&
              <Text style={{ textAlign: 'center', fontSize: 20 }}>{bet.points}</Text>
            }
          </Col>
          <Col size={1} style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ textAlign: 'center', fontSize: 20 }}>{bet.team_away_goals}</Text>
          </Col>
          <Col size={2} style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Image
              source={{ uri: `http:${bet.team_away_image_url}` }}
              style={{ width: 50, height: 50 }}
            />
            <Text style={{ fontSize: 10 }}>{bet.team_away}</Text>
          </Col>
        </Grid>
      </ListItem>
    );
  }

  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate("DrawerOpen")}
            >
              <Icon name='menu' />
            </Button>
          </Left>
          <Body>
            <Title>Palpites</Title>
          </Body>
          <Right />
        </Header>

        <Content
          padder
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
              title="Carregando..."
            />
          }>
          <List
            dataArray={this.state.bets}
            renderRow={this._renderRow.bind(this)}
          />
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
