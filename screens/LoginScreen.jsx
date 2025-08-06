import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import useUserStore from '../store/useUserStore';

export default function LoginScreen() {
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false); // 👈 로딩 상태 추가
  const navigation = useNavigation();
  const { setNickName, setMemberId } = useUserStore();
  const BACK_SERVER = "https://b99d987b875f.ngrok.app";
  const url = `${BACK_SERVER}/isDuplicateNickname`;

  const handleSubmit = async () => {
    const trimmed = nickname.trim();
    if (!trimmed) {
      Alert.alert('입력 오류', '닉네임을 입력해주세요!');
      return;
    }

    setIsLoading(true); // 👈 로딩 시작
    try {
      const response = await axios.post(
        url,
        trimmed,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.data === true) {
        setNickName(trimmed);
        navigation.navigate('SeatCheck');
      } else {
        Alert.alert('닉네임 오류', '등록되지 않은 닉네임입니다.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('서버 오류', '닉네임 확인 중 문제가 발생했습니다.');
    } finally {
      setIsLoading(false); // 👈 로딩 종료
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        안녕하세요 👋{'\n'}닉네임을 입력해주세요.
      </Text>

      <TextInput
        placeholder="닉네임 입력"
        value={nickname}
        onChangeText={setNickname}
        style={styles.input}
        editable={!isLoading} // 👈 로딩 중 입력 비활성화
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={isLoading} // 👈 로딩 중 버튼 비활성화
      >
        <Text style={styles.buttonText}>확인</Text>
      </TouchableOpacity>

      {/* 👇 로딩 오버레이 (전체 화면 터치 차단 + 인디케이터 표시) */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 40,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    borderColor: '#aaa',
    borderWidth: 2,
    borderRadius: 8,
    padding: 14,
    fontSize: 18,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)', // 반투명 배경
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});
