/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */


import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useEffect } from 'react';
import {
  SafeAreaProvider,

} from 'react-native-safe-area-context';
import * as Updates from 'expo-updates';

function App() {
  const { isUpdatePending } = Updates.useUpdates();

  useEffect(() => {
    // Check for a new update every 15 seconds for fast testing!
    const interval = setInterval(async () => {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync(); // Downloads the update in the background
        }
      } catch (error) {
        // Silently fail if offline
      }
    }, 15000); 

    return () => clearInterval(interval);
  }, []);

  const handleReload = async () => {
    await Updates.reloadAsync();
  };

  return (
    <SafeAreaProvider>
      {isUpdatePending && (
        <View style={styles.updateBanner}>
          <Text style={styles.updateBannerText}>✨ Update available</Text>
          <TouchableOpacity style={styles.reloadButton}>
            <Text style={styles.reloadButtonText} onPress={handleReload}>
              Reload
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 40, fontWeight: '900', color: '#ff007f', textAlign: 'center' }}>
        OLLLAAAA!!! 🎉
      </Text>
      <Text style={{ fontSize: 20, marginTop: 20, color: '#00ced1', textAlign: 'center', fontWeight: 'bold' }}>
        The magic never stops!
      </Text>
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
  updateBanner: {
    backgroundColor: '#0084ff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingTop: 50, // To avoid device top notch
    width: '100%',
    position: 'absolute',
    top: 0,
    zIndex: 9999, // Floating above everything
  },
  updateBannerText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  reloadButton: {
    backgroundColor: '#005bb5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  reloadButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default App;
