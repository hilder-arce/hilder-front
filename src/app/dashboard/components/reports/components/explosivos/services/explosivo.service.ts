import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../../../../environments/environment.prod";

@Injectable({
    providedIn: 'root'
})

export class ExplosivoService {

    private readonly apiBackend = environment.apiUrl;    
    
    //INJECTANDO A HttpClient PARA MANEJAR PETICIONES HTTP
    constructor(private http : HttpClient){}

}