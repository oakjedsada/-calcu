import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { DecimalPipe } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import {
  Chart,
  LineController, LineElement, PointElement,
  CategoryScale, LinearScale,
  Tooltip, Legend, Filler,
} from 'chart.js';
import { LoanService, LoanProfile } from '../services/loan';

Chart.register(
  LineController, LineElement, PointElement,
  CategoryScale, LinearScale,
  Tooltip, Legend, Filler,
);

export interface RepaymentRow {
  year: number;
  openingBalance: number;
  principal: number;
  interest: number;
  payment: number;
  closingBalance: number;
}

@Component({
  selector: 'app-loan',
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTableModule,
    MatSnackBarModule,
    MatSelectModule,
    DecimalPipe,
    BaseChartDirective,
  ],
  templateUrl: './loan.html',
  styleUrl: './loan.css',
})
export class Loan implements OnInit {
  private loanService = inject(LoanService);
  private snackBar = inject(MatSnackBar);

  // ข้อมูลฟอร์ม
  profileName = signal('ของฉัน');
  totalBorrowed = signal(150000);
  extraYears = signal(0);
  extraPerYear = signal(30000);
  interestRate = signal(1);
  repaymentYears = signal(15);

  // รายการโปรไฟล์ที่บันทึกไว้
  savedProfiles = signal<LoanProfile[]>([]);
  selectedProfileId = signal<number | null>(null);
  isSaving = signal(false);

  displayedColumns = ['year', 'openingBalance', 'principal', 'interest', 'payment', 'closingBalance'];

  ngOnInit() {
    this.loadProfiles();
  }

  // โหลดรายการโปรไฟล์จาก API
  loadProfiles() {
    this.loanService.getAll().subscribe({
      next: profiles => this.savedProfiles.set(profiles),
      error: () => this.snackBar.open('ไม่สามารถเชื่อมต่อ API ได้', 'ปิด', { duration: 3000 }),
    });
  }

  // โหลดโปรไฟล์ที่เลือกมาใส่ฟอร์ม
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

  // ลบโปรไฟล์
  deleteProfile(profile: LoanProfile, event: MouseEvent) {
    event.stopPropagation(); // ป้องกัน click ลามไปปุ่มโหลด
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

  // บันทึกหรืออัปเดตโปรไฟล์
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

  // สร้างโปรไฟล์ใหม่เปล่าๆ
  newProfile() {
    this.selectedProfileId.set(null);
    this.profileName.set('ของฉัน');
    this.totalBorrowed.set(150000);
    this.extraYears.set(0);
    this.extraPerYear.set(30000);
    this.interestRate.set(1);
    this.repaymentYears.set(15);
  }

  summary = computed(() => {
    const principal = this.totalBorrowed() + this.extraYears() * this.extraPerYear();
    const rate = this.interestRate() / 100;
    const years = this.repaymentYears();

    const annualPayment =
      (principal * rate * Math.pow(1 + rate, years)) / (Math.pow(1 + rate, years) - 1);
    const totalPayment = annualPayment * years;
    const totalInterest = totalPayment - principal;

    const schedule: RepaymentRow[] = [];
    let balance = principal;
    for (let y = 1; y <= years; y++) {
      const interest = balance * rate;
      const principalPaid = annualPayment - interest;
      const closing = balance - principalPaid;
      schedule.push({
        year: y,
        openingBalance: balance,
        principal: principalPaid,
        interest,
        payment: annualPayment,
        closingBalance: Math.max(closing, 0),
      });
      balance = Math.max(closing, 0);
    }

    return { principal, annualPayment, totalPayment, totalInterest, schedule };
  });

  chartData = computed<ChartData<'line'>>(() => {
    const schedule = this.summary().schedule;
    return {
      labels: schedule.map(r => `ปีที่ ${r.year}`),
      datasets: [
        {
          label: 'เงินต้นที่ชำระ',
          data: schedule.map(r => Math.round(r.principal)),
          borderColor: '#1565c0',
          backgroundColor: 'rgba(21, 101, 192, 0.1)',
          borderWidth: 2, pointRadius: 3, fill: true, tension: 0.3,
        },
        {
          label: 'ดอกเบี้ย',
          data: schedule.map(r => Math.round(r.interest)),
          borderColor: '#e65100',
          backgroundColor: 'rgba(230, 81, 0, 0.1)',
          borderWidth: 2, pointRadius: 3, fill: true, tension: 0.3,
        },
        {
          label: 'ยอดคงเหลือ',
          data: schedule.map(r => Math.round(r.closingBalance)),
          borderColor: '#2e7d32',
          backgroundColor: 'rgba(46, 125, 50, 0.1)',
          borderWidth: 2, pointRadius: 3, fill: true, tension: 0.3,
          yAxisID: 'y1',
        },
      ],
    };
  });

  chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: ctx => ` ${ctx.dataset.label}: ${(ctx.parsed.y ?? 0).toLocaleString('th-TH')} บาท`,
        },
      },
    },
    scales: {
      y: {
        title: { display: true, text: 'บาท' },
        ticks: { callback: v => Number(v).toLocaleString('th-TH') },
      },
      y1: {
        position: 'right',
        title: { display: true, text: 'ยอดคงเหลือ (บาท)' },
        ticks: { callback: v => Number(v).toLocaleString('th-TH') },
        grid: { drawOnChartArea: false },
      },
    },
  };
}
