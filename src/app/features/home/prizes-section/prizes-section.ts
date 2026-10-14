import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { PrizesContent } from '../../../core/content/site-content.model';
import { AppButtonComponent } from '../../../shared/components/app-button/app-button';

@Component({
  selector: 'app-prizes-section',
  imports: [AppButtonComponent],
  templateUrl: './prizes-section.html',
  styleUrls: ['./prizes-section.scss', './prize-card.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrizesSectionComponent {
  readonly content = input.required<PrizesContent>();
}
