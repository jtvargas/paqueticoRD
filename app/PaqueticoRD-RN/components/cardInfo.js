import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import {
  Card,
  Icon,
  ListItem
} from 'react-native-elements';

class CardInfo extends Component {

  renderItems = (data) => {
    return data.map((item, index) => (
        <ListItem
          key={index}
          title={item.title}
          rightTitle={item.rightTitle}
          subtitleStyle={{ color: 'grey'}}
        />
      
    ))
  }


  render() {
    return (
      <Card containerStyle={{ width: '90%', height: '60%', justifyContent:'center' }} title={this.props.headerText}>
        {this.renderItems(this.props.infoData)}
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
});

export default CardInfo;
