import axios from 'axios';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
  //const BACK_SERVER = Constants.expoConfig.extra.BACK_SERVER;
   const BACK_SERVER = "https://b99d987b875f.ngrok.app";

  const [answers, setAnswers] = useState(Array(questions.length).fill([]));

  const handleSelect = (questionIdx, choiceIdx) => {
    const updatedAnswers = [...answers];
    const current = updatedAnswers[questionIdx];
    const letter = choiceLetters[choiceIdx];

    if (current.includes(letter)) {
      updatedAnswers[questionIdx] = current.filter(c => c !== letter);
    } else if (current.length < 3) {
      updatedAnswers[questionIdx] = [...current, letter];
    }

    setAnswers(updatedAnswers);
  };

  const handleSubmit = async () => {
    const isCompleted = answers.every(a => a.length === 3);
    if (!isCompleted) {
      Alert.alert('설문 미완료', '모든 문항에서 a, b, c 중 3개를 순서대로 선택해주세요.');
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
      const response = await axios.post(`${BACK_SERVER}/submitSurvey`, {
        nickName: nickName,
        answerA: totals['a'],
        answerB: totals['b'],
        answerC: totals['c'],
      });

      if (response.status === 200) {
        Alert.alert('제출 완료', '설문이 성공적으로 제출되었습니다.');
        navigation.navigate('Final');
      } else {
        throw new Error('서버 오류');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('에러', '설문 제출 중 문제가 발생했습니다.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>버뮤다 키오스크 지대 🚨</Text>

      {questions.map((item, qIdx) => (
        <View key={qIdx} style={styles.questionBlock}>
          <Text style={styles.question}>{item.question}</Text>
          {item.options.map((option, oIdx) => {
            const letter = choiceLetters[oIdx];
            const isSelected = answers[qIdx].includes(letter);

            return (
              <TouchableOpacity
                key={oIdx}
                style={[
                  styles.choiceButton,
                  isSelected && styles.selectedChoice,
                ]}
                onPress={() => handleSelect(qIdx, oIdx)}
              >
                <Text style={[
                  styles.choiceText,
                  isSelected && { color: '#fff' },
                ]}>
                  {letter.toUpperCase()}. {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}

      <TouchableOpacity
        style={[
          styles.submitButton,
          answers.some(a => a.length !== 3) && styles.disabledButton,
        ]}
        onPress={handleSubmit}
        disabled={answers.some(a => a.length !== 3)}
      >
        <Text style={styles.submitText}>확인</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 50,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  questionBlock: {
    marginBottom: 28,
  },
  question: {
    fontSize: 18,
    marginBottom: 12,
    fontWeight: '600',
  },
  choiceButton: {
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 10,
    padding: 12,
    marginVertical: 6,
    backgroundColor: '#f9f9f9',
  },
  selectedChoice: {
    backgroundColor: '#007bff',
  },
  choiceText: {
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    marginTop: 30,
    backgroundColor: '#28a745',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#aaa',
  },
});
