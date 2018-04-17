import { randomBytes, createCipher, createDecipher } from 'crypto'
const algorithm = 'aes-256-ctr'

export function generateKey() {
  const pass = randomBytes(128)
  const passBase64 = pass.toString('base64')
  return passBase64
}

export async function encrypt(text, password) {
  const cipher = await createCipher(algorithm, password)
  let crypted = await cipher.update(text, 'utf8', 'hex')
  crypted += cipher.final('hex')
  return crypted
}

export async function decrypt(text, password) {
  const decipher = await createDecipher(algorithm, password)
  let dec = await decipher.update(text, 'hex', 'utf8')
  dec += decipher.final('utf8')
  return dec
}
