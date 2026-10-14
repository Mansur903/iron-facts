import { TestBed } from '@angular/core/testing';

import type { FinalCtaContent } from '../../../core/content/site-content.model';
import { FinalCtaSectionComponent } from './final-cta-section';

describe('FinalCtaSectionComponent', () => {
  const content: FinalCtaContent = {
    title: 'Узнавайте РЖД с железными фактами',
    titleParts: {
      lead: 'Узнавайте',
      accent: 'РЖД',
      tail: 'с железными фактами',
    },
    description: 'Начинайте игру, проходите раунды и забирайте подарки',
    playLink: { label: 'Начать игру', href: '#play' },
    image: {
      src: 'assets/final-cta/electromechanic.png',
      alt: 'Сотрудница РЖД',
      width: 660,
      height: 738,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinalCtaSectionComponent],
    }).compileComponents();
  });

  it('renders editable title parts, portrait and a play link', () => {
    const fixture = TestBed.createComponent(FinalCtaSectionComponent);
    fixture.componentRef.setInput('content', content);
    fixture.detectChanges();

    const section = fixture.nativeElement.querySelector('.final-cta') as HTMLElement;
    const title = section.querySelector('#final-cta-title') as HTMLHeadingElement;
    const portrait = section.querySelector('.final-cta__portrait') as HTMLImageElement;
    const link = section.querySelector('.final-cta__action a') as HTMLAnchorElement;

    expect(section.getAttribute('aria-labelledby')).toBe('final-cta-title');
    expect(title.textContent).toContain(content.titleParts?.accent);
    expect(title.textContent).toContain(content.titleParts?.tail);
    expect(section.textContent).toContain(content.description);
    expect(portrait.getAttribute('src')).toBe(content.image?.src);
    expect(portrait.getAttribute('alt')).toBe(content.image?.alt);
    expect(link.getAttribute('href')).toBe(content.playLink.href);
    expect(link.textContent).toContain(content.playLink.label);
  });

  it('falls back to the unsplit title when no title parts are provided', () => {
    const fixture = TestBed.createComponent(FinalCtaSectionComponent);
    fixture.componentRef.setInput('content', { ...content, titleParts: undefined });
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('#final-cta-title') as HTMLHeadingElement;

    expect(title.textContent).toContain(content.title);
    expect(title.querySelector('.final-cta__ticket')).toBeNull();
  });
});
