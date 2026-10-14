import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  signal,
  viewChildren,
} from '@angular/core';

import type { MechanicsContent } from '../../../core/content/site-content.model';

@Component({
  selector: 'app-mechanics-section',
  templateUrl: './mechanics-section.html',
  styleUrls: ['./mechanics-section.scss', './mechanics-mobile.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MechanicsSectionComponent {
  private readonly statElements = viewChildren<ElementRef<HTMLElement>>('statElement');

  readonly content = input.required<MechanicsContent>();

  protected readonly activeStatIndex = signal(-1);

  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  /** Highlights the stat currently passing through the viewing area. */
  public ngAfterViewInit(): void {
    const viewport = this.document.defaultView;

    if (!viewport) {
      return;
    }

    const elements = this.statElements().map((reference) => reference.nativeElement);
    const updateHighlight = (): void => {
      const focusLine = Math.min(viewport.innerHeight * 0.6, 300);
      let nearestIndex = -1;
      let nearestDistance = Number.POSITIVE_INFINITY;

      elements.forEach((element, index) => {
        const bounds = element.getBoundingClientRect();

        if (bounds.bottom < 0 || bounds.top > viewport.innerHeight) {
          return;
        }

        const distance = Math.abs(bounds.top + bounds.height / 2 - focusLine);

        if (distance < nearestDistance) {
          nearestIndex = index;
          nearestDistance = distance;
        }
      });

      this.activeStatIndex.set(nearestIndex);
    };

    this.document.addEventListener('scroll', updateHighlight, { passive: true });
    viewport.addEventListener('resize', updateHighlight);
    updateHighlight();
    this.destroyRef.onDestroy(() => {
      this.document.removeEventListener('scroll', updateHighlight);
      viewport.removeEventListener('resize', updateHighlight);
    });
  }
}
