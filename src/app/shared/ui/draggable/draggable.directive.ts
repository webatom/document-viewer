import { Directive, ElementRef, inject, input, output, signal, HostListener } from '@angular/core';
import { calculateClampPositionInPercent } from '../../utils';

export interface DragPosition {
  x: number;
  y: number;
}

export interface DragEvent {
  position: DragPosition;
  element: HTMLElement;
  originalEvent: MouseEvent | TouchEvent;
}

const DRAG_THRESHOLD = 5;
@Directive({
  selector: '[draggable]',
  standalone: true,
})
export class DraggableDirective {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  public readonly container = input.required<HTMLElement>();

  public readonly dragStart = output<DragEvent>();
  public readonly dragMove = output<DragEvent>();
  public readonly dragEnd = output<DragEvent>();

  private readonly isDragging = signal(false);
  private readonly currentPosition = signal<DragPosition>({ x: 0, y: 0 });

  private startPosition: DragPosition = { x: 0, y: 0 };
  private initialPosition: DragPosition = { x: 0, y: 0 };
  private readonly threshold = DRAG_THRESHOLD;

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.startDrag({ x: event.clientX, y: event.clientY });
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isDragging()) return;
    this.handleMove(event, { x: event.clientX, y: event.clientY });
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.endDrag(event);
  }

  private startDrag(startPos: DragPosition) {
    this.startPosition = startPos;
    this.initialPosition = this.getCurrentPosition();
    this.isDragging.set(true);
  }

  private handleMove(originalEvent: MouseEvent | TouchEvent, currentPos: DragPosition) {
    const deltaX = currentPos.x - this.startPosition.x;
    const deltaY = currentPos.y - this.startPosition.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (!this.isDragging() && distance < this.threshold) {
      return;
    }

    if (!this.isDragging()) {
      this.isDragging.set(true);
      this.dragStart.emit({
        position: this.initialPosition,
        element: this.elementRef.nativeElement,
        originalEvent,
      });
    }

    const newPosition = this.calculateNewPosition(deltaX, deltaY);
    this.updatePosition(newPosition);
    this.currentPosition.set(newPosition);

    this.dragMove.emit({
      position: newPosition,
      element: this.elementRef.nativeElement,
      originalEvent,
    });
  }

  private endDrag(originalEvent: MouseEvent | TouchEvent) {
    if (this.isDragging()) {
      this.dragEnd.emit({
        position: this.getCurrentPosition(),
        element: this.elementRef.nativeElement,
        originalEvent,
      });
    }
    this.isDragging.set(false);
  }

  private calculateNewPosition(deltaX: number, deltaY: number): DragPosition {
    const container = this.container();
    const containerRect = container.getBoundingClientRect();
    const elementRect = this.elementRef.nativeElement.getBoundingClientRect();

    // Конвертируем начальную позицию из процентов в пиксели
    const initialXPixels = (this.initialPosition.x / 100) * containerRect.width;
    const initialYPixels = (this.initialPosition.y / 100) * containerRect.height;

    // Вычисляем новую позицию в пикселях
    const newXPixels = initialXPixels + deltaX;
    const newYPixels = initialYPixels + deltaY;

    return calculateClampPositionInPercent(newXPixels, newYPixels, elementRect, containerRect);
  }

  private updatePosition(position: DragPosition) {
    this.elementRef.nativeElement.style.left = `${position.x}%`;
    this.elementRef.nativeElement.style.top = `${position.y}%`;
  }

  private getCurrentPosition(): DragPosition {
    const element = this.elementRef.nativeElement;

    const left = element.style.left || '0%';
    const top = element.style.top || '0%';

    const leftPercent = parseFloat(left) || 0;
    const topPercent = parseFloat(top) || 0;

    return { x: leftPercent, y: topPercent };
  }
}
