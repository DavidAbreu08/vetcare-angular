import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnimalService {
  private readonly apiUrl = environment.api.url;

  constructor(
    private readonly http: HttpClient,
  ) { }

  /**
   * Fetches all animals from the API.
   * @returns An observable containing an array of animals.
   */
  public getAllAnimals(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/animal/all`);
  }

  public getAnimalsByClient(clientId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/animal/owner/${clientId}`);
  }

  public addAnimal(animalDto: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/animal/create`, animalDto);
  }

}
