/**
 * El sitio vive en https://jimenajr05.github.io/segunda-vida/, no en la raíz
 * del dominio. Las rutas de imagen guardadas en la base de datos son
 * absolutas ("/images/..."), así que hay que anteponerles el prefijo del
 * sitio para que carguen bien.
 */
export function withBase(path) {
  if (!path) return path;
  const base = import.meta.env.BASE_URL; // ej: "/segunda-vida/"
  return base + path.replace(/^\//, '');
}
