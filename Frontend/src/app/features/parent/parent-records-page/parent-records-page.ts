import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MeService } from '@core/services/me.service';
import { Student } from '@core/models/student.interface';
import { ParentProfile } from '@core/models/parent-profile.interface';

@Component({
  selector: 'app-parent-records-page',
  imports: [FormsModule],
  templateUrl: './parent-records-page.html',
  styleUrl: './parent-records-page.scss',
})
export class ParentRecordsPage implements OnInit {
  private readonly _meService = inject(MeService);

  protected readonly children = signal<Student[]>([]);
  protected readonly selectedChildId = signal<number | null>(null);

  // parent contact
  protected readonly profile = signal<ParentProfile | null>(null);
  protected readonly phone = signal('');
  protected readonly address = signal('');
  protected readonly savingProfile = signal(false);
  protected readonly profileSaved = signal(false);

  // child medical
  protected readonly allergies = signal('');
  protected readonly diet = signal('');
  protected readonly medicalConditions = signal('');
  protected readonly emergencyContact = signal('');
  protected readonly savingMedical = signal(false);
  protected readonly medicalSaved = signal(false);

  ngOnInit(): void {
    this._meService.getProfile().subscribe((p) => {
      this.profile.set(p);
      this.phone.set(p.phone ?? '');
      this.address.set(p.address ?? '');
    });

    this._meService.getChildren().subscribe((list) => {
      this.children.set(list);
      const first = list[0]?.id ?? null;
      this.selectedChildId.set(first);
      if (first != null) this._loadMedical(first);
    });
  }

  protected selectChild(id: number): void {
    this.selectedChildId.set(id);
    this.medicalSaved.set(false);
    this._loadMedical(id);
  }

  private _loadMedical(childId: number): void {
    this._meService.getChildMedical(childId).subscribe((m) => {
      this.allergies.set(m.allergies ?? '');
      this.diet.set(m.diet ?? '');
      this.medicalConditions.set(m.medicalConditions ?? '');
      this.emergencyContact.set(m.emergencyContact ?? '');
    });
  }

  protected saveProfile(): void {
    this.savingProfile.set(true);
    this.profileSaved.set(false);
    this._meService
      .updateProfile({ phone: this.phone(), address: this.address() })
      .subscribe((p) => {
        this.profile.set(p);
        this.savingProfile.set(false);
        this.profileSaved.set(true);
      });
  }

  protected saveMedical(): void {
    const id = this.selectedChildId();
    if (id == null) return;
    this.savingMedical.set(true);
    this.medicalSaved.set(false);
    this._meService
      .updateChildMedical(id, {
        allergies: this.allergies(),
        diet: this.diet(),
        medicalConditions: this.medicalConditions(),
        emergencyContact: this.emergencyContact(),
      })
      .subscribe(() => {
        this.savingMedical.set(false);
        this.medicalSaved.set(true);
      });
  }
}
