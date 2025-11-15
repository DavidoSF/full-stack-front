import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-shop-page',
  imports: [RouterOutlet],
  templateUrl: './shop-page.html',
  styleUrl: './shop-page.css',
})
export class ShopPage implements OnInit, OnDestroy {
  constructor(private store: Store<AppState>) {}

  ngOnInit() {}

  ngOnDestroy() {}
}
