import { TestBed } from '@angular/core/testing';

import type { MechanicsContent } from '../../../core/content/site-content.model';
import { MechanicsSectionComponent } from './mechanics-section';

describe('MechanicsSectionComponent', () => {
  const content: MechanicsContent = {
    eyebrow: 'Механика игры',
    title: 'РЖД больше,',
    titleAccent: 'чем кажется',
    timelineImage: { src: 'assets/mechanics/timeline.svg', alt: '', width: 34, height: 714 },
    stats: [
      { value: 10, label: 'раундов', description: 'Первый подарок после раунда.' },
      { value: 10, label: 'вопросов', description: 'В каждом раунде.' },
      { value: 100, label: 'фактов', description: 'О людях РЖД.' },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MechanicsSectionComponent],
    }).compileComponents();
  });

  it('renders runtime data in order and hides the decorative timeline', () => {
    const fixture = TestBed.createComponent(MechanicsSectionComponent);
    fixture.componentRef.setInput('content', content);
    fixture.detectChanges();

    const section = fixture.nativeElement.querySelector('#mechanics') as HTMLElement;
    const stats = [...section.querySelectorAll('.mechanics__stat')] as HTMLElement[];
    const timeline = section.querySelector('.mechanics__timeline-image') as HTMLImageElement;

    expect(section.getAttribute('aria-labelledby')).toBe('mechanics-title');
    expect(section.querySelector('h2')?.textContent).toContain('чем кажется');
    expect(stats.map((stat) => stat.querySelector('.mechanics__value')?.textContent)).toEqual([
      '10',
      '10',
      '100',
    ]);
    expect(stats.map((stat) => stat.querySelector('h3')?.textContent)).toEqual([
      'раундов',
      'вопросов',
      'фактов',
    ]);
    expect(stats[0]?.textContent).toContain(content.stats[0].description);
    expect(timeline.getAttribute('src')).toBe('assets/mechanics/timeline.svg');
    expect(timeline.getAttribute('aria-hidden')).toBe('true');
    expect(timeline.alt).toBe('');
  });

  it('moves the highlight with scroll and removes listeners on destroy', () => {
    const fixture = TestBed.createComponent(MechanicsSectionComponent);
    fixture.componentRef.setInput('content', content);
    fixture.detectChanges();

    const stats = [...fixture.nativeElement.querySelectorAll('.mechanics__stat')] as HTMLElement[];
    const bounds = [
      { top: -400, bottom: -200, height: 200 },
      { top: 200, bottom: 400, height: 200 },
      { top: 600, bottom: 800, height: 200 },
    ];

    const rectSpies = stats.map((stat, index) =>
      vi.spyOn(stat, 'getBoundingClientRect').mockReturnValue({
        ...stat.getBoundingClientRect(),
        ...bounds[index],
      }),
    );

    document.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();

    expect(stats[1].classList.contains('mechanics__stat--active')).toBe(true);
    expect(stats[0].classList.contains('mechanics__stat--active')).toBe(false);

    rectSpies[1].mockReturnValue({
      ...stats[1].getBoundingClientRect(),
      top: -200,
      bottom: 0,
      height: 200,
    });
    rectSpies[2].mockReturnValue({
      ...stats[2].getBoundingClientRect(),
      top: 200,
      bottom: 400,
      height: 200,
    });
    document.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();

    expect(stats[2].classList.contains('mechanics__stat--active')).toBe(true);

    const removeScrollListener = vi.spyOn(document, 'removeEventListener');
    const removeResizeListener = vi.spyOn(window, 'removeEventListener');
    fixture.destroy();
    expect(removeScrollListener).toHaveBeenCalledWith('scroll', expect.any(Function));
    expect(removeResizeListener).toHaveBeenCalledWith('resize', expect.any(Function));
    removeScrollListener.mockRestore();
    removeResizeListener.mockRestore();
  });
});
