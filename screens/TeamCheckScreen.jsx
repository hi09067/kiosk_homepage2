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
  const BACK_SERVER = "https://b99d987b875f.ngrok.app";
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 32,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
