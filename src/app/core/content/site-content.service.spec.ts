import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import {
  SITE_CONTENT_LOAD_ERROR_MESSAGE,
  SITE_CONTENT_URL,
} from './site-content.constants';
import { SiteContent } from './site-content.model';
import { SiteContentService } from './site-content.service';
import { SITE_CONTENT_SCHEMA_VERSION } from './site-content.validator';

describe('SiteContentService', () => {
  let httpTestingController: HttpTestingController;
  let service: SiteContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(SiteContentService);
  });

  afterEach(() => {
    httpTestingController.verify();
    vi.restoreAllMocks();
  });

  it('publishes valid content after a successful load', async () => {
    const content = createValidContent();
    const initialization = service.initialize();

    expect(service.state()).toEqual({ status: 'loading' });
    httpTestingController.expectOne(SITE_CONTENT_URL).flush(content);
    await initialization;

    expect(service.state()).toEqual({ status: 'ready', content });
  });

  it('publishes a safe error state after an HTTP error', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const initialization = service.initialize();

    httpTestingController.expectOne(SITE_CONTENT_URL).flush('Unavailable', {
      status: 503,
      statusText: 'Service Unavailable',
    });
    await initialization;

    expect(service.state()).toMatchObject({
      status: 'error',
      reason: 'http-error',
      message: SITE_CONTENT_LOAD_ERROR_MESSAGE,
    });
  });

  it('retries loading after an error', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const initialization = service.initialize();

    httpTestingController.expectOne(SITE_CONTENT_URL).flush('Unavailable', {
      status: 500,
      statusText: 'Server Error',
    });
    await initialization;

    const retry = service.retry();
    expect(service.state()).toEqual({ status: 'loading' });

    const content = createValidContent();
    httpTestingController.expectOne(SITE_CONTENT_URL).flush(content);
    await retry;

    expect(service.state()).toEqual({ status: 'ready', content });
  });

  it('does not publish partially valid content', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const content = createValidContent();
    const invalidContent = {
      ...content,
      prizes: {
        ...content.prizes,
        items: [{ ...content.prizes.items[0], title: undefined }],
      },
    };
    const initialization = service.initialize();

    httpTestingController.expectOne(SITE_CONTENT_URL).flush(invalidContent);
    await initialization;

    const state = service.state();
    expect(state).toMatchObject({ status: 'error', reason: 'invalid-content' });
    expect('content' in state).toBe(false);
  });
});

function createValidContent(): SiteContent {
  return {
    schemaVersion: SITE_CONTENT_SCHEMA_VERSION,
    navigation: {
      brandLabel: 'Brand',
      items: [{ label: 'About', href: '#about' }],
      playLink: { label: 'Play', href: '#play' },
    },
    hero: {
      eyebrow: 'Game',
      title: 'Facts',
      description: 'Description',
      marqueeText: 'Marquee',
      playLink: { label: 'Start', href: '#play' },
      rotationIntervalMs: 7000,
      slides: [
        {
          id: 'slide-1',
          eyebrow: 'Question',
          statement: 'Statement',
          yesLabel: 'Yes',
          noLabel: 'No',
        },
      ],
    },
    prizes: {
      eyebrow: 'Prizes',
      title: 'Prize title',
      description: 'Prize description',
      rules: ['Rule'],
      playLink: { label: 'Play', href: '#play' },
      items: [
        {
          id: 'prize-1',
          eyebrow: 'Guaranteed',
          title: 'Prize',
          description: 'Description',
          variant: 'guaranteed',
        },
      ],
    },
    leaderboard: {
      eyebrow: 'Leaderboard',
      title: 'Top players',
      scoreLabel: 'points',
      resultsLink: { label: 'Results', href: '#results' },
      entries: [{ position: 1, name: 'Player', score: 1000 }],
    },
    mechanics: {
      eyebrow: 'Mechanics',
      title: 'How it works',
      stats: [{ value: 10, label: 'rounds', description: 'Description' }],
    },
    finalCta: {
      title: 'Start playing',
      description: 'Description',
      playLink: { label: 'Start', href: '#play' },
    },
    footer: {
      brandLabel: 'Facts',
      description: 'Description',
      organizer: 'Organizer',
      supportEmail: 'support@example.com',
      legalLinks: [{ label: 'Rules', href: '#rules' }],
      socialLinks: [{ label: 'Social', href: '#social' }],
      copyright: '2026',
    },
  };
}
