//import liraries
import React, { Component } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  TouchableOpacity,
  Image
   } from 'react-native';
   
import { MonoText } from '../components/StyledText';
import {
  Card
} from 'react-native-elements';

// create a component
class CreditCard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      selected: null,
      isFocused: false,
      numberCard: 0,
      nameCard: 'John Doe',
      idCard: null,
      typeCard: 'https://logosmarcas.com/wp-content/uploads/2018/03/VISA-logo.png',
      types:{
        visa: 'https://logosmarcas.com/wp-content/uploads/2018/03/VISA-logo.png',
        amex: 'http://138.68.3.227/wp-content/uploads/2018/06/American-Express_Pentagram_Boteco-Design_04.jpg',
        mastercard: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/245px-Mastercard-logo.svg.png'
      }
    }
  }

componentDidMount() {

  let number = this.props.numberCard;
  let typeCard = this.props.type;
  const nameCard = this.props.nameCard; 
  let asterisk = '';

  for (let i = 0; i <= 4; i++) {
    asterisk += '*'

  }
  number = asterisk + number

  switch (typeCard) {
    case 'visa':
      typeCard = this.state.types["visa"]
      break;
    case 'amex':
      typeCard = this.state.types["amex"]
      break;
    case 'mastercard':
      typeCard = this.state.types["mastercard"]
      break;
    default:
      break;
  }

  this.setState({ 
    typeCard: typeCard,
    numberCard: number,
    nameCard: nameCard
  })
}


  render() {
    let focus = {
      borderColor: '#3498db',
      height: 120,
      padding: 15
    }
    const isFocus = this.props.isFocus;

    return (
    
      <TouchableOpacity
        onPress={() => this.props.onPress(this.props.numberCard)}
        style={[{ flex: 1 }, styles.containerStyle]}>
        <Card
          containerStyle={isFocus ? focus :
            { 
            height:120, 
            padding: 15
            }}>
          <View style={{ alignItems:'center'}}>
            <View>
              <MonoText style={{
                fontSize: 22,
                color: "black"
              }}>{this.state.numberCard}</MonoText>
            </View>
            
            <View style={{ justifyContent:"space-between", flexDirection:'row'}}>
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text style={styles.primaryText}>Nombre</Text>
                <Text style={[{paddingTop:8},styles.secondaryText]}>{this.state.nameCard}</Text>
              </View>

              <View style={{  flex: 1, alignItems: "center" }}>
                <Text style={styles.primaryText}>Tipo</Text>
                <Image
                  style={{ width: 60, height: 40 }}
                  resizeMode={"stretch"}
                  source={{ uri: this.state.typeCard }}
                />
              </View>

            </View>
          </View>
        </Card>
      </TouchableOpacity>
    )
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
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

//make this component available to the app
export default CreditCard;
