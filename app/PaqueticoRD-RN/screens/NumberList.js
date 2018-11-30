import React from 'react';
import {
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebBrowser } from 'expo';

import { Card, Badge } from 'react-native-elements';

import { MonoText } from '../components/StyledText';

import Icon from 'react-native-vector-icons/FontAwesome';
import { Divider, Avatar } from 'react-native-elements';

export default class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            dataUser: {
                name: "Pedro S. Lopez",//this.props.navigation.getParam('name', 'Juan Perez'),
                user: "elPEPE25",//this.props.navigation.getParam('user', 'JPerez'),
                image: "https://scontent-mia3-1.xx.fbcdn.net/v/t1.0-1/33145782_10216271931501189_8061695941494702080_o.jpg?_nc_cat=101&_nc_ht=scontent-mia3-1.xx&oh=aab19908fc03c6ef1c7beec6c665c62a&oe=5CA99BAB"
            },
            phoneNumbers: [{
                id: 0,
                numero: "809-732-0288",
                voiceBalance: "9 minutos",
                dataBalance: "10mb"
            },{
                id: 1,
                numero: "809-639-9234",
                voiceBalance: "15 minutos",
                dataBalance: "30mb"
            },{
                id: 2,
                numero: "809-7703-0024",
                voiceBalance: "9 minutos",
                dataBalance: "60mb"
            },{
                id: 3,
                numero: "809-732-0288",
                voiceBalance: "9 minutos",
                dataBalance: "10mb"
            },{
                id: 4,
                numero: "809-639-9234",
                voiceBalance: "15 minutos",
                dataBalance: "30mb"
            },{
                id: 5,
                numero: "809-7703-0024",
                voiceBalance: "9 minutos",
                dataBalance: "60mb"
            },{
                id: 6,
                numero: "809-732-0288",
                voiceBalance: "9 minutos",
                dataBalance: "10mb"
            },{
                id: 7,
                numero: "809-639-9234",
                voiceBalance: "15 minutos",
                dataBalance: "30mb"
            },{
                id: 8,
                numero: "809-7703-0024",
                voiceBalance: "9 minutos",
                dataBalance: "60mb"
            }]
        }
    }
  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
      console.log(this.props);
  }


  onPhoneNumberPressed = (item) => {
      this.props.navigation.navigate('Home', item);
  }

  render() {
      const {name, user, image} = this.state.dataUser;
      const {phoneNumbers} = this.state;
    return (
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
                                }}>{item.numero}</MonoText>
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
            keyExtractor={(item,index) => "K"+item.id}
        />
      </View>
    );
  }
}
 

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