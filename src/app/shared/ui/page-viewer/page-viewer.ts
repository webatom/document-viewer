import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IPage } from '../../models';

@Component({
  selector: 'page-viewer',
  templateUrl: './page-viewer.html',
  styleUrl: './page-viewer.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageViewerComponent {
  public readonly page = input.required<IPage>();
}
