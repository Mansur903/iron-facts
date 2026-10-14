import { TestBed } from '@angular/core/testing';

import type { FooterContent } from '../../core/content/site-content.model';
import { SiteFooterComponent } from './site-footer';

describe('SiteFooterComponent', () => {
  const content: FooterContent = {
    brandLabel: 'Железные факты',
    description: 'О людях, профессиях и технологиях РЖД',
    organizerLabel: 'Организатор акции:',
    organizer: '[юридическое наименование ЦПР]',
    supportLabel: 'Поддержка:',
    supportEmail: '[email]',
    legalLinks: [
      { label: 'Правила акции', href: '#rules' },
      { label: 'Политика обработки персональных данных', href: '#privacy' },
    ],
    socialLinks: [
      {
        label: 'ВКонтакте',
        href: '#vk',
        icon: { src: 'assets/footer/vk.svg', alt: '', width: 48, height: 48 },
      },
      {
        label: 'Telegram',
        href: '#telegram',
        icon: { src: 'assets/footer/telegram.svg', alt: '', width: 48, height: 48 },
      },
    ],
    copyright: '©2026',
    logo: { src: 'assets/brand/logo.svg', alt: 'РЖД для людей дела', width: 185, height: 41 },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SiteFooterComponent] }).compileComponents();
  });

  it('renders runtime copy and keeps placeholders unchanged', () => {
    const fixture = TestBed.createComponent(SiteFooterComponent);
    fixture.componentRef.setInput('content', content);
    fixture.detectChanges();

    const footer = fixture.nativeElement.querySelector('footer') as HTMLElement;
    const logo = footer.querySelector('.site-footer__logo') as HTMLElement;

    expect(footer.textContent).toContain(content.brandLabel);
    expect(footer.textContent).toContain(content.description);
    expect(footer.textContent).toContain(content.organizer);
    expect(footer.textContent).toContain(content.supportEmail);
    expect(footer.textContent).toContain(content.copyright);
    expect(logo.getAttribute('aria-label')).toBe(content.logo?.alt);
  });

  it('renders legal and social links in configuration order', () => {
    const fixture = TestBed.createComponent(SiteFooterComponent);
    fixture.componentRef.setInput('content', content);
    fixture.detectChanges();

    const legal = [...fixture.nativeElement.querySelectorAll('.site-footer__legal a')] as
      HTMLAnchorElement[];
    const social = [...fixture.nativeElement.querySelectorAll('.site-footer__social a')] as
      HTMLAnchorElement[];

    expect(legal.map((link) => link.getAttribute('href'))).toEqual(['#rules', '#privacy']);
    expect(social.map((link) => link.getAttribute('aria-label'))).toEqual([
      'ВКонтакте',
      'Telegram',
    ]);
    expect(social.map((link) => link.querySelector('img')?.getAttribute('src'))).toEqual([
      'assets/footer/vk.svg',
      'assets/footer/telegram.svg',
    ]);
  });
});
