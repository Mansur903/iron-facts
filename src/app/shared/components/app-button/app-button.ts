import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export type AppButtonAppearance = 'brand' | 'light';
export type AppButtonSize = 'compact' | 'regular';

@Component({
  selector: 'app-button',
  templateUrl: './app-button.html',
  styleUrl: './app-button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppButtonComponent {
  readonly label = input.required<string>();
  readonly href = input<string>();
  readonly external = input(false);
  readonly disabled = input(false);
  readonly appearance = input<AppButtonAppearance>('brand');
  readonly size = input<AppButtonSize>('regular');
  readonly stretch = input(false);

  readonly activated = output<void>();

  protected onButtonClick(): void {
    this.activated.emit();
  }

  protected onLinkClick(event: MouseEvent): void {
    if (this.disabled()) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    this.activated.emit();
  }
}
