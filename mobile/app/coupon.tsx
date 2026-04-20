import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useLocalSearchParams } from 'expo-router'

export default function Coupon() {
  const params: any = useLocalSearchParams()
  const data = JSON.parse(params.data)
  const selectedCoupon = params.coupon

   const handlePrint = () => {
    alert('Cupom enviado para impressão')
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>FlashCupom ⚡</Text>

        <Text style={styles.label}>Cliente</Text>
        <Text style={styles.value}>{data.customerName}</Text>

        <Text style={styles.label}>Valor da compra</Text>
        <Text style={styles.value}>R$ {data.amount}</Text>

        <Text style={styles.coupon}>{selectedCoupon}</Text>

        <TouchableOpacity style={styles.printButton} onPress={handlePrint}>
          <Text style={styles.printText}>Imprimir Cupom</Text>
        </TouchableOpacity>
      </View>
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
  card: {
    backgroundColor: '#1e293b',
    padding: 25,
    borderRadius: 15,
    width: '85%',
    alignItems: 'center'
  },
  title: {
    color: '#22c55e',
    fontSize: 22,
    marginBottom: 20
  },
  label: {
    color: '#94a3b8'
  },
  value: {
    color: '#fff',
    marginBottom: 10
  },
  coupon: {
    fontSize: 28,
    color: '#22c55e',
    fontWeight: 'bold',
    marginVertical: 20
  },
  printButton: {
    backgroundColor: '#22c55e',
    padding: 12,
    borderRadius: 10
  },
  printText: {
    color: '#fff',
    fontWeight: 'bold'
  }
})