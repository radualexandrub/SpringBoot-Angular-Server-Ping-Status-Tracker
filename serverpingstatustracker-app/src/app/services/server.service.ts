import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CustomResponse } from '../interfaces/custom-response';
import { Server } from '../interfaces/server';
import { Status } from '../enums/status.enum';

/**
 * @author Radu-Alexandru Bulai
 * @version 1.0.0
 * @since 18/07/2023
 */
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

  filterByStatus$ = (status: Status, response: CustomResponse) =>
    <Observable<CustomResponse>>new Observable<CustomResponse>((subscriber) => {
      const servers = response.data?.servers || [];
      const filteredServers =
        status === Status.ALL
          ? servers
          : servers.filter((server) => server.status === status);
      const message =
        filteredServers.length > 0
          ? `Servers filtered by ${status} status`
          : `No servers of ${status} status were found`;

      subscriber.next({
        ...response,
        message,
        data: {
          servers: filteredServers,
        },
      });
      subscriber.complete();
    }).pipe(tap(console.log), catchError(this.handleError));

  searchServersByKeyword$ = (keyword: String, response: CustomResponse) =>
    <Observable<CustomResponse>>new Observable<CustomResponse>((subscriber) => {
      const currentServers = response.data?.servers || [];
      const searchedText = keyword.toLowerCase();
      const resultedServers: Server[] = currentServers.filter(
        (server) =>
          server.name.toLowerCase().indexOf(searchedText) !== -1 ||
          server.ipAddress.toLowerCase().indexOf(searchedText) !== -1 ||
          server.network.toLowerCase().indexOf(searchedText) !== -1
      );
      subscriber.next({
        ...response,
        message: `Servers resulted by ${keyword ? keyword : 'EMPTY'} search`,
        data: {
          servers: resultedServers,
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
