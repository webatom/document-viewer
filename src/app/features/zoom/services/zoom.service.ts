import { computed, Injectable, signal } from '@angular/core';
import { DEFAULT_ZOOM, MAX_ZOOM, MIN_ZOOM, ZOOM_STEP } from '../constants';

@Injectable({ providedIn: 'root' })
export class ZoomService {
  private readonly zoom = signal(DEFAULT_ZOOM);
  public readonly zoomValue = this.zoom.asReadonly();
  public readonly isAlreadyMin = computed(() => {
    return this.zoom() === MIN_ZOOM;
  });
  public readonly isAlreadyMax = computed(() => {
    return this.zoom() === MAX_ZOOM;
  });

  increment(): void {
    this.zoom.update((oldValue) => {
      const value = Math.min(oldValue + ZOOM_STEP, MAX_ZOOM);
      return value;
    });
  }

  decrement(): void {
    this.zoom.update((oldValue) => {
      const value = Math.max(oldValue - ZOOM_STEP, MIN_ZOOM);
      return value;
    });
  }

  setDefault(): void {
    this.zoom.set(DEFAULT_ZOOM);
  }
}
