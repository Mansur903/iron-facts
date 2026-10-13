import { SiteContent } from './site-content.model';

export type SiteContentErrorReason =
  | 'http-error'
  | 'invalid-content'
  | 'unsupported-version';

export type SiteContentState =
  | { readonly status: 'loading' }
  | { readonly status: 'ready'; readonly content: SiteContent }
  | {
      readonly status: 'error';
      readonly reason: SiteContentErrorReason;
      readonly message: string;
      readonly detail?: string;
    };
