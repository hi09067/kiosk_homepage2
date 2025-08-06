import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Button, StyleSheet, Text, View } from 'react-native';
import useUserStore from '../store/useUserStore';

export default function SeatCheckScreen() {
  const { nickName } = useUserStore();
  const navigation = useNavigation();
  const [seatNumber, setSeatNumber] = useState(null);
  const [loading, setLoading] = useState(false); // 최초엔 false
  //const BACK_SERVER = Constants.expoConfig.extra.BACK_SERVER;
  const BACK_SERVER = "https://b99d987b875f.ngrok.app";
  const encodedNickName = encodeURIComponent(nickName);
  const url = `${BACK_SERVER}/chkMemberSeat/${encodedNickName}`;

  const fetchSeatNumber = async () => {
    setLoading(true);
    try {
      const response = await axios.get(url, {
        headers: { 'Content-Type': 'application/json' },
      });

      const isAssigned = response.data.resData; // 숫자 or 0
      console.log('서버 응답 seat:', isAssigned);

      if (isAssigned > 0) {
        setSeatNumber(isAssigned);
      } else {
        Alert.alert('자리 배치 미완료', '아직 자리 배치가 완료되지 않았어요.');
        setSeatNumber(null); // 명확히 처리
      }
    } catch (error) {
      console.error('자리 확인 중 오류 발생:', error);
      Alert.alert('오류', '서버와의 연결에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (seatNumber === null) {
      navigation.goBack(); // 이전 페이지로
    } else {
      navigation.navigate('Survey'); // 다음 설문 화면으로
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.text}>자리 확인 중입니다...</Text>
        </View>
      ) : seatNumber === null ? (
        <>
          <Text style={styles.text}>ㅜㅜ. 아직 자리 배치가 완료되지 않았어요.</Text>
          <Button title="다시 확인하기" onPress={fetchSeatNumber} />
        </>
      ) : (
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 24,
    textAlign: 'center',
  },
});
