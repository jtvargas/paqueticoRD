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
import CreditCard from '../components/creditCards';

import {connect} from "react-redux";

class CreditsCardScreen extends React.Component {
  static navigationOptions = {
    title: 'CreditCards'
  };

  constructor(props){
    super(props);
    this.state = {};  
  }

  goAddCard = () => {
    this.props.navigation.navigate('AddCard');
  }

  /*componentDidMount() {
    this.props.dispatch(getPaymentMethods(this.props.userInfo.token));
  }*/


  onCreditCardPressed = (item) => {
    // this.props.navigation.navigate('Home', item);
    //console.warn(item);
  }

  render() {
    //const { cards } = this.state;
    let cards = this.props.cards;

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
              onPress={(item) => this.onCreditCardPressed()}
              numberCard={item.number}
              nameCard={item.name}
              type={item.type}
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

const mapStateToProps = state => {
  const userInfo = state.user;
  const cards = state.paymentMethods.paymentMethods;
  return {
    userInfo,
    cards
  };
};

export default connect(mapStateToProps)(CreditsCardScreen);



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
