
import { hash, compare } from 'bcryptjs'
import { sign, verify } from 'jsonwebtoken'
import type { Secret, SignOptions } from 'jsonwebtoken'

const JWT_SECRET: Secret = process.env.NEXTAUTH_SECRET || 'your-secret-key'

/**
 * Hashes a password using bcrypt.
 *
 * @param {string} password - The password to hash.
 * @returns {Promise<string>} - A promise that resolves to the hashed password.
 */
export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 12)
}

/**
 * Compares a given password with a hashed password using bcrypt.
 * Returns true if the passwords match, false otherwise.
 * @throws {Error} If there is an error comparing the passwords.
 * @returns {Promise<boolean>} A promise that resolves to true if the passwords match, false otherwise.
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await compare(password, hashedPassword)
}

/**
 * Generates a JSON Web Token (JWT) based on the given payload.
 * The token will expire after the given expiresIn.
 * If expiresIn is not provided, the token will expire after 7 days.
 * @param {string | object | Buffer} payload - The payload to be signed.
 * @param {SignOptions['expiresIn']} [expiresIn='7d'] - The expiration time of the token.
 * @returns {string} The generated JWT token.
 */
export function generateToken(payload: string | object | Buffer, expiresIn: SignOptions['expiresIn'] = '7d'): string {
  const options: SignOptions = { expiresIn }
  return sign(payload, JWT_SECRET as Secret, options)
}

/**
 * Verify a token by checking if it is valid and not expired.
 * If the token is valid, returns the payload of the token.
 * If the token is invalid or expired, returns null.
 * @param {string} token - The token to be verified.
 * @returns {any} The payload of the token if it is valid, or null if it is invalid or expired.
 */
export function verifyToken(token: string): any {
  try {
    return verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

/**
 * Generates a verification token as a string of two random alphanumeric strings each of length 13.
 * The token is used to verify the email address of a user when they sign up.
 * @returns {string} A verification token as a string of two random alphanumeric strings each of length 13.
 */
export function generateVerificationToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15)
}