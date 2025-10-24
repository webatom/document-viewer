import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAnnotation } from '../../models';

@Injectable({ providedIn: 'root' })
export class AnnotationsApiService {
  save(list: IAnnotation[]): Observable<IAnnotation[]> {
    throw 'Unimplemented';
  }
}
