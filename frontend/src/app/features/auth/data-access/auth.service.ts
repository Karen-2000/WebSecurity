import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { LoginRequest } from '../models/loginRequest.models';
import { LoginResponse } from '../models/loginResponse.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/auth';

  login(payload: LoginRequest): Promise<LoginResponse> {
    return firstValueFrom(
      this.http.post<LoginResponse>(
        `${this.apiUrl}/login`,
        payload,
        { withCredentials: true }
      )
    );
  }

  logout(): Promise<{ message: string }> {
    return firstValueFrom(
      this.http.post<{ message: string }>(
        `${this.apiUrl}/logout`,
        {},
        { withCredentials: true }
      )
    );
  }
}
