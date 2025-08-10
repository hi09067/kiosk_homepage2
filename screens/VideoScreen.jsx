import React, { useEffect, useRef } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Video from 'react-native-video';

export default function VideoScreen({ navigation }) {
  const handleNext = () => {
    navigation.navigate('SeatCheck');
  };

  // ✅ 웹: 자동재생 보강용 ref
  const webVideoRef = useRef(null);

  useEffect(() => {
    if (Platform.OS === 'web' && webVideoRef.current) {
      const v = webVideoRef.current;
      // 브라우저가 막을 수도 있으므로 play() 시도
      const p = v.play?.();
      if (p && typeof p.catch === 'function') {
        p.catch(() => {
          // 자동재생이 막힌 경우 - 조용히 무시 (사용자 상호작용 시 재생됨)
        });
      }
    }
  }, []);

  if (Platform.OS === 'web') {
    // 웹: public/video/video.mp4 → /video/video.mp4
    return (
      <View style={styles.container}>
        <video
          ref={webVideoRef}
          // ✅ 자동재생에 필요한 속성들
          autoPlay
          muted
          playsInline
          preload="auto"
          loop
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
        resizeMode="cover"
        // ✅ 자동재생 보장
        paused={false}
        // 선택: 반복 재생 원하면 켜기
        repeat
        // 선택: iOS 무음모드에서도 재생하려면
        ignoreSilentSwitch="ignore"
        // 필요 시 컨트롤 숨기기/보이기
        controls
      />
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>넘어가기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  webVideo: { width: '100%', height: '100%', display: 'block', objectFit: 'cover' },
  nativeVideo: { width: '100%', height: '100%' },
  button: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
