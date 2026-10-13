import { HttpErrorResponse } from '@angular/common/http';

import { describeHttpError } from './describe-http-error';

describe('describeHttpError', () => {
  it('describes an Angular HTTP error', () => {
    const error = new HttpErrorResponse({
      status: 503,
      statusText: 'Service Unavailable',
    });

    expect(describeHttpError(error)).toBe(
      'Request failed with status 503: Service Unavailable.',
    );
  });

  it('preserves a standard error message', () => {
    expect(describeHttpError(new Error('Connection failed.'))).toBe('Connection failed.');
  });

  it('handles an unknown error value', () => {
    expect(describeHttpError(null)).toBe('Unknown content loading error.');
  });
});
