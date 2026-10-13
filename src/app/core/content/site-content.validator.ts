import {
  AssetReference,
  ContentLink,
  FinalCtaContent,
  FooterContent,
  HeroContent,
  HeroSlide,
  LeaderboardContent,
  LeaderboardEntry,
  MechanicStat,
  MechanicsContent,
  NavigationContent,
  PrizeItem,
  PrizesContent,
  PrizeVariant,
  SiteContent,
} from './site-content.model';

export const SITE_CONTENT_SCHEMA_VERSION = 1;

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

type JsonObject = Record<string, unknown>;

class ValidationIssue extends Error {
  constructor(readonly validationError: SiteContentValidationError) {
    super(validationError.message);
  }
}

/** Validates and converts unknown runtime data into the supported site-content schema. */
export function validateSiteContent(value: unknown): SiteContentValidationResult {
  try {
    return { valid: true, value: parseSiteContent(value) };
  } catch (error) {
    if (error instanceof ValidationIssue) {
      return { valid: false, error: error.validationError };
    }

    throw error;
  }
}

function parseSiteContent(value: unknown): SiteContent {
  const content = readObject(value, '$');
  const schemaVersion = readInteger(content, 'schemaVersion', '$', 1);

  if (schemaVersion !== SITE_CONTENT_SCHEMA_VERSION) {
    fail(
      'unsupported-version',
      '$.schemaVersion',
      `Unsupported schema version ${schemaVersion}; expected ${SITE_CONTENT_SCHEMA_VERSION}.`,
    );
  }

  return {
    schemaVersion,
    navigation: parseNavigation(readRequired(content, 'navigation', '$'), '$.navigation'),
    hero: parseHero(readRequired(content, 'hero', '$'), '$.hero'),
    prizes: parsePrizes(readRequired(content, 'prizes', '$'), '$.prizes'),
    leaderboard: parseLeaderboard(readRequired(content, 'leaderboard', '$'), '$.leaderboard'),
    mechanics: parseMechanics(readRequired(content, 'mechanics', '$'), '$.mechanics'),
    finalCta: parseFinalCta(readRequired(content, 'finalCta', '$'), '$.finalCta'),
    footer: parseFooter(readRequired(content, 'footer', '$'), '$.footer'),
  };
}

function parseNavigation(value: unknown, path: string): NavigationContent {
  const navigation = readObject(value, path);

  return {
    brandLabel: readString(navigation, 'brandLabel', path),
    logo: readOptionalAsset(navigation, 'logo', path),
    items: readArray(navigation, 'items', path, parseLink),
    playLink: parseLink(readRequired(navigation, 'playLink', path), `${path}.playLink`),
  };
}

function parseHero(value: unknown, path: string): HeroContent {
  const hero = readObject(value, path);

  return {
    eyebrow: readString(hero, 'eyebrow', path),
    title: readString(hero, 'title', path),
    description: readString(hero, 'description', path),
    marqueeText: readString(hero, 'marqueeText', path),
    playLink: parseLink(readRequired(hero, 'playLink', path), `${path}.playLink`),
    rotationIntervalMs: readInteger(hero, 'rotationIntervalMs', path, 1),
    slides: readArray(hero, 'slides', path, parseHeroSlide),
  };
}

function parseHeroSlide(value: unknown, path: string): HeroSlide {
  const slide = readObject(value, path);

  return {
    id: readString(slide, 'id', path),
    eyebrow: readString(slide, 'eyebrow', path),
    statement: readString(slide, 'statement', path),
    yesLabel: readString(slide, 'yesLabel', path),
    noLabel: readString(slide, 'noLabel', path),
    image: readOptionalAsset(slide, 'image', path),
  };
}

function parsePrizes(value: unknown, path: string): PrizesContent {
  const prizes = readObject(value, path);

  return {
    eyebrow: readString(prizes, 'eyebrow', path),
    title: readString(prizes, 'title', path),
    description: readString(prizes, 'description', path),
    rules: readArray(prizes, 'rules', path, readArrayString),
    playLink: parseLink(readRequired(prizes, 'playLink', path), `${path}.playLink`),
    items: readArray(prizes, 'items', path, parsePrizeItem),
  };
}

