import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message'; // 👈 Toast import 추가
import useUserStore from '../store/useUserStore';

export default function LoginScreen() {
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const { setNickName, setMemberId } = useUserStore();
  const BACK_SERVER = "https://b99d987b875f.ngrok.app";
  const url = `${BACK_SERVER}/isDuplicateNickname`;

  const handleSubmit = async () => {
    const trimmed = nickname.trim();
    if (!trimmed) {
      Toast.show({
        type: 'error',
        text1: '입력 오류',
        text2: '닉네임을 입력해주세요!',
      });
      return;
    }

    setIsLoading(true);
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
        Toast.show({
          type: 'success',
          text1: '환영합니다!',
          text2: `${trimmed}님, 자리에 입장해주세요.`,
        });
        navigation.navigate('SeatCheck');
      } else {
        Toast.show({
          type: 'error',
          text1: '닉네임 오류',
          text2: '등록되지 않은 닉네임입니다. 다시 입력해주세요.',
        });
      }
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: '서버 오류',
        text2: '닉네임 확인 중 문제가 발생했습니다.',
      });
    } finally {
      setIsLoading(false);
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
        editable={!isLoading}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>확인</Text>
      </TouchableOpacity>

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
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});
