import { Component, computed, inject, OnInit } from '@angular/core';
import { PageViewerComponent, ToolbarComponent } from '../../shared';
import { DocumentPageService } from './document-page.service';
import { DocumentPageStore } from './store/document-page.store';
import { ZoomControllerComponent, ZoomService } from '../../features/zoom';

@Component({
  selector: 'document-page',
  templateUrl: './document-page.html',
  styleUrl: './document-page.less',
  imports: [ToolbarComponent, PageViewerComponent, ZoomControllerComponent],
  providers: [DocumentPageService, DocumentPageStore],
})
export class DocumentPageComponent implements OnInit {
  private readonly documentPageService = inject(DocumentPageService);
  private readonly zoomService = inject(ZoomService);
  public readonly document = this.documentPageService.document;
  public readonly isLoading = this.documentPageService.isLoading;
  public readonly hasError = this.documentPageService.hasError;
  public readonly zoomInPercent = computed(() => `${this.zoomService.zoomValue() - 30}%`);

  public ngOnInit(): void {
    this.documentPageService.init();
  }
}