function parsePrizeItem(value: unknown, path: string): PrizeItem {
  const item = readObject(value, path);
  const variant = readString(item, 'variant', path);

  if (!isPrizeVariant(variant)) {
    fail('invalid-value', `${path}.variant`, 'Expected guaranteed, knowledge, or grand.');
  }

  return {
    id: readString(item, 'id', path),
    eyebrow: readString(item, 'eyebrow', path),
    title: readString(item, 'title', path),
    description: readString(item, 'description', path),
    variant,
    image: readOptionalAsset(item, 'image', path),
  };
}

function parseLeaderboard(value: unknown, path: string): LeaderboardContent {
  const leaderboard = readObject(value, path);

  return {
    eyebrow: readString(leaderboard, 'eyebrow', path),
    title: readString(leaderboard, 'title', path),
    scoreLabel: readString(leaderboard, 'scoreLabel', path),
    resultsLink: parseLink(
      readRequired(leaderboard, 'resultsLink', path),
      `${path}.resultsLink`,
    ),
    entries: readArray(leaderboard, 'entries', path, parseLeaderboardEntry),
  };
}

function parseLeaderboardEntry(value: unknown, path: string): LeaderboardEntry {
  const entry = readObject(value, path);

  return {
    position: readInteger(entry, 'position', path, 1),
    name: readString(entry, 'name', path),
    score: readInteger(entry, 'score', path, 0),
    avatar: readOptionalAsset(entry, 'avatar', path),
  };
}

function parseMechanics(value: unknown, path: string): MechanicsContent {
  const mechanics = readObject(value, path);

  return {
    eyebrow: readString(mechanics, 'eyebrow', path),
    title: readString(mechanics, 'title', path),
    stats: readArray(mechanics, 'stats', path, parseMechanicStat),
  };
}

function parseMechanicStat(value: unknown, path: string): MechanicStat {
  const stat = readObject(value, path);

  return {
    value: readInteger(stat, 'value', path, 1),
    label: readString(stat, 'label', path),
    description: readString(stat, 'description', path),
  };
}

function parseFinalCta(value: unknown, path: string): FinalCtaContent {
  const finalCta = readObject(value, path);

  return {
    title: readString(finalCta, 'title', path),
    description: readString(finalCta, 'description', path),
    playLink: parseLink(readRequired(finalCta, 'playLink', path), `${path}.playLink`),
    image: readOptionalAsset(finalCta, 'image', path),
  };
}

function parseFooter(value: unknown, path: string): FooterContent {
  const footer = readObject(value, path);

  return {
    brandLabel: readString(footer, 'brandLabel', path),
    description: readString(footer, 'description', path),
    organizer: readString(footer, 'organizer', path),
    supportEmail: readString(footer, 'supportEmail', path),
    legalLinks: readArray(footer, 'legalLinks', path, parseLink),
    socialLinks: readArray(footer, 'socialLinks', path, parseLink),
    copyright: readString(footer, 'copyright', path),
    logo: readOptionalAsset(footer, 'logo', path),
  };
}

function parseLink(value: unknown, path: string): ContentLink {
  const link = readObject(value, path);
  const external = readOptionalBoolean(link, 'external', path);
  const label = readString(link, 'label', path);
  const href = readString(link, 'href', path);

  if (isUnsafeLinkHref(href)) {
    fail('invalid-value', `${path}.href`, 'Link href uses a prohibited URL scheme or prefix.');
  }

  return external === undefined
    ? {
        label,
        href,
      }
    : {
        label,
        href,
        external,
      };
}

