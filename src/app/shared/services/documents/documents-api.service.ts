import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IDocument } from '../../models';

@Injectable({ providedIn: 'root' })
export class DocumentApiService {
  getById(id: string): Observable<IDocument> {
    throw 'Unimplemented';
  }
}
