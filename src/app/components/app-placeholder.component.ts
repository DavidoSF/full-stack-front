import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-placeholder',
  imports: [RouterLink],
  templateUrl: `./app-placeholder.component.html`,
})
export class AppPlaceholderComponent {}
