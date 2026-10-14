import type { LeaderboardEntry } from '../../../core/content/site-content.model';
import { formatPodiumScore, splitLeaderboardEntries } from './leaderboard-entries';

describe('leaderboard entries', () => {
  it('orders podium places 2, 1, 3 and remaining rows by rank', () => {
    const entries: LeaderboardEntry[] = [
      { position: 5, name: 'Пятый', score: 5000 },
      { position: 3, name: 'Третий', score: 9000 },
      { position: 1, name: 'Первый', score: 14500 },
      { position: 4, name: 'Четвёртый', score: 8500 },
      { position: 2, name: 'Второй', score: 10000 },
    ];

    const result = splitLeaderboardEntries(entries);

    expect(result.podium.map((entry) => entry.position)).toEqual([2, 1, 3]);
    expect(result.rows.map((entry) => entry.position)).toEqual([4, 5]);
    expect(entries.map((entry) => entry.position)).toEqual([5, 3, 1, 4, 2]);
  });

  it('formats podium scores with a thousands separator', () => {
    expect(formatPodiumScore(14500)).toMatch(/^14\s500$/u);
  });
});
