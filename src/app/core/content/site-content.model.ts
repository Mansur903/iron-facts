import type * as v from 'valibot';

import type {
  assetReferenceSchema,
  contentLinkSchema,
  finalCtaContentSchema,
  footerContentSchema,
  heroContentSchema,
  heroSlideSchema,
  leaderboardContentSchema,
  leaderboardEntrySchema,
  mechanicStatSchema,
  mechanicsContentSchema,
  navigationContentSchema,
  prizeItemSchema,
  prizesContentSchema,
  siteContentSchema,
} from './site-content.schema';

type DeepReadonly<T> = T extends readonly (infer TItem)[]
  ? readonly DeepReadonly<TItem>[]
  : T extends object
    ? { readonly [TKey in keyof T]: DeepReadonly<T[TKey]> }
    : T;

export type AssetReference = DeepReadonly<v.InferOutput<typeof assetReferenceSchema>>;
export type ContentLink = DeepReadonly<v.InferOutput<typeof contentLinkSchema>>;
export type NavigationContent = DeepReadonly<v.InferOutput<typeof navigationContentSchema>>;
export type HeroSlide = DeepReadonly<v.InferOutput<typeof heroSlideSchema>>;
export type HeroContent = DeepReadonly<v.InferOutput<typeof heroContentSchema>>;
export type PrizeVariant = v.InferOutput<typeof prizeItemSchema>['variant'];
export type PrizeItem = DeepReadonly<v.InferOutput<typeof prizeItemSchema>>;
export type PrizesContent = DeepReadonly<v.InferOutput<typeof prizesContentSchema>>;
export type LeaderboardEntry = DeepReadonly<v.InferOutput<typeof leaderboardEntrySchema>>;
export type LeaderboardContent = DeepReadonly<
  v.InferOutput<typeof leaderboardContentSchema>
>;
export type MechanicStat = DeepReadonly<v.InferOutput<typeof mechanicStatSchema>>;
export type MechanicsContent = DeepReadonly<v.InferOutput<typeof mechanicsContentSchema>>;
export type FinalCtaContent = DeepReadonly<v.InferOutput<typeof finalCtaContentSchema>>;
export type FooterContent = DeepReadonly<v.InferOutput<typeof footerContentSchema>>;
export type SiteContent = DeepReadonly<v.InferOutput<typeof siteContentSchema>>;
