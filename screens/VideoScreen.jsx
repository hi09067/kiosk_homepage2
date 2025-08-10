import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Video from 'react-native-video';

export default function VideoScreen({ navigation }) {
  const handleNext = () => {
    navigation.navigate('SeatCheck');
  };

  if (Platform.OS === 'web') {
    // 웹: public/video/video.mp4 로 배포됨 → URL은 /video/video.mp4
    return (
      <View style={styles.container}>
        <video
          controls
          style={styles.webVideo}
        >
          <source src="/video/video.mp4" type="video/mp4" />
        </video>

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>넘어가기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 모바일(iOS/Android): assets에 포함된 파일을 require로 로드
  return (
    <View style={styles.container}>
      <Video
        source={require('../assets/video/video.mp4')}
        style={styles.nativeVideo}
        resizeMode="cover"     // 화면 꽉 채우되 비율 유지
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
  // 웹 비디오: 부모(View) 전체를 채우고, 잘리는 부분은 cover
  webVideo: {
    width: '100%',
    height: '100%',
    display: 'block',
    objectFit: 'cover',
  },
  // 모바일 비디오: 화면 전체
  nativeVideo: {
    width: '100%',
    height: '100%',
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
