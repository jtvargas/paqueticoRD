import React from 'react';
import {
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  View,
  SafeAreaView
} from 'react-native';
import { WebBrowser } from 'expo';

import {connect} from "react-redux";

import { Card, Badge } from 'react-native-elements';

import { MonoText } from '../components/StyledText';

import {getPhoneNumbers, selectNumber} from '../actions/phoneNumbers';

import Icon from 'react-native-vector-icons/FontAwesome';
import { Divider, Avatar } from 'react-native-elements';

import TabPop from '../components/tabPop';

class NumberList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            dataUser: {
                image: "https://www.waspcom.com/wp-content/uploads/2014/10/user-placeholder-circle-1.png"
            }
        }
    }
  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
      this.getContracts();
  }

  getContracts = () => {
    this.props.dispatch(getPhoneNumbers(this.props.userInfo.token));
  }

  onPhoneNumberPressed = (item) => {
      this.props.dispatch(selectNumber(item));
  }

  render() {
      //const {name, user, image} = this.state.dataUser;
      const name = this.props.userInfo.name;
      const user = this.props.userInfo.email;
      const image = this.props.userInfo.image || this.state.dataUser.image;
      const phoneNumbers = this.props.userPhones.phoneNumbers;
      const selectedNumber = this.props.userPhones.selectedNumber;
    return (
       <SafeAreaView style={{flex: 1, paddingTop: 10}}>
        <View style={styles.container}>
            <View style={styles.dataUserContainer}>
                <Avatar
                    size="large"
                    rounded
                    source={{uri: image}}
                />
                <Text style={{fontSize: 16, fontWeight: "600"}}>{name} ({user})</Text>
                <Text>TELEFONOS REGISTRADOS</Text>
                <Badge
                    containerStyle={{backgroundColor: "#3498db"}}
                    value={phoneNumbers.length}
                    textStyle={{ color: 'white' }}
                />
            </View>

        
        {phoneNumbers.length > 0 ? (
            <View style={{flex: 1}}>
            <View style={styles.selfContainer}>
            <Text style={{
                fontWeight: '600',
                fontSize: 28,
                textAlign: "center"
            }}>Escoja un telefono para la recarga</Text>
            <Text>Telefonos disponibles</Text>
            
            
            </View>
            <FlatList
                style={{flex: 1}}
                data={phoneNumbers}
                renderItem={({item}) => (
                    <TouchableOpacity 
                    onPress={() => this.onPhoneNumberPressed(item)}
                    style={[{flex: 1},styles.containerStyle]}>
                        <Card
                        containerStyle={[{flex: 1, padding: 15}]}>
                            <View style={{flex: 7, alignItems: "center"}}>
                                <View style={{marginBottom: 5}}>             
                                    <MonoText style={{
                                        fontSize: 22,
                                        color: "black"
                                    }}>{item.number}</MonoText>
                                </View>
                                <View style={{flex: 1, flexDirection: "row", justifyContent: "space-between"}}>
                                    <View style={{flex: 1, alignItems: "center"}}>
                                        <Text style={styles.primaryText}>DATA BALANCE</Text>   
                                        <Text style={styles.secondaryText}>{item.dataBalance}</Text>
                                    </View>
                                    <View style={{flex: 1, alignItems: "center"}}>
                                        <Text style={styles.primaryText}>VOICE BALANCE</Text>   
                                        <Text style={styles.secondaryText}>{item.voiceBalance}</Text>
                                    </View>
                                </View>
                            </View>
                        </Card>
                    </TouchableOpacity>
                )}
                keyExtractor={(item,index) => item.id}
            /> 
            </View>) : (<View style={{alignItems: "center", marginTop: 20}}>
                    <Text style={{fontSize: 20}}>No hay numeros disponibles</Text>
                </View>
                ) }
            {selectedNumber.number != undefined ? (<TabPop
            title={'Telefono seleccionado '+selectedNumber.number}
            overview={'Continuar con la recarga'}
            onPress={() => this.props.navigation.navigate('Home')}
            textButton={'Seleccionar'}
          />) : null}
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
    const userInfo = state.user;
    const userPhones = state.phoneNumbers;
    return {
      userInfo,
      userPhones
    };
  };

export default connect(mapStateToProps)(NumberList);
 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  selfContainer: {
    alignItems: 'center'
  },
  containerCard: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  textStyle: {
    fontWeight: '600',
    fontSize: 24,
    color: 'grey'
  },
  dataUserContainer: {
    width: "100%",
    backgroundColor: "white",
    paddingVertical: 30,
    alignItems: "center"
  },
  primaryText: {
    fontSize: 10,
    color: "grey",
    fontWeight: "400"
  },
  secondaryText: {
    color: "#3498db",
    fontWeight: "600"
  }
});