/**
 * Utilidad para compresión de imágenes y conversión a base64
 */
export class ImageCompressionUtil {
  
  /**
   * Comprime una imagen y la convierte a base64
   * @param file - Archivo de imagen a comprimir
   * @param maxWidth - Ancho máximo de la imagen comprimida (default: 800)
   * @param maxHeight - Alto máximo de la imagen comprimida (default: 600)
   * @param quality - Calidad de compresión (0.1 - 1.0, default: 0.8)
   * @returns Promise con la imagen comprimida en base64
   */
  static async compressImageToBase64(
    file: File,
    maxWidth: number = 800,
    maxHeight: number = 600,
    quality: number = 0.8
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      // Validar que sea un archivo de imagen
      if (!file.type.startsWith('image/')) {
        reject(new Error('El archivo debe ser una imagen'));
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calcular nuevas dimensiones manteniendo la proporción
        const { width, height } = this.calculateNewDimensions(
          img.width,
          img.height,
          maxWidth,
          maxHeight
        );

        // Configurar el canvas
        canvas.width = width;
        canvas.height = height;

        // Dibujar la imagen redimensionada
        ctx?.drawImage(img, 0, 0, width, height);

        // Convertir a base64
        try {
          const base64 = canvas.toDataURL('image/jpeg', quality);
          // Remover el prefijo "data:image/jpeg;base64,"
          const base64Data = base64.split(',')[1];
          resolve(base64Data);
        } catch (error) {
          reject(new Error('Error al convertir la imagen a base64'));
        }
      };

      img.onerror = () => {
        reject(new Error('Error al cargar la imagen'));
      };

      // Crear URL del archivo para cargar en la imagen
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = () => {
        reject(new Error('Error al leer el archivo'));
      };
      reader.readAsDataURL(file);
    });
  }

  /**
   * Calcula las nuevas dimensiones manteniendo la proporción
   */
  private static calculateNewDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number
  ): { width: number; height: number } {
    let { width, height } = { width: originalWidth, height: originalHeight };

    // Si la imagen es más grande que los límites, redimensionar
    if (width > maxWidth || height > maxHeight) {
      const aspectRatio = width / height;

      if (width > height) {
        width = maxWidth;
        height = width / aspectRatio;
      } else {
        height = maxHeight;
        width = height * aspectRatio;
      }

      // Asegurar que no exceda los límites
      if (width > maxWidth) {
        width = maxWidth;
        height = width / aspectRatio;
      }
      if (height > maxHeight) {
        height = maxHeight;
        width = height * aspectRatio;
      }
    }

    return { width: Math.round(width), height: Math.round(height) };
  }

  /**
   * Valida el tamaño del archivo
   * @param file - Archivo a validar
   * @param maxSizeMB - Tamaño máximo en MB (default: 5)
   * @returns true si el archivo es válido
   */
  static validateFileSize(file: File, maxSizeMB: number = 5): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  }

  /**
   * Valida el tipo de archivo
   * @param file - Archivo a validar
   * @param allowedTypes - Tipos permitidos (default: ['image/jpeg', 'image/png', 'image/webp'])
   * @returns true si el tipo es válido
   */
  static validateFileType(
    file: File,
    allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/webp']
  ): boolean {
    return allowedTypes.includes(file.type);
  }

  /**
   * Obtiene información del archivo
   * @param file - Archivo a analizar
   * @returns Información del archivo
   */
  static getFileInfo(file: File): {
    name: string;
    size: number;
    sizeFormatted: string;
    type: string;
    lastModified: Date;
  } {
    return {
      name: file.name,
      size: file.size,
      sizeFormatted: this.formatFileSize(file.size),
      type: file.type,
      lastModified: new Date(file.lastModified)
    };
  }

  /**
   * Formatea el tamaño del archivo en una cadena legible
   * @param bytes - Tamaño en bytes
   * @returns Tamaño formateado (ej: "1.5 MB")
   */
  private static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
