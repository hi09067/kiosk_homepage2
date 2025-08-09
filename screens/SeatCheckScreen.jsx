import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import useUserStore from '../store/useUserStore';

export default function SeatCheckScreen() {
  const { nickName } = useUserStore();
  const navigation = useNavigation();

  const [seatNumber, setSeatNumber] = useState(-1); // -1: 아직 확인 안 함, 0: 자리 없음, >0: 자리 있음
  const [loading, setLoading] = useState(false);

  const BACK_SERVER = 'https://kioskaws.ngrok.app';
  const encodedNickName = encodeURIComponent(nickName || '');
  const url = `${BACK_SERVER}/chkMemberSeat/${encodedNickName}`;

  const hasResult = useMemo(() => seatNumber !== -1, [seatNumber]);

  const fetchSeatNumber = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axios.get(url, { headers: { 'Content-Type': 'application/json' } });
      const { httpStatus, resData, message } = response.data || {};

      if (httpStatus === 'OK' && typeof resData === 'number') {
        if (resData > 0) {
          setSeatNumber(resData);
          Toast.show({ type: 'success', text1: '자리 확인 완료', text2: `${nickName}님의 자리는 ${resData}번입니다.` });
        } else {
          setSeatNumber(0);
          Toast.show({ type: 'info', text1: '자리 배치 미완료', text2: '아직 자리 배치가 완료되지 않았어요.' });
        }
      } else {
        Toast.show({ type: 'error', text1: '오류', text2: message || '예상치 못한 응답입니다.' });
      }
    } catch (error) {
      console.error('자리 확인 중 오류 발생:', error);
      Toast.show({ type: 'error', text1: '서버 오류', text2: '서버와의 연결에 실패했습니다.' });
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => navigation.navigate('Survey');

  return (
    <SafeAreaView style={styles.page}>
      <StatusBar barStyle={'light-content'} />

      {/* BACKGROUND DECOR */}
      <View style={styles.bgBlobOne} />
      <View style={styles.bgBlobTwo} />

      <View style={styles.centerWrap}>
        <View style={styles.card}>
          <Text style={styles.title}>자리 확인</Text>
          <Text style={styles.subtitle}>
            {hasResult
              ? seatNumber > 0
                ? `${nickName}님의 좌석 번호가 확인되었습니다`
                : '아직 좌석 배치가 완료되지 않았어요'
              : '버튼을 눌러 자리를 확인해주세요'}
          </Text>

          {/* RESULT AREA */}
          {hasResult && (
            <View style={[styles.resultBox, seatNumber > 0 ? styles.resultBoxOk : styles.resultBoxWait]}>
              {seatNumber > 0 ? (
                <>
                  <Text style={styles.resultLabel}>좌석 번호</Text>
                  <Text style={styles.resultNumber}>{seatNumber}</Text>
                </>
              ) : (
                <Text style={styles.waitText}>배치 중… 잠시 후 다시 시도해주세요</Text>
              )}
            </View>
          )}

          {/* ACTIONS */}
          <View style={styles.actions}>
            {!hasResult && (
              <PrimaryButton label={loading ? '확인 중…' : '자리 확인하기'} onPress={fetchSeatNumber} loading={loading} />
            )}

            {hasResult && seatNumber === 0 && (
              <>
                <PrimaryButton label={loading ? '다시 확인 중…' : '다시 확인하기'} onPress={fetchSeatNumber} loading={loading} />
              </>
            )}

            {hasResult && seatNumber > 0 && (
              <PrimaryButton label="확인" onPress={handleNext} />
            )}
          </View>
        </View>
      </View>

      {loading && (
        <View style={styles.loadingOverlay} pointerEvents="auto">
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>자리 확인 중…</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

function PrimaryButton({ label, onPress, loading }) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
      onPress={onPress}
      disabled={!!loading}
    >
      {loading ? <ActivityIndicator size="small" /> : <Text style={styles.primaryBtnText}>{label}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // THEME
  page: { flex: 1, backgroundColor: '#0b1220' },
  bgBlobOne: {
    position: 'absolute', top: -120, left: -80, width: 300, height: 300, borderRadius: 200,
    backgroundColor: 'rgba(91, 140, 255, 0.35)', opacity: 0.6,
  },
  bgBlobTwo: {
    position: 'absolute', bottom: -140, right: -100, width: 360, height: 360, borderRadius: 220,
    backgroundColor: 'rgba(91, 140, 255, 0.22)', opacity: 0.7,
  },

  // LAYOUT
  centerWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  card: {
    width: '100%', maxWidth: 460,
    backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.14)', borderWidth: 1,
    borderRadius: 20, padding: 22,
    shadowColor: '#000', shadowOpacity: 0.35, shadowRadius: 18, shadowOffset: { width: 0, height: 10 }, elevation: 8,
  },

  // TEXTS
  title: { fontSize: 24, fontWeight: '800', color: '#eef2ff' },
  subtitle: { marginTop: 6, marginBottom: 16, fontSize: 14, color: '#9aa4b2' },

  // RESULT
  resultBox: {
    width: '100%', borderRadius: 16, padding: 16, marginBottom: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  resultBoxOk: { backgroundColor: 'rgba(16, 185, 129, 0.12)', borderWidth: 1, borderColor: 'rgba(16,185,129,0.35)' },
  resultBoxWait: { backgroundColor: 'rgba(234,179,8, 0.12)', borderWidth: 1, borderColor: 'rgba(234,179,8,0.35)' },
  resultLabel: { color: '#a7f3d0', fontSize: 12, fontWeight: '700', letterSpacing: 0.4 },
  resultNumber: { color: '#ecfeff', fontSize: 56, fontWeight: '900' },
  waitText: { color: '#fde68a', fontSize: 14, fontWeight: '700' },

  // ACTIONS
  actions: { gap: 10 },

  primaryBtn: {
    height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#5b8cff', shadowColor: '#5b8cff', shadowOpacity: 0.35, shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 }, elevation: 6,
  },
  primaryBtnDisabled: { backgroundColor: '#3a4b6a', shadowOpacity: 0 },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 0.2 },

  // LOADING OVERLAY
  loadingOverlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(11, 18, 32, 0.45)' },
  loadingText: { marginTop: 12, color: '#e5e7eb', fontWeight: '600' },
});
