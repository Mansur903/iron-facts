import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { SiteContentService } from '../../core/content/site-content.service';
import { SiteHeaderComponent } from '../../layout/site-header/site-header';
import { HeroSectionComponent } from './hero-section/hero-section';

@Component({
  selector: 'app-home-page',
  imports: [HeroSectionComponent, SiteHeaderComponent],
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
