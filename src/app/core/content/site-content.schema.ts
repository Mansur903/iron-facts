import * as v from 'valibot';

import { SITE_CONTENT_SCHEMA_VERSION } from './site-content.constants';

const EXPECTED_OBJECT_MESSAGE = 'Expected an object.';
const EXPECTED_ARRAY_MESSAGE = 'Expected an array.';
const EXPECTED_STRING_MESSAGE = 'Expected a string.';
const EXPECTED_INTEGER_MESSAGE = 'Expected an integer.';
const EXPECTED_NON_EMPTY_STRING_MESSAGE = 'Expected a non-empty string.';
const EXPECTED_NON_EMPTY_ARRAY_MESSAGE = 'Expected a non-empty array.';

const nonEmptyStringSchema = v.pipe(
  v.string(EXPECTED_STRING_MESSAGE),
  v.check((value) => value.trim().length > 0, EXPECTED_NON_EMPTY_STRING_MESSAGE),
);

const positiveIntegerSchema = v.pipe(
  v.number(EXPECTED_INTEGER_MESSAGE),
  v.integer(EXPECTED_INTEGER_MESSAGE),
  v.minValue(1, 'Expected an integer greater than or equal to 1.'),
);

const nonNegativeIntegerSchema = v.pipe(
  v.number(EXPECTED_INTEGER_MESSAGE),
  v.integer(EXPECTED_INTEGER_MESSAGE),
  v.minValue(0, 'Expected an integer greater than or equal to 0.'),
);

const schemaVersionSchema = v.pipe(
  positiveIntegerSchema,
  v.check(
    (value) => value === SITE_CONTENT_SCHEMA_VERSION,
    ({ input }) =>
      `Unsupported schema version ${input}; expected ${SITE_CONTENT_SCHEMA_VERSION}.`,
  ),
);

export const assetReferenceSchema = v.object(
  {
    src: v.pipe(
      nonEmptyStringSchema,
      v.check(
        isSafeAssetPath,
        'Asset source must use a safe application-local assets/ path.',
      ),
    ),
    alt: v.string(EXPECTED_STRING_MESSAGE),
    width: v.optional(positiveIntegerSchema),
    height: v.optional(positiveIntegerSchema),
  },
  EXPECTED_OBJECT_MESSAGE,
);

export const contentLinkSchema = v.object(
  {
    label: nonEmptyStringSchema,
    href: v.pipe(
      nonEmptyStringSchema,
      v.check(isSafeLinkHref, 'Link href uses a prohibited URL scheme or prefix.'),
    ),
    external: v.optional(v.boolean('Expected a boolean.')),
  },
  EXPECTED_OBJECT_MESSAGE,
);

export const navigationContentSchema = v.object(
  {
    brandLabel: nonEmptyStringSchema,
    logo: v.optional(assetReferenceSchema),
    items: nonEmptyArray(contentLinkSchema),
    playLink: contentLinkSchema,
  },
  EXPECTED_OBJECT_MESSAGE,
);

export const heroSlideSchema = v.object(
  {
    id: nonEmptyStringSchema,
    eyebrow: nonEmptyStringSchema,
    statement: nonEmptyStringSchema,
    yesLabel: nonEmptyStringSchema,
    noLabel: nonEmptyStringSchema,
    image: v.optional(assetReferenceSchema),
  },
  EXPECTED_OBJECT_MESSAGE,
);

export const heroContentSchema = v.object(
  {
    eyebrow: nonEmptyStringSchema,
    title: nonEmptyStringSchema,
    description: nonEmptyStringSchema,
    marqueeText: nonEmptyStringSchema,
    playLink: contentLinkSchema,
    rotationIntervalMs: positiveIntegerSchema,
    slides: nonEmptyArray(heroSlideSchema),
  },
  EXPECTED_OBJECT_MESSAGE,
);

export const prizeItemSchema = v.object(
  {
    id: nonEmptyStringSchema,
    eyebrow: nonEmptyStringSchema,
    title: nonEmptyStringSchema,
    titleAccent: v.optional(nonEmptyStringSchema),
    description: nonEmptyStringSchema,
    variant: v.picklist(
      ['guaranteed', 'knowledge', 'grand'],
      'Expected guaranteed, knowledge, or grand.',
    ),
    image: v.optional(assetReferenceSchema),
  },
  EXPECTED_OBJECT_MESSAGE,
);

