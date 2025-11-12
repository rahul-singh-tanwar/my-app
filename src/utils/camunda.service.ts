import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CamundaService {
  private baseUrl = 'http://localhost:3000';
  private processIntanceKey = new BehaviorSubject<string>('');
  processIntanceKey$ = this.processIntanceKey.asObservable();

  setProcessInstanceKey(key: string) {
    this.processIntanceKey.next(key);
  }

  constructor(private http: HttpClient) { }

  startProcess(payload: Object): Observable<any> {
    console.log('Starting process with payload:', payload);
    return this.http.post(`${this.baseUrl}/start-process`, payload);
  }

  searchUserTasks(): Observable<any> {
    return this.http.get(`${this.baseUrl}/searchUserTasks`);
  }

  completeUserTask(userTaskKey: string, variables: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/complete-user-task`, {
      userTaskKey: userTaskKey,
      variables: variables,
    });
  }

  getUserTaskByProcessInstance(processInstanceId: string, name: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/user-tasks/search`, {
      processInstanceKey: processInstanceId, name: name

    });
  }
}
