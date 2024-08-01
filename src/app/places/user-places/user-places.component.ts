import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { PlacesService } from '../places.service';
import { IPlace } from '../place.model';

const baseURL = 'http://localhost:3000';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit {

  private placeService = inject(PlacesService);
  private destroyRef = inject(DestroyRef);

  places = this.placeService.loadedUserPlaces;
  error = signal('');
  isFetching = signal(false);

  ngOnInit() {
    this.isFetching.set(true);
    const subscription = this.placeService.loadUserPlaces()
      .subscribe({
        next: places => {
          // this.places.set(places);
          this.isFetching.set(false);
        },
        error: error => {
          this.error.set(error.message);
          this.isFetching.set(false);
        }
      })
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  onRemoveFavoritePlace(place: IPlace) {
    const subscription = this.placeService.removeUserPlace(place)
      .subscribe({
        next: () => {
          console.log(`Place ${place.title} removed from favorites`);
        },
        complete: () => console.log(`Place ${place.title} removed from favorites`),
        error: (error) => {
          console.log(error.message)
        }
      });
      this.destroyRef.onDestroy(() => {
        subscription.unsubscribe();
      });
  }

}
