import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Libro } from '../models/libro.model';

// Estructura de los datos recibidos de Open Library.
interface RegistroLibroApi {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
}

interface RespuestaOpenLibrary {
  docs: RegistroLibroApi[];
}

@Injectable({
  providedIn: 'root'
})
export class OpenLibraryService {

  private clienteHttp = inject(HttpClient);

  private direccionApi =
    'https://openlibrary.org/search.json';

  buscarLibrosRomanticos(): Observable<Libro[]> {

    const parametros = new HttpParams()
      .set('q', 'subject:romance')
      .set('limit', '10')
      .set(
        'fields',
        'key,title,author_name,first_publish_year,cover_i'
      );

    return this.clienteHttp
      .get<RespuestaOpenLibrary>(
        this.direccionApi,
        { params: parametros }
      )
      .pipe(
        map(respuesta =>
          respuesta.docs.map(registro => ({
            clave: registro.key,
            titulo: registro.title,
            autores: registro.author_name ?? [],
            anioPublicacion: registro.first_publish_year,
            idPortada: registro.cover_i
          }))
        )
      );
  }
}