import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class TokenService {
    private tokenName = 'token'

    getToken(): string | null{
        const cookies = document.cookie.split('; ');

        const tokenCookie = cookies.find(row => row.startsWith(`${this.tokenName}=`));
        
        return tokenCookie ? tokenCookie.split('=')[1] : null;
    }
}
