// src/domain/entities/contacto/ContactoEntity.ts

export interface ContactoEntityProps {
  id: string;
  nombre: string;
  correo: string;
  telefono: string;
  fechaRegistro: Date;
  activo: boolean;
}

export class ContactoEntity {
  public id: string;
  public nombre: string;
  public correo: string;
  public telefono: string;
  public fechaRegistro: Date;
  public activo: boolean;

  private constructor(props: ContactoEntityProps) {
    this.id = props.id;
    this.nombre = props.nombre;
    this.correo = props.correo;
    this.telefono = props.telefono;
    this.fechaRegistro = props.fechaRegistro;
    this.activo = props.activo;
  }

  static create(props: ContactoEntityProps): ContactoEntity {
    return new ContactoEntity(props);
  }
}
