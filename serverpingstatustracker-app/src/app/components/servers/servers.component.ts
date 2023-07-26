import { Component, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  of,
  startWith,
} from 'rxjs';
import { NgForm } from '@angular/forms';
import { ServerService } from '../../services/server.service';
import { AppState } from '../../interfaces/app-state';
import { CustomResponse } from '../../interfaces/custom-response';
import { DataState } from '../../enums/data-state.enum';
import { Status } from '../../enums/status.enum';
import { Server } from '../../interfaces/server';

/**
 * @author Radu-Alexandru Bulai
 * @version 1.0.0
 * @since 26/07/2023
 */
@Component({
  selector: 'app-servers',
  templateUrl: './servers.component.html',
  styleUrls: ['./servers.component.css'],
})
export class ServersComponent implements OnInit {
  appState$!: Observable<AppState<CustomResponse>>;
  private editServerSubject = new BehaviorSubject<Server>(null!);
  readonly editServer$ = this.editServerSubject.asObservable();

  readonly Status = Status;
  readonly DataState = DataState;
  private ipAddressSubjectWhenPinging = new BehaviorSubject<string>('');
  readonly ipAddressStatusWhenPinging$ =
    this.ipAddressSubjectWhenPinging.asObservable();
  private currentServersCopyDataSubject = new BehaviorSubject<CustomResponse>(
    null!
  );
  // Assert that null can be assigned by using the non-null assertion operator !
  // This assumes that the data passed to serversDataCopySubject (the UI copy of servers)
  // will be updated before any subscribers access it, ensuring that it won't actually be null.
  private statusSubject = new BehaviorSubject<Status>(
    Status['ALL' as keyof typeof Status]
  );
  private isServerRequestLoadingSubject = new BehaviorSubject<boolean>(false);
  readonly isServerRequestLoading$ =
    this.isServerRequestLoadingSubject.asObservable();

  constructor(private serverService: ServerService) {}

  ngOnInit(): void {
    this.appState$ = this.serverService.servers$.pipe(
      map((response) => {
        this.currentServersCopyDataSubject.next(response);
        return { dataState: DataState.LOADED_STATE, appData: response };
      }),
      startWith({ dataState: DataState.LOADING_STATE }),
      catchError((error: string) => {
        return of({ dataState: DataState.ERROR_STATE, error });
      })
    );
  }

  onPingServerByItsIpAddress(ipAddress: string): void {
    // Assign ip string to show a spinning loading icon while pinging
    this.ipAddressSubjectWhenPinging.next(ipAddress);
    this.appState$ = this.serverService.pingServerByIpAddress$(ipAddress).pipe(
      map((response) => {
        const serversCopy =
          this.currentServersCopyDataSubject.value.data.servers;
        const indexOfPingedServer = serversCopy!.findIndex(
          (server) => server.id === response.data.server!.id
        );
        // Update the Server from serversCopy in UI after it has been pinged
        serversCopy![indexOfPingedServer] = response.data.server!;
        // Assign empty string to stop showing spinning loading icon
        this.ipAddressSubjectWhenPinging.next('');
        return {
          dataState: DataState.LOADED_STATE,
          appData: this.currentServersCopyDataSubject.value,
        };
      }),
      startWith({
        dataState: DataState.LOADED_STATE,
        appData: this.currentServersCopyDataSubject.value,
      }),
      catchError((error: string) => {
        this.ipAddressSubjectWhenPinging.next('');
        return of({ dataState: DataState.ERROR_STATE, error });
      })
    );
  }

  onFilterServersByStatus(event: Event): void {
    const statusValue: String = (event.target as HTMLInputElement).value;
    this.statusSubject.next(Status[statusValue as keyof typeof Status]);
    this.appState$ = this.serverService
      .filterByStatus$(
        this.statusSubject.value,
        this.currentServersCopyDataSubject.value
      )
      .pipe(
        map((response) => {
          return {
            dataState: DataState.LOADED_STATE,
            appData: response,
          };
        }),
        startWith({
          dataState: DataState.LOADED_STATE,
          appData: this.currentServersCopyDataSubject.value,
        }),
        catchError((error: string) => {
          return of({ dataState: DataState.ERROR_STATE, error });
        })
      );
  }

  onAddServer(addServerForm: NgForm): void {
    this.isServerRequestLoadingSubject.next(true);
    this.appState$ = this.serverService
      .addServer$(addServerForm.value as Server)
      .pipe(
        map((response) => {
          const currentServers =
            this.currentServersCopyDataSubject.value?.data?.servers || [];
          this.currentServersCopyDataSubject.next({
            ...response,
            data: {
              servers: [...currentServers, response.data.server!],
            },
          });
          addServerForm.resetForm({ status: this.Status.SERVER_DOWN });
          this.isServerRequestLoadingSubject.next(false);
          document.getElementById('closeAddModal')?.click();
          return {
            dataState: DataState.LOADED_STATE,
            appData: this.currentServersCopyDataSubject.value,
          };
        }),
        startWith({
          dataState: DataState.LOADED_STATE,
          appData: this.currentServersCopyDataSubject.value,
        }),
        catchError((error: string) => {
          this.isServerRequestLoadingSubject.next(false);
          return of({ dataState: DataState.ERROR_STATE, error });
        })
      );
  }

  onDeleteServer(server: Server): void {
    this.appState$ = this.serverService.deleteServerById$(server.id).pipe(
      map((response) => {
        this.currentServersCopyDataSubject.next({
          ...response,
          data: {
            servers:
              this.currentServersCopyDataSubject.value.data.servers?.filter(
                (serverToDelete) => serverToDelete.id !== server.id
              ),
          },
        });
        return {
          dataState: DataState.LOADED_STATE,
          appData: this.currentServersCopyDataSubject.value,
        };
      }),
      startWith({
        dataState: DataState.LOADED_STATE,
        appData: this.currentServersCopyDataSubject.value,
      }),
      catchError((error: string) => {
        return of({ dataState: DataState.ERROR_STATE, error });
      })
    );
  }

  onUpdateServer(updateServerForm: NgForm): void {
    this.isServerRequestLoadingSubject.next(true);
    this.appState$ = this.serverService
      .updateServer$(updateServerForm.value as Server)
      .pipe(
        map((response) => {
          const currentServers =
            this.currentServersCopyDataSubject.value?.data?.servers;
          const indexOfUpdatedServer = currentServers!.findIndex(
            (server) => server.id === response.data.server!.id
          );
          currentServers![indexOfUpdatedServer] = response.data.server!;
          this.isServerRequestLoadingSubject.next(false);
          document.getElementById('closeEditModal')?.click();
          return {
            dataState: DataState.LOADED_STATE,
            appData: this.currentServersCopyDataSubject.value,
          };
        }),
        startWith({
          dataState: DataState.LOADED_STATE,
          appData: this.currentServersCopyDataSubject.value,
        }),
        catchError((error: string) => {
          this.isServerRequestLoadingSubject.next(false);
          return of({ dataState: DataState.ERROR_STATE, error });
        })
      );
  }

  onOpenModal(server: Server, modalMode: String): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');

    if (modalMode == 'add') {
      this.editServerSubject.next(server);
      button.setAttribute('data-target', '#addServerModal');
    }
    if (modalMode == 'edit') {
      this.editServerSubject.next(server);
      button.setAttribute('data-target', '#editServerModal');
    }
    container?.appendChild(button);
    button.click();
    button.remove();
  }
}
