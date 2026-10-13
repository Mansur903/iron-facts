export interface AssetReference {
  readonly src: string;
  readonly alt: string;
  readonly width?: number;
  readonly height?: number;
}

export interface ContentLink {
  readonly label: string;
  readonly href: string;
  readonly external?: boolean;
}

export interface NavigationContent {
  readonly brandLabel: string;
  readonly logo?: AssetReference;
  readonly items: readonly ContentLink[];
  readonly playLink: ContentLink;
}

export interface HeroSlide {
  readonly id: string;
  readonly eyebrow: string;
  readonly statement: string;
  readonly yesLabel: string;
  readonly noLabel: string;
  readonly image?: AssetReference;
}

export interface HeroContent {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly marqueeText: string;
  readonly playLink: ContentLink;
  readonly rotationIntervalMs: number;
  readonly slides: readonly HeroSlide[];
}

export type PrizeVariant = 'guaranteed' | 'knowledge' | 'grand';

export interface PrizeItem {
  readonly id: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly variant: PrizeVariant;
  readonly image?: AssetReference;
}

export interface PrizesContent {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly rules: readonly string[];
  readonly playLink: ContentLink;
  readonly items: readonly PrizeItem[];
}

export interface LeaderboardEntry {
  readonly position: number;
  readonly name: string;
  readonly score: number;
  readonly avatar?: AssetReference;
}

export interface LeaderboardContent {
  readonly eyebrow: string;
  readonly title: string;
  readonly scoreLabel: string;
  readonly resultsLink: ContentLink;
  readonly entries: readonly LeaderboardEntry[];
}

export interface MechanicStat {
  readonly value: number;
  readonly label: string;
  readonly description: string;
}

export interface MechanicsContent {
  readonly eyebrow: string;
  readonly title: string;
  readonly stats: readonly MechanicStat[];
}

export interface FinalCtaContent {
  readonly title: string;
  readonly description: string;
  readonly playLink: ContentLink;
  readonly image?: AssetReference;
}

export interface FooterContent {
  readonly brandLabel: string;
  readonly description: string;
  readonly organizer: string;
  readonly supportEmail: string;
  readonly legalLinks: readonly ContentLink[];
  readonly socialLinks: readonly ContentLink[];
  readonly copyright: string;
  readonly logo?: AssetReference;
}

export interface SiteContent {
  readonly schemaVersion: number;
  readonly navigation: NavigationContent;
  readonly hero: HeroContent;
  readonly prizes: PrizesContent;
  readonly leaderboard: LeaderboardContent;
  readonly mechanics: MechanicsContent;
  readonly finalCta: FinalCtaContent;
  readonly footer: FooterContent;
}
