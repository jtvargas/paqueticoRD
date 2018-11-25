import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Platform
} from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import { MonoText } from '../components/StyledText';
import {
  Header,
  Icon,
  ButtonGroup,
  Card,
  Button
} from 'react-native-elements';

import RadioButtons from '../components/wraperCards';
import TabPop from '../components/tabPop';

export default class PaymentScreen extends React.Component {


  constructor() {
    super();
    this.state = {
      plan: null,
      isSelected: false,
      processData: {},
      paymentsMethods:[
        {
          method: 'Tarjeta',
          text:'Tarjeta',
          intermediate: 'Visa',
          bank: 'Scotiabank'
        },
        {
          method: 'Paypal',
          text:'Paypal',
          intermediate: 'Paypal.co'
        }
      ]
    }

  }
  componentWillMount() {
    const { plan, processData } = this.props.navigation.state.params;
    this.setState({ 
      plan: plan,
      processData: processData })
  }


  paymentSelected = (payment) => {
    this.setState({ 
      selected: true, 
      selected: payment 
    }, () => {
      const processData = {
        ...this.state.processData,
        payment: this.state.selected
      }

      this.setState({ processData: processData }, () => console.warn(this.state.processData))
    })
  }

  _keyExtractor = (item) => item.id;

  renderMethods = () => {
   return(
     <View style={{ margin: 15 }}>
       <RadioButtons
         data={this.state.paymentsMethods}
         opSelect={(op) => this.paymentSelected(op)}
       />
     </View>
   ) 
  }
  render() {
    const textPlan = this.state.plan == 'voice' ? 'voz' : 'data';
    return (
      <View style={styles.container}>
        <View style={styles.selfContainer}>
          <Text style={{
            fontWeight: '600',
            fontSize: 28
          }}>¿Cual seria tu metodo de pago?</Text>
          {this.renderMethods()}
        </View>
        {this.state.selected ?
          <TabPop
            title={'Pago'}
            overview={`Pagaras con ${this.state.selected} a tu plan de ${textPlan} `}
            textButton={'SEGUIR'}
            onPress={() => this.props.navigation.navigate(
              'Checkout',
              {
                processData: this.state.processData,
                plan: 'voice',
                measure: 'minutos'
              }
            )}
          />
          :
          null
        }

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
