import type { LeaderboardEntry } from '../../../core/content/site-content.model';

const PODIUM_DISPLAY_ORDER = [2, 1, 3] as const;
const podiumScoreFormatter = new Intl.NumberFormat('ru-RU');

/** Orders the podium as shown in the design and keeps the remaining ranks ascending. */
export function splitLeaderboardEntries(entries: readonly LeaderboardEntry[]) {
  const ordered = [...entries].sort((left, right) => left.position - right.position);

  return {
    podium: PODIUM_DISPLAY_ORDER.flatMap((position) =>
      ordered.filter((entry) => entry.position === position),
    ),
    rows: ordered.filter((entry) => entry.position > 3),
  };
}

/** Formats podium scores with the spacing used in the design. */
export function formatPodiumScore(score: number): string {
  return podiumScoreFormatter.format(score);
}
