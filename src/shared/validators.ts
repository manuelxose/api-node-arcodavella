// src/shared/validators.ts

export class Validators {
  /**
   * Valida el formato del correo electrónico.
   * @param email - La dirección de correo electrónico a validar.
   * @returns True si el correo electrónico tiene un formato válido, false de lo contrario.
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Valida la contraseña asegurando que tenga al menos 8 caracteres, incluyendo letras y números.
   * @param password - La contraseña a validar.
   * @returns True si la contraseña es válida, false de lo contrario.
   */
  static isValidPassword(password: string): boolean {
    const minLength = 8;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&_\-.]{8,}$/;
    console.log("password: ", password);
    console.log("passwordRegex: ", passwordRegex);
    console.log("passwordRegex.test(password): ", passwordRegex.test(password));
    console.log("minLength: ", minLength);
    console.log("password.length >= minLength: ", password.length >= minLength);

    return password.length >= minLength && passwordRegex.test(password);
  }

  /**
   * Valida que un rol sea válido dentro de una lista de roles permitidos.
   * @param role - El rol a validar.
   * @param validRoles - Lista de roles válidos permitidos.
   * @returns True si el rol es válido, false de lo contrario.
   */
  static isValidUserRole(role: string, validRoles: string[]): boolean {
    return validRoles.includes(role);
  }

  /**
   * Valida que el nombre de usuario solo contenga caracteres alfanuméricos y tenga una longitud válida.
   * @param username - El nombre de usuario a validar.
   * @returns True si el nombre de usuario es válido, false de lo contrario.
   */
  static isValidUsername(username: string): boolean {
    const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;
    return usernameRegex.test(username);
  }
  /**
   * Verifica si un valor no está vacío.
   * @param value - El valor a verificar.
   * @returns True si el valor no está vacío, false de lo contrario.
   */
  static isNotEmpty(value: string | number | undefined): boolean {
    if (typeof value === "number") {
      // Si el valor es un número, consideramos que no está vacío si no es NaN
      return !isNaN(value);
    }

    // Si el valor es una cadena, verificamos que no esté vacía después de trim
    if (typeof value === "string") {
      return value.trim().length > 0;
    }

    // Si el valor es de cualquier otro tipo o es null/undefined, consideramos que está vacío
    return false;
  }

  /**
   * Valida que dos contraseñas coincidan.
   * @param password - La primera contraseña.
   * @param confirmPassword - La contraseña de confirmación.
   * @returns True si las contraseñas coinciden, false de lo contrario.
   */
  static doPasswordsMatch(password: string, confirmPassword: string): boolean {
    return password === confirmPassword;
  }

  /**
   * Valida que el valor esté dentro de un rango numérico.
   * @param value - El valor numérico a validar.
   * @param min - El valor mínimo permitido.
   * @param max - El valor máximo permitido.
   * @returns True si el valor está dentro del rango, false de lo contrario.
   */
  static isInRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
  }

  /**
   * Valida que el texto no contenga caracteres especiales, solo letras y números.
   * @param text - El texto a validar.
   * @returns True si el texto es alfanumérico, false de lo contrario.
   */
  static isAlphaNumeric(text: string): boolean {
    const alphaNumericRegex = /^[a-zA-Z0-9]+$/;
    return alphaNumericRegex.test(text);
  }

  static isValidIPAddress(ip: string): boolean {
    // Expresión regular para validar IPv4 e IPv6
    // Expresión regular para validar IPv4
    const ipv4Regex =
      /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/;

    // Expresión regular mejorada para validar IPv6 (simplificada)
    const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::1)$/;

    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
  }

  /**
   * Valida un número de teléfono (ejemplo simple, puede variar según la región).
   * @param phone - El número de teléfono a validar.
   * @returns True si el número de teléfono es válido, false de lo contrario.
   */
  static isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  }

  /**
   * Valida si una fecha es válida y no es futura.
   * @param date - La fecha a validar en formato string o Date.
   * @returns True si la fecha es válida, false de lo contrario.
   */
  static isValidDate(date: string | Date): boolean {
    let parsedDate: Date;

    if (typeof date === "string") {
      const regex = /^\d{4}-\d{2}-\d{2}$/;
      if (!regex.test(date)) {
        return false;
      }
      parsedDate = new Date(date + "T00:00:00");
    } else if (date instanceof Date) {
      parsedDate = date;
    } else {
      return false;
    }

    return !isNaN(parsedDate.getTime()) && parsedDate.getTime() <= Date.now();
  }

  /**
   * Valida un objeto Date.
   * @param input - El objeto Date a validar.
   * @returns True si el objeto Date es válido, false de lo contrario.
   */
  static validateDateObject(input: Date): boolean {
    if (!(input instanceof Date)) {
      return false;
    }
    if (isNaN(input.getTime())) {
      return false;
    }
    const isoString = input.toISOString();
    const expectedPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    return expectedPattern.test(isoString);
  }

  /**
   * Valida si una URL es válida.
   * @param url - La URL a validar.
   * @returns True si la URL es válida, false de lo contrario.
   */
  static isValidURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (error: unknown) {
      if (error instanceof Error) return false;
    }
    return false;
  }

  /**
   * Valida el formato del DNI (Ejemplo: 12345678Z).
   * @param dni - El DNI a validar.
   * @returns True si el DNI es válido, false de lo contrario.
   */
  static isValidDNI(dni: string): boolean {
    const dniRegex = /^\d{8}[A-Za-z]$/;
    if (!dniRegex.test(dni)) return false;

    const dniLetters = "TRWAGMYFPDXBNJZSQVHLCKE";
    const number = parseInt(dni.substring(0, 8), 10);
    const letter = dni.charAt(8).toUpperCase();
    const expectedLetter = dniLetters.charAt(number % 23);

    return letter === expectedLetter;
  }

  /**
   * Valida que el número de miembro sea alfanumérico.
   * @param memberNumber - El número de miembro a validar.
   * @returns True si el número de miembro es válido, false de lo contrario.
   */
  static isValidMemberNumber(memberNumber: string): boolean {
    const memberNumberRegex = /^[a-zA-Z0-9]{1,10}$/;
    return memberNumberRegex.test(memberNumber);
  }

  /**
   * Valida que los comentarios no excedan un límite de caracteres.
   * @param comments - Los comentarios a validar.
   * @param maxLength - La longitud máxima permitida (por defecto 200).
   * @returns True si los comentarios no exceden el límite, false de lo contrario.
   */
  static isValidComments(comments: string, maxLength: number = 200): boolean {
    return comments.length <= maxLength;
  }

  /**
   * Verifica si una cadena es un base64 válido.
   * @param str - La cadena que se desea validar.
   * @returns True si la cadena es un base64 válido, false de lo contrario.
   */
  static isValidBase64(str: string): boolean {
    if (!str || typeof str !== "string") {
      return false;
    }

    const base64Pattern =
      /^(?:[A-Za-z0-9+/]{4})*?(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
    return base64Pattern.test(str) && str.length % 4 === 0;
  }
}
