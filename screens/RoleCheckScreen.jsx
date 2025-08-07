import axios from 'axios';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import useUserStore from '../store/useUserStore';

export default function RoleCheckScreen({ navigation }) {
  const { nickName } = useUserStore();
  console.log("닉네임 :", nickName);
  //const BACK_SERVER = Constants.expoConfig.extra.BACK_SERVER;
  const BACK_SERVER = "https://kioskaws.ngrok.app";
  const [role, setRole] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCheckRole = async () => {
    setLoading(true);
    setStatusMessage('');
    try {
      const response = await axios.get(`${BACK_SERVER}/getTeam/${nickName}`);
      const role = response.data?.resData?.role;

      if (role) {
        setRole(role);
        setStatusMessage("🎭 ["+nickName+"]님의 역할은 ["+role+"]입니다!");
      } else {
        setStatusMessage('직업 배정중입니다. 조금만 기다려주세요.');
      }
    } catch (error) {
      console.error(error);
      setStatusMessage('에러 발생: 서버 연결에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>나의 직업 확인하기</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleCheckRole}>
          <Text style={styles.buttonText}>확인하기</Text>
        </TouchableOpacity>
      )}

      {statusMessage !== '' && (
        <Text style={styles.statusText}>{statusMessage}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
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
  statusText: {
    marginTop: 24,
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
    fontWeight: '500',
  },
});
