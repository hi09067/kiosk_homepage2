import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Constants from 'expo-constants';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import useUserStore from '../store/useUserStore';


export default function LoginScreen() {
  const [nickname, setNickname] = useState('');
  const navigation = useNavigation();
  const { setNickName, setMemberId } = useUserStore();
  const BACK_SERVER = Constants.expoConfig.extra.BACK_SERVER;
  const url = `${BACK_SERVER}/isDuplicateNickname`;
  console.log(url);
  console.log("🚀 BACK_SERVER:", Constants.expoConfig.extra.BACK_SERVER);

  // 임시 handleSubmit (로컬 test용)
  const handleSubmit = async () => {
  const trimmed = nickname.trim();

  if (!trimmed) {
    Alert.alert('입력 오류', '닉네임을 입력해주세요!');
    return;
  }

    try {
      const response = await axios.post(
        url,
        nickname,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

    if (response.data === true) {
      // 서버에서 true 반환 → 닉네임 존재
      setNickName(trimmed);

      navigation.navigate('SeatCheck');
    } else {
      // 서버에서 false 반환 → 닉네임 없음
      Alert.alert('닉네임 오류', '등록되지 않은 닉네임입니다.');
    }
  } catch (error) {
    console.error(error);
    Alert.alert('서버 오류', '닉네임 확인 중 문제가 발생했습니다.');
  }
};


  /*
  const handleSubmit = async () => {
    const trimmed = nickname.trim();
    if (!trimmed) {
      Alert.alert('입력 오류', '닉네임을 입력해주세요!');
      return;
    }

    try {
      const response = await axios.post(
        url,
        nickname,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.data === true) {
        setNickName(nickname);
        //navigate('SeatCheck'); // 다음 화면으로 이동
        console.log("성공!")
      } else {
        Alert.alert('닉네임 오류', '등록되지 않은 닉네임입니다.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('서버 오류', '닉네임 확인 중 문제가 발생했습니다.');
    }
  };
  */


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
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>확인</Text>
      </TouchableOpacity>
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
});
