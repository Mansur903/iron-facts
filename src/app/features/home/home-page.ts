import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { SiteContentService } from '../../core/content/site-content.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  protected readonly siteContentService = inject(SiteContentService);

  protected onRetry(): void {
    void this.siteContentService.retry();
  }
}
