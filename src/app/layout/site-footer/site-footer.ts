import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { FooterContent } from '../../core/content/site-content.model';

@Component({
  selector: 'app-site-footer',
  templateUrl: './site-footer.html',
  styleUrl: './site-footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteFooterComponent {
  readonly content = input.required<FooterContent>();
}
