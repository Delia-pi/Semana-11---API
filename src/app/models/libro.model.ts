export interface Libro {
  clave: string;
  titulo: string;
  autores: string[];
  anioPublicacion?: number;
  idPortada?: number;
}