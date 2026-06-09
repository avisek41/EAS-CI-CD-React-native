/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */


import { StyleSheet, View, Text } from 'react-native';
import {
  SafeAreaProvider,

} from 'react-native-safe-area-context';

function App() {


  return (
    <SafeAreaProvider>
     
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 24, fontWeight: 'bold',color:'red' }}>Hello OTA Update!</Text>
      <Text style={{ fontSize: 16, marginTop: 10,color:'orange' }}>This came from the EAS Update!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor:'#fff'
  },
});

export default App;
