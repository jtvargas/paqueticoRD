import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Platform,
  Alert
} from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import { MonoText } from '../components/StyledText';
import {
  Header,
  Icon,
  ButtonGroup,
  Card,
  Button,
  ListItem
} from 'react-native-elements';


import {connect} from "react-redux";

import {getPhoneNumbers} from '../actions/phoneNumbers';
import {placeOrder} from '../actions/payment';

import RadioButtons from '../components/wraperCards';
import TabPop from '../components/tabPop';
import CardInfo from '../components/cardInfo';


class CheckoutScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      service: null,
      amount: null,
      payment: null

    }

  }

  componentWillMount() {
    const { plan, processData } = this.props.navigation.state.params;
    const {service, amount, payment} = processData;
    this.setState({
      service: service,
      amount: amount,
      payment: payment
    })
  }

  componentDidUpdate(prevProps) {
    if(this.props.cart.message != "") this.onPaymentSuccessful();
    if(this.props.cart.error != "") this.onPaymentError();
  }

  onPaymentSuccessful = () => {
    this.props.dispatch(getPhoneNumbers(this.props.userInfo.token));
    Alert.alert(
      'MUY BIEN!',
      `Se ha recargado tu paquete de ${this.state.service} con exito`,
      [
        {text: 'Ok', onPress: () => this.props.navigation.popToTop()}
      ],
      { cancelable: false }
    )
  }

  onPaymentError = () => {
    Alert.alert(
      'Ha ocurrido un problema!',
      this.props.cart.error,
      [
        {text: 'Ir al inicio', onPress: () => this.props.navigation.popToTop()},
        {text: 'Volver', onPress: () => console.log('Nada')}
      ],
      { cancelable: false }
    )
  }

  paymentSelected = (payment) => {

  }

  onPayPressed = () => {
    let orderType = this.state.service;
    let amount = this.state.amount;
    let paymentMethodId = "5c00cd03ac86e75937a69ee3";
    let contractId = this.props.selectedNumber.id;

    this.props.dispatch(placeOrder(orderType, amount, paymentMethodId, contractId, this.props.userInfo.token ));
  }

  _keyExtractor = (item) => item.id;

  renderMethods = () => {
    return (
      <View style={{ margin: 15 }}>
        <RadioButtons
          data={this.state.paymentsMethods}
          opSelect={(op) => this.paymentSelected(op)}
        />
      </View>
    )
  }
  render() {
    const textPlan = this.state.service == 'voice' ? 'Voz' : 'Data';

    return (
      <View style={styles.container}>
        <View style={styles.selfContainer}>
          <Text style={{
            fontWeight: '600',
            fontSize: 28
          }}>Breve resumen del pedido</Text>
          <Card 
            containerStyle={{ width: '90%', height: '60%', justifyContent: 'center' }} 
            title={'Orden'}>
            <View style={{padding: 10}}>
              <View style={{
                alignItems: 'center',
                flexDirection: "row",
                justifyContent: "space-between"
              }}>
                <Text>Servicio</Text>
                <Text>{textPlan}</Text>
              </View>

              <View style={{
                alignItems: 'center',
                flexDirection: "row",
                justifyContent: "space-between"
              }}>
                <Text>Cantidad a comprar</Text>
                <Text>{this.state.amount}</Text>
              </View>

              <View style={{
                alignItems: 'center',
                flexDirection: "row",
                justifyContent: "space-between"
              }}>
                <Text>Metodo de pago</Text>
                <Text>{this.state.payment}</Text>
              </View>

            </View>
            
          </Card>
         
        </View>
          <TabPop
            title={'Confirmar Pago'}
            textButton={'PAGAR'}
            overview={`Confirmar pago con ${this.state.payment}`}
            onPress={() => this.onPayPressed() /*alert('pagado')*/}
          />

      </View>
    );
  }
}

const mapStateToProps = state => {
  const userInfo = state.user;
  const selectedNumber = state.phoneNumbers.selectedNumber;
  const cart = state.cart;
  return {
    userInfo,
    selectedNumber,
    cart
  };
};

export default connect(mapStateToProps)(CheckoutScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  selfContainer: {
    alignItems: 'center',
    flex: 1,
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
    padding: 25
  },
});
