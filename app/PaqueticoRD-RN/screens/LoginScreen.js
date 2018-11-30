import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Input, Button } from 'react-native-elements';

const LOGIN_ERROR_MESSAGE = "Debe de completar todos los campos";

export default class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            user: "",
            pass: "",
            error: null,
        }
    }
  static navigationOptions = {
    header: null,
  };

  
  onLoginPressed = () => {
    const {user, pass} = this.state;
    console.log(`LOGIN USER ${user} PASS ${pass}`)
    if(user == "" || pass == "") {
        return this.setState({error: LOGIN_ERROR_MESSAGE});
    }
        
    return this.setState({
            error: null
        },
        () => this.props.navigation.navigate("Main")
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
            <Image style={{flex: 1, marginTop: 20}} resizeMode="contain" source={require("../assets/images/Logo.png")} />
        </View>
        <View style={styles.formContainer}>
            <Text style={styles.errorText}>{this.state.error}</Text>
            <Input
                inputContainerStyle={styles.inputContainer}
                underlineColorAndroid="transparent"
                placeholder='Usuario'
                leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                onChangeText={txt => this.setState({user: txt})}
                value={this.state.user}
            />
            <Input
                inputContainerStyle={styles.inputContainer}
                underlineColorAndroid="transparent"
                placeholder='Contraseña'
                leftIcon={{ type: 'feather', name: 'lock' }}
                onChangeText={txt => this.setState({pass: txt})}
                value={this.state.pass}

                secureTextEntry
            />
            <Button
                onPress={this.onLoginPressed}
                title='Iniciar Sesión'
                titleStyle={{ fontWeight: "600", fontSize: 18 }}
                buttonStyle={{
                    backgroundColor: "#3498db",
                    width: 300,
                    height: 50,
                    borderWidth: 0,
                    borderRadius: 50
                }}
                containerStyle={{ marginTop: 20 }}
            />
        </View>
      </View>
    );
  }
}
 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#3498db"//"#cc66c6"
  },
  formContainer: {
      flex: 2,
      paddingVertical: "5%",
      alignItems: "center"
  },
  inputContainer: {
      borderWidth: 1,
      borderRadius: 20,
      marginBottom: 10
  },
  errorText: {
      margin: 10,
      textAlign: "center",
      color: "#cc0000"
  }
});
