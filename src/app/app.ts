import { Component } from '@angular/core';
import { Navbar } from './navbar/navbar';
import { Footer } from './footer/footer';
import { Loan } from './loan/loan';
import { Sidebar } from './sidebar/sidebar';

@Component({
  selector: 'app-root',
  imports: [Navbar, Footer, Loan, Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
