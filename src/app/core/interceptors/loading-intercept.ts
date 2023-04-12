import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { LoadingService } from '../_services/loading.service';

@Injectable({
  providedIn: 'root'
})
export class LoaderInterceptorService implements HttpInterceptor{
  constructor(private _loaderService : LoadingService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  return  next.handle(req).pipe(
    tap(()=>{
     this._loaderService.loadingSpinner.next(true);
    }),
    finalize(()=>{
      this._loaderService.loadingSpinner.next(false);
    })
  )
   
  }

}
