import React, { Component } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  TouchableOpacity 
} from 'react-native';

import {
  Card
} from 'react-native-elements';

class RadioCard extends Component {
  static defaultProps = {
    height: 200,
    width: 150
  }
  constructor(){
    super();
    this.state = {
      isFocus: false,
      valueSelect: null
    }
  }


  selectCard = (id) =>{
    this.props.selected(id)
  }


  render() {
    const focus = this.props.isFocus;
    
    return (
      <TouchableOpacity 
        key={this.props.id} 
        onPress={() => this.selectCard(this.props.id)}
      >
        <Card
          containerStyle={[
            styles.containerCard,
            { height: this.props.height,
              width: this.props.width,
              borderColor: this.props.isFocus ? '#3498db' : '#bdc3c7',
              shadowRadius: this.props.isFocus ? 6 : 0,
              shadowOffset: this.props.isFocus ? { width: 2, height: 1 } : { width: 0.5, height: 0.1 }
            }
          ]}
        >
          <Text style={styles.textStyle}>{this.props.textCard}</Text>
        </Card>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  containerCard: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  textStyle: {
    fontWeight: '600',
    fontSize: 24,
    color: 'grey'
  }
});

export default RadioCard;
