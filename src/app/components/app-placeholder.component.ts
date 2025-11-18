import { Component } from '@angular/core';
import { Navbar } from './navbar/navbar';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-placeholder',
  imports: [Navbar, RouterOutlet],
  templateUrl: `./app-placeholder.component.html`,
  styles: [],
})
export class AppPlaceholderComponent {}
