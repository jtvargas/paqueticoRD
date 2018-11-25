import React, { Component } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Platform
} from 'react-native';
import { MonoText } from '../components/StyledText';
import {
  Button
} from 'react-native-elements';

class TabPop extends Component {
  render() {
    return (
      <View style={styles.tabBarInfoContainer}>
        <View >
          <Text style={styles.tabBarInfoText}>{this.props.title}</Text>

          <View style={[styles.codeHighlightContainer]}>
            <MonoText style={styles.codeHighlightText}>{this.props.overview}</MonoText>
          </View>

        </View>
        <View>
          <Button
            titleStyle={{
              fontWeight: '600',
              fontSize: 18
            }}
            buttonStyle={{
              margin: 8,
              borderRadius: 50,
              backgroundColor: '#3498db'
            }}
            iconRight
            disabled={this.props.disabled}
            title={this.props.textButton}
            onPress={() => this.props.onPress()}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)'
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
    fontSize: 12
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
    marginTop: 5,
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

export default TabPop;
