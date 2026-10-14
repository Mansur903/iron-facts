import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import type { LeaderboardContent } from '../../../core/content/site-content.model';
import { AppButtonComponent } from '../../../shared/components/app-button/app-button';
import { formatPodiumScore, splitLeaderboardEntries } from './leaderboard-entries';

@Component({
  selector: 'app-leaderboard-section',
  imports: [AppButtonComponent],
  templateUrl: './leaderboard-section.html',
  styleUrls: ['./leaderboard-section.scss', './leaderboard-card.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeaderboardSectionComponent {
  readonly content = input.required<LeaderboardContent>();

  protected readonly entries = computed(() => splitLeaderboardEntries(this.content().entries));
  protected readonly formatPodiumScore = formatPodiumScore;
}
