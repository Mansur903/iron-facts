import { TestBed } from '@angular/core/testing';

import { AppButtonComponent } from './app-button';

describe('AppButtonComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppButtonComponent],
    }).compileComponents();
  });

  it('renders a native button by default', () => {
    const fixture = TestBed.createComponent(AppButtonComponent);
    fixture.componentRef.setInput('label', 'Играть');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button).toBeTruthy();
    expect(button.type).toBe('button');
  });

  it('renders a native link with the configured href', () => {
    const fixture = TestBed.createComponent(AppButtonComponent);
    fixture.componentRef.setInput('label', 'Играть');
    fixture.componentRef.setInput('href', '#play');
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe('#play');
  });

  it('uses native disabled semantics and does not activate', () => {
    const fixture = TestBed.createComponent(AppButtonComponent);
    const activated = vi.fn();
    fixture.componentRef.setInput('label', 'Играть');
    fixture.componentRef.setInput('disabled', true);
    fixture.componentInstance.activated.subscribe(activated);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    button.click();

    expect(button.disabled).toBe(true);
    expect(activated).not.toHaveBeenCalled();
  });

  it('prevents activation and exposes semantics for a disabled link', () => {
    const fixture = TestBed.createComponent(AppButtonComponent);
    const activated = vi.fn();
    fixture.componentRef.setInput('label', 'Играть');
    fixture.componentRef.setInput('href', '#play');
    fixture.componentRef.setInput('disabled', true);
    fixture.componentInstance.activated.subscribe(activated);
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
    link.dispatchEvent(clickEvent);

    expect(link.getAttribute('aria-disabled')).toBe('true');
    expect(link.tabIndex).toBe(-1);
    expect(clickEvent.defaultPrevented).toBe(true);
    expect(activated).not.toHaveBeenCalled();
  });
});
