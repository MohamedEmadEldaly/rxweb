import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { LoaderInterceptorService } from "./loading-intercept";

export const interceptors = [
    {provide : HTTP_INTERCEPTORS,useClass:LoaderInterceptorService,multi:true}
]