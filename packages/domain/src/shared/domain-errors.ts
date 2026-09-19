/**
 * Base class for every error the domain throws.
 *
 * Infrastructure layers (HTTP filters, queue error handlers) map these to
 * transport-specific responses using `code` and `httpStatus`. The domain
 * itself never knows about HTTP.
 */
export abstract class DomainError extends Error {
  /** Stable, machine-readable code. Never change once released. */
  abstract readonly code: string;

  /** Suggested HTTP status when surfaced through the API. */
  abstract readonly httpStatus: number;

  /** Safe, user-facing message. Never contains internal details. */
  readonly userMessage: string;

  /** Optional structured context for logs (never exposed to clients). */
  readonly context?: Record<string, unknown>;

  constructor(
    userMessage: string,
    options?: { cause?: unknown; context?: Record<string, unknown> },
  ) {
    super(userMessage, options?.cause ? { cause: options.cause } : undefined);
    this.name = new.target.name;
    this.userMessage = userMessage;
    this.context = options?.context;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}