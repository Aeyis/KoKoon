import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MessageService } from '@core/services/message.service';
import { ThreadMessage } from '@core/models/message.interface';
import { StudentAvatar } from '@shared/components/student-avatar/student-avatar';

@Component({
  selector: 'app-conversation-page',
  imports: [FormsModule, RouterLink, StudentAvatar],
  templateUrl: './conversation-page.html',
  styleUrl: './conversation-page.scss',
})
export class ConversationPage implements OnInit, AfterViewInit {
  private readonly _messageService = inject(MessageService);
  private readonly _route = inject(ActivatedRoute);

  private readonly _scroll = viewChild<ElementRef<HTMLElement>>('scroll');

  private _otherId = 0;
  protected readonly messages = signal<ThreadMessage[]>([]);
  protected readonly otherFirstName = signal('');
  protected readonly otherLastName = signal('');
  protected readonly draft = signal('');
  protected readonly sending = signal(false);

  ngOnInit(): void {
    this._otherId = Number(this._route.snapshot.paramMap.get('userId'));
    this._loadThread();
    this._resolveName();
  }

  ngAfterViewInit(): void {
    this._scrollToBottom();
  }

  private _loadThread(): void {
    this._messageService.getThread(this._otherId).subscribe((list) => {
      this.messages.set(list);
      this._scrollToBottom();
    });
  }

  private _resolveName(): void {
    forkJoin({
      contacts: this._messageService.getContacts(),
      conversations: this._messageService.getConversations(),
    }).subscribe(({ contacts, conversations }) => {
      const fromContact = contacts.find((c) => c.id === this._otherId);
      const fromConv = conversations.find((c) => c.user.id === this._otherId)?.user;
      const u = fromContact ?? fromConv;
      if (u) {
        this.otherFirstName.set(u.firstName);
        this.otherLastName.set(u.lastName);
      }
    });
  }

  protected send(): void {
    const content = this.draft().trim();
    if (!content || this.sending()) return;
    this.sending.set(true);
    this._messageService.send(this._otherId, content).subscribe({
      next: () => {
        this.draft.set('');
        this.sending.set(false);
        this._loadThread();
      },
      error: () => this.sending.set(false),
    });
  }

  protected timeLabel(iso: string): string {
    return new Date(iso).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' });
  }

  private _scrollToBottom(): void {
    setTimeout(() => {
      const el = this._scroll()?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }
}
