import { DestroyRef, inject, Injectable } from '@angular/core';
import { catchError, finalize, map, of } from 'rxjs';
import { DocumentApiService } from '../../shared';
import { ActivatedRoute } from '@angular/router';
import { DocumentPageStore } from './store/document-page.store';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

@Injectable()
export class DocumentPageService {
  private readonly documentApi = inject(DocumentApiService);
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

  init() {
    const documentId = this.activatedRoute.snapshot.paramMap.get('id');
    if (!documentId) {
      console.error('The `documentName` param not found');
      this.documentPageStore.setHasDocumentError(true);
      return;
    }

    this.loadDocument(documentId);
  }

  private loadDocument(id: string) {
    this.documentPageStore.setIsDocumentLoading(true);
    this.documentApi
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
