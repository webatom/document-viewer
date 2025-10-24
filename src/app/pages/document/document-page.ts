import { Component, computed, inject, OnInit } from '@angular/core';
import {
  PageViewerComponent,
  ToolbarComponent,
  AnnotationComponent,
  DraggableDirective,
} from '../../shared';
import { DocumentPageService } from './document-page.service';
import { DocumentPageStore } from './store/document-page.store';
import { ZoomControllerComponent, ZoomService } from '../../features/zoom';

@Component({
  selector: 'document-page',
  templateUrl: './document-page.html',
  styleUrl: './document-page.less',
  imports: [
    ToolbarComponent,
    PageViewerComponent,
    ZoomControllerComponent,
    AnnotationComponent,
    DraggableDirective,
  ],
  providers: [DocumentPageService, DocumentPageStore],
})
export class DocumentPageComponent implements OnInit {
  private readonly documentPageService = inject(DocumentPageService);
  private readonly zoomService = inject(ZoomService);

  public readonly document = this.documentPageService.document;
  public readonly isLoading = this.documentPageService.isLoading;
  public readonly hasError = this.documentPageService.hasError;
  public readonly annotationsRecord = this.documentPageService.annotationsRecord;
  public readonly zoomInPercent = computed(() => `${this.zoomService.zoomValue()}%`);

  ngOnInit(): void {
    this.documentPageService.init();
  }

  onPageDoubleClick(event: MouseEvent, pageNumber: number, container: HTMLDivElement): void {
    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    this.documentPageService.addAnnotation(pageNumber, {
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  }

  onSaveAnnotations(): void {
    this.documentPageService.saveAnnotations();
  }

  onAnnotationPositionChange(
    pageNumber: number,
    id: string,
    event: { position: { x: number; y: number } },
  ) {
    this.documentPageService.changeAnnotationPosition(pageNumber, id, event.position);
  }

  onAnnotationTextChange(pageNumber: number, id: string, text: string) {
    this.documentPageService.changeAnnotationText(pageNumber, id, text);
  }

  onAnnotationDelete(pageNumber: number, id: string): void {
    this.documentPageService.deleteAnnotation(pageNumber, id);
  }
}
