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