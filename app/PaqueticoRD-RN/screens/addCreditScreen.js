import React from 'react';
import {
  StyleSheet,
  View
} from 'react-native';

import {
  Text,
  Input,
  ButtonGroup
 } from 'react-native-elements';

import { MonoText } from '../components/StyledText';
import TabPop from '../components/tabPop';

export default class AddCardScreen extends React.Component {
  static navigationOptions = {
    title: '',
    
  };

  constructor() {
    super();
    this.state = {
      cards: [
        { id: 1, number: "1233", name: 'jose' },
        { id: 2, number: "1233", name: "jose" },
        { id: 3, number: "1233", name: "manuel" },
        { id: 4, number: "1233", name: "reyes" }
      ],
      selectedIndex: 0,
      number: '',
      name: '',
      fecha: '',
      validCard: false,
      type: 'visa',
      cvc: ''
    }
    this.updateIndex = this.updateIndex.bind(this)
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.number != '') {
      nextState.validCard = true;

    }else{
      nextState.validCard = false;
    }
  }

  updateIndex = (selectedIndex) => {
    let type = this.state.type;

    switch (selectedIndex) {
      case 0:
        type= 'visa';
        break;
      case 1:
        type = 'Master Card';
        break;
      case 2:
        type = 'amex';
        break;
      default:
        break;
    }
    this.setState({ type: type, selectedIndex: selectedIndex })
  }

  cc_format(value) {
    var v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    var matches = v.match(/\d{4,16}/g);
    var match = matches && matches[0] || ''
    var parts = []
    for (i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return value
    }
}

onChangeCreditText = (text) =>{
  var v = text.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
  var matches = v.match(/\d{4,16}/g);
  var match = matches && matches[0] || ''
  var parts = []
  for (i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4))
  }
  if (parts.length) {
    this.setState({ number: parts.join(' ') })

  } else {
    this.setState({number: text})
  }
}
  saveCreditCard = () => {
    const { type,  number, name, date, cvc } = this.state;
    
    console.warn(type, number, name, date, cvc);
  }

  render() {
    const { cards, selectedIndex } = this.state;
    const buttons = ['Visa', 'Master Card', 'AMEX'];

    return (
      <View style={styles.container}>
        {/* Go ahead and delete ExpoLinksView and replace it with your
           * content, we just wanted to provide you with some helpful links */}
        <View style={styles.selfContainer}>
          <Text style={{
            fontWeight: '600',
            fontSize: 28,
            textAlign: "center"
          }}>Agregar Tarjeta</Text>
          <Text>Llenes los campos</Text>
        </View>
        <View style={{
          padding: 10,
          alignItems: 'center',
          flex: 3
        }}>
          <View style={{ paddingBottom: 18 }}>
            <Text style={{
              fontWeight: '600',
              fontSize: 23,
              textAlign: "left",
              paddingBottom: 5
            }}>Numero de tarjeta</Text>
            <Input
              placeholder='3771-234-12344'
              value={this.state.number}
              onChangeText={txt =>  this.onChangeCreditText(txt)}
              inputContainerStyle={{ width: "100%" }}
            />
          </View>

          <View style={{ paddingBottom: 18 }}>
            <Text style={{
              fontWeight: '600',
              fontSize: 23,
              textAlign: "left",
              paddingBottom: 5
            }}>CVC</Text>
            <Input
              placeholder='9129'
              value={this.state.cvc}
              onChangeText={txt => this.setState({cvc: txt})}
              inputContainerStyle={{ width: "100%" }}
            />
          </View>
            
          <View style={{ paddingBottom: 18 }}>
            <Text style={{
              fontWeight: '600',
              fontSize: 23,
              textAlign: "left",
              paddingBottom: 5
            }}>Nombre</Text>
            <Input
              placeholder='John Doe'
              onChangeText={txt => this.setState({ name: txt })}
              inputContainerStyle={{ width: "100%" }}
            />
          </View>

         
          <View style={{ paddingBottom: 18 }}>
            <Text style={{
              fontWeight: '600',
              fontSize: 23,
              textAlign: "left",
              paddingBottom: 5
            }}>Fecha</Text>
            <Input
              placeholder='09/23'
              onChangeText={txt => this.setState({date: txt})}
              inputContainerStyle={{ width: "100%" }}
            />
          </View>

          <View style={{ paddingBottom: 18 }}>
            <Text style={{
              fontWeight: '600',
              fontSize: 23,
              textAlign: "center",
              paddingBottom: 5
            }}>Tipo</Text>
            <ButtonGroup
              onPress={this.updateIndex}
              selectedIndex={selectedIndex}
              buttons={buttons}
              containerStyle={{ height: 40, width: 300 }}
            />
          </View>
        </View>
        {this.state.validCard ? 
        <TabPop
          title={'Guardar'}
          overview={`Confirme los datos introducidos`}
          textButton={'Guardar'}
          onPress={() => this.saveCreditCard()}
        />     
        : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  selfContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    flex: 0.2
  },
  primaryText: {
    fontSize: 10,
    color: "grey",
    fontWeight: "400"
  },
  secondaryText: {
    color: "#3498db",
    fontWeight: "600",
    textAlign: 'center'
  }
});
