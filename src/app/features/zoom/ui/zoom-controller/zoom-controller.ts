import { Component, inject } from '@angular/core';
import { ZoomService } from '../../services';

@Component({
  selector: 'zoom-controller',
  templateUrl: './zoom-controller.html',
  styleUrl: './zoom-controller.less',
})
export class ZoomControllerComponent {
  private readonly zoomService = inject(ZoomService);
  public readonly zoomValue = this.zoomService.zoomValue;
  public readonly isDisableIncrement = this.zoomService.isAlreadyMax;
  public readonly isDisableDecrement = this.zoomService.isAlreadyMin;

  public zoomIn(): void {
    this.zoomService.increment();
  }

  public zoomOut(): void {
    this.zoomService.decrement();
  }
  public resetZoom(): void {
    this.zoomService.setDefault();
  }
}
