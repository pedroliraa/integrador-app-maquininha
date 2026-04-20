import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { useState } from 'react'

export default function Home() {
  const router = useRouter()
  const [selectedCoupon, setSelectedCoupon] = useState('10% OFF')

  const coupons = [
    '10% OFF',
    '15% OFF',
    'R$20 OFF',
    'Frete Grátis'
  ]

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FlashCupom ⚡</Text>
      <Text style={styles.subtitle}>
        Gere cupons automaticamente após cada venda
      </Text>

      <Text style={styles.section}>Escolha o cupom:</Text>

      {coupons.map((coupon) => (
        <TouchableOpacity
          key={coupon}
          style={[
            styles.couponOption,
            selectedCoupon === coupon && styles.selected
          ]}
          onPress={() => setSelectedCoupon(coupon)}
        >
          <Text style={styles.couponText}>{coupon}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          router.push({
            pathname: '/loading',
            params: { coupon: selectedCoupon }
          })
        }
      >
        <Text style={styles.buttonText}>Gerar Cupom</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0f172a',
    justifyContent: 'center'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center'
  },
  subtitle: {
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 30
  },
  section: {
    color: '#fff',
    marginBottom: 10
  },
  couponOption: {
    padding: 15,
    backgroundColor: '#1e293b',
    borderRadius: 10,
    marginBottom: 10
  },
  selected: {
    borderColor: '#22c55e',
    borderWidth: 2
  },
  couponText: {
    color: '#fff'
  },
  button: {
    backgroundColor: '#22c55e',
    padding: 15,
    borderRadius: 10,
    marginTop: 20
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold'
  }
})