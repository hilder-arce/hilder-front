import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../../../../environments/environment.prod";

@Injectable({
    providedIn: 'root'
})
export class EquipoService {

    private readonly apiBackend = environment.apiUrl;

    constructor(private http: HttpClient) {}


}