import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LoanService, LoanProfile } from '../services/loan';

@Component({
  selector: 'app-loan-form',
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './loan-form.html',
  styleUrl: './loan-form.css',
})
export class LoanForm implements OnInit {
  private loanService = inject(LoanService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  profileName = signal('ของฉัน');
  totalBorrowed = signal(150000);
  extraYears = signal(0);
  extraPerYear = signal(30000);
  interestRate = signal(1);
  repaymentYears = signal(15);

  savedProfiles = signal<LoanProfile[]>([]);
  selectedProfileId = signal<number | null>(null);
  isSaving = signal(false);

  ngOnInit() {
    this.loadProfiles();
  }

  loadProfiles() {
    this.loanService.getAll().subscribe({
      next: profiles => this.savedProfiles.set(profiles),
      error: () => this.snackBar.open('ไม่สามารถเชื่อมต่อ API ได้', 'ปิด', { duration: 3000 }),
    });
  }

  loadSelected(profile: LoanProfile) {
    this.selectedProfileId.set(profile.id ?? null);
    this.profileName.set(profile.name);
    this.totalBorrowed.set(profile.totalBorrowed);
    this.extraYears.set(profile.extraYears);
    this.extraPerYear.set(profile.extraPerYear);
    this.interestRate.set(profile.interestRate);
    this.repaymentYears.set(profile.repaymentYears);
    this.snackBar.open(`โหลด "${profile.name}" แล้ว`, '', { duration: 2000 });
  }

  deleteProfile(profile: LoanProfile, event: MouseEvent) {
    event.stopPropagation();
    if (!profile.id) return;
    this.loanService.delete(profile.id).subscribe({
      next: () => {
        this.snackBar.open(`ลบ "${profile.name}" แล้ว`, '', { duration: 2000 });
        if (this.selectedProfileId() === profile.id) this.newProfile();
        this.loadProfiles();
      },
      error: () => this.snackBar.open('ลบไม่สำเร็จ', 'ปิด', { duration: 3000 }),
    });
  }

  saveProfile() {
    this.isSaving.set(true);
    const profile: LoanProfile = {
      id: this.selectedProfileId() ?? undefined,
      name: this.profileName(),
      totalBorrowed: this.totalBorrowed(),
      extraYears: this.extraYears(),
      extraPerYear: this.extraPerYear(),
      interestRate: this.interestRate(),
      repaymentYears: this.repaymentYears(),
    };

    const onSuccess = () => {
      this.snackBar.open('บันทึกสำเร็จ ✓', '', { duration: 2000 });
      this.loadProfiles();
      this.isSaving.set(false);
    };
    const onError = () => {
      this.snackBar.open('บันทึกไม่สำเร็จ', 'ปิด', { duration: 3000 });
      this.isSaving.set(false);
    };

    if (profile.id) {
      this.loanService.update(profile).subscribe({ next: onSuccess, error: onError });
    } else {
      this.loanService.save(profile).subscribe({ next: onSuccess, error: onError });
    }
  }

  newProfile() {
    this.selectedProfileId.set(null);
    this.profileName.set('ของฉัน');
    this.totalBorrowed.set(150000);
    this.extraYears.set(0);
    this.extraPerYear.set(30000);
    this.interestRate.set(1);
    this.repaymentYears.set(15);
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
