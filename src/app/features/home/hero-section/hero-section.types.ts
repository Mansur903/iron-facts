import type { HeroSlide } from '../../../core/content/site-content.model';

export type HeroPauseReason = 'focus' | 'hidden' | 'hover';

export interface HeroQueuedSlide {
  readonly position: number;
  readonly slide: HeroSlide;
}
