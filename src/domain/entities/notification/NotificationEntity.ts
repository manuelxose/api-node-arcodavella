import { RecipientTypes } from "../../enums/RecipientTypes";
import { NotificationTypes } from "../../enums/NotificationTypes";
import { StatusCodes } from "../../enums/StatusCodes";

interface NotificationEntityProps {
  id: string;
  recipientId: string;
  recipientType: RecipientTypes;
  type: NotificationTypes;
  message: string;
  title: string;
  summary: string;
  status: StatusCodes;
  fieldToUpdate?: string; // Campo solicitado para modificación (opcional)
  newValue?: any; // El nuevo valor propuesto (opcional)
  createdAt: Date;
  updatedAt: Date;
}

export class NotificationEntity {
  private readonly _id: string;
  private readonly _recipientId: string;
  private readonly _recipientType: RecipientTypes;
  private readonly _type: NotificationTypes;
  private _message: string;
  private _title: string;
  private _summary: string;
  private _status: StatusCodes;
  private _fieldToUpdate?: string; // Campo solicitado para modificación
  private _newValue?: any; // Nuevo valor propuesto
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: NotificationEntityProps) {
    this._id = props.id;
    this._recipientId = props.recipientId;
    this._recipientType = props.recipientType;
    this._type = props.type;
    this._title = props.title;
    this._summary = props.summary;
    this._message = props.message;
    this._status = props.status;
    this._fieldToUpdate = props.fieldToUpdate;
    this._newValue = props.newValue;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get recipientId(): string {
    return this._recipientId;
  }

  get recipientType(): RecipientTypes {
    return this._recipientType;
  }

  get type(): NotificationTypes {
    return this._type;
  }

  get title(): string {
    return this._title;
  }

  get summary(): string {
    return this._summary;
  }

  get message(): string {
    return this._message;
  }

  get status(): StatusCodes {
    return this._status;
  }

  get fieldToUpdate(): string | undefined {
    return this._fieldToUpdate;
  }

  get newValue(): any | undefined {
    return this._newValue;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Método estático para crear una nueva entidad de notificación
  static create(props: NotificationEntityProps): NotificationEntity {
    return new NotificationEntity(props);
  }

  // Método para clonar la entidad y actualizar algunos campos
  clone(updatedData: Partial<NotificationEntityProps>): NotificationEntity {
    return new NotificationEntity({
      id: updatedData.id || this._id,
      recipientId: updatedData.recipientId || this._recipientId,
      recipientType: updatedData.recipientType || this._recipientType,
      type: updatedData.type || this._type,
      message: updatedData.message || this._message,
      title: updatedData.title || this._title,
      summary: updatedData.summary || this._summary,
      status: updatedData.status || this._status,
      fieldToUpdate: updatedData.fieldToUpdate || this._fieldToUpdate, // Mantener o actualizar el campo
      newValue: updatedData.newValue || this._newValue, // Mantener o actualizar el nuevo valor
      createdAt: this._createdAt, // No se actualiza
      updatedAt: updatedData.updatedAt || new Date(), // Siempre actualizamos la fecha de modificación
    });
  }
}
