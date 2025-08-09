import axios from 'axios';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import useUserStore from '../store/useUserStore';

export default function TeamCheckScreen({ navigation }) {
  const { nickName } = useUserStore();
  const BACK_SERVER = 'https://kioskaws.ngrok.app';

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null); // JS: 타입 표기 제거

  const handleCheckTeam = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACK_SERVER}/getTeam/${nickName}`);
      const res = response.data; // ResponseDTO
      const receiptInfo = res?.resData;
      const team = receiptInfo?.team;

      if (team && team.trim() !== '') { // string 인식 못하는 오류
        setStatusMessage(`[${nickName}]님은 [${team}]팀에 배정되었습니다.`);
      } else {
        setStatusMessage('팀 배정중입니다. 조금만 기다려주세요!');
      }
    } catch (error) {
      console.error(error);
      setStatusMessage('에러 발생: 서버 연결에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (statusMessage?.includes('배정되었습니다')) {
      navigation.navigate('RoleCheck');
    } else {
      navigation.goBack();
    }
  };

  const messageStyle =
    statusMessage?.includes('배정중')
      ? styles.msgInfo
      : statusMessage?.startsWith('에러')
      ? styles.msgError
      : styles.msgSuccess;

  return (
    <SafeAreaView style={styles.page}>
      <StatusBar barStyle="light-content" />

      {/* 배경 블롭 (터치 방해 X) */}
      <View style={styles.bgBlobOne} pointerEvents="none" />
      <View style={styles.bgBlobTwo} pointerEvents="none" />

      {/* 카드 */}
      <View style={styles.card}>
        <Text style={styles.title}>팀 확인하기</Text>

        {loading ? (
          <View style={{ paddingVertical: 12, alignItems: 'center' }}>
            <ActivityIndicator size="large" />
            <Text style={styles.waitText}>확인 중…</Text>
          </View>
        ) : statusMessage ? (
          <>
            <Text style={[styles.message, messageStyle]}>{statusMessage}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={handleConfirm}
              activeOpacity={0.9}
            >
              <Text style={styles.buttonText}>확인</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={handleCheckTeam}
            activeOpacity={0.9}
          >
            <Text style={styles.buttonText}>팀 확인하기</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // PAGE (다크 톤)
  page: {
    flex: 1,
    backgroundColor: '#0b1220',
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
    // @ts-ignore (웹 전용)
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
    // @ts-ignore (웹 전용)
    filter: 'blur(28px)',
    opacity: 0.7,
  },

  // CARD (글래스)
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
    marginBottom: 24,
    textAlign: 'center',
  },
  waitText: {
    marginTop: 10,
    color: '#e5e7eb',
    fontWeight: '600',
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  msgSuccess: { color: '#e5fff5' },
  msgInfo: { color: '#cbd5e1' },
  msgError: { color: '#ffd4d4' },

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
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});