export const prizesContentSchema = v.object(
  {
    eyebrow: nonEmptyStringSchema,
    title: nonEmptyStringSchema,
    titleAccent: v.optional(nonEmptyStringSchema),
    description: nonEmptyStringSchema,
    rules: nonEmptyArray(nonEmptyStringSchema),
    playLink: contentLinkSchema,
    items: nonEmptyArray(prizeItemSchema),
  },
  EXPECTED_OBJECT_MESSAGE,
);

export const leaderboardEntrySchema = v.object(
  {
    position: positiveIntegerSchema,
    name: nonEmptyStringSchema,
    score: nonNegativeIntegerSchema,
    avatar: v.optional(assetReferenceSchema),
    podiumLabelDesktop: v.optional(nonEmptyStringSchema),
    podiumLabelMobile: v.optional(nonEmptyStringSchema),
  },
  EXPECTED_OBJECT_MESSAGE,
);

export const leaderboardContentSchema = v.object(
  {
    eyebrow: nonEmptyStringSchema,
    title: nonEmptyStringSchema,
    titleAccent: v.optional(nonEmptyStringSchema),
    scoreLabel: nonEmptyStringSchema,
    resultsLink: contentLinkSchema,
    backgroundImage: v.optional(assetReferenceSchema),
    entries: nonEmptyArray(leaderboardEntrySchema),
  },
  EXPECTED_OBJECT_MESSAGE,
);

export const mechanicStatSchema = v.object(
  {
    value: positiveIntegerSchema,
    label: nonEmptyStringSchema,
    description: nonEmptyStringSchema,
  },
  EXPECTED_OBJECT_MESSAGE,
);

export const mechanicsContentSchema = v.object(
  {
    eyebrow: nonEmptyStringSchema,
    title: nonEmptyStringSchema,
    titleAccent: v.optional(nonEmptyStringSchema),
    timelineImage: v.optional(assetReferenceSchema),
    stats: nonEmptyArray(mechanicStatSchema),
  },
  EXPECTED_OBJECT_MESSAGE,
);

export const finalCtaContentSchema = v.object(
  {
    title: nonEmptyStringSchema,
    titleParts: v.optional(
      v.object({
        lead: nonEmptyStringSchema,
        accent: nonEmptyStringSchema,
        tail: nonEmptyStringSchema,
      }),
    ),
    description: nonEmptyStringSchema,
    playLink: contentLinkSchema,
    image: v.optional(assetReferenceSchema),
  },
  EXPECTED_OBJECT_MESSAGE,
);

export const footerContentSchema = v.object(
  {
    brandLabel: nonEmptyStringSchema,
    description: nonEmptyStringSchema,
    organizer: nonEmptyStringSchema,
    supportEmail: nonEmptyStringSchema,
    legalLinks: nonEmptyArray(contentLinkSchema),
    socialLinks: nonEmptyArray(contentLinkSchema),
    copyright: nonEmptyStringSchema,
    logo: v.optional(assetReferenceSchema),
  },
  EXPECTED_OBJECT_MESSAGE,
);

export const siteContentSchema = v.object(
  {
    schemaVersion: schemaVersionSchema,
    navigation: navigationContentSchema,
    hero: heroContentSchema,
    prizes: prizesContentSchema,
    leaderboard: leaderboardContentSchema,
    mechanics: mechanicsContentSchema,
    finalCta: finalCtaContentSchema,
    footer: footerContentSchema,
  },
  EXPECTED_OBJECT_MESSAGE,
);

function nonEmptyArray<TItem extends v.GenericSchema>(itemSchema: TItem) {
  return v.pipe(
    v.array(itemSchema, EXPECTED_ARRAY_MESSAGE),
    v.nonEmpty(EXPECTED_NON_EMPTY_ARRAY_MESSAGE),
  );
}

function isSafeAssetPath(path: string): boolean {
  return path.startsWith('assets/') && !path.includes('..') && !path.includes('\\');
}

function isSafeLinkHref(href: string): boolean {
  const normalizedHref = href.trimStart().toLowerCase();

  return !(
    normalizedHref.startsWith('javascript:') ||
    normalizedHref.startsWith('data:') ||
    normalizedHref.startsWith('//')
  );
}
