import { useEffect } from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { getLastTransaction } from '../src/services/api'

export default function Loading() {
  const router = useRouter()
  const params: any = useLocalSearchParams()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getLastTransaction()

        router.replace({
          pathname: '/coupon',
          params: {
            data: JSON.stringify(data),
            coupon: params.coupon
          }
        })
      } catch (error) {
        console.log('ERRO:', error)
      }
    }

    fetchData()
  }, [])

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
    marginTop: 20
  },
  sub: {
    color: '#94a3b8'
  }
})