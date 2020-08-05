import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class FinancialDataService {

  constructor(private http: HttpClient) {
    this.financialRecords = new BehaviorSubject([]);
   }
  private endPoint = environment.endApi;
  public financialRecords: BehaviorSubject<any[]>;

  public getFinancialRecords(amount: number) {
    return this.http.get(this.endPoint + amount).pipe(map((data: any[]) => {
      data.map(record => {
        const diffs = record["PriceDiffs"];
        Object.assign(record, diffs);
        delete record["PriceDiffs"];
      });

      return data;
    })).subscribe((data: any[]) => {
        this.financialRecords.next(data);
    });
  }
}