function parseAsset(value: unknown, path: string): AssetReference {
  const asset = readObject(value, path);
  const src = readString(asset, 'src', path);
  const width = readOptionalPositiveInteger(asset, 'width', path);
  const height = readOptionalPositiveInteger(asset, 'height', path);

  if (!src.startsWith('assets/') || src.includes('..') || src.includes('\\')) {
    fail(
      'invalid-value',
      `${path}.src`,
      'Asset source must use a safe application-local assets/ path.',
    );
  }

  return {
    src,
    alt: readString(asset, 'alt', path, true),
    ...(width === undefined ? {} : { width }),
    ...(height === undefined ? {} : { height }),
  };
}

function readObject(value: unknown, path: string): JsonObject {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    fail('invalid-type', path, 'Expected an object.');
  }

  return value as JsonObject;
}

function readRequired(object: JsonObject, key: string, parentPath: string): unknown {
  if (!(key in object)) {
    fail('missing-field', `${parentPath}.${key}`, 'Required field is missing.');
  }

  return object[key];
}

function readString(
  object: JsonObject,
  key: string,
  parentPath: string,
  allowEmpty = false,
): string {
  const value = readRequired(object, key, parentPath);
  const path = `${parentPath}.${key}`;

  if (typeof value !== 'string') {
    fail('invalid-type', path, 'Expected a string.');
  }

  if (!allowEmpty && value.trim().length === 0) {
    fail('invalid-value', path, 'Expected a non-empty string.');
  }

  return value;
}

function readInteger(
  object: JsonObject,
  key: string,
  parentPath: string,
  minimum: number,
): number {
  const value = readRequired(object, key, parentPath);
  const path = `${parentPath}.${key}`;

  if (typeof value !== 'number' || !Number.isInteger(value)) {
    fail('invalid-type', path, 'Expected an integer.');
  }

  if (value < minimum) {
    fail('invalid-value', path, `Expected an integer greater than or equal to ${minimum}.`);
  }

  return value;
}

function readArray<T>(
  object: JsonObject,
  key: string,
  parentPath: string,
  parseItem: (value: unknown, path: string) => T,
): readonly T[] {
  const value = readRequired(object, key, parentPath);
  const path = `${parentPath}.${key}`;

  if (!Array.isArray(value)) {
    fail('invalid-type', path, 'Expected an array.');
  }

  if (value.length === 0) {
    fail('invalid-value', path, 'Expected a non-empty array.');
  }

  return value.map((item, index) => parseItem(item, `${path}[${index}]`));
}

function readArrayString(value: unknown, path: string): string {
  if (typeof value !== 'string') {
    fail('invalid-type', path, 'Expected a string.');
  }

  if (value.trim().length === 0) {
    fail('invalid-value', path, 'Expected a non-empty string.');
  }

  return value;
}

function readOptionalAsset(
  object: JsonObject,
  key: string,
  parentPath: string,
): AssetReference | undefined {
  return key in object ? parseAsset(object[key], `${parentPath}.${key}`) : undefined;
}

function readOptionalBoolean(
  object: JsonObject,
  key: string,
  parentPath: string,
): boolean | undefined {
  if (!(key in object)) {
    return undefined;
  }

  const value = object[key];

  if (typeof value !== 'boolean') {
    fail('invalid-type', `${parentPath}.${key}`, 'Expected a boolean.');
  }

  return value;
}

function readOptionalPositiveInteger(
  object: JsonObject,
  key: string,
  parentPath: string,
): number | undefined {
  if (!(key in object)) {
    return undefined;
  }

  return readInteger(object, key, parentPath, 1);
}

function isPrizeVariant(value: string): value is PrizeVariant {
  return value === 'guaranteed' || value === 'knowledge' || value === 'grand';
}

function isUnsafeLinkHref(href: string): boolean {
  const normalizedHref = href.trimStart().toLowerCase();

  return (
    normalizedHref.startsWith('javascript:') ||
    normalizedHref.startsWith('data:') ||
    normalizedHref.startsWith('//')
  );
}

function fail(code: SiteContentValidationErrorCode, path: string, message: string): never {
  throw new ValidationIssue({ code, path, message });
}
