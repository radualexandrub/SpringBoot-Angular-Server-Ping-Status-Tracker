import { Injectable } from '@angular/core';
import { NotifierService } from 'angular-notifier';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly notifier: NotifierService;

  constructor(notifierService: NotifierService) {
    this.notifier = notifierService;
  }

  onDefaultMessage(message: string) {
    this.notifier.notify(Type.DEFAULT, message);
  }
  onInfoMessage(message: string) {
    this.notifier.notify(Type.INFO, message);
  }
  onSuccessMessage(message: string) {
    this.notifier.notify(Type.SUCCESS, message);
  }
  onWarningMessage(message: string) {
    this.notifier.notify(Type.WARNING, message);
  }
  onErrorMessage(message: string) {
    this.notifier.notify(Type.ERROR, message);
  }
}

enum Type {
  DEFAULT = 'default',
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}
