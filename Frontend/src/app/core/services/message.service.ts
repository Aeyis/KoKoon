import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env';
import { Contact, Conversation, ThreadMessage } from '@core/models/message.interface';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private readonly _http = inject(HttpClient);
  private readonly _apiUrl = environment.apiURL;

  getConversations(): Observable<Conversation[]> {
    return this._http.get<Conversation[]>(`${this._apiUrl}messages/conversations`);
  }

  getContacts(): Observable<Contact[]> {
    return this._http.get<Contact[]>(`${this._apiUrl}messages/contacts`);
  }

  getThread(otherId: number): Observable<ThreadMessage[]> {
    return this._http.get<ThreadMessage[]>(`${this._apiUrl}messages/thread/${otherId}`);
  }

  send(recipientId: number, content: string): Observable<unknown> {
    return this._http.post(`${this._apiUrl}messages`, { recipientId, content });
  }
}
