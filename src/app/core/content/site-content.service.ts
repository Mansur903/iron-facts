import { HttpClient } from '@angular/common/http';
import { Injectable, inject, isDevMode, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { describeHttpError } from '../http/describe-http-error';
import {
  SITE_CONTENT_LOAD_ERROR_MESSAGE,
  SITE_CONTENT_URL,
  SITE_CONTENT_VERSION_ERROR_MESSAGE,
} from './site-content.constants';
import {
  SiteContentErrorReason,
  SiteContentState,
} from './site-content-state.model';
import {
  SiteContentValidationError,
  validateSiteContent,
} from './site-content.validator';

@Injectable({ providedIn: 'root' })
export class SiteContentService {
  private readonly stateSource = signal<SiteContentState>({ status: 'loading' });
  readonly state = this.stateSource.asReadonly();

  private readonly httpClient = inject(HttpClient);

  /** Loads the runtime content during application initialization. */
  public initialize(): Promise<void> {
    return this.load();
  }

  /** Retries loading the runtime content after an error. */
  public retry(): Promise<void> {
    return this.load();
  }

  private async load(): Promise<void> {
    this.stateSource.set({ status: 'loading' });

    let rawContent: unknown;

    try {
      rawContent = await firstValueFrom(this.httpClient.get<unknown>(SITE_CONTENT_URL));
    } catch (error) {
      this.publishError(
        'http-error',
        SITE_CONTENT_LOAD_ERROR_MESSAGE,
        describeHttpError(error),
      );
      return;
    }

    const validationResult = validateSiteContent(rawContent);

    if (!validationResult.valid) {
      this.publishValidationError(validationResult.error);
      return;
    }

    this.stateSource.set({ status: 'ready', content: validationResult.value });
  }

  private publishValidationError(error: SiteContentValidationError): void {
    const isUnsupportedVersion = error.code === 'unsupported-version';

    this.publishError(
      isUnsupportedVersion ? 'unsupported-version' : 'invalid-content',
      isUnsupportedVersion
        ? SITE_CONTENT_VERSION_ERROR_MESSAGE
        : SITE_CONTENT_LOAD_ERROR_MESSAGE,
      `${error.path}: ${error.message}`,
    );
  }

  private publishError(
    reason: SiteContentErrorReason,
    message: string,
    detail: string,
  ): void {
    if (isDevMode()) {
      console.error(`[SiteContentService] ${detail}`);
      this.stateSource.set({ status: 'error', reason, message, detail });
      return;
    }

    this.stateSource.set({ status: 'error', reason, message });
  }
}
