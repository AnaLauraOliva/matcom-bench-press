// Datos necesarios para iniciar sesión.
export type LoginData = {
  email: string
  password: string
}

// Datos necesarios para registrar un cliente.
export type RegisterClientData = {
  name: string
  email: string
  phone: string
  password: string
  role: 'CLIENT'
  age: number
  sex: 'FEMENINO' | 'MASCULINO' | 'OTRO'
  idLocation: number
}

// Respuesta que devuelve el backend al iniciar sesión.
export type LoginResponse = {
  token: string
  user: unknown
}

// Respuesta que devuelve el backend al registrar un usuario.
export type RegisterResponse = {
  user: unknown
}

// Tipo de autenticación
export type AuthMode = 'login' | 'register'

// 
export type AuthForm = {
  name: string
  email: string
  phone: string
  password: string
  age: string
  sex: '' | 'FEMENINO' | 'MASCULINO' | 'OTRO'
  idLocation: string
}