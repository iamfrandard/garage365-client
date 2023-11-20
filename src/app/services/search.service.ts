import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Search } from '../models/search.model';

const baseUrl = 'https://goldfish-app-67lk9.ondigitalocean.app/api/appointment';

@Injectable({
  providedIn: 'root',
})
export class SearchServiceComponent {
  constructor(private http: HttpClient) {}

  getAll(page: number = 1, brand?: string, address?: string): Observable<any> {
    // Cambia a any, ya que ahora no es solo un array de Search[]
    let params = new HttpParams().set('page', page.toString());
    if (brand) params = params.set('brand', brand);
    if (address) params = params.set('address', address);

    return this.http.get<any>(baseUrl, { params });
  }

  findByValue(
    value: string,
    brand?: string,
    address?: string
  ): Observable<Search[]> {
    let params = new HttpParams().set('value', value);
    if (brand) params = params.set('brand', brand);
    if (address) params = params.set('address', address);

    return this.http.get<Search[]>(`${baseUrl}/search`, { params });
  }

  get(id: any): Observable<Search> {
    return this.http.get<Search>(`${baseUrl}/${id}`);
  }

  getAllBrands(): Observable<string[]> {
    return this.http.get<string[]>(`${baseUrl}/brands`);
  }

  getAllAddresses(): Observable<string[]> {
    return this.http.get<string[]>(`${baseUrl}/addresses`);
  }

  getDirecciones(id: string): Observable<any> {
    return this.http.get<any>(`${baseUrl}/${id}`);
  }

  getServicios(id: string): Observable<any> {
    return this.http.get<any>(`${baseUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }

  deleteAll(): Observable<any> {
    return this.http.delete(baseUrl);
  }

  findByTitle(value: any): Observable<Search[]> {
    return this.http.get<Search[]>(`${baseUrl}?WorkshopName=${value}`);
  }
}
