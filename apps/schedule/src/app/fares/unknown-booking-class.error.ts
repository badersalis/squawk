/** Domain error: kept distinct from infrastructure/transport errors, mapped at the edge. */
export class UnknownBookingClassError extends Error {
  constructor(public readonly bookingClassCode: string) {
    super(`Unknown booking class: ${bookingClassCode}`);
    this.name = 'UnknownBookingClassError';
  }
}
