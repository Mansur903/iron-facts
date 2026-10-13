import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { SITE_CONTENT_LOAD_ERROR_MESSAGE } from '../../core/content/site-content.constants';
import { SiteContentState } from '../../core/content/site-content-state.model';
import { SiteContentService } from '../../core/content/site-content.service';
import { validateSiteContent } from '../../core/content/site-content.validator';
import siteContent from '../../../../public/config/site-content.json';
import { HomePageComponent } from './home-page';

describe('HomePageComponent', () => {
  const state = signal<SiteContentState>({ status: 'loading' });
  const retry = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);

  beforeEach(async () => {
    state.set({ status: 'loading' });
    retry.mockClear();

    await TestBed.configureTestingModule({
      imports: [HomePageComponent],
      providers: [
        {
          provide: SiteContentService,
          useValue: { state: state.asReadonly(), retry },
        },
      ],
    }).compileComponents();
  });

  it('renders the loading state', () => {
    const fixture = TestBed.createComponent(HomePageComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Загрузка содержимого');
  });

  it('renders an accessible retry action for the error state', () => {
    state.set({
      status: 'error',
      reason: 'http-error',
      message: SITE_CONTENT_LOAD_ERROR_MESSAGE,
    });
    const fixture = TestBed.createComponent(HomePageComponent);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.type).toBe('button');

    button.click();
    expect(retry).toHaveBeenCalledOnce();
  });

  it('renders the ready state without product layout', () => {
    const validationResult = validateSiteContent(siteContent);

    if (!validationResult.valid) {
      throw new Error(`Invalid test content at ${validationResult.error.path}.`);
    }

    state.set({ status: 'ready', content: validationResult.value });
    const fixture = TestBed.createComponent(HomePageComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Содержимое страницы загружено');
  });
});
