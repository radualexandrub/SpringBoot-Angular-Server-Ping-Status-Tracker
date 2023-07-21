import { Component, OnInit } from '@angular/core';
import { ServerService } from './services/server.service';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  of,
  startWith,
} from 'rxjs';
import { AppState } from './interfaces/app-state';
import { CustomResponse } from './interfaces/custom-response';
import { DataState } from './enums/data-state.enum';
import { Status } from './enums/status.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  appState$!: Observable<AppState<CustomResponse>>;
  readonly Status = Status;
  readonly DataState = DataState;
  private filterSubjectWhenPinging = new BehaviorSubject<string>('');
  readonly filterStatusWhenPinging$ =
    this.filterSubjectWhenPinging.asObservable();

  constructor(private serverService: ServerService) {}

  ngOnInit(): void {
    this.appState$ = this.serverService.servers$.pipe(
      map((response) => {
        return { dataState: DataState.LOADED_STATE, appData: response };
      }),
      startWith({ dataState: DataState.LOADING_STATE }),
      catchError((error: string) => {
        return of({ dataState: DataState.ERROR_STATE, error });
      })
    );
  }
}
