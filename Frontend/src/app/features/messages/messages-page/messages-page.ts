import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MessageService } from '@core/services/message.service';
import { Contact, Conversation } from '@core/models/message.interface';
import { StudentAvatar } from '@shared/components/student-avatar/student-avatar';

@Component({
  selector: 'app-messages-page',
  imports: [RouterLink, StudentAvatar],
  templateUrl: './messages-page.html',
  styleUrl: './messages-page.scss',
})
export class MessagesPage implements OnInit {
  private readonly _messageService = inject(MessageService);

  protected readonly conversations = signal<Conversation[]>([]);
  protected readonly contacts = signal<Contact[]>([]);
  protected readonly showContacts = signal(false);

  ngOnInit(): void {
    this._messageService.getConversations().subscribe((c) => this.conversations.set(c));
    this._messageService.getContacts().subscribe((c) => this.contacts.set(c));
  }

  protected preview(text: string): string {
    return text.length > 48 ? text.slice(0, 48) + '…' : text;
  }

  protected timeLabel(iso: string): string {
    const d = new Date(iso);
    const now = new Date();
    const sameDay = d.toDateString() === now.toDateString();
    return sameDay
      ? d.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })
      : d.toLocaleDateString('en', { day: 'numeric', month: 'short' });
  }
}
