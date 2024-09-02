import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";
import { env } from "../config/env";

const JWT_SECRET = env.jwtSecret;

export class JwtAdapter {
  static async generateToken(
    payload: object,
    secretKey: string = JWT_SECRET,
    duration: string = "2h",
    options: SignOptions = {}
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const signOptions: SignOptions = {
        expiresIn: duration,
        algorithm: "HS512", // Usar un algoritmo más fuerte si es necesario
        ...options,
      };

      jwt.sign(payload, secretKey, signOptions, (err, token) => {
        if (err || !token) {
          reject(new Error(`Failed to generate token: ${err?.message}`));
        } else {
          resolve(token);
        }
      });
    });
  }

  static validateToken<T>(
    token: string,
    secretKey: string = JWT_SECRET,
    options: VerifyOptions = {}
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secretKey, options, (err, decoded) => {
        if (err) {
          reject(new Error(`Token validation failed: ${err.message}`));
        } else {
          resolve(decoded as T);
        }
      });
    });
  }
}
