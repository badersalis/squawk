export interface SavedJobProps {
  id: string;
  userId: string;
  jobId: string;
  createdAt: Date;
}

export class SavedJob {
  private constructor(private readonly props: SavedJobProps) {}

  static hydrate(props: SavedJobProps): SavedJob {
    return new SavedJob(props);
  }

  get id(): string { return this.props.id; }
  get userId(): string { return this.props.userId; }
  get jobId(): string { return this.props.jobId; }
  get createdAt(): Date { return this.props.createdAt; }

  toProps(): SavedJobProps {
    return { ...this.props };
  }
}