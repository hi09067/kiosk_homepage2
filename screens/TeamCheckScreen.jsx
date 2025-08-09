import axios from 'axios';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import useUserStore from '../store/useUserStore';

export default function TeamCheckScreen({ navigation }) {
  const { nickName } = useUserStore();
  //const BACK_SERVER = Constants.expoConfig.extra.BACK_SERVER;
  const BACK_SERVER = "https://kioskaws.ngrok.app";
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null); // ✅ 상태 메시지 저장

  const handleCheckTeam = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACK_SERVER}/getTeam/${nickName}`);

      const res = response.data; // 전체 ResponseDTO
      const receiptInfo = res?.resData;
      const team = receiptInfo?.team;

      console.log('📍 TeamCheckScreen 실행');
      console.log('receiptInfo:', receiptInfo);
      console.log('team:', team);

      if (typeof team === 'string' && team.trim() !== '') {
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>팀 확인하기</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : statusMessage ? (
        <>
          <Text style={styles.message}>{statusMessage}</Text>
          <TouchableOpacity style={styles.button} onPress={handleConfirm}>
            <Text style={styles.buttonText}>확인</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleCheckTeam}>
          <Text style={styles.buttonText}>팀 확인하기</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#0b1220',
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgBlobOne: {
    position: 'absolute',
    top: -120,
    left: -80,
    width: 320,
    height: 320,
    borderRadius: 200,
    backgroundColor: 'rgba(91, 140, 255, 0.35)',
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
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#eef2ff',
    marginBottom: 24,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#e5e7eb',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
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
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#3a4b6a',
    shadowOpacity: 0,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});
