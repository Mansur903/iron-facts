import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { FinalCtaContent } from '../../../core/content/site-content.model';
import { AppButtonComponent } from '../../../shared/components/app-button/app-button';

@Component({
  selector: 'app-final-cta-section',
  imports: [AppButtonComponent],
  templateUrl: './final-cta-section.html',
  styleUrl: './final-cta-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinalCtaSectionComponent {
  readonly content = input.required<FinalCtaContent>();
}
