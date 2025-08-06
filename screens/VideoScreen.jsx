import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function VideoScreen() {
  const navigation = useNavigation();

  const handleNext = () => {
    navigation.navigate('SeatCheck');
  };

  return (
    <View style={styles.container}>
      <WebView
        style={{ flex: 1 }}
        javaScriptEnabled={true}
        source={{ uri: 'https://www.youtube.com/embed/WD_jTLtTeiM' }}
        />

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>넘어가기</Text>
      </TouchableOpacity>
    </View>
  );
}

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    height: height * 0.6,
  },
  button: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
