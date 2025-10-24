import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IAnnotation, IDocument } from '../../../shared';

interface IDocumentPageState {
  document: IDocument | null;
  isDocumentLoading: boolean;
  hasDocumentError: boolean;
  annotationsRecord: Record<IAnnotation['pageNumber'], IAnnotation[]>;
}

@Injectable()
export class DocumentPageStore {
  private readonly state$$ = new BehaviorSubject<IDocumentPageState>({
    document: null,
    hasDocumentError: false,
    isDocumentLoading: false,
    annotationsRecord: {},
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

  addAnnotation(annotation: IAnnotation) {
    const annotationsRecord = structuredClone(this.state$$.value.annotationsRecord);
    const existAnnotations = annotationsRecord[annotation.pageNumber] ?? null;
    if (existAnnotations) {
      annotationsRecord[annotation.pageNumber] = existAnnotations.concat(annotation);
    } else {
      annotationsRecord[annotation.pageNumber] = [annotation];
    }
    this.updateState({ annotationsRecord });
  }

  changeAnnotation(
    pageNumber: number,
    id: string,
    { x, y, text }: Partial<Pick<IAnnotation, 'x' | 'y' | 'text'>>,
  ) {
    const annotationsRecord = structuredClone(this.state$$.value.annotationsRecord);
    const pagesAnnotations = annotationsRecord[pageNumber] ?? null;
    if (!pagesAnnotations) {
      return;
    }
    annotationsRecord[pageNumber] = pagesAnnotations.map((a) =>
      a.id === id ? { ...a, x: x ?? a.x, y: y ?? a.y, text: text ?? a.text } : a,
    );
    this.updateState({ annotationsRecord });
  }

  deleteAnnotation(pageNumber: number, id: string) {
    const annotationsRecord = structuredClone(this.state$$.value.annotationsRecord);
    const pagesAnnotations = annotationsRecord[pageNumber] ?? null;
    if (!pagesAnnotations) {
      return;
    }
    annotationsRecord[pageNumber] = pagesAnnotations.filter((a) => a.id !== id);
    this.updateState({ annotationsRecord });
  }

  private updateState(updated: Partial<IDocumentPageState>): void {
    this.state$$.next({ ...this.state$$.value, ...updated });
  }
}
