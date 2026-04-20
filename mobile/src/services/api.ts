const BASE_URL = "http://192.168.0.102:3000/api"

export const getLastTransaction = async () => {
  const response = await fetch(`${BASE_URL}/last-transaction`)
  return response.json()
}