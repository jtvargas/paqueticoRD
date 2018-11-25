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

export default class RechargeScreen extends React.Component {
  
  
  constructor(){
    super();
    this.state = {
      plan: null,
      isSelected: false,
      selected: null,
      processData:{},
      voicePlans: [
        {
          id:1,
          value: 50,
          text: 50
        },
        {
          id: 2,
          value: 100,
          text: 100
        },
        {
          id: 3,
          value: 150,
          text: 150
        },
        {
          id: 4,
          value: 200,
          text: 200
        },
      ],
      dataPlans: [
        {
          id: 1,
          value: 50,
          text: 50
        },
        {
          id: 2,
          value: 120,
          text: 120
          
        },
        {
          id: 3,
          value: 150,
          text: 150
        },
        {
          id: 4,
          text: 200,
          value: 200
        }
      ]
    }
    
  }
  componentWillMount() {
    const { plan } = this.props.navigation.state.params;
    this.setState({ plan: plan})
  }

  planSelected = (plan) =>{
    
    this.setState({
      selected: true,
      selected: plan
    },() =>{
      const processData = {
        service: this.state.plan,
        amount: this.state.selected
      }
      this.setState({ processData: processData }, () => console.warn(this.state.processData))
    })
  }

  _keyExtractor = (item) => item.id;

  renderMethod = (method) => {
    if(method == 'voice')
    {
      return (
        <View style={{margin: 15}}>
          <RadioButtons
           data={this.state.voicePlans}
           opSelect={(op) => this.planSelected(op)}
          />
        </View>
      )
    }else{
      return (
        <View style={{ margin: 15 }}>
          <RadioButtons
            data={this.state.dataPlans}
            opSelect={(op) => this.planSelected(op)}
          />
        </View>
      )
    }

  }
  render() {
    const { plan, measure } = this.props.navigation.state.params;
    const textPlan = plan == 'voice' ? 'voz' : 'data';
    return (
      <View style={styles.container}>
        <View style={styles.selfContainer}>
          <Text style={{
            fontWeight: '600',
            fontSize: 28
          }}>¿De cuanto seria tu recarga?</Text>
          <Text>Datos medidos en {measure} </Text>
          {this.renderMethod(this.state.plan)}
        </View>
        { this.state.selected ? 
          <TabPop
            title={'Recargar'}
            overview={`Recarga ${this.state.selected} a tu plan de ${textPlan} `}
            textButton={'SEGUIR'}
            disabled={this.state.selected ? false : true}
            onPress={() => this.props.navigation.navigate(
              'Payment', 
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
    flex:1,
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
