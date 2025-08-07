import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import useUserStore from '../store/useUserStore';

export default function SeatCheckScreen() {
  const { nickName } = useUserStore();
  const navigation = useNavigation();

  const [seatNumber, setSeatNumber] = useState(-1); // ✅ -1: 아직 확인 안 함
  const [loading, setLoading] = useState(false);

  const BACK_SERVER = "https://kioskaws.ngrok.app";
  const encodedNickName = encodeURIComponent(nickName);
  const url = `${BACK_SERVER}/chkMemberSeat/${encodedNickName}`;

  const fetchSeatNumber = async () => {
    setLoading(true);
    try {
      const response = await axios.get(url, {
        headers: { 'Content-Type': 'application/json' },
      });

      const { httpStatus, resData, message } = response.data;

      if (httpStatus === 'OK' && resData > 0) {
        setSeatNumber(resData);
        Toast.show({
          type: 'success',
          text1: '자리 확인 완료',
          text2: `${nickName}님의 자리는 ${resData}번입니다.`,
        });
      } else if (httpStatus === 'OK' && resData === 0) {
        setSeatNumber(0); // ✅ 자리 없음
        Toast.show({
          type: 'info',
          text1: '자리 배치 미완료',
          text2: '아직 자리 배치가 완료되지 않았어요.',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: '오류',
          text2: message || '예상치 못한 응답입니다.',
        });
      }
    } catch (error) {
      console.error('자리 확인 중 오류 발생:', error);
      Toast.show({
        type: 'error',
        text1: '서버 오류',
        text2: '서버와의 연결에 실패했습니다.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    navigation.navigate('Survey');
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.text}>자리 확인 중입니다...</Text>
        </View>
      ) : seatNumber === -1 ? (
        // ✅ 최초 진입 → 아직 자리 확인 안 함
        <>
          <Text style={styles.text}>버튼을 눌러 자리를 확인해주세요.</Text>
          <Button title="자리 확인하기" onPress={fetchSeatNumber} />
        </>
      ) : seatNumber === 0 ? (
        // ✅ 확인했지만 자리 없음
        <>
          <Text style={styles.text}>ㅜㅜ 아직 자리 배치가 완료되지 않았어요.</Text>
          <Button title="다시 확인하기" onPress={fetchSeatNumber} />
        </>
      ) : (
        // ✅ 자리 있음
        <>
          <Text style={styles.text}>{nickName}님의 자리는 {seatNumber}번입니다.</Text>
          <Button title="확인" onPress={handleNext} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  center: {
    flex: 1, // ✅ 반드시 추가
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 24,
    textAlign: 'center',
  },
});
