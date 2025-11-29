import client from './client'

export type CreateUserPayload = {
  idNumber: string
  rfidTag: string
  firstName: string
  lastName: string
  college?: string
  department?: string
  email?: string
  yearLevel?: string
  userType?: 'student' | 'faculty'
}

export type UpdateUserPayload = Partial<CreateUserPayload> & { userId: number | string }

export async function createUser(payload: CreateUserPayload) {
  const body = {
    idNumber: payload.idNumber,
    rfidTag: payload.rfidTag,
    firstName: payload.firstName,
    lastName: payload.lastName,
    college: payload.college,
    department: payload.department,
    email: payload.email,
    yearLevel: payload.yearLevel,
    userType: payload.userType ?? 'student',
  }

  const { data } = await client.post('/users', body)
  return data
}

export async function updateUser(payload: UpdateUserPayload) {
  const { userId, ...rest } = payload
  const { data } = await client.put(`/users/${userId}`, rest)
  return data
}

export async function getUserByToken(token: string) {
  const { data } = await client.get('/entries/form', { params: { token } })
  return data
}

export async function upsertUser(payload: {
  token?: string
  rfidTag?: string
  idNumber?: string
  firstName?: string
  lastName?: string
  email?: string
  userType?: string
  college?: string
  department?: string
  yearLevel?: string
  status?: string
}) {
  const { data } = await client.post('/users/upsert', payload)
  return data
}

export default { createUser, updateUser, getUserByToken, upsertUser }
