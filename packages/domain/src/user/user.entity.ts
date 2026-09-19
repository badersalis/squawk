export interface UserProps {
  id: string;
  email: string;
  name: string;
  /** Null when the user authenticates exclusively via an external provider. */
  passwordHash: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  private constructor(private readonly props: UserProps) {}

  static hydrate(props: UserProps): User {
    return new User({ ...props, email: props.email.trim().toLowerCase() });
  }

  get id(): string { return this.props.id; }
  get email(): string { return this.props.email; }
  get name(): string { return this.props.name; }
  get passwordHash(): string | null { return this.props.passwordHash; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }

  toProps(): UserProps {
    return { ...this.props };
  }
}