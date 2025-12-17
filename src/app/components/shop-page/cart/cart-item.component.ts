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
    if (this.item.stock !== undefined && this.item.quantity >= this.item.stock) {
      return;
    }

    this.quantityChange.emit({
      productId: this.item.productId,
      quantity: this.item.quantity + 1,
    });
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
    let quantity = parseInt(input.value, 10);

    if (isNaN(quantity) || quantity < 1) {
      quantity = 1;
    }

    if (this.item.stock !== undefined && quantity > this.item.stock) {
      quantity = this.item.stock;
      input.value = quantity.toString();
    }

    if (quantity > 0) {
      this.quantityChange.emit({ productId: this.item.productId, quantity });
    }
  }

  onRemove(): void {
    this.remove.emit(this.item.productId);
  }

  getStockWarning(): string | null {
    if (this.item.stock === undefined) {
      return null;
    }

    if (this.item.stock === 0) {
      return 'This item is out of stock';
    }

    if (this.item.quantity > this.item.stock) {
      return `Only ${this.item.stock} available`;
    }

    return null;
  }

  showLowStockWarning(): boolean {
    return this.item.stock !== undefined && this.item.stock > 0 && this.item.stock < 10;
  }
}
