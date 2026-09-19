import type {
  EmploymentType,
  Seniority,
  WorkMode,
} from '../job/job.enums.js';

/** Lowercased → canonical work mode. */
export const WORK_MODE_RULES: ReadonlyArray<readonly [RegExp, WorkMode]> = [
  [/\bfully[\s-]?remote\b/i, 'REMOTE'],
  [/\bremote\b/i, 'REMOTE'],
  [/\bhybrid\b/i, 'HYBRID'],
  [/\bpartially[\s-]?remote\b/i, 'HYBRID'],
  [/\bonsite\b/i, 'ONSITE'],
  [/\bon[\s-]?site\b/i, 'ONSITE'],
  [/\bin[\s-]?office\b/i, 'ONSITE'],
];

export const EMPLOYMENT_TYPE_RULES: ReadonlyArray<readonly [RegExp, EmploymentType]> = [
  [/\bfull[\s-]?time\b/i, 'FULL_TIME'],
  [/\bpart[\s-]?time\b/i, 'PART_TIME'],
  [/\bcontract(or)?\b/i, 'CONTRACT'],
  [/\bintern(ship)?\b/i, 'INTERNSHIP'],
  [/\btemporary\b/i, 'TEMPORARY'],
  [/\b(vie|apprentice(ship)?)\b/i, 'INTERNSHIP'],
];

/**
 * Seniority is primarily derived from the job title. Ordered from most
 * specific to least specific so that "Senior Staff Engineer" resolves to
 * STAFF rather than SENIOR.
 */
export const SENIORITY_RULES: ReadonlyArray<readonly [RegExp, Seniority]> = [
  [/\bprincipal\b/i, 'PRINCIPAL'],
  [/\bstaff\b/i, 'STAFF'],
  [/\b(lead|tech lead|team lead)\b/i, 'STAFF'],
  [/\b(head|director|vp|chief)\b/i, 'PRINCIPAL'],
  [/\b(senior|sr\.?)\b/i, 'SENIOR'],
  [/\b(mid|mid[\s-]?level|intermediate)\b/i, 'MID'],
  [/\b(junior|jr\.?|entry[\s-]?level|graduate)\b/i, 'JUNIOR'],
  [/\bintern(ship)?\b/i, 'INTERN'],
];

/** Lowercased country name or ISO-2 code → ISO-3166-1 alpha-2. */
export const COUNTRY_NAME_TO_CODE: Record<string, string> = {
  france: 'FR', fr: 'FR',
  germany: 'DE', deutschland: 'DE', de: 'DE',
  spain: 'ES', es: 'ES',
  italy: 'IT', it: 'IT',
  netherlands: 'NL', nl: 'NL',
  belgium: 'BE', be: 'BE',
  portugal: 'PT', pt: 'PT',
  'united kingdom': 'GB', uk: 'GB', gb: 'GB', england: 'GB',
  ireland: 'IE', ie: 'IE',
  'united states': 'US', usa: 'US', us: 'US',
  canada: 'CA', ca: 'CA',
  brazil: 'BR', br: 'BR',
  mexico: 'MX', mx: 'MX',
  australia: 'AU', au: 'AU',
  'new zealand': 'NZ', nz: 'NZ',
  japan: 'JP', jp: 'JP',
  singapore: 'SG', sg: 'SG',
  india: 'IN', 'in': 'IN',
  china: 'CN', cn: 'CN',
  'south korea': 'KR', kr: 'KR',
  poland: 'PL', pl: 'PL',
  sweden: 'SE', se: 'SE',
  norway: 'NO', no: 'NO',
  denmark: 'DK', dk: 'DK',
  finland: 'FI', fi: 'FI',
  switzerland: 'CH', ch: 'CH',
  austria: 'AT', at: 'AT',
};