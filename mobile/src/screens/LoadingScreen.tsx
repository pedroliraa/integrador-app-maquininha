import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'

export default function Loading() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#22c55e" />
      <Text style={styles.text}>Processando pagamento...</Text>
      <Text style={styles.sub}>Gerando seu cupom...</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: '#fff',
    marginTop: 20,
    fontSize: 16
  },
  sub: {
    color: '#94a3b8'
  }
})