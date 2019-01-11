import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {connect} from "react-redux";

import { Input, Button } from 'react-native-elements';

import {authenticateUser} from '../actions/user';

const LOGIN_ERROR_MESSAGE = "Debe de completar todos los campos";

class LoginScreen extends React.Component {
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
 
 componentDidUpdate(prevProps, prevState) {
   if(prevProps != this.props)
    {
       this.setState({loading: false});
    }
   if(this.props.userInfo.done)
    {    
      this.props.navigation.navigate("Main");
    }
 }
  
  onLoginPressed = () => {
    const {user, pass, loading} = this.state;
    if(loading) return 0;
    console.log(`LOGIN USER ${user} PASS ${pass}`)
    if(user == "" || pass == "") {
        return this.setState({error: LOGIN_ERROR_MESSAGE});
    }
        
    return this.setState({
            error: null,
            loading: true
        },
        () => this.props.dispatch(authenticateUser(user, pass))
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
            <Image style={styles.image} resizeMode="contain" source={require("../assets/images/Logo.png")} />
        </View>
        <View style={styles.formContainer}>
            <Text style={styles.errorText}>{this.state.error || this.props.userInfo.error}</Text>
            <Input
                inputContainerStyle={styles.inputContainer}
                underlineColorAndroid="transparent"
                placeholder='Usuario'
                leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                onChangeText={txt => this.setState({user: txt})}
                value={this.state.user.toLowerCase()}
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
                onPress={() => this.onLoginPressed()}
                title='Iniciar Sesión'
                titleStyle={{ fontWeight: "600", fontSize: 18 }}
                buttonStyle={{
                    backgroundColor: "#3498db",
                    width: 300,
                    height: 50,
                    borderWidth: 0,
                    borderRadius: 50
                }}
                loading = {this.state.loading}
                loadingProps={{ size: "large", color: "rgba(255, 255, 255, 1)" }}
                containerStyle={{ marginTop: 20 }}
            />
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
    const userInfo = state.user;
    return {
      userInfo
    };
  };

export default connect(mapStateToProps)(LoginScreen);
 

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
  },
  image: {
    flex: 1,
    marginTop: 20
  }
});
