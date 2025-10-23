import { Component, input } from '@angular/core';
import { IPage } from '../../models';

@Component({
  selector: 'page-viewer',
  templateUrl: './page-viewer.html',
  styleUrl: './page-viewer.less',
})
export class PageViewerComponent {
  public readonly page = input.required<IPage>();
}
