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
    this.onGetServers();
  }

  onGetServers(): void {
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

  onGetPingedServers(): void {
    this.appState$ = this.serverService.getPingedServers$().pipe(
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

  onSearchServers(keyword: String): void {
    this.appState$ = this.serverService
      .searchServersByKeyword$(
        keyword,
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

  onAddServers(servers: Server[]): void {
    this.appState$ = this.serverService.addServers$(servers).pipe(
      map((response) => {
        const currentServers =
          this.currentServersCopyDataSubject.value?.data?.servers || [];
        this.currentServersCopyDataSubject.next({
          ...response,
          data: {
            servers: [...currentServers, ...response.data.servers!],
          },
        });
        document.getElementById('closeAddModal')?.click();
        return {
          dataState: DataState.LOADED_STATE,
          appData: this.currentServersCopyDataSubject.value,
        };
      }),
      startWith({ dataState: DataState.LOADING_STATE }),
      catchError((error: string) => {
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

  onDeleteAllServers(): void {
    this.appState$ = this.serverService.deleteAllServers$().pipe(
      map((response) => {
        this.currentServersCopyDataSubject.next({
          ...response,
          data: {
            servers: [],
          },
        });
        return {
          dataState: DataState.LOADED_STATE,
          appData: this.currentServersCopyDataSubject.value,
        };
      }),
      startWith({ dataState: DataState.LOADING_STATE }),
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

  onExportListAsJSON(): void {
    const filename = `ServersList_${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    const currentServers =
      this.currentServersCopyDataSubject.value?.data?.servers;
    let element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(currentServers))
    );
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  onImportListAsJSON(event: Event): void {
    event.preventDefault();
    let filePathInput = document.getElementById(
      'JSONFileInput'
    ) as HTMLInputElement;
    let importFileOutputMessage = document.getElementById(
      'importJSONFileFormOutputMessages'
    ) as HTMLInputElement;

    if (!filePathInput.files || filePathInput.files.length === 0) {
      importFileOutputMessage.innerHTML =
        '<p class="text-danger">Please select a file to continue.</p>';
      return;
    }

    const importListAsJSONonloadCallback = (
      event: ProgressEvent<FileReader>
    ) => {
      const methodName = 'importListAsJSONonloadCallback()';
      if (!event.target || !event.target.result) {
        console.error(`${methodName} JSON parsing error`);
        importFileOutputMessage.innerHTML =
          '<p class="text-danger">File parsing failed. Please try again.</p>';
        return;
      }

      let serversListFromJSON = <Server[]>(
        JSON.parse(event.target.result as string)
      );
      console.debug(
        `${methodName} JSON read ${JSON.stringify(serversListFromJSON)}`
      );

      // Concatenate or Overwrite to current Tasks list
      let radioInput = (
        Array.from(document.getElementsByName('JSONFileRadioInputs')).find(
          (r) => (r as HTMLInputElement).checked
        ) as HTMLInputElement
      ).value;

      if (radioInput === 'JSONFileRadioConcatenateList') {
        this.onAddServers(serversListFromJSON);
        importFileOutputMessage.innerHTML = `<p>Current list was concatenated with list from file.</p>`;
      } else if (radioInput === 'JSONFileRadioOverwriteList') {
        /* Note: We cannot call the methods directly since onAddServers() method
         * will not wait until onDeleteAllServers() finishes
         * this.onDeleteAllServers();
         * this.onAddServers(serversListFromJSON);
         */
        this.onDeleteAllServers();
        setTimeout(() => this.onAddServers(serversListFromJSON), 100);
        importFileOutputMessage.innerHTML = `<p>Current list was overwriten with list from file.</p>`;
      }
      (
        document.getElementById('importJSONFileForm') as HTMLFormElement
      ).reset();
    };

    let reader = new FileReader();
    reader.onload = importListAsJSONonloadCallback;
    reader.readAsText(filePathInput.files[0]);
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
