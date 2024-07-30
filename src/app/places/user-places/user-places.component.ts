import { Component, inject, OnInit, signal } from '@angular/core';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { PlacesService } from '../places.service';

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

  places = this.placeService.loadedUserPlaces;
  error = signal('');
  isFetching = signal(false);

  ngOnInit() {
    this.isFetching.set(true);
    this.placeService.loadUserPlaces()
      .subscribe({
        // next: places => {
        //   this.places.set(places);
        //   this.isFetching.set(false);
        // },
        error: error => {
          this.error.set(error.message);
          this.isFetching.set(false);
        }
      })
  
  }

}
