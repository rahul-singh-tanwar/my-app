// auth.service.ts
import { Injectable } from '@angular/core';
import axios from 'axios';
import { Router } from '@angular/router';
import {jwtDecode} from 'jwt-decode';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private KEYCLOAK_TOKEN_URL = 'http://localhost:18080/auth/realms/camunda-platform/protocol/openid-connect/token';
    private CLIENT_ID = 'orchestration';
    private CLIENT_SECRET = 'secret';

    constructor(private router: Router) { }

    getToken(): string | null {
        return localStorage.getItem('access_token');
    }

    isAuthenticated(): boolean {
        const token = this.getToken();
        if (!token) return false;

        try {
            const decoded: any = jwtDecode(token);
            const currentTime = Math.floor(Date.now() / 1000);
            if (decoded.exp && decoded.exp > currentTime) {
                return true;
            } else {
                this.logout();
                return false;
            }
        } catch (e) {
            this.logout();
            return false;
        }
    }

    logout(): void {
        localStorage.removeItem('access_token');
        this.router.navigate(['/login']);
    }


    async login(username: string, password: string): Promise<any> {
        const params = new URLSearchParams();
        params.append('grant_type', 'password');
        params.append('client_id', this.CLIENT_ID);
        params.append('client_secret', this.CLIENT_SECRET);
        params.append('username', username);
        params.append('password', password);

        try {
            const { data } = await axios.post(this.KEYCLOAK_TOKEN_URL, params, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

            // Save the token in localStorage or sessionStorage
            localStorage.setItem('access_token', data.access_token);

            return data;
        } catch (error: any) {
            console.error('Login failed:', error);
            throw error;
        }
    }
}
