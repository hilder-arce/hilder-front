import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportsSearchService {
  private searchSubject = new BehaviorSubject<string>('');
  public search$: Observable<string> = this.searchSubject.asObservable();

  setSearch(value: string): void {
    this.searchSubject.next(value);
  }

  getSearch(): string {
    return this.searchSubject.value;
  }
}
