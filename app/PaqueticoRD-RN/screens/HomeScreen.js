import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';
import { WebBrowser } from 'expo';


import {connect} from "react-redux";

import { MonoText } from '../components/StyledText';
import {
  Header,
  Icon,
  ButtonGroup,
  Card,
  Button
} from 'react-native-elements';
import TabPop from '../components/tabPop';
import CardInfo from '../components/cardInfo';

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Detalle'

  };
  constructor(props){
    super(props);
    this.state = {
      selectedIndex: 0,
      number: '(809)-696-7648',
      balanceData: '1',
      balanceVoice: '100',
      lastRechargeVoice: '100',
      lastRechargeData: '1',
      dataVoice:[ 
        {
          title: "Disponible (minutos)",
          rightTitle: props.selectedNumber.voiceBalance + "",
          leftIcon: "phone"
        },
        {
          
          title: "Ultimo plan contratado",
          rightTitle: "50",
          leftIcon: "phone"
        },
        {
          title: "Corte",
          rightTitle: "10/12/2018",
          leftIcon: "calendar"
        },
      ],
      dataData: [
        {
          title: "Disponible (MB)",
          rightTitle: props.selectedNumber.dataBalance + "",
          leftIcon: "phone"
        },
        {

          title: "Ultimo plan contratado",
          rightTitle: "100",
          leftIcon: "phone"
        },
        {
          title: "Corte",
          rightTitle: "10/12/2018",
          leftIcon: "calendar"
        },
      ]
    }
    this.updateIndex = this.updateIndex.bind(this);

  }

  componentWillMount() {
    console.log("COMP PROPS", this.props);
  }

  updateIndex (selectedIndex) {
    this.setState({selectedIndex});
  }

  renderCardInfo(){
    const { selectedIndex } = this.state;

    switch (selectedIndex) {
      case 0:
        return (
        <CardInfo
          infoData={this.state.dataVoice}
        />
        )
        break;
      case 1:
      return(
        <CardInfo
          infoData={this.state.dataData}
        />
      )
      break;
      default:
        break;
    }
  }
  navigateToRecharge = (plan) =>{
    this.props.navigation.setParams({plan: plan})
    this.props.navigation.naigate('Recharge')
  }
  renderTabCharge() {
    const { selectedIndex } = this.state;

    switch (selectedIndex) {
      case 0:
        return (
          <TabPop
            title={'Plan de Voz'}
            overview={'Recarga tu plan de voz'}
            onPress={() => this.props.navigation.navigate('Recharge', { plan: 'voice', measure:'minutos' })}
            textButton={'RECARGAR'}
          />
        )
        break;
      case 1:
        return (
          <TabPop
            title={'Plan de data'}
            overview={'Recarga tu plan de data'}
            onPress={() => this.props.navigation.navigate('Recharge', { plan: 'data', measure:'MB' })}
            textButton={'RECARGAR'}
          />
        )
        break;
      default:
        break;
    }
  }

  render() {
    const buttons = ['Voz', 'Data'];
    const { selectedIndex } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.welcomeContainer}>
          <Icon
            raised
            name='mobile-phone'
            type='font-awesome'
            color='#3498db'
            size={32}
            onPress={() => console.log('hello')} />
        </View>
        {this.renderNumInfo()}

        <ButtonGroup
          onPress={this.updateIndex}
          selectedIndex={selectedIndex}
          buttons={buttons}
          selectedButtonStyle={{
            backgroundColor: '#3498db'
          }}
          containerStyle={{ height: 40 }}
        />

        <View style={styles.contentContainer} >
         {this.renderCardInfo()}

        </View>

        {/* Recargar componente */}
        {this.renderTabCharge()}
        {/*  */}
      </SafeAreaView>
    );
  }

  renderNumInfo() {

      return (
        <View style={styles.getStartedContainer}>
          <MonoText style={{
            fontSize: 22
          }}>{this.props.selectedNumber.number}</MonoText>
          <Text style={styles.developmentModeText}>
            Proveedor Patelito
          </Text>
        </View>
       
      );
     
  }
}

const mapStateToProps = state => {
  const selectedNumber = state.phoneNumbers.selectedNumber;
  return {
    selectedNumber
  };
};

export default connect(mapStateToProps)(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 10,
    alignItems: 'center'
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  }
});
