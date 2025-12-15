import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ProductModel } from '../../models/product.model';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, RouterModule],
  templateUrl: './product-item.html',
  styleUrls: ['./product-item.scss'],
})
export class ProductItem {
  @Input() product: ProductModel | undefined;

  getStockStatus(): { message: string; cssClass: string } {
    if (!this.product) {
      return { message: '', cssClass: '' };
    }

    const { stock, lowStockThreshold } = this.product;

    if (stock === 0) {
      return { message: 'Out of stock', cssClass: 'out-of-stock' };
    } else if (stock > 0 && stock <= lowStockThreshold) {
      return { message: `Only ${stock} left`, cssClass: 'low-stock' };
    } else {
      return { message: 'In stock', cssClass: 'in-stock' };
    }
  }
}
