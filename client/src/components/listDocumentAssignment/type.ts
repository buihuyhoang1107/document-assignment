export interface Document {
  id: string;
  title: string;
  content: string;
  folderId: string;
  createdAt: number;
  updatedAt: number;
}

export interface DocumentWithTimestamp extends Document {
  timestamp: number;
}
