import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  private readonly defaultConfig: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: 'right',
    verticalPosition: 'top',
  };

  private readonly typeConfig: Record<NotificationType, Partial<MatSnackBarConfig>> = {
    success: {
      panelClass: ['notification-success'],
      duration: 3000,
    },
    error: {
      panelClass: ['notification-error'],
      duration: 8000,
    },
    warning: {
      panelClass: ['notification-warning'],
      duration: 5000,
    },
    info: {
      panelClass: ['notification-info'],
      duration: 4000,
    },
  };

  success(message: string, action = 'Close', config?: MatSnackBarConfig) {
    return this.show(message, action, 'success', config);
  }

  error(message: string, action = 'Close', config?: MatSnackBarConfig) {
    return this.show(message, action, 'error', config);
  }

  warning(message: string, action = 'Close', config?: MatSnackBarConfig) {
    return this.show(message, action, 'warning', config);
  }

  info(message: string, action = 'Close', config?: MatSnackBarConfig) {
    return this.show(message, action, 'info', config);
  }

  show(
    message: string,
    action = 'Close',
    type: NotificationType = 'info',
    config?: MatSnackBarConfig,
  ) {
    const finalConfig = {
      ...this.defaultConfig,
      ...this.typeConfig[type],
      ...config,
    };

    return this.snackBar.open(message, action, finalConfig);
  }

  dismiss() {
    this.snackBar.dismiss();
  }
}
