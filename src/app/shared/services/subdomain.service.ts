import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SubdomainService {
  getSubdomain(): string | null {
    const host = window.location.host; // Ejemplo: "miapp.hirify.com"
    const hostSplit = host.split('.');
    console.log("hostSplit", hostSplit);
    
    if (hostSplit.length > 2) {
      return hostSplit[0] // return "miapp"
    }
    return null;
  }
}
