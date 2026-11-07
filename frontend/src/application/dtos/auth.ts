// Datos necesarios para iniciar sesión.
export type LoginData = {
  email: string
  password: string
}

// Roles definidos por el backend.
export type UserRole =
  | 'ADMIN'
  | 'TRAINER'
  | 'HEAD_TRAINER'
  | 'CLIENT'

// Información pública del usuario autenticado.
export type AuthenticatedUser = {
  id: number
  name: string
  email: string
  phone: string
  role: UserRole
  active: boolean
  registerDate: string
}

// Respuesta del endpoint de login
export type LoginResponse = {
  token: string
  user: AuthenticatedUser
}

// Datos necesarios para registrar un cliente.
export type RegisterClientData = {
  name: string
  email: string
  phone: string
  password: string
  role: 'CLIENT'
  age: number
  gender: 'FEMENINO' | 'MASCULINO' | 'OTRO'
  idLocation: number
}

// Respuesta que devuelve el backend al registrar un usuario.
// Se mantiene unknown hasta comprobar su estructura definitiva.
export type RegisterResponse = {
  user: unknown
}

// Información completa de una sesión autenticada.
export type AuthSession = {
  token: string
  user: AuthenticatedUser
}