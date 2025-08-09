import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Video from 'react-native-video';

export default function VideoScreen({ navigation }) {
  const handleNext = () => {
    navigation.navigate('SeatCheck');
  };

  const videoWidth = 1080;
  const videoHeight = 1920;

  // Web 환경
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <video
          width={videoWidth}
          height={videoHeight}
          controls
          style={styles.video}
        >
          <source src="/video/video.mp4" type="video/mp4" />
        </video>

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>넘어가기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 모바일 환경
  return (
    <View style={styles.container}>
      <Video
        ssource={require('../assets/video/video.mp4')}
        style={{ width: videoWidth, height: videoHeight, alignSelf: 'center' }}
        resizeMode="cover"
        controls
      />
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>넘어가기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    display: 'block',
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
