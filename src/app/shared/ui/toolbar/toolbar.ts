import { Component, input } from '@angular/core';

@Component({
  selector: 'toolbar',
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.less',
})
export class ToolbarComponent {
  public readonly title = input.required<string>();
}
