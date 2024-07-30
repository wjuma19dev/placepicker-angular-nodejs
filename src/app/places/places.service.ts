import { inject, Injectable, signal } from '@angular/core';
import { IPlace, IResponse, Place } from './place.model';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment.development';
import { catchError, map, Observable, tap, throwError } from 'rxjs';

// 'An error occurred while fetching places ...'

@Injectable({
  providedIn: 'root',
})
export class PlacesService {

  private http = inject(HttpClient);
  private userPlaces = signal<Place[]>([]);
  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces(): Observable<IPlace[]> {
    return this.fetchPlaces('places', 'An error occurred while fetching places...')
  }

  loadUserPlaces() {
    return this.fetchPlaces('user-places', 'An error courred trying to load user places')
    .pipe(
      tap({
        next: (userPlaces) => this.userPlaces.set(userPlaces)
      })
    );
  }

  addPlaceToUserPlaces(place: Place): Observable<any> {

    const prevPlaces = this.loadedUserPlaces();

    if(!this.loadedUserPlaces().some(p => p.id === place.id)) {
      this.userPlaces.set([...prevPlaces, place]);
    }

    return this.http.put(`${environment.baseURL}/user-places`, { placeId: place.id })
    .pipe(
      catchError(() => {
        return throwError(() => { 
          this.userPlaces.set(prevPlaces);
          new Error('An error occurred while adding place to user places')
        })
      })
    );
  }

  fetchPlaces(url: string, errorMessage: string): Observable<IPlace[]> {
    return this.http
      .get<IResponse>(`${environment.baseURL}/${url}`)
      .pipe(
        map((resData) => resData.places),
        catchError(() => {
          return throwError(() => new Error(errorMessage))
        })
      )
  }

  removeUserPlace(place: Place) {}
}
