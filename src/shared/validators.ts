export class Validators {
  // Valida el formato del correo electrónico
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Valida la contraseña asegurando que tenga al menos 8 caracteres, incluyendo letras y números
  // Los caracteres especiales son opcionales
  static isValidPassword(password: string): boolean {
    const minLength = 8;
    // La expresión regular permite letras, números, y opcionalmente caracteres especiales
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&_\-]{8,}$/;
    return password.length >= minLength && passwordRegex.test(password);
  }

  // Valida que un rol sea válido dentro de una lista de roles permitidos
  static isValidUserRole(role: any, validRoles: any[]): boolean {
    return validRoles.includes(role);
  }

  // Valida que el nombre de usuario solo contenga caracteres alfanuméricos y tenga una longitud válida
  static isValidUsername(username: string): boolean {
    const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;
    return usernameRegex.test(username);
  }

  // Valida que el campo no esté vacío
  static isNotEmpty(value: any): boolean {
    if (value === undefined || value === null) {
      return false;
    }
    return value.trim().length > 0;
  }

  // Valida que dos contraseñas coincidan
  static doPasswordsMatch(password: string, confirmPassword: string): boolean {
    return password === confirmPassword;
  }

  // Valida que el valor esté dentro de un rango numérico
  static isInRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
  }

  // Valida que el texto no contenga caracteres especiales, solo letras y números
  static isAlphaNumeric(text: string): boolean {
    const alphaNumericRegex = /^[a-zA-Z0-9]+$/;
    return alphaNumericRegex.test(text);
  }

  // Valida un número de teléfono (ejemplo simple, puede variar según la región)
  static isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  }

  // Valida si una fecha es válida y no es futura
  static isValidDate(date: string): boolean {
    const parsedDate = Date.parse(date);
    if (isNaN(parsedDate)) return false;
    return parsedDate <= Date.now(); // Verifica que no sea una fecha futura
  }

  // Valida si una URL es válida
  static isValidURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  }
}
