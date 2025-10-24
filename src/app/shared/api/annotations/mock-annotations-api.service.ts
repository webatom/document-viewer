import { Provider } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IAnnotation } from '../../models';
import { AnnotationsApiService } from './annotations-api.service';

export const provideMockAnnotationsApi: () => Provider[] = () => [
  { provide: AnnotationsApiService, useClass: MockAnnotationsApiService },
];

export class MockAnnotationsApiService implements AnnotationsApiService {
  save(annotations: IAnnotation[]): Observable<IAnnotation[]> {
    if (annotations.length === 0) {
      console.log('Annotations is empty');
    }

    const groupedAnnotations = Object.groupBy(annotations, ({ pageNumber }) => pageNumber);
    for (const [pageNumber, annotationList] of Object.entries(groupedAnnotations)) {
      console.groupCollapsed(`Page ${pageNumber}:`);
      console.table(annotationList);
      console.groupEnd();
    }

    return of(annotations);
  }
}
