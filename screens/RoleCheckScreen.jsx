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

export default function RoleCheckScreen({ navigation }) {
  const { nickName } = useUserStore();
  const BACK_SERVER = 'https://kioskaws.ngrok.app';

  const [role, setRole] = useState(null);           // ✅ 타입 제거
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCheckRole = async () => {
    setLoading(true);
    setStatusMessage('');
    try {
      const response = await axios.get(BACK_SERVER + '/getTeam/' + nickName); // ✅ 백틱 X
      const r = response.data && response.data.resData && response.data.resData.role;

      if (typeof r === 'string' && r.trim() !== '') {
        setRole(r);
        setStatusMessage('🎭 [' + nickName + ']님의 역할은 [' + r + ']입니다!');
      } else {
        setRole(null);
        setStatusMessage('직업 배정중입니다. 조금만 기다려주세요.');
      }
    } catch (error) {
      console.error(error);
      setRole(null);
      setStatusMessage('에러 발생: 서버 연결에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (role) navigation.navigate('Final');
    else navigation.goBack();
  };

  const messageStyle =
    statusMessage.indexOf('🎭') === 0
      ? styles.msgSuccess
      : statusMessage.indexOf('에러') === 0
      ? styles.msgError
      : styles.msgInfo;

  return (
    <SafeAreaView style={styles.page}>
      <StatusBar barStyle="light-content" />

      {/* 배경 블롭 */}
      <View style={styles.bgBlobOne} pointerEvents="none" />
      <View style={styles.bgBlobTwo} pointerEvents="none" />

      <View style={styles.card}>
        <Text style={styles.title}>나의 직업 확인하기</Text>

        {loading ? (
          <View style={{ paddingVertical: 12 }}>
            <ActivityIndicator size="large" />
            <Text style={styles.waitText}>확인 중…</Text>
          </View>
          ) : (
            <>
              {statusMessage ? (
                <>
                  <Text style={[styles.message, messageStyle]}>{statusMessage}</Text>
                  {/* 닉네임 + 역할 모두 있을 때 버튼 숨김 */}
                  {!(nickName && role) && (
                    <TouchableOpacity style={styles.button} onPress={handleConfirm}>
                      <Text style={styles.buttonText}>확인</Text>
                    </TouchableOpacity>
                  )}
                </>
              ) : (
                <TouchableOpacity style={styles.button} onPress={handleCheckRole}>
                  <Text style={styles.buttonText}>확인하기</Text>
                </TouchableOpacity>
              )}
            </>
          )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#0b1220',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  bgBlobOne: {
    position: 'absolute',
    top: -120,
    left: -80,
    width: 320,
    height: 320,
    borderRadius: 200,
    backgroundColor: 'rgba(91, 140, 255, 0.35)',
    // 웹 전용 블러(네이티브에선 무시)
    // @ts-ignore (남아있어도 주석이라 무해하지만, 지워도 됩니다)
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
    marginBottom: 16,
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
    marginBottom: 18,
    lineHeight: 22,
  },
  msgSuccess: { color: '#e5fff5' },
  msgInfo: { color: '#cbd5e1' },
  msgError: { color: '#ffd4d4' },
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
