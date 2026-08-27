import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface LoanProfile {
  id?: number;
  name: string;
  totalBorrowed: number;
  extraYears: number;
  extraPerYear: number;
  interestRate: number;
  repaymentYears: number;
  updatedAt?: string;
}

@Injectable({ providedIn: 'root' })
export class LoanService {
  private http = inject(HttpClient);
  private url = 'http://localhost:5106/api/loan';

  getAll() {
    return this.http.get<LoanProfile[]>(this.url);
  }

  save(profile: LoanProfile) {
    return this.http.post<LoanProfile>(this.url, profile);
  }

  update(profile: LoanProfile) {
    return this.http.put<void>(`${this.url}/${profile.id}`, profile);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
