import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function FinalScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.page}>
      <StatusBar barStyle="light-content" />

      {/* 배경 블롭 (터치 방해 X) */}
      <View style={styles.bgBlobOne} pointerEvents="none" />
      <View style={styles.bgBlobTwo} pointerEvents="none" />

      {/* 카드 */}
      <View style={styles.card}>
        <Text style={styles.title}>설문이 완료되었습니다! 🎉</Text>
        <Text style={styles.subtitle}>
          잠시 후 팀 배정이 이루어집니다.{"\n"}안내가 나오면 아래 버튼을 눌러 확인해 주세요.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('TeamCheck')}
          activeOpacity={0.9}
        >
          <Text style={styles.buttonText}>팀 확인하러 가기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // PAGE
  page: {
    flex: 1,
    backgroundColor: '#0b1220',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  // BACKGROUND BLOBS
  bgBlobOne: {
    position: 'absolute',
    top: -120,
    left: -80,
    width: 320,
    height: 320,
    borderRadius: 200,
    backgroundColor: 'rgba(91, 140, 255, 0.35)',
    // 웹 전용 블러 (네이티브에선 무시)
    // @ts-ignore
    filter: 'blur(30px)',
    opacity: 0.6,
  },
  bgBlobTwo: {
    position: 'absolute',
    bottom: -140,
    right: -100,
    width: 360,
    height: 360,
    borderRadius: 220,
    backgroundColor: 'rgba(91, 140, 255, 0.22)',
    // @ts-ignore
    filter: 'blur(28px)',
    opacity: 0.7,
  },

  // CARD (GLASS)
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },

  // TEXTS
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#eef2ff',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#9aa4b2',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 20,
  },

  // BUTTON
  button: {
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5b8cff',
    shadowColor: '#5b8cff',
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    paddingHorizontal: 28,
    alignSelf: 'stretch',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});
