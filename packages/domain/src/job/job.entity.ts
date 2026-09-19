import type { Location } from '../shared/location.js';
import { locationsEqual } from '../shared/location.js';
import type {
  EmploymentType,
  JobProvider,
  JobStatus,
  Seniority,
  WorkMode,
} from './job.enums.js';

export interface JobProps {
  id: string;
  companyId: string;
  title: string;
  slug: string;
  description: string;
  department: string | null;
  employmentType: EmploymentType;
  seniority: Seniority;
  workMode: WorkMode;
  /** A job can be open in several places (e.g. "Paris or Berlin"). */
  locations: Location[];
  applicationUrl: string;
  sourceProvider: JobProvider;
  externalId: string;
  sourceUpdatedAt: Date | null;
  publishedAt: Date | null;
  firstSeenAt: Date;
  lastSeenAt: Date;
  closedAt: Date | null;
  status: JobStatus;
  providerMetadata: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Job {
  private constructor(private readonly props: JobProps) {}

  static hydrate(props: JobProps): Job {
    return new Job({ ...props, locations: dedupeLocations(props.locations) });
  }

  get id(): string { return this.props.id; }
  get companyId(): string { return this.props.companyId; }
  get title(): string { return this.props.title; }
  get slug(): string { return this.props.slug; }
  get description(): string { return this.props.description; }
  get department(): string | null { return this.props.department; }
  get employmentType(): EmploymentType { return this.props.employmentType; }
  get seniority(): Seniority { return this.props.seniority; }
  get workMode(): WorkMode { return this.props.workMode; }
  get locations(): readonly Location[] { return this.props.locations; }
  get applicationUrl(): string { return this.props.applicationUrl; }
  get sourceProvider(): JobProvider { return this.props.sourceProvider; }
  get externalId(): string { return this.props.externalId; }
  get sourceUpdatedAt(): Date | null { return this.props.sourceUpdatedAt; }
  get publishedAt(): Date | null { return this.props.publishedAt; }
  get firstSeenAt(): Date { return this.props.firstSeenAt; }
  get lastSeenAt(): Date { return this.props.lastSeenAt; }
  get closedAt(): Date | null { return this.props.closedAt; }
  get status(): JobStatus { return this.props.status; }
  get providerMetadata(): Record<string, unknown> | null {
    return this.props.providerMetadata;
  }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }

  /** Composite identity used for idempotency across ingestion runs. */
  get identityKey(): string {
    return `${this.props.companyId}::${this.props.sourceProvider}::${this.props.externalId}`;
  }

  toProps(): JobProps {
    return { ...this.props, locations: [...this.props.locations] };
  }
}

function dedupeLocations(locations: Location[]): Location[] {
  const out: Location[] = [];
  for (const candidate of locations) {
    if (!out.some((existing) => locationsEqual(existing, candidate))) {
      out.push(candidate);
    }
  }
  return out;
}