import { HttpClient } from '@angular/common/http';
import { inject, Provider } from '@angular/core';
import { Observable } from 'rxjs';
import { IDocument } from '../../models';
import { DocumentsApiService } from './documents-api.service';

export const provideMockDocumentsApi: () => Provider[] = () => [
  { provide: DocumentsApiService, useClass: MockDocumentsApiService },
];

export class MockDocumentsApiService implements DocumentsApiService {
  private readonly path = 'assets/mock/documents';
  private readonly httpClient = inject(HttpClient);

  getById(id: string): Observable<IDocument> {
    return this.httpClient.get<IDocument>(`${this.path}/${id}.json`);
  }
}
