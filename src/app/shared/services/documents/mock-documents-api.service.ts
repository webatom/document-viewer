import { HttpClient } from '@angular/common/http';
import { inject, Provider } from '@angular/core';
import { Observable } from 'rxjs';
import { IDocument } from '../../models';
import { DocumentApiService } from './documents-api.service';

export const provideMockDocumentsApi: () => Provider[] = () => [
  { provide: DocumentApiService, useClass: MockDocumentApiService },
];

export class MockDocumentApiService implements DocumentApiService {
  private readonly path = 'assets/mock/documents';
  private readonly httpClient = inject(HttpClient);

  getById(id: string): Observable<IDocument> {
    return this.httpClient.get<IDocument>(`${this.path}/${id}.json`);
  }
}
