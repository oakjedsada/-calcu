import { Component } from '@angular/core';
import { Navbar } from './navbar/navbar';
import { Footer } from './footer/footer';
import { Loan } from './loan/loan';

@Component({
  selector: 'app-root',
  imports: [Navbar, Footer, Loan],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
