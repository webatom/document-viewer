import {
  Component,
  input,
  output,
  ElementRef,
  viewChild,
  effect,
  AfterViewInit,
  inject,
} from '@angular/core';
import { IAnnotation } from '../../models';

@Component({
  selector: 'annotation',
  templateUrl: './annotation.component.html',
  styleUrl: './annotation.component.less',
})
export class AnnotationComponent implements AfterViewInit {
  public readonly annotation = input.required<IAnnotation>();
  public readonly textChange = output<string>();
  public readonly delete = output<void>();
  public readonly elementRef = inject(ElementRef);
  public readonly textarea = viewChild.required<ElementRef<HTMLTextAreaElement>>('textarea');

  constructor() {
    effect(() => {
      const annotation = this.annotation();
      this.setPosition(annotation.x, annotation.y);
    });
  }
  ngAfterViewInit(): void {
    this.focusTextarea();
  }

  focusTextarea(): void {
    this.textarea().nativeElement.focus();
  }

  onTextChange(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    this.textChange.emit(target.value);
  }

  stopEvent(event: MouseEvent) {
    event.stopPropagation();
  }

  onDelete() {
    this.delete.emit();
  }

  private setPosition(x: number, y: number) {
    this.elementRef.nativeElement.style.left = `${x}%`;
    this.elementRef.nativeElement.style.top = `${y}%`;
  }
}
