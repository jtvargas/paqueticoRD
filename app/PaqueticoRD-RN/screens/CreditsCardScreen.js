import React from 'react';
import { 
  ScrollView, 
  StyleSheet, 
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Button
 } from 'react-native';

import { Card, Icon } from 'react-native-elements';
import { MonoText } from '../components/StyledText';

export default class CreditsCardScreen extends React.Component {
  static navigationOptions = {
    title: 'Links'
  };

  constructor(){
    super();
    this.state = {
      cards: []
    }
    
  }

  goAddCard = () => {
    this.props.navigation.navigate('AddCard')
  }


  onCreditCardPressed = (item) => {
    // this.props.navigation.navigate('Home', item);
    console.warn(item);
  }

  render() {
    const { cards } = this.state;

    return (
      <View style={styles.container}>
        {/* Go ahead and delete ExpoLinksView and replace it with your
           * content, we just wanted to provide you with some helpful links */}
        <View style={styles.selfContainer}>
        <View style={{paddingRight: 10}}>
            <Text style={{
              fontWeight: '600',
              fontSize: 28,
              textAlign: "center"
            }}>Tarjetas guardadas</Text>
            <Text>Seleccione una tarjeta para modificar</Text>
        </View>
      
          
        <Icon
          name='plus-circle'
          type='font-awesome'
          color='#3498db'
          size={32}
          onPress={() => this.goAddCard()} 
        />
      
        
        </View>
        {cards.length > 0 ? 
        <FlatList
          style={{ flex: 1 }}
          data={cards}
          renderItem={({ item }) => (
            <CreditCard
              onPress={() => this.onCreditCardPressed(item)}
              numberCard={item.number}
              name={item.name}
            />
          )}
          keyExtractor={(item, index) => "K" + item.id}
        />
        : 
        <View style={{justifyContent: 'center', alignItems:'center', flex:1}}>
            <Icon
              name='emoji-sad'
              type='entypo'
              size={62}
              color='rgba(189, 195, 199,1.0)'
            />
          <Text style={{ textAlign: 'center' }}> No hay tarjetas guardadas</Text>
        </View>}
      </View>
    );
  }
}

const CreditCard = (props) =>{

  const types = {
    visa: 'https://logosmarcas.com/wp-content/uploads/2018/03/VISA-logo.png',
    amex: 'http://138.68.3.227/wp-content/uploads/2018/06/American-Express_Pentagram_Boteco-Design_04.jpg',
    masterCard: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/245px-Mastercard-logo.svg.png'
  }

  let number = props.numberCard;
  let asterisk = '';
  for (let i = 0; i <= 4; i++) {
    asterisk += '*'
    
  }
  const privNum = asterisk + number;
  const typeCard = '';
  switch (props.type) {
    case 'visa':
      typeCard = types[visa]
      break;
    case 'amex':
      typeCard = types[amex]
      break;
    case 'master card':
      typeCard = types[masterCard]
      break;
    default:
      break;
  }
  return(
    <TouchableOpacity
      onPress={ () => props.onPress()}
      style={[{ flex: 1 }, styles.containerStyle]}>
      <Card
        containerStyle={[{ flex: 1, padding: 15 }]}>
        <View style={{ flex: 7, alignItems: "center" }}>
          <View style={{ marginBottom: 5 }}>
            <MonoText style={{
              fontSize: 22,
              color: "black"
            }}>{privNum}</MonoText>
          </View>
          <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}>
            <View style={{ flex: 1, alignItems: "center"}}>
              <Text style={styles.primaryText}>Nombre</Text>
              <Text style={styles.secondaryText}>{props.name}</Text>
            </View>
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text style={styles.primaryText}>Tipo</Text>
               <Image
                style={{ width: 60, height: 40 }}
                resizeMode={"stretch"}
                source={{ uri: typeCard }}
              />
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  selfContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
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
