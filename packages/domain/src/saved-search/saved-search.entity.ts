import type { SavedSearchCriteria } from './saved-search.criteria.js';

export interface SavedSearchProps {
  id: string;
  userId: string;
  name: string;
  criteria: SavedSearchCriteria;
  lastNotifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class SavedSearch {
  private constructor(private readonly props: SavedSearchProps) {}

  static hydrate(props: SavedSearchProps): SavedSearch {
    return new SavedSearch({ ...props, criteria: { ...props.criteria } });
  }

  get id(): string { return this.props.id; }
  get userId(): string { return this.props.userId; }
  get name(): string { return this.props.name; }
  get criteria(): Readonly<SavedSearchCriteria> { return this.props.criteria; }
  get lastNotifiedAt(): Date | null { return this.props.lastNotifiedAt; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }

  toProps(): SavedSearchProps {
    return { ...this.props, criteria: { ...this.props.criteria } };
  }
}