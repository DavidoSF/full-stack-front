import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartItem } from '../models/cart-item.model';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss'],
})
export class CartItemComponent {
  @Input() item!: CartItem;
  @Output() quantityChange = new EventEmitter<{ productId: number; quantity: number }>();
  @Output() remove = new EventEmitter<number>();

  increaseQuantity(): void {
    if (this.item.stock === undefined || this.item.quantity < this.item.stock) {
      this.quantityChange.emit({
        productId: this.item.productId,
        quantity: this.item.quantity + 1,
      });
    }
  }

  decreaseQuantity(): void {
    if (this.item.quantity > 1) {
      this.quantityChange.emit({
        productId: this.item.productId,
        quantity: this.item.quantity - 1,
      });
    }
  }

  onQuantityChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const quantity = parseInt(input.value, 10);
    if (!isNaN(quantity) && quantity > 0) {
      this.quantityChange.emit({ productId: this.item.productId, quantity });
    }
  }

  onRemove(): void {
    this.remove.emit(this.item.productId);
  }
}
