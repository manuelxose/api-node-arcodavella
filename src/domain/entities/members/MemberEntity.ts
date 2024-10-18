interface MemberEntityProps {
  id: string;
  name: string;
  email: string;
  dni: string;
  comments: string;
  memberNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

export class MemberEntity {
  public id: string;
  public name: string;
  public email: string;
  public dni: string;
  public comments: string;
  public memberNumber: string;
  public createdAt: Date;
  public updatedAt: Date;

  private constructor(props: MemberEntityProps) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.dni = props.dni;
    this.comments = props.comments;
    this.memberNumber = props.memberNumber;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(props: MemberEntityProps): MemberEntity {
    return new MemberEntity(props);
  }
}
