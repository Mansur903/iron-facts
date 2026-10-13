import { TestBed } from '@angular/core/testing';

import type { NavigationContent } from '../../core/content/site-content.model';
import { SiteHeaderComponent } from './site-header';

describe('SiteHeaderComponent', () => {
  const navigation: NavigationContent = {
    brandLabel: 'РЖД для людей',
    items: [
      { label: 'О проекте', href: '#about' },
      { label: 'Как это работает', href: '#mechanics' },
    ],
    playLink: { label: 'Играть', href: '#play' },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteHeaderComponent],
    }).compileComponents();
  });

  it('renders navigation and CTA data from runtime content', () => {
    const fixture = createFixture();
    const text = fixture.nativeElement.textContent as string;

    expect(text).toContain('О проекте');
    expect(text).toContain('Как это работает');
    expect(text).toContain('Играть');
  });

  it('opens and closes the mobile menu', () => {
    const fixture = createFixture();
    const dialog = fixture.nativeElement.querySelector('dialog') as HTMLDialogElement;
    const trigger = getMenuTrigger(fixture.nativeElement);
    mockDialog(dialog);

    trigger.click();
    fixture.detectChanges();
    expect(dialog.open).toBe(true);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    const closeButton = fixture.nativeElement.querySelector(
      '.mobile-menu__close',
    ) as HTMLButtonElement;
    closeButton.click();
    fixture.detectChanges();
    expect(dialog.open).toBe(false);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('closes the mobile menu on Escape', () => {
    const fixture = createFixture();
    const dialog = fixture.nativeElement.querySelector('dialog') as HTMLDialogElement;
    mockDialog(dialog);
    getMenuTrigger(fixture.nativeElement).click();

    dialog.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
    );
    fixture.detectChanges();

    expect(dialog.open).toBe(false);
  });

  it('closes the mobile menu after selecting a navigation item', () => {
    const fixture = createFixture();
    const dialog = fixture.nativeElement.querySelector('dialog') as HTMLDialogElement;
    mockDialog(dialog);
    getMenuTrigger(fixture.nativeElement).click();

    const menuLink = fixture.nativeElement.querySelector(
      '.mobile-menu__link',
    ) as HTMLAnchorElement;
    menuLink.click();

    expect(dialog.open).toBe(false);
  });

  it('returns focus to the hamburger after the menu closes', () => {
    const fixture = createFixture();
    const dialog = fixture.nativeElement.querySelector('dialog') as HTMLDialogElement;
    const trigger = getMenuTrigger(fixture.nativeElement);
    const focusSpy = vi.spyOn(trigger, 'focus');
    mockDialog(dialog);
    trigger.click();

    const closeButton = fixture.nativeElement.querySelector(
      '.mobile-menu__close',
    ) as HTMLButtonElement;
    closeButton.click();

    expect(focusSpy).toHaveBeenCalledOnce();
  });

  function createFixture() {
    const fixture = TestBed.createComponent(SiteHeaderComponent);
    fixture.componentRef.setInput('navigation', navigation);
    fixture.detectChanges();
    return fixture;
  }

  function getMenuTrigger(element: HTMLElement): HTMLButtonElement {
    return element.querySelector('.site-header__menu-trigger') as HTMLButtonElement;
  }

  function mockDialog(dialog: HTMLDialogElement): void {
    dialog.showModal = vi.fn(() => dialog.setAttribute('open', ''));
    dialog.close = vi.fn(() => {
      dialog.removeAttribute('open');
      dialog.dispatchEvent(new Event('close'));
    });
  }
});
