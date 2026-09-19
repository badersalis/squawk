export interface FollowProps {
  id: string;
  userId: string;
  companyId: string;
  createdAt: Date;
}

export class Follow {
  private constructor(private readonly props: FollowProps) {}

  static hydrate(props: FollowProps): Follow {
    return new Follow(props);
  }

  get id(): string { return this.props.id; }
  get userId(): string { return this.props.userId; }
  get companyId(): string { return this.props.companyId; }
  get createdAt(): Date { return this.props.createdAt; }

  toProps(): FollowProps {
    return { ...this.props };
  }
}