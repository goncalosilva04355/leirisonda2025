// Serviço Firebase Storage para armazenamento de fotos
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
  StorageReference,
} from "firebase/storage";
import { app as getFirebaseApp } from "../firebase";

export interface PhotoUpload {
  id?: string;
  name: string;
  size: number;
  type: string;
  file: File;
  timestamp?: string;
  entityId?: string; // ID da obra/manutenção associada
  entityType?: "obra" | "manutencao" | "piscina";
}

export interface StoredPhoto {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  downloadURL: string;
  timestamp: string;
  entityId?: string;
  entityType?: "obra" | "manutencao" | "piscina";
  storagePath: string;
}

export class FirebaseStorageService {
  private storage = null;

  constructor() {
    this.initializeStorage();
  }

  private initializeStorage() {
    try {
      const app = getFirebaseApp();
      if (app) {
        this.storage = getStorage(app);
        console.log("✅ Firebase Storage inicializado");
      } else {
        console.warn("⚠️ Firebase App não disponível para Storage");
      }
    } catch (error) {
      console.warn("⚠️ Erro ao inicializar Firebase Storage:", error);
    }
  }

  private isAvailable(): boolean {
    return this.storage !== null;
  }

  // Upload de uma foto
  async uploadPhoto(photo: PhotoUpload): Promise<StoredPhoto | null> {
    if (!this.isAvailable()) {
      console.warn("Firebase Storage não disponível");
      return null;
    }

    try {
      const timestamp = new Date().toISOString();
      const fileName = `${timestamp}_${photo.name}`;
      const folder = photo.entityType || "general";
      const storagePath = `photos/${folder}/${fileName}`;

      // Criar referência no Storage
      const storageRef = ref(this.storage!, storagePath);

      // Upload do arquivo
      console.log(`📤 Uploading photo: ${fileName}...`);
      const snapshot = await uploadBytes(storageRef, photo.file);

      // Obter URL de download
      const downloadURL = await getDownloadURL(snapshot.ref);

      const storedPhoto: StoredPhoto = {
        id: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: photo.name,
        size: photo.size,
        type: photo.type,
        url: downloadURL,
        downloadURL,
        timestamp,
        entityId: photo.entityId,
        entityType: photo.entityType,
        storagePath,
      };

      console.log("✅ Foto upload concluído:", storedPhoto.id);

      // Salvar metadata no Firestore
      await this.savePhotoMetadata(storedPhoto);

      return storedPhoto;
    } catch (error) {
      console.error("❌ Erro no upload da foto:", error);
      return null;
    }
  }

  // Upload múltiplas fotos
  async uploadPhotos(photos: PhotoUpload[]): Promise<StoredPhoto[]> {
    const results: StoredPhoto[] = [];

    for (const photo of photos) {
      const result = await this.uploadPhoto(photo);
      if (result) {
        results.push(result);
      }
    }

    console.log(
      `✅ ${results.length}/${photos.length} fotos uploaded com sucesso`,
    );
    return results;
  }

  // Eliminar uma foto
  async deletePhoto(storedPhoto: StoredPhoto): Promise<boolean> {
    if (!this.isAvailable()) return false;

    try {
      // Eliminar do Storage
      const storageRef = ref(this.storage!, storedPhoto.storagePath);
      await deleteObject(storageRef);

      // Eliminar metadata do Firestore
      await this.deletePhotoMetadata(storedPhoto.id);

      console.log("✅ Foto eliminada:", storedPhoto.id);
      return true;
    } catch (error) {
      console.error("❌ Erro ao eliminar foto:", error);
      return false;
    }
  }

  // Listar fotos por entidade
  async listPhotos(
    entityType?: string,
    entityId?: string,
  ): Promise<StoredPhoto[]> {
    try {
      // Carregar metadata do Firestore
      const photos = await this.loadPhotosMetadata(entityType, entityId);
      return photos;
    } catch (error) {
      console.error("❌ Erro ao listar fotos:", error);
      return [];
    }
  }

  // Salvar metadata da foto no Firestore
  private async savePhotoMetadata(photo: StoredPhoto): Promise<void> {
    try {
      const { firestoreService } = await import("./firestoreService");
      await firestoreService.create("photos", photo);
      console.log("✅ Metadata da foto salvo no Firestore");
    } catch (error) {
      console.warn("⚠️ Erro ao salvar metadata da foto:", error);
    }
  }

  // Eliminar metadata da foto do Firestore
  private async deletePhotoMetadata(photoId: string): Promise<void> {
    try {
      const { firestoreService } = await import("./firestoreService");
      await firestoreService.delete("photos", photoId);
      console.log("✅ Metadata da foto eliminado do Firestore");
    } catch (error) {
      console.warn("⚠️ Erro ao eliminar metadata da foto:", error);
    }
  }

  // Carregar metadata das fotos do Firestore
  private async loadPhotosMetadata(
    entityType?: string,
    entityId?: string,
  ): Promise<StoredPhoto[]> {
    try {
      const { firestoreService } = await import("./firestoreService");
      const allPhotos = await firestoreService.read<StoredPhoto>("photos");

      // Filtrar por entidade se especificado
      if (entityType && entityId) {
        return allPhotos.filter(
          (photo) =>
            photo.entityType === entityType && photo.entityId === entityId,
        );
      } else if (entityType) {
        return allPhotos.filter((photo) => photo.entityType === entityType);
      }

      return allPhotos;
    } catch (error) {
      console.warn("⚠️ Erro ao carregar metadata das fotos:", error);
      return [];
    }
  }

  // Converter File para PhotoUpload
  static createPhotoUpload(
    file: File,
    entityType?: "obra" | "manutencao" | "piscina",
    entityId?: string,
  ): PhotoUpload {
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      file,
      timestamp: new Date().toISOString(),
      entityType,
      entityId,
    };
  }

  // Obter URL pré-assinado para upload direto (para uploads grandes)
  async getUploadURL(
    fileName: string,
    contentType: string,
  ): Promise<string | null> {
    // Implementação futura para uploads diretos
    console.log("Upload direto não implementado ainda");
    return null;
  }
}

// Instância singleton
export const firebaseStorageService = new FirebaseStorageService();
