import { DestroyRef, inject, Injectable } from '@angular/core';
import { catchError, finalize, map, of } from 'rxjs';
import { AnnotationsApiService, DocumentsApiService, IAnnotation } from '../../shared';
import { ActivatedRoute } from '@angular/router';
import { DocumentPageStore } from './store/document-page.store';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { uid } from 'uid';

@Injectable()
export class DocumentPageService {
  private readonly documentsApi = inject(DocumentsApiService);
  private readonly annotationsApiService = inject(AnnotationsApiService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly documentPageStore = inject(DocumentPageStore);
  private readonly destroyRef = inject(DestroyRef);
  private readonly pageState$ = this.documentPageStore.state$;

  public readonly document = toSignal(this.pageState$.pipe(map(({ document }) => document)), {
    initialValue: null,
  });
  public readonly hasError = toSignal(
    this.pageState$.pipe(map(({ hasDocumentError }) => hasDocumentError)),
    { initialValue: false },
  );

  public readonly isLoading = toSignal(
    this.pageState$.pipe(map(({ isDocumentLoading }) => isDocumentLoading)),
    { initialValue: false },
  );

  public readonly annotationsRecord = toSignal(
    this.pageState$.pipe(map(({ annotationsRecord }) => annotationsRecord)),
  );

  init() {
    const documentId = this.activatedRoute.snapshot.paramMap.get('id');
    if (!documentId) {
      console.error('The `documentName` param not found');
      this.documentPageStore.setHasDocumentError(true);
      return;
    }

    this.loadDocument(documentId);
  }

  addAnnotation(pageNumber: number, { x, y }: { x: number; y: number }) {
    this.documentPageStore.addAnnotation({
      id: uid(),
      pageNumber,
      text: '',
      x,
      y,
    });
  }

  changeAnnotationPosition(pageNumber: number, id: string, { x, y }: { x: number; y: number }) {
    this.documentPageStore.changeAnnotation(pageNumber, id, { x, y });
  }

  changeAnnotationText(pageNumber: number, id: string, text: string) {
    this.documentPageStore.changeAnnotation(pageNumber, id, { text });
  }

  deleteAnnotation(pageNumber: number, id: string) {
    this.documentPageStore.deleteAnnotation(pageNumber, id);
  }

  saveAnnotations(): void {
    this.annotationsApiService.save(this.getAnnotationList());
  }

  private getAnnotationList(): IAnnotation[] {
    const record = this.annotationsRecord();
    if (!record) {
      return [];
    }
    return Object.values(record).flatMap((t) => t);
  }

  private loadDocument(id: string) {
    this.documentPageStore.setIsDocumentLoading(true);
    this.documentsApi
      .getById(id)
      .pipe(
        catchError((e) => {
          console.error('Error fetch document', e);
          this.documentPageStore.setHasDocumentError(true);
          return of(null);
        }),
        finalize(() => {
          this.documentPageStore.setIsDocumentLoading(false);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((document) => {
        this.documentPageStore.setDocument(document);
        if (document) {
          this.documentPageStore.setHasDocumentError(false);
        }
      });
  }
}
