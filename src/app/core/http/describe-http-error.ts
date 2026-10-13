import { HttpErrorResponse } from '@angular/common/http';

/** Returns a diagnostic description for an unknown HTTP failure. */
export function describeHttpError(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    return `Request failed with status ${error.status}: ${error.statusText || 'Unknown error'}.`;
  }

  return error instanceof Error ? error.message : 'Unknown content loading error.';
}
