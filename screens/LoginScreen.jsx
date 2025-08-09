import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import useUserStore from '../store/useUserStore';

export default function LoginScreen() {
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const { setNickName } = useUserStore();

  const BACK_SERVER = 'https://kioskaws.ngrok.app';
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

    Keyboard.dismiss();
    setIsLoading(true);
    try {
      const response = await axios.post(
        url,
        trimmed,
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data === true) {
        setNickName(trimmed);
        Toast.show({
          type: 'success',
          text1: '환영합니다!',
          text2: `${trimmed}님, 자리에 입장해주세요.`,
        });
        navigation.navigate('Video');
      } else {
        Toast.show({
          type: 'error',
          text1: '닉네임 오류',
          text2: '등록되지 않은 닉네임입니다. 영수증과 동일한 닉네임을 입력해주세요.',
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

  const disabled = useMemo(
    () => isLoading || nickname.trim().length === 0,
    [isLoading, nickname]
  );

  return (
    <SafeAreaView style={styles.page}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        {/* 꼭 '하나'의 자식만 두기 위해 View로 감싸줌 */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={{ flex: 1 }}>
            {/* BACKGROUND DECOR */}
            <View style={styles.bgBlobOne} />
            <View style={styles.bgBlobTwo} />

            {/* CENTER CARD */}
            <View style={styles.centerWrap}>
              <View style={styles.card}>
                <Text style={styles.heading}>안녕하세요 👋</Text>
                <Text style={styles.subheading}>닉네임을 입력하고 계속 진행하세요</Text>

                <TextInput
                  placeholder="닉네임 입력"
                  value={nickname}
                  onChangeText={setNickname}
                  style={styles.input}
                  placeholderTextColor="#9aa4b2"
                  editable={!isLoading}
                  autoCapitalize="none"
                  autoCorrect={false}
                  onSubmitEditing={handleSubmit}
                  returnKeyType="done"
                />

                <TouchableOpacity
                  activeOpacity={0.9}
                  style={[styles.button, disabled && styles.buttonDisabled]}
                  onPress={handleSubmit}
                  disabled={disabled}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" />
                  ) : (
                    <Text style={styles.buttonText}>확인</Text>
                  )}
                </TouchableOpacity>

                <Text style={styles.cautionText}>
                  주의! 초대장에 적혀 있는 '닉네임'을 입력해주세요
                </Text>

                <Text style={styles.helperText}>
                  영수증의 닉네임과 동일하게 입력해주세요
                </Text>
              </View>
            </View>

            {/* LOADING OVERLAY */}
            {isLoading && (
              <View style={styles.loadingOverlay} pointerEvents="auto">
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>확인 중…</Text>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // THEME
  page: {
    flex: 1,
    backgroundColor: '#0b1220',
  },
  bgBlobOne: {
    position: 'absolute',
    top: -120,
    left: -80,
    width: 320,
    height: 320,
    borderRadius: 200,
    backgroundColor: 'rgba(91, 140, 255, 0.35)',
    filter: 'blur(30px)', // web only; ignored on native
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
    filter: 'blur(28px)', // web only; ignored on native
    opacity: 0.7,
  },

  // LAYOUT
  centerWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderRadius: 20,
    padding: 22,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },

  // TEXTS
  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: '#eef2ff',
  },
  subheading: {
    marginTop: 6,
    marginBottom: 16,
    fontSize: 14,
    color: '#9aa4b2',
  },
  helperText: {
    marginTop: 12,
    fontSize: 12,
    color: '#9aa4b2',
    textAlign: 'center',
  },
  cautionText: {
    marginTop: 10,
    fontSize: 12,
    color: '#ff6b6b', // 강조
    fontWeight: '700',
    textAlign: 'center',
  },

  // INPUT
  input: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    color: '#e5e7eb',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 14,
  },

  // BUTTON
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

  // LOADING
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(11, 18, 32, 0.45)',
  },
  loadingText: {
    marginTop: 12,
    color: '#e5e7eb',
    fontWeight: '600',
  },
});
