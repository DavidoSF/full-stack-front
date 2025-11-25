import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { selectCartCount } from './state/cart.selectors';
import { AppState } from '../../../store/app.state';

@Component({
  selector: 'app-cart-icon',
  standalone: true,
  imports: [CommonModule, MatTooltipModule],
  templateUrl: './cart-icon.component.html',
  styleUrls: ['./cart-icon.component.scss'],
})
export class CartIconComponent implements OnInit {
  @Input() showTooltip = false;
  cartCount$!: Observable<number>;

  constructor(
    private store: Store<AppState>,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.cartCount$ = this.store.select(selectCartCount);
  }

  navigateToCart(): void {
    this.router.navigate(['/shop/cart']);
  }
}
