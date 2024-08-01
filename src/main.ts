import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { HttpEventType, HttpHandlerFn, HttpHeaders, HttpRequest, provideHttpClient, withInterceptors } from '@angular/common/http';
import { tap } from 'rxjs';

const LOGIN_INTERCEPTOR = (request: HttpRequest<unknown>, next: HttpHandlerFn) => {

  // const headersOptions = {
  //   headers: new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Authorization': 'Bearer'
  //   })
  // }

  // const req = request.clone({
  //   // headers: headersOptions.headers
  //   // headers: request.headers.set('X_DEBUG', 'TESTING'),
  //   // params: request.params.append('query','computadora')
  // });

  console.log('[OUTPUT_REQUEST]:')
  console.log(request)
  return next(request)
    .pipe(
      tap((event) => {

        if(event.type === HttpEventType.Response) {
          console.log('[INPUT_RESPONSE]:')
          console.log(event.status)
          console.log(event.body)
        }
      })
    );
}


bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(
      withInterceptors([
        LOGIN_INTERCEPTOR
      ])
    )
  ]
}).catch((err) => console.error(err));
