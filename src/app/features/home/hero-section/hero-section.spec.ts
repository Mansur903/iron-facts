import { TestBed, type ComponentFixture } from '@angular/core/testing';

import type { HeroContent } from '../../../core/content/site-content.model';
import { HeroSectionComponent } from './hero-section';

describe('HeroSectionComponent', () => {
  const content: HeroContent = {
    eyebrow: 'Интерактивная игра',
    title: 'Железные факты',
    description: 'Описание игры',
    marqueeText: 'Подарок уже через 10 вопросов',
    playLink: { label: 'Начать игру', href: '#play' },
    rotationIntervalMs: 1000,
    slides: [
      {
        id: 'question-1',
        eyebrow: 'Вопрос 1',
        statement: 'Первый вопрос',
        yesLabel: 'Да',
        noLabel: 'Нет',
        image: {
          src: 'assets/hero/question-1-worker.png',
          alt: 'Первый персонаж',
          width: 202,
          height: 252,
        },
      },
      {
        id: 'question-2',
        eyebrow: 'Вопрос 2',
        statement: 'Второй вопрос',
        yesLabel: 'Да',
        noLabel: 'Нет',
      },
      {
        id: 'question-3',
        eyebrow: 'Вопрос 3',
        statement: 'Третий вопрос',
        yesLabel: 'Да',
        noLabel: 'Нет',
      },
    ],
  };

  let documentHidden = false;
  let prefersReducedMotion = false;

  beforeEach(async () => {
    vi.useFakeTimers();
    documentHidden = false;
    prefersReducedMotion = false;

    const mediaQuery = createMediaQuery(() => prefersReducedMotion);
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn(() => mediaQuery),
    });
    vi.spyOn(document, 'hidden', 'get').mockImplementation(() => documentHidden);

    await TestBed.configureTestingModule({
      imports: [HeroSectionComponent],
    }).compileComponents();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('renders runtime content and native answer buttons', () => {
    const fixture = createFixture();
    const text = fixture.nativeElement.textContent as string;
    const buttons = fixture.nativeElement.querySelectorAll(
      '.hero-card__answer',
    ) as NodeListOf<HTMLButtonElement>;
    const image = fixture.nativeElement.querySelector(
      '.hero-card__image',
    ) as HTMLImageElement;
    const title = fixture.nativeElement.querySelector('.hero__title') as HTMLHeadingElement;

    expect(text).toContain('Интерактивная игра');
    expect(title.getAttribute('aria-label')).toBe('Железные факты');
    expect(text).toContain('Первый вопрос');
    expect(image.getAttribute('src')).toBe('assets/hero/question-1-worker.png');
    expect([...buttons].every((button) => button.type === 'button')).toBe(true);
  });

  it('rotates through all slides and wraps to the first slide', () => {
    const fixture = createFixture();

    advanceRotation(fixture);
    expect(getCard(fixture).dataset['slideId']).toBe('question-2');

    advanceRotation(fixture);
    expect(getCard(fixture).dataset['slideId']).toBe('question-3');

    advanceRotation(fixture);
    expect(getCard(fixture).dataset['slideId']).toBe('question-1');
  });

  it('pauses on hover and focus, then resumes after both reasons clear', () => {
    const fixture = createFixture();
    const cardShell = fixture.nativeElement.querySelector('.hero__card-shell') as HTMLElement;

    cardShell.dispatchEvent(new MouseEvent('mouseenter'));
    vi.advanceTimersByTime(2000);
    fixture.detectChanges();
    expect(getCard(fixture).dataset['slideId']).toBe('question-1');

    cardShell.dispatchEvent(new FocusEvent('focusin'));
    cardShell.dispatchEvent(new MouseEvent('mouseleave'));
    vi.advanceTimersByTime(2000);
    fixture.detectChanges();
    expect(getCard(fixture).dataset['slideId']).toBe('question-1');

    cardShell.dispatchEvent(new FocusEvent('focusout', { relatedTarget: null }));
    advanceRotation(fixture);
    expect(getCard(fixture).dataset['slideId']).toBe('question-2');
  });

  it('keeps rotating when the pointer is elsewhere in the hero', () => {
    const fixture = createFixture();
    const section = fixture.nativeElement.querySelector('.hero') as HTMLElement;

    section.dispatchEvent(new MouseEvent('mouseenter'));
    advanceRotation(fixture);

    expect(getCard(fixture).dataset['slideId']).toBe('question-2');
  });

  it('anchors play links to the top of the hero layout', () => {
    const fixture = createFixture();
    const playTarget = fixture.nativeElement.querySelector('#play') as HTMLElement;
    const cardShell = fixture.nativeElement.querySelector('.hero__card-shell') as HTMLElement;

    expect(playTarget.classList).toContain('hero__layout');
    expect(cardShell.id).toBe('');
  });

  it('pauses while the document is hidden and resumes when it becomes visible', () => {
    const fixture = createFixture();

    documentHidden = true;
    document.dispatchEvent(new Event('visibilitychange'));
    vi.advanceTimersByTime(2000);
    fixture.detectChanges();
    expect(getCard(fixture).dataset['slideId']).toBe('question-1');

    documentHidden = false;
    document.dispatchEvent(new Event('visibilitychange'));
    advanceRotation(fixture);
    expect(getCard(fixture).dataset['slideId']).toBe('question-2');
  });

  it('does not start automatic rotation when reduced motion is preferred', () => {
    prefersReducedMotion = true;
    const fixture = createFixture();

    vi.advanceTimersByTime(3000);
    fixture.detectChanges();

    expect(getCard(fixture).dataset['slideId']).toBe('question-1');
  });

  it('clears the active timer when destroyed', () => {
    const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');
    const fixture = createFixture();

    fixture.destroy();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it('exposes one marquee message and hides its decorative copy', () => {
    const fixture = createFixture();
    const groups = fixture.nativeElement.querySelectorAll(
      '.hero__marquee-group',
    ) as NodeListOf<HTMLElement>;

    expect(groups).toHaveLength(2);
    expect(groups[0]?.getAttribute('aria-hidden')).toBeNull();
    expect(groups[1]?.getAttribute('aria-hidden')).toBe('true');
    expect(groups[0]?.textContent).toContain(content.marqueeText);
    expect(groups[1]?.textContent).toContain(content.marqueeText);
    expect(groups[0]?.querySelectorAll('span')).toHaveLength(3);
    expect(groups[0]?.querySelectorAll('span[aria-hidden="true"]')).toHaveLength(2);
    expect(groups[1]?.querySelectorAll('span')).toHaveLength(3);
  });

  function createFixture(): ComponentFixture<HeroSectionComponent> {
    const fixture = TestBed.createComponent(HeroSectionComponent);
    fixture.componentRef.setInput('content', content);
    fixture.detectChanges();
    return fixture;
  }

  function advanceRotation(fixture: ComponentFixture<HeroSectionComponent>): void {
    vi.advanceTimersByTime(content.rotationIntervalMs);
    fixture.detectChanges();
  }

  function getCard(fixture: ComponentFixture<HeroSectionComponent>): HTMLElement {
    return fixture.nativeElement.querySelector('.hero-card--active') as HTMLElement;
  }

  function createMediaQuery(getMatches: () => boolean): MediaQueryList {
    return {
      get matches() {
        return getMatches();
      },
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(() => true),
    } as MediaQueryList;
  }
});
