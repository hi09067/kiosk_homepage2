import axios from 'axios';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import useUserStore from '../store/useUserStore';

const questions = [
  {
    question: "Q1. 어떤 상황이 가장 불편하게 느껴지시나요?",
    options: [
      "햄버거 세트를 주문하려고 하는데 어느 탭에 있는지 몰라 한참 찾는 상황",
      "키오스크를 통해서 자체적으로 환불이나 교환이 어려운 상황",
      "한국어 이외에 다른 언어가 제공되지 않는 상황",
    ],
  },
  {
    question: "Q2. 어떤 상황이 가장 곤란하게 느껴지시나요?",
    options: [
      "가게마다 키오스크 디자인이 달라 새로운 가게에 가면 주문하기 어려운 상황",
      "익숙하지 않은 키오스크 프로그램을 통해 주문을 하려고 하는데 기다리고 있는 사람이 많은 상황",
      "키오스크만 있고 사람 직원이 없어 질문을 할 수 없는 상황",
    ],
  },
  {
    question: "Q3. 어떤 기능이 가장 불편하다고 느끼셨나요?",
    options: [
      "주문 과정에 불필요한 제품을 추천하는 탭이 뜨는 상황",
      "글씨가 너무 작아서 정보를 인식하기 어려운 상황",
      "음성 안내나 도움 기능이 없어 혼자서 주문할 수 없는 상황",
    ],
  },
  {
    question: "Q4. 어떤 주문 경험이 가장 불편했나요?",
    options: [
      "쿠폰 적립이나 할인을 하려고 하는데 해당 기능을 찾기 어려운 상황",
      "버거를 주문하던 중 세트 업그레이드가 이미 선택된 상황",
      "키오스크 주문이 어려워 직원에게 도움을 요청하였는데 키오스크를 통해 결제하라고 안내하는 상황",
    ],
  },
  {
    question: "Q5. 어떤 물리적인 상황이 가장 불편했나요?",
    options: [
      "입력 시간이 짧아 화면이 빠르게 초기화되는 상황",
      "화면이 세로로 길고 높아 읽기 어렵고 손이 닿지 않는 상황",
      "키오스크 기계 터치 시 위생 상태가 의심스러운 상황",
    ],
  },
];

const choiceLetters = ['a', 'b', 'c'];

export default function SurveyScreen({ navigation }) {
  const { nickName } = useUserStore();
  const BACK_SERVER = 'https://kioskaws.ngrok.app';

  const [answers, setAnswers] = useState(Array(questions.length).fill([]));
  const [isLoading, setIsLoading] = useState(false);

  const handleSelect = (questionIdx, choiceIdx) => {
    setAnswers(prev => {
      const updated = [...prev];
      const current = updated[questionIdx];
      const letter = choiceLetters[choiceIdx];

      if (current.includes(letter)) {
        updated[questionIdx] = current.filter(c => c !== letter);
      } else if (current.length < 3) {
        updated[questionIdx] = [...current, letter];
      }
      return updated;
    });
  };

  const readyToSubmit = useMemo(() => answers.every(a => a.length === 3), [answers]);

  const handleSubmit = async () => {
    if (!readyToSubmit) {
      Toast.show({
        type: 'info',
        text1: '설문 미완료',
        text2: '모든 문항에서 a, b, c를 모두 선택해 주세요.',
      });
      return;
    }

    // 점수 계산
    const scoreMap = { 0: 5, 1: 3, 2: 1 };
    const totals = { a: 0, b: 0, c: 0 };
    answers.forEach(answer => {
      answer.forEach((letter, idx) => {
        totals[letter] += scoreMap[idx];
      });
    });

    try {
      setIsLoading(true);
      const res = await axios.post(`${BACK_SERVER}/submitSurvey`, {
        nickName,
        answerA: totals['a'],
        answerB: totals['b'],
        answerC: totals['c'],
      });

      const { httpStatus, message, alertType, resData } = res.data;
      if (httpStatus === 'OK' && resData === true) {
        Toast.show({ type: 'success', text1: '제출 완료', text2: message || '감사합니다.' });
        navigation.navigate('Final');
      } else {
        Toast.show({ type: alertType || 'error', text1: '실패', text2: message || '제출에 실패했습니다.' });
      }
    } catch (error) {
      const status = error.response?.status;
      const { httpStatus, message, alertType } = error.response?.data || {};
      if (status === 409) {
        Toast.show({
          type: alertType || 'info',
          text1: '중복 제출',
          text2: message || '이미 설문을 제출하셨습니다. 다음 페이지로 이동합니다.',
        });
        navigation.navigate('Final');
      } else {
        Toast.show({ type: 'error', text1: '서버 오류', text2: '서버에 연결할 수 없습니다.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.page}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={{ flex: 1 }} pointerEvents="box-none">
          {/* 배경 데코 (터치 방해 없음) */}
          <View style={styles.bgBlobOne} pointerEvents="none" />
          <View style={styles.bgBlobTwo} pointerEvents="none" />

          {/* 본문 */}
          <ScrollView contentContainerStyle={styles.scrollBody}>
            <View style={styles.headerWrap}>
              <Text style={styles.title}>버뮤다 키오스크 지대 🚨</Text>
              <Text style={styles.subtitle}>각 문항에서 A·B·C를 모두 선택하세요 (순서 반영)</Text>
            </View>

            {/* 질문 카드 */}
            <View style={styles.card}>
              {questions.map((item, qIdx) => (
                <View key={qIdx} style={styles.questionBlock}>
                  <Text style={styles.question}>{item.question}</Text>

                  {item.options.map((option, oIdx) => {
                    const letter = choiceLetters[oIdx];
                    const isSelected = answers[qIdx].includes(letter);

                    return (
                      <Pressable
                        key={oIdx}
                        onPress={() => handleSelect(qIdx, oIdx)}
                        style={[
                          styles.choiceRow,
                          isSelected && styles.choiceRowSelected,
                        ]}
                      >
                        <View style={[styles.badge, isSelected && styles.badgeSelected]}>
                          <Text style={[styles.badgeText, isSelected && styles.badgeTextSelected]}>
                            {letter.toUpperCase()}
                          </Text>
                        </View>
                        <Text style={[styles.choiceText, isSelected && styles.choiceTextSelected]}>
                          {option}
                        </Text>
                      </Pressable>
                    );
                  })}

                  {/* 선택 카운터 */}
                  <Text style={styles.pickHint}>
                    선택: <Text style={{ color: '#e2e8f0' }}>{answers[qIdx].length}</Text>/3
                  </Text>

                  {/* 구분선 */}
                  {qIdx !== questions.length - 1 && <View style={styles.divider} />}
                </View>
              ))}

              {/* 제출 버튼 */}
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={handleSubmit}
                disabled={!readyToSubmit || isLoading}
                style={[
                  styles.submitButton,
                  (!readyToSubmit || isLoading) && styles.submitButtonDisabled,
                ]}
              >
                {isLoading ? <ActivityIndicator size="small" /> : <Text style={styles.submitText}>확인</Text>}
              </TouchableOpacity>

              <Text style={styles.helperText}>모든 문항에서 A·B·C를 각각 한 번씩 선택해야 합니다</Text>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Page theme (로그인 화면과 톤 맞춤)
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
    // @ts-ignore - web only
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
    // @ts-ignore - web only
    filter: 'blur(28px)',
    opacity: 0.7,
  },

  scrollBody: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },

  headerWrap: {
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    color: '#eef2ff',
    fontSize: 24,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 6,
    color: '#9aa4b2',
    fontSize: 13,
  },

  // Card container
  card: {
    width: '100%',
    alignSelf: 'center',
    maxWidth: 700,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },

  // Questions
  questionBlock: {
    marginBottom: 18,
  },
  question: {
    color: '#e5e7eb',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },

  // Choice row (글래스 버튼 느낌)
  choiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginVertical: 6,
  },
  choiceRowSelected: {
    borderColor: 'transparent',
    backgroundColor: '#5b8cff',
    shadowColor: '#5b8cff',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  badge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(148,163,184,0.15)',
  },
  badgeSelected: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderColor: 'transparent',
  },
  badgeText: {
    color: '#cbd5e1',
    fontWeight: '800',
    fontSize: 12,
  },
  badgeTextSelected: {
    color: '#fff',
  },

  choiceText: {
    flex: 1,
    color: '#cbd5e1',
    fontSize: 14,
  },
  choiceTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },

  pickHint: {
    marginTop: 6,
    fontSize: 12,
    color: '#9aa4b2',
  },

  divider: {
    marginTop: 14,
    marginBottom: 8,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },

  // Submit
  submitButton: {
    marginTop: 8,
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
  submitButtonDisabled: {
    backgroundColor: '#3a4b6a',
    shadowOpacity: 0,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },

  helperText: {
    textAlign: 'center',
    color: '#9aa4b2',
    fontSize: 12,
    marginTop: 10,
  },
});
