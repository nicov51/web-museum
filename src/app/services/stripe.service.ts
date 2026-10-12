import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  constructor(private readonly http: HttpClient) {}
  createCheckoutSession(
    documentId?: string,
  ): Observable<{ clientSecret: string }> {
    return this.http.post<{ clientSecret: string }>('/api/session-pay', {
      command: documentId,
    });
  }
}
