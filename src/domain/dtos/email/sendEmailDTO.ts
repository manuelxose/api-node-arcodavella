export class SendEmailDTO {
  public readonly to: string;
  public readonly subject: string;
  public readonly bodyText: string;

  constructor(to: string, subject: string, bodyText: string) {
    this.to = to;
    this.subject = subject;
    this.bodyText = bodyText;
  }
}
