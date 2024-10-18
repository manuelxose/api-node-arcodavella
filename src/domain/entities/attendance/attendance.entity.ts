interface AttendanceProps {
  id: string;
  name: string;
  memberNumber: string;
  email: string;
  dni: string;
  date: Date; // Date in ISO format
  entry: string;
}

export class AttendanceEntity {
  private readonly _id: string;
  private readonly _name: string;
  private readonly _memberNumber: string;
  private readonly _email: string;
  private readonly _dni: string;
  private readonly _entry: string;
  private _date: Date;

  constructor(props: AttendanceProps) {
    this._id = props.id;
    this._name = props.name;
    this._memberNumber = props.memberNumber;
    this._email = props.email;
    this._dni = props.dni;
    this._entry = props.entry;
    this._date = props.date;
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get memberNumber(): string {
    return this._memberNumber;
  }

  get email(): string {
    return this._email;
  }

  get dni(): string {
    return this._dni;
  }
  get entry(): string {
    return this._entry;
  }

  get date(): Date {
    return this._date;
  }

  // Método estático para crear una nueva instancia de Attendance
  static create(props: AttendanceProps): AttendanceEntity {
    return new AttendanceEntity(props);
  }

  // Método para clonar y actualizar datos de Attendance
  clone(updatedData: Partial<AttendanceProps>): AttendanceEntity {
    return new AttendanceEntity({
      id: updatedData.id || this._id,
      name: updatedData.name || this._name,
      memberNumber: updatedData.memberNumber || this._memberNumber,
      email: updatedData.email || this._email,
      dni: updatedData.dni || this._dni,
      entry: updatedData.entry || this._entry,
      date: updatedData.date || this._date,
    });
  }
}
