import { Component, input, output, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

export interface CommentTerm {
  id: number;
  label: string;
}

/**
 * Bloc "appréciation du titulaire" : affiche le commentaire de la période
 * sélectionnée et ouvre une feuille d'édition. La persistance reste au parent.
 */
@Component({
  selector: 'app-comment-card',
  imports: [MatIcon],
  templateUrl: './comment-card.html',
  styleUrl: './comment-card.scss',
})
export class CommentCard {
  readonly title = input('Teacher comment');
  readonly placeholder = input('Write a comment for the parents…');
  readonly text = input<string | null>(null);
  readonly terms = input<CommentTerm[]>([]);
  readonly periodId = input<number | null>(null);

  readonly periodChanged = output<number>();
  readonly saved = output<string>();

  protected readonly editing = signal(false);
  protected readonly draft = signal('');

  protected open(): void {
    this.draft.set(this.text() ?? '');
    this.editing.set(true);
  }

  protected submit(): void {
    this.saved.emit(this.draft().trim());
    this.editing.set(false);
  }
}
