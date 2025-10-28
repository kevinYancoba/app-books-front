import express from 'express';
import { join } from 'path';

const app = express();
const PORT = process.env['PORT'] || 4200;

// Servir archivos estáticos desde la carpeta dist
const distFolder = join(process.cwd(), 'dist', 'app-book-fr', 'browser');

// Middleware para servir archivos estáticos
app.use(express.static(distFolder, {
  maxAge: '1y',
  etag: true
}));

// Todas las rutas deben servir el index.html (para Angular routing)
app.get('*', (_req, res) => {
  res.sendFile(join(distFolder, 'index.html'));
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en puerto ${PORT}`);
  console.log(`Sirviendo archivos desde: ${distFolder}`);
});

export default app;
