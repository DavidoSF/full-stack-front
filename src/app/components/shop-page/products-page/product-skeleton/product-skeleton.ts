import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-product-skeleton',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './product-skeleton.html',
  styleUrls: ['./product-skeleton.scss'],
})
export class ProductSkeleton {}
