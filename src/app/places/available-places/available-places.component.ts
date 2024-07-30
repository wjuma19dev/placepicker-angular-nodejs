import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesService } from '../places.service';


@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {

  private destroyRef = inject(DestroyRef);
  private placesServices = inject(PlacesService);
  places = signal<Place[] | undefined>(undefined);
  isFetching = signal(false);
  error = signal('');


  ngOnInit(): void {
    this.isFetching.set(true);
    const subscription = this.placesServices.loadAvailablePlaces()
      .subscribe({
        next: (places) => 
          this.places.set(places),
        error: (error: Error) => 
          this.error.set(error.message),
        complete: () => 
          this.isFetching.set(false)
      });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  onSelectPlace(place: Place) {
    this.placesServices.addPlaceToUserPlaces(place).subscribe();
  }
    

}
