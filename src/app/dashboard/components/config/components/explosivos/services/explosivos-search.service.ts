import { Injectable, signal } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class ExplosivosSearchService {

    // SEÑAL PRIVADA PARA LA BÚSQUEDA
    private readonly _search = signal<string>('');

    // BÚSQUEDA DE EQUIPOS (READONLY)
    readonly search = this._search.asReadonly();

    // ESTABLECER BÚSQUEDA
    setSearch(value: string) {
        this._search.set(value.toLowerCase().trim());
    }

    // LIMPIAR BÚSQUEDA
    clearSearch() {
        this._search.set('');
    }

}