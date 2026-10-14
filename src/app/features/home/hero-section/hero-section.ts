import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';

import type { HeroContent } from '../../../core/content/site-content.model';
import { AppButtonComponent } from '../../../shared/components/app-button/app-button';
import type { HeroPauseReason, HeroQueuedSlide } from './hero-section.types';

@Component({
  selector: 'app-hero-section',
  imports: [AppButtonComponent],
  templateUrl: './hero-section.html',
  styleUrls: ['./hero-section.scss', './hero-card.scss', './hero-marquee.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroSectionComponent implements OnInit, OnDestroy {
  readonly content = input.required<HeroContent>();

  protected readonly activeSlideIndex = signal(0);
  protected readonly queuedSlides = computed<readonly HeroQueuedSlide[]>(() => {
    const slides = this.content().slides;
    const activeIndex = this.activeSlideIndex();

    return slides.map((slide, index) => ({
      position: (index - activeIndex + slides.length) % slides.length,
      slide,
    }));
  });
  protected readonly titlePrimary = computed(
    () => this.content().title.trim().split(/\s+/, 1)[0] ?? '',
  );
  protected readonly titleAccent = computed(() => {
    const [, ...remainingWords] = this.content().title.trim().split(/\s+/);
    return remainingWords.join(' ');
  });

  private readonly document = inject(DOCUMENT);
  private readonly pauseReasons = signal<ReadonlySet<HeroPauseReason>>(new Set());
  private readonly reducedMotion = signal(false);

  private motionQuery?: MediaQueryList;
  private timerId?: number;

  private readonly onMotionPreferenceChange = (event: MediaQueryListEvent): void => {
    this.reducedMotion.set(event.matches);
    this.reconcileTimer();
  };

  private readonly onVisibilityChange = (): void => {
    this.setPauseReason('hidden', this.document.hidden);
  };

  /** Initializes motion preferences, visibility tracking and slide rotation. */
  public ngOnInit(): void {
    this.motionQuery = this.document.defaultView?.matchMedia?.(
      '(prefers-reduced-motion: reduce)',
    );
    this.reducedMotion.set(this.motionQuery?.matches ?? false);
    this.motionQuery?.addEventListener('change', this.onMotionPreferenceChange);
    this.document.addEventListener('visibilitychange', this.onVisibilityChange);

    if (this.document.hidden) {
      this.pauseReasons.set(new Set(['hidden']));
    }

    this.reconcileTimer();
  }

  /** Removes browser listeners and clears the active rotation timer. */
  public ngOnDestroy(): void {
    this.clearTimer();
    this.motionQuery?.removeEventListener('change', this.onMotionPreferenceChange);
    this.document.removeEventListener('visibilitychange', this.onVisibilityChange);
  }

  protected onPointerEnter(): void {
    this.setPauseReason('hover', true);
  }

  protected onPointerLeave(): void {
    this.setPauseReason('hover', false);
  }

  protected onFocusIn(): void {
    this.setPauseReason('focus', true);
  }

  protected onFocusOut(event: FocusEvent): void {
    const cardShell = event.currentTarget as HTMLElement;
    const nextTarget = event.relatedTarget;

    if (!(nextTarget instanceof Node) || !cardShell.contains(nextTarget)) {
      this.setPauseReason('focus', false);
    }
  }

  private setPauseReason(reason: HeroPauseReason, paused: boolean): void {
    const nextReasons = new Set(this.pauseReasons());

    if (paused) {
      nextReasons.add(reason);
    } else {
      nextReasons.delete(reason);
    }

    this.pauseReasons.set(nextReasons);
    this.reconcileTimer();
  }

  private reconcileTimer(): void {
    this.clearTimer();

    if (
      this.reducedMotion() ||
      this.pauseReasons().size > 0 ||
      this.content().slides.length < 2
    ) {
      return;
    }

    const viewport = this.document.defaultView;

    if (!viewport) {
      return;
    }

    this.timerId = viewport.setTimeout(() => {
      this.activeSlideIndex.update(
        (index) => (index + 1) % this.content().slides.length,
      );
      this.timerId = undefined;
      this.reconcileTimer();
    }, this.content().rotationIntervalMs);
  }

  private clearTimer(): void {
    if (this.timerId === undefined) {
      return;
    }

    this.document.defaultView?.clearTimeout(this.timerId);
    this.timerId = undefined;
  }
}
