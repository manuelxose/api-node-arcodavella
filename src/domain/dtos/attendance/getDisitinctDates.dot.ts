export class GetDistinctDatesDTO {
  constructor() {}

  // No necesita validación ya que no se pasan parámetros
  static create(): GetDistinctDatesDTO {
    return new GetDistinctDatesDTO();
  }
}
