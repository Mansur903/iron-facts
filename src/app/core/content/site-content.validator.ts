import * as v from 'valibot';

import type { SiteContent } from './site-content.model';
import { siteContentSchema } from './site-content.schema';

export type SiteContentValidationErrorCode =
  | 'invalid-type'
  | 'invalid-value'
  | 'missing-field'
  | 'unsupported-version';

export interface SiteContentValidationError {
  readonly code: SiteContentValidationErrorCode;
  readonly path: string;
  readonly message: string;
}

export type SiteContentValidationResult =
  | { readonly valid: true; readonly value: SiteContent }
  | { readonly valid: false; readonly error: SiteContentValidationError };

/** Validates and converts unknown runtime data into the supported site-content schema. */
export function validateSiteContent(value: unknown): SiteContentValidationResult {
  const result = v.safeParse(siteContentSchema, value, {
    abortEarly: true,
    abortPipeEarly: true,
  });

  if (result.success) {
    return { valid: true, value: result.output };
  }

  return { valid: false, error: toValidationError(result.issues[0]) };
}

function toValidationError(issue: v.BaseIssue<unknown>): SiteContentValidationError {
  const path = formatIssuePath(issue.path);

  return {
    code: getErrorCode(issue, path),
    path,
    message: isMissingField(issue) ? 'Required field is missing.' : issue.message,
  };
}

function getErrorCode(
  issue: v.BaseIssue<unknown>,
  path: string,
): SiteContentValidationErrorCode {
  if (isMissingField(issue)) {
    return 'missing-field';
  }

  if (path === '$.schemaVersion' && issue.type === 'check') {
    return 'unsupported-version';
  }

  if (issue.type === 'picklist') {
    return typeof issue.input === 'string' ? 'invalid-value' : 'invalid-type';
  }

  if (
    issue.type === 'object' ||
    issue.type === 'array' ||
    issue.type === 'string' ||
    issue.type === 'number' ||
    issue.type === 'boolean' ||
    issue.type === 'integer'
  ) {
    return 'invalid-type';
  }

  return 'invalid-value';
}

function isMissingField(issue: v.BaseIssue<unknown>): boolean {
  return issue.path?.at(-1)?.type === 'object' && issue.path.at(-1)?.origin === 'key';
}

function formatIssuePath(path: v.BaseIssue<unknown>['path']): string {
  if (!path) {
    return '$';
  }

  return path.reduce((result, item) => {
    if (item.type === 'array') {
      return `${result}[${String(item.key)}]`;
    }

    return `${result}.${String(item.key)}`;
  }, '$');
}
