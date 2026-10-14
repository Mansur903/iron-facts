import { TestBed } from '@angular/core/testing';

import type { PrizesContent } from '../../../core/content/site-content.model';
import { PrizesSectionComponent } from './prizes-section';

describe('PrizesSectionComponent', () => {
  const content: PrizesContent = {
    eyebrow: 'Что можно получить',
    title: 'Чем больше играете —',
    titleAccent: 'тем больше призов',
    description: 'Доверьтесь интуиции и играйте!',
    rules: ['Первое правило', 'Второе правило'],
    playLink: { label: 'Играть сейчас', href: '#play' },
    items: [
      {
        id: 'promo',
        eyebrow: 'Гарантированный подарок',
        title: 'Подарочный промокод',
        titleAccent: 'на впечатления',
        description: 'Описание промокода',
        variant: 'guaranteed',
        image: { src: 'assets/prizes/experience-buildings.svg', alt: '', width: 337, height: 420 },
      },
      {
        id: 'certificate',
        eyebrow: 'Приз за знания',
        title: 'Подарочный сертификат',
        titleAccent: 'на 500 рублей',
        description: 'Описание сертификата',
        variant: 'knowledge',
      },
      {
        id: 'travel',
        eyebrow: 'Главный приз',
        title: '3 сертификата на 50 000 рублей',
        description: 'Описание путешествия',
        variant: 'grand',
        image: { src: 'assets/prizes/travel-train.png', alt: '', width: 800, height: 480 },
      },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrizesSectionComponent],
    }).compileComponents();
  });

  it('renders runtime intro, rules and a play link', () => {
    const fixture = TestBed.createComponent(PrizesSectionComponent);
    fixture.componentRef.setInput('content', content);
    fixture.detectChanges();

    const section = fixture.nativeElement.querySelector('#prizes') as HTMLElement;
    const heading = section.querySelector('#prizes-title') as HTMLHeadingElement;
    const rules = section.querySelectorAll('.prizes__rule');
    const link = section.querySelector('.prizes__action a') as HTMLAnchorElement;

    expect(section.getAttribute('aria-labelledby')).toBe('prizes-title');
    expect(heading.textContent).toContain(content.titleAccent);
    expect(rules).toHaveLength(2);
    expect(rules[0]?.textContent).toContain('Первое правило');
    expect(link.getAttribute('href')).toBe(content.playLink.href);
    expect(link.textContent).toContain(content.playLink.label);
  });

  it('renders cards in config order with local images and stacking indices', () => {
    const fixture = TestBed.createComponent(PrizesSectionComponent);
    fixture.componentRef.setInput('content', content);
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('.prize-card') as NodeListOf<HTMLElement>;
    const images = fixture.nativeElement.querySelectorAll(
      '.prize-card__image',
    ) as NodeListOf<HTMLImageElement>;

    expect(cards).toHaveLength(3);
    expect([...cards].map((card) => card.style.getPropertyValue('--prize-index'))).toEqual([
      '0',
      '1',
      '2',
    ]);
    expect(cards[0]?.textContent).toContain('на впечатления');
    expect(cards[1]?.textContent).toContain('на 500 рублей');
    expect(cards[2]?.textContent).toContain('Главный приз');
    expect([...images].map((image) => image.getAttribute('src'))).toEqual([
      'assets/prizes/experience-buildings.svg',
      'assets/prizes/travel-train.png',
    ]);
    expect([...images].every((image) => image.alt === '')).toBe(true);
  });
});
