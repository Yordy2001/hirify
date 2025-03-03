import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { TokenService } from "./token.service";
import { SubdomainService } from "../services/subdomain.service";
import { Observable } from "rxjs";


export const AuthInterceptor: HttpInterceptorFn = (
    req: HttpRequest<any>,
    next: HttpHandlerFn
): Observable<HttpEvent<any>> => {

    const tokenService = inject(TokenService);
    const subdomainService = inject(SubdomainService);
    
    const token = tokenService.getToken();
    const subdomain = subdomainService.getSubdomain();

    if (req.url.includes('/auth')) {
        return next(req);
    }

    let headers: Record<string, string> = {
        'X-Tenant-Subdomain': subdomain || ''
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // clone req with headers & withCredentials
    const authReq = req.clone({
        setHeaders: headers,
        withCredentials: true
    });

    return next(authReq);
}
