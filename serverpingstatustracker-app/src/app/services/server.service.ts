import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CustomResponse } from '../interfaces/custom-response';
import { Server } from '../interfaces/server';
import { Status } from '../enums/status.enum';

@Injectable({ providedIn: 'root' })
export class ServerService {
  private readonly apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  servers$ = <Observable<CustomResponse>>(
    this.http
      .get<CustomResponse>(`${this.apiUrl}/servers`)
      .pipe(tap(console.log), catchError(this.handleError))
  );

  getServersPinged$ = () =>
    <Observable<CustomResponse>>(
      this.http
        .get<CustomResponse>(`${this.apiUrl}/servers/ping`)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  filter$ = (status: Status, response: CustomResponse) =>
    <Observable<CustomResponse>>new Observable<CustomResponse>((subscriber) => {
      console.log(response);
      const servers = response.data?.servers || [];
      const filteredServers = servers.filter(
        (server) => server.status === status
      );

      const message =
        status === Status.ALL
          ? `Servers filtered by ${status} status`
          : filteredServers.length > 0
          ? `Servers filtered by ${
              status === Status.SERVER_UP ? 'SERVER UP' : 'SERVER DOWN'
            } status`
          : `No servers of ${status} found`;

      subscriber.next({
        ...response,
        message,
        data: {
          servers: filteredServers,
        },
      });
      subscriber.complete();
    }).pipe(tap(console.log), catchError(this.handleError));

  getServerById$ = (serverId: number) =>
    <Observable<CustomResponse>>(
      this.http
        .get<CustomResponse>(`${this.apiUrl}/servers/${serverId}`)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  addServer$ = (server: Server) =>
    <Observable<CustomResponse>>(
      this.http
        .post<CustomResponse>(`${this.apiUrl}/servers`, server)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  updateServer$ = (server: Server) =>
    <Observable<CustomResponse>>(
      this.http
        .put<CustomResponse>(`${this.apiUrl}/servers`, server)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  deleteServerById$ = (serverId: number) =>
    <Observable<CustomResponse>>(
      this.http
        .delete<CustomResponse>(`${this.apiUrl}/servers/${serverId}`)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  pingServerById$ = (serverId: number) =>
    <Observable<CustomResponse>>(
      this.http
        .get<CustomResponse>(`${this.apiUrl}/servers/${serverId}/ping`)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  pingServerByIpAddress$ = (ipAddress: string) =>
    <Observable<CustomResponse>>(
      this.http
        .get<CustomResponse>(`${this.apiUrl}/servers/ping/${ipAddress}`)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  // TODO: Verify if this method is valid or if it can be improved
  handleError(error: HttpErrorResponse): Observable<never> {
    console.error(error);

    let errorMessage: string;
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `An error occurred: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}, Message: ${error.message}`;
    }

    return throwError(() => new Error(errorMessage));
  }
}
