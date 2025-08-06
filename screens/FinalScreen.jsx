import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function FinalScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>설문이 완료되었습니다!</Text>
      <Text style={styles.subtitle}>잠시 후 팀 배정이 이루어집니다.</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('TeamCheck')}
      >
        <Text style={styles.buttonText}>팀 확인하러 가기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
