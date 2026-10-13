import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';

import type { NavigationContent } from '../../core/content/site-content.model';
import { AppButtonComponent } from '../../shared/components/app-button/app-button';

@Component({
  selector: 'app-site-header',
  imports: [AppButtonComponent],
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteHeaderComponent {
  private readonly menuDialog =
    viewChild.required<ElementRef<HTMLDialogElement>>('mobileMenu');
  private readonly menuTrigger =
    viewChild.required<ElementRef<HTMLButtonElement>>('menuTrigger');

  readonly navigation = input.required<NavigationContent>();

  protected readonly isMenuOpen = signal(false);

  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);

  constructor() {
    afterNextRender(() => {
      const viewport = this.document.defaultView;

      if (!viewport?.matchMedia) {
        return;
      }

      const desktopQuery = viewport.matchMedia('(min-width: 64rem)');
      const closeAtDesktop = ({ matches }: MediaQueryListEvent): void => {
        if (matches) {
          this.onMenuClose();
        }
      };

      desktopQuery.addEventListener('change', closeAtDesktop);
      this.destroyRef.onDestroy(() =>
        desktopQuery.removeEventListener('change', closeAtDesktop),
      );
    });
  }

  protected onMenuOpen(): void {
    const dialog = this.menuDialog().nativeElement;

    if (!dialog.open) {
      dialog.showModal();
      this.isMenuOpen.set(true);
    }
  }

  protected onMenuClose(): void {
    const dialog = this.menuDialog().nativeElement;

    if (dialog.open) {
      dialog.close();
    }
  }

  protected onMenuEscape(event: Event): void {
    event.preventDefault();
    this.onMenuClose();
  }

  protected onMenuItemSelected(): void {
    this.onMenuClose();
  }

  protected onDialogClosed(): void {
    this.isMenuOpen.set(false);
    this.menuTrigger().nativeElement.focus();
  }
}
