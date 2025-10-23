import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IDocument } from '../../../shared';

interface IDocumentPageState {
  document: IDocument | null;
  isDocumentLoading: boolean;
  hasDocumentError: boolean;
  //   @todo
  //   annotations: any[];
}

@Injectable()
export class DocumentPageStore {
  private readonly state$$ = new BehaviorSubject<IDocumentPageState>({
    document: null,
    hasDocumentError: false,
    isDocumentLoading: false,
    // annotations: [],
  });

  public readonly state$ = this.state$$.asObservable();

  setIsDocumentLoading(isDocumentLoading: boolean): void {
    this.updateState({ isDocumentLoading });
  }

  setHasDocumentError(hasDocumentError: boolean): void {
    this.updateState({ hasDocumentError });
  }

  setDocument(document: IDocument | null): void {
    this.updateState({ document });
  }

  private updateState(updated: Partial<IDocumentPageState>): void {
    this.state$$.next({ ...this.state$$.value, ...updated });
  }
}
