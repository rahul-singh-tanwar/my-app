import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { AuthService } from './AuthService';

@Injectable({ providedIn: 'root' })
export class CamundaService {

  private token: string | null;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.token = this.authService.getToken();
  }
  
  private baseUrl = 'http://localhost:3000';
  private processIntanceKey = new BehaviorSubject<string>('');
  private proccessInstanceId = new BehaviorSubject<string>('');
  processIntanceKey$ = this.processIntanceKey.asObservable();
  proccessInstanceId$ = this.proccessInstanceId.asObservable();

  setProcessInstanceKey(key: string) {
    this.processIntanceKey.next(key);
  }

  private getAuthOptions(): { headers?: { Authorization: string } } {
    const token = this.authService.getToken() || this.token;
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  }

  startProcess(payload: Object): Observable<any> {
    return this.http.post(`${this.baseUrl}/start-process`, payload, this.getAuthOptions());
  }

  searchUserTasks(): Observable<any> {
    return this.http.get(`${this.baseUrl}/searchUserTasks`, this.getAuthOptions());
  }

  completeUserTask(userTaskKey: string, variables: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/complete-user-task`,
      { userTaskKey: userTaskKey, variables: variables },
      this.getAuthOptions()
    );
  }

  getUserTaskByProcessInstance(processInstanceId: string, name: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/user-tasks/search`,
      { processInstanceKey: processInstanceId, name: name },
      this.getAuthOptions()
    );
  }
}
