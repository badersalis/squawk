export type CompanyStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

export const COMPANY_STATUSES: readonly CompanyStatus[] = [
  'ACTIVE',
  'INACTIVE',
  'ARCHIVED',
] as const;

export function isCompanyStatus(value: string): value is CompanyStatus {
  return (COMPANY_STATUSES as readonly string[]).includes(value);
}