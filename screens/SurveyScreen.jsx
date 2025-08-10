import axios from 'axios';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
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
    question: 'Q1. 어떤 상황이 가장 불편하게 느껴지시나요?',
    options: [
      '햄버거 세트를 주문하려고 하는데 어느 탭에 있는지 몰라 한참 찾는 상황',
      '키오스크를 통해서 자체적으로 환불이나 교환이 어려운 상황',
      '한국어 이외에 다른 언어가 제공되지 않는 상황',
    ],
  },
  {
    question: 'Q2. 어떤 상황이 가장 곤란하게 느껴지시나요?',
    options: [
      '가게마다 키오스크 디자인이 달라 새로운 가게에 가면 주문하기 어려운 상황',
      '익숙하지 않은 키오스크 프로그램을 통해 주문을 하려고 하는데 기다리고 있는 사람이 많은 상황',
      '키오스크만 있고 사람 직원이 없어 질문을 할 수 없는 상황',
    ],
  },
  {
    question: 'Q3. 어떤 기능이 가장 불편하다고 느끼셨나요?',
    options: [
      '주문 과정에 불필요한 제품을 추천하는 탭이 뜨는 상황',
      '글씨가 너무 작아서 정보를 인식하기 어려운 상황',
      '음성 안내나 도움 기능이 없어 혼자서 주문할 수 없는 상황',
    ],
  },
  {
    question: 'Q4. 어떤 주문 경험이 가장 불편했나요?',
    options: [
      '쿠폰 적립이나 할인을 하려고 하는데 해당 기능을 찾기 어려운 상황',
      '버거를 주문하던 중 세트 업그레이드가 이미 선택된 상황',
      '키오스크 주문이 어려워 직원에게 도움을 요청하였는데 키오스크를 통해 결제하라고 안내하는 상황',
    ],
  },
  {
    question: 'Q5. 어떤 물리적인 상황이 가장 불편했나요?',
    options: [
      '입력 시간이 짧아 화면이 빠르게 초기화되는 상황',
      '화면이 세로로 길고 높아 읽기 어렵고 손이 닿지 않는 상황',
      '키오스크 기계 터치 시 위생 상태가 의심스러운 상황',
    ],
  },
];

const choiceLetters = ['a', 'b', 'c'];
const letterColors = { a: '#ef4444', b: '#22c55e', c: '#3b82f6' };

export default function SurveyScreen({ navigation }) {
  const { nickName } = useUserStore();
  const BACK_SERVER = 'https://kioskaws.ngrok.app';

  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState(Array(questions.length).fill([]));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = questions[currentIdx];
  const readyForNext = useMemo(() => answers[currentIdx].length === 3, [answers, currentIdx]);

  const handleSelect = (choiceIdx) => {
    const letter = choiceLetters[choiceIdx];
    setAnswers((prev) => {
      const updated = [...prev];
      const cur = updated[currentIdx];
      if (cur.includes(letter)) {
        updated[currentIdx] = cur.filter((l) => l !== letter);
      } else if (cur.length < 3) {
        updated[currentIdx] = [...cur, letter];
      }
      return updated;
    });
  };

  const goNext = async () => {
    if (!readyForNext) return;
    if (currentIdx === questions.length - 1) {
      await handleSubmit();
    } else {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const goPrev = () => {
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
  };

  const handleSubmit = async () => {
    const scoreMap = { 0: 5, 1: 3, 2: 1 };
    const totals = { a: 0, b: 0, c: 0 };
    answers.forEach((answer) => {
      answer.forEach((letter, idx) => {
        totals[letter] += scoreMap[idx];
      });
    });

    try {
      setIsSubmitting(true);
      const response = await axios.post(BACK_SERVER + '/submitSurvey', {
        nickName,
        answerA: totals['a'],
        answerB: totals['b'],
        answerC: totals['c'],
      });

      const { httpStatus, message, alertType, resData } = response.data;
      if (httpStatus === 'OK' && resData === true) {
        Toast.show({ type: 'success', text1: '제출 완료', text2: message || '감사합니다.' });
        navigation.navigate('Final');
      } else {
        Toast.show({ type: alertType || 'error', text1: '실패', text2: message || '제출에 실패했습니다.' });
      }
    } catch (error) {
      const status = error.response && error.response.status;
      const payload = (error.response && error.response.data) || {};
      if (status === 409) {
        Toast.show({
          type: payload.alertType || 'info',
          text1: '중복 제출',
          text2: payload.message || '이미 설문을 제출하셨습니다. 다음 페이지로 이동합니다.',
        });
        navigation.navigate('Final');
      } else {
        Toast.show({ type: 'error', text1: '서버 오류', text2: '서버에 연결할 수 없습니다.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const orderText = answers[currentIdx].map((l) => l.toUpperCase()).join(' - ');

  return (
    <SafeAreaView style={styles.page}>
      <StatusBar barStyle="light-content" />
      <View style={styles.bgBlobOne} pointerEvents="none" />
      <View style={styles.bgBlobTwo} pointerEvents="none" />

      {!started ? (
        <>
          {/* ✅ 경고 박스: 제목 위, 별도 컨테이너 */}
          <View style={styles.alertBox}>
            <Text style={styles.alertText}>
              🚨 [중요] 진행자의 안내가 있을 때까지 버튼 클릭 금지!! 🚨
            </Text>
          </View>

          {/* 시작 카드 */}
          <View style={styles.card}>
            <Text style={styles.title}>버뮤다 키오스크 지대 🚨</Text>
            <Text style={styles.subtitleCenter}>
              설문은 총 5문항입니다. 각 문항에서 불편하다고 느끼는 순서대로 A·B·C를 선택하면 다음으로 넘어갑니다.
            </Text>
            <TouchableOpacity
              style={styles.startBtn}
              onPress={() => {
                setStarted(true);
                setCurrentIdx(0);
                setAnswers(Array(questions.length).fill([]));
              }}
              activeOpacity={0.9}
            >
              <Text style={styles.navBtnText}>설문조사 하러 가기</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>버뮤다 키오스크 지대 🚨</Text>
            <Text style={styles.progress}>
              Q {currentIdx + 1} / {questions.length}
            </Text>
          </View>
          <Text style={styles.subtitle}>각 문항에서 불편하다고 느끼는 순서대로 A·B·C를 모두 선택하세요 (순서 반영)</Text>

          <View style={styles.block}>
            <Text style={styles.question}>{currentQuestion.question}</Text>

            {currentQuestion.options.map((option, oIdx) => {
              const letter = choiceLetters[oIdx];
              const isSelected = answers[currentIdx].includes(letter);
              const selColor = letterColors[letter];

              return (
                <Pressable
                  key={oIdx}
                  onPress={() => handleSelect(oIdx)}
                  style={[
                    styles.choiceRow,
                    isSelected && {
                      backgroundColor: selColor,
                      borderColor: 'transparent',
                      shadowColor: selColor,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.badge,
                      isSelected && { backgroundColor: 'rgba(255,255,255,0.18)', borderColor: 'transparent' },
                    ]}
                  >
                    <Text style={[styles.badgeText, isSelected && { color: '#fff' }]}>
                      {letter.toUpperCase()}
                    </Text>
                  </View>
                  <Text style={[styles.choiceText, isSelected && { color: '#fff', fontWeight: '600' }]}>
                    {option}
                  </Text>
                </Pressable>
              );
            })}

            <Text style={styles.pickHint}>
              선택: <Text style={{ color: '#e2e8f0' }}>{answers[currentIdx].length}</Text>/3
            </Text>
          </View>

          {/* 선택 순서 표시 */}
          <View style={styles.orderRow}>
            <Text style={styles.orderText}>선택 순서 : {orderText || '-'}</Text>
          </View>

          <View style={styles.navRow}>
            <TouchableOpacity
              onPress={goPrev}
              disabled={currentIdx === 0 || isSubmitting}
              style={[styles.navBtnSecondary, (currentIdx === 0 || isSubmitting) && styles.disabled]}
              activeOpacity={0.9}
            >
              <Text style={styles.navBtnText}>이전</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={goNext}
              disabled={!readyForNext || isSubmitting}
              style={[styles.navBtnPrimary, (!readyForNext || isSubmitting) && styles.disabled]}
              activeOpacity={0.9}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" />
              ) : (
                <Text style={styles.navBtnText}>
                  {currentIdx === questions.length - 1 ? '제출' : '다음'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

/* ===== styles ===== */
const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#0b1220',
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgBlobOne: {
    position: 'absolute',
    top: -120,
    left: -80,
    width: 320,
    height: 320,
    borderRadius: 200,
    backgroundColor: 'rgba(91, 140, 255, 0.35)',
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
    opacity: 0.7,
  },

  /* ✅ 새 경고 박스 */
  alertBox: {
    width: '100%',
    maxWidth: 700,
    backgroundColor: 'rgba(235, 13, 13, 0.10)',
    borderColor: '#eb0d0d',
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 12,
    alignSelf: 'center',
  },
  alertText: {
    color: '#ff6b6b',
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
  },

  card: {
    width: '100%',
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

  subtitleCenter: {
    marginTop: 6,
    color: '#9aa4b2',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 14,
  },
  startBtn: {
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
    paddingHorizontal: 28,
    alignSelf: 'stretch',
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  title: {
    color: '#eef2ff',
    fontSize: 20,
    fontWeight: '800',
  },
  progress: {
    color: '#9aa4b2',
    fontSize: 12,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 6,
    color: '#9aa4b2',
    fontSize: 12,
  },

  block: {
    marginTop: 16,
  },
  question: {
    color: '#e5e7eb',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },

  choiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginVertical: 6,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
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
    marginRight: 10,
  },
  badgeText: {
    color: '#cbd5e1',
    fontWeight: '800',
    fontSize: 12,
  },
  choiceText: {
    flex: 1,
    color: '#cbd5e1',
    fontSize: 14,
  },

  pickHint: {
    marginTop: 6,
    fontSize: 12,
    color: '#9aa4b2',
  },

  orderRow: {
    marginTop: 10,
    paddingVertical: 8,
  },
  orderText: {
    color: '#e5e7eb',
    fontSize: 13,
    fontWeight: '700',
  },

  navRow: {
    marginTop: 14,
    flexDirection: 'row',
    gap: 10,
  },
  navBtnPrimary: {
    flex: 1,
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
  navBtnSecondary: {
    width: 92,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(148,163,184,0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  navBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  disabled: {
    opacity: 0.5,
  },
});
