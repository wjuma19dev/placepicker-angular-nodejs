import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';

export interface IResponse {
  places: IPlace[]
}
export interface IPlace {
  id:    string;
  title: string;
  image: Image;
  lat:   number;
  lon:   number;
}
export interface Image {
  src: string;
  alt: string;
}


@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {

  private http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  places = signal<Place[] | undefined>(undefined);

  ngOnInit(): void {

    const subscription = this.http.get<IResponse>('http://localhost:3000/places').subscribe({
      next: ({places}) => this.places.update((oldPlaces) => oldPlaces ? [...oldPlaces, ...places] : places)
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
    
  }

}
