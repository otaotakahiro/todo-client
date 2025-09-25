export interface FormDataEntity {
  id: string;
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  tags?: string[];
  startedAt?: string;
  expiresAt: string;
  completedAt?: string;
}
