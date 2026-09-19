import type { Location } from '../shared/location.js';
import { locationsEqual } from '../shared/location.js';
import type { CompanyStatus } from './company.status.js';

export interface CompanyProps {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  websiteUrl: string | null;
  careersUrl: string | null;
  logoUrl: string | null;
  industry: string | null;
  /** A company can be in many places. Never assume one. */
  locations: Location[];
  status: CompanyStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Company is the primary aggregate root of the platform.
 * Jobs belong to a Company; follows point at a Company.
 */
export class Company {
  private constructor(private readonly props: CompanyProps) {}

  static hydrate(props: CompanyProps): Company {
    return new Company({ ...props, locations: dedupeLocations(props.locations) });
  }

  get id(): string { return this.props.id; }
  get name(): string { return this.props.name; }
  get slug(): string { return this.props.slug; }
  get description(): string | null { return this.props.description; }
  get websiteUrl(): string | null { return this.props.websiteUrl; }
  get careersUrl(): string | null { return this.props.careersUrl; }
  get logoUrl(): string | null { return this.props.logoUrl; }
  get industry(): string | null { return this.props.industry; }
  get locations(): readonly Location[] { return this.props.locations; }
  get status(): CompanyStatus { return this.props.status; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }

  toProps(): CompanyProps {
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