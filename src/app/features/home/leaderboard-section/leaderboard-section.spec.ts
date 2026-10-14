import { TestBed } from '@angular/core/testing';

import type { LeaderboardContent } from '../../../core/content/site-content.model';
import { LeaderboardSectionComponent } from './leaderboard-section';

describe('LeaderboardSectionComponent', () => {
  const content: LeaderboardContent = {
    eyebrow: 'Турнирная таблица',
    title: 'игроков',
    titleAccent: 'Топ-10',
    scoreLabel: 'баллов',
    resultsLink: { label: 'Все результаты', href: '#results' },
    backgroundImage: {
      src: 'assets/leaderboard/confetti.svg',
      alt: '',
      width: 1440,
      height: 1640,
    },
    entries: [
      {
        position: 1,
        name: 'Светлана Куликова',
        score: 14500,
        podiumLabelDesktop: 'Первое место',
        podiumLabelMobile: '1 место',
        avatar: { src: 'assets/leaderboard/svetlana-kulikova.png', alt: '' },
      },
      {
        position: 2,
        name: 'Михаил Нагоров',
        score: 10000,
        podiumLabelDesktop: 'Второе место',
        podiumLabelMobile: '2 место',
      },
      {
        position: 3,
        name: 'Елена Дмитриева',
        score: 9000,
        podiumLabelDesktop: 'Третье место',
        podiumLabelMobile: '3 место',
      },
      {
        position: 4,
        name: 'Кирилл Хусманов',
        score: 8500,
        avatar: { src: 'assets/leaderboard/kirill-khusmanov.png', alt: '' },
      },
      { position: 5, name: 'Сергей Литвинов', score: 8000 },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaderboardSectionComponent],
    }).compileComponents();
  });

  it('renders configured text, the design podium order and ranking rows', () => {
    const fixture = TestBed.createComponent(LeaderboardSectionComponent);
    fixture.componentRef.setInput('content', content);
    fixture.detectChanges();

    const section = fixture.nativeElement.querySelector('#leaderboard') as HTMLElement;
    const cards = [...section.querySelectorAll('.leaderboard-card')] as HTMLElement[];
    const rows = [...section.querySelectorAll('.leaderboard-row')] as HTMLElement[];

    expect(section.getAttribute('aria-labelledby')).toBe('leaderboard-title');
    expect(section.querySelector('h2')?.textContent).toContain('Топ-10');
    expect(cards.map((card) => card.querySelector('h3')?.textContent)).toEqual([
      'Михаил Нагоров',
      'Светлана Куликова',
      'Елена Дмитриева',
    ]);
    expect(rows.map((row) => row.querySelector('.leaderboard-row__position')?.textContent)).toEqual([
      '4',
      '5',
    ]);
    expect(cards[1]?.textContent).toMatch(/14\s500\sбаллов/u);
    expect(rows[0]?.textContent).toContain('8500 баллов');
  });

  it('uses local decorative assets and a results link', () => {
    const fixture = TestBed.createComponent(LeaderboardSectionComponent);
    fixture.componentRef.setInput('content', content);
    fixture.detectChanges();

    const section = fixture.nativeElement.querySelector('#leaderboard') as HTMLElement;
    const confetti = section.querySelector('.leaderboard__confetti') as HTMLImageElement;
    const avatars = [...section.querySelectorAll('img:not(.leaderboard__confetti)')] as HTMLImageElement[];
    const link = section.querySelector('.leaderboard__action a') as HTMLAnchorElement;

    expect(confetti.getAttribute('src')).toBe('assets/leaderboard/confetti.svg');
    expect(confetti.getAttribute('aria-hidden')).toBe('true');
    expect(avatars.map((avatar) => avatar.getAttribute('src'))).toEqual([
      'assets/leaderboard/svetlana-kulikova.png',
      'assets/leaderboard/kirill-khusmanov.png',
    ]);
    expect(avatars.every((avatar) => avatar.alt === '')).toBe(true);
    expect(link.getAttribute('href')).toBe(content.resultsLink.href);
    expect(link.textContent).toContain(content.resultsLink.label);
  });
});
