import type { SiteContent } from './site-content.model';
import { SITE_CONTENT_SCHEMA_VERSION } from './site-content.constants';
import { validateSiteContent } from './site-content.validator';
import siteContent from '../../../../public/config/site-content.json';

describe('validateSiteContent', () => {
  it('accepts a valid configuration', () => {
    const content = createValidContent();

    expect(validateSiteContent(content)).toEqual({ valid: true, value: content });
  });

  it('accepts the shipped runtime configuration', () => {
    expect(validateSiteContent(siteContent)).toEqual({ valid: true, value: siteContent });
  });

  it('accepts an application-local asset path', () => {
    const content = createValidContent();
    const contentWithAsset = {
      ...content,
      navigation: {
        ...content.navigation,
        logo: {
          src: 'assets/brand/logo.svg',
          alt: 'Brand',
        },
      },
    };

    expect(validateSiteContent(contentWithAsset)).toEqual({
      valid: true,
      value: contentWithAsset,
    });
  });

  it('rejects an external asset URL', () => {
    const content = createValidContent();
    const contentWithExternalAsset = {
      ...content,
      navigation: {
        ...content.navigation,
        logo: {
          src: 'https://example.com/logo.svg',
          alt: 'Brand',
        },
      },
    };

    expect(validateSiteContent(contentWithExternalAsset)).toEqual({
      valid: false,
      error: {
        code: 'invalid-value',
        path: '$.navigation.logo.src',
        message: 'Asset source must use a safe application-local assets/ path.',
      },
    });
  });

  it('rejects a JavaScript link', () => {
    const content = createValidContent();
    const contentWithUnsafeLink = {
      ...content,
      navigation: {
        ...content.navigation,
        items: [{ label: 'Unsafe', href: 'javascript:alert(1)' }],
      },
    };

    expect(validateSiteContent(contentWithUnsafeLink)).toEqual({
      valid: false,
      error: {
        code: 'invalid-value',
        path: '$.navigation.items[0].href',
        message: 'Link href uses a prohibited URL scheme or prefix.',
      },
    });
  });

  it('returns the path of the first invalid required field', () => {
    const content = createValidContent();
    const invalidContent = {
      ...content,
      hero: {
        ...content.hero,
        title: undefined,
      },
    };

    expect(validateSiteContent(invalidContent)).toEqual({
      valid: false,
      error: {
        code: 'invalid-type',
        path: '$.hero.title',
        message: 'Expected a string.',
      },
    });
  });

  it('distinguishes a missing field from an invalid field type', () => {
    const content = createValidContent();
    const { title: _title, ...heroWithoutTitle } = content.hero;
    const invalidContent = { ...content, hero: heroWithoutTitle };

    expect(validateSiteContent(invalidContent)).toEqual({
      valid: false,
      error: {
        code: 'missing-field',
        path: '$.hero.title',
        message: 'Required field is missing.',
      },
    });
  });

  it('reports an unsupported prize variant as an invalid value', () => {
    const content = createValidContent();
    const invalidContent = {
      ...content,
      prizes: {
        ...content.prizes,
        items: [{ ...content.prizes.items[0], variant: 'unknown' }],
      },
    };

    expect(validateSiteContent(invalidContent)).toEqual({
      valid: false,
      error: {
        code: 'invalid-value',
        path: '$.prizes.items[0].variant',
        message: 'Expected guaranteed, knowledge, or grand.',
      },
    });
  });

  it('rejects an unsupported schema version', () => {
    const invalidContent = {
      ...createValidContent(),
      schemaVersion: SITE_CONTENT_SCHEMA_VERSION + 1,
    };

    expect(validateSiteContent(invalidContent)).toEqual({
      valid: false,
      error: {
        code: 'unsupported-version',
        path: '$.schemaVersion',
        message: `Unsupported schema version ${SITE_CONTENT_SCHEMA_VERSION + 1}; expected ${SITE_CONTENT_SCHEMA_VERSION}.`,
      },
    });
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
