// Tipo de autenticación
export type AuthMode = 'login' | 'register'

// Forma del formulario
export type AuthForm = {
  name: string
  email: string
  phone: string
  password: string
  age: string
  sex: '' | 'FEMENINO' | 'MASCULINO' | 'OTRO'
  idLocation: string
}