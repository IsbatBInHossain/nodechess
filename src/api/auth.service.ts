import axios from 'axios'
const BASE_URL = import.meta.env.VITE_API_URL

if (!BASE_URL) {
  throw new Error(
    'VITE_API_BASE_URL is not defined in the environment variables'
  )
}

export const loginAsGuest = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/guest`)
    // console.log(`allheaders: ${response.headers}`)
    const authHeader = response.headers['authorization']
    const token = authHeader?.split(' ')[1]

    if (!token) {
      throw new Error('No JWT token received from the server')
    }
    return token
  } catch (error) {
    console.error('Error logging in as guest:', error)
    throw error
  }
}

export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      username,
      password,
    })
    const authHeader = response.headers['authorization']
    const token = authHeader?.split(' ')[1]

    if (!token) {
      throw new Error('No JWT token received from the server')
    }

    return token
  } catch (error) {
    console.error('Error logging in:', error)
    throw error
  }
}

export const register = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, {
      username,
      password,
    })
    return response.data
  } catch (error) {
    console.error('Error registering:', error)
    throw error
  }
}
