import { inject, Injectable, signal } from '@angular/core';
import { IPlace, IResponse, Place } from './place.model';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment.development';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { ErrorService } from '../shared/error.service';


@Injectable({
  providedIn: 'root',
})
export class PlacesService {

  private errorService = inject(ErrorService);
  private http = inject(HttpClient);
  private userPlaces = signal<Place[]>([]);
  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces(): Observable<IPlace[]> {
    return this.fetchPlaces('places', 'An error occurred while fetching places...')
  }

  loadUserPlaces() {
    return this.fetchPlaces('user-places', 'An error occurred while fetching favorite places ...')
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
    } else {
      this.errorService.showError(`${place.title} is already added to favorites`);
    }


    return this.http.put(`${environment.baseURL}/user-places`, { placeId: place.id })
    .pipe(
      catchError(() => {
        return throwError(() => { 
          this.userPlaces.set(prevPlaces);
          // here show modal dialog error 
          this.errorService.showError(`An error occurred while adding place ${place.title} to favorites.`);
          return new Error(`An error occurred while adding place ${place.title} to favorites.`);
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

  removeUserPlace(place: Place) {

    const confirmRemovePlaceFromFavorite = window.confirm('Are you sure you want to remove?');
    if(confirmRemovePlaceFromFavorite) {
      return this.http.delete(`${environment.baseURL}/user-places/${place.id}`)
      .pipe(
        catchError(() => throwError( () => {
          this.errorService.showError(`${place.title} can't remove from favorites`)
          return new Error('An error ocurred while delete places')
        })),
        tap((resData) => {
          this.userPlaces.set(this.loadedUserPlaces().filter(p => p.id!== place.id));
          return resData;
        })
      );
    } else {
      return throwError(() => new Error('Your cancel deleting places'));
    }

  }
}
