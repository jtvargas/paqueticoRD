import React, { Component } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  FlatList } from 'react-native';

import RadioCard from '../components/radioCards';

class WrapperRadio extends Component {
  constructor(props){
    super();
    this.state = {
      data: [],
      selected: null,
      isFocused: false
    }
  }

  componentWillMount() {
    const data = this.props.data;
    this.setState({
      data: data
    })
  }

  
  selected(id){
    this.setState({
      isFocused: true,
      selected: id
    }, () => this.props.opSelect(this.state.selected))
  }

  
  _renderOptions = ({ item }) => {
    return (
      <RadioCard
        textCard={item.text}
        id={item.text}
        isFocus={this.state.isFocused && (this.state.selected == item.text)? true : false}
        selected={(id) => this.selected(id)}
      />
    )
  }
  _keyExtractor = (item) => item.id;

  render = () =>{
    return (
      <FlatList
        data={this.state.data}
        extraData={this.state}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderOptions}
        numColumns={2}
        scrollEnabled={false}
      />
    );
  }
}

export default WrapperRadio;
