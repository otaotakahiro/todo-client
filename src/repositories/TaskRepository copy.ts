import type { TaskEntity } from '@/entities/TaskEntity';

interface CreateTaskRequest {
  title: string;
  description: string;
  priority: string;
  expiresAt: string;
  tags: string;
}

/*
 *サーバーとTaskのやりとりを担当するクラス
 */
export class TaskRepository {
  public async createTasks(createTaskRequest: CreateTaskRequest): Promise<TaskEntity | null> {
    const requestURL = 'http://localhost:8787/api/v1/tasks';
    const response = await fetch(requestURL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        title: createTaskRequest.title,
        description: createTaskRequest.description,
        priority: createTaskRequest.priority || undefined,
        expiresAt: createTaskRequest.expiresAt || undefined,
        tags: createTaskRequest.tags
          .split(',')
          .map(tag => tag.trim())
          .filter(Boolean), // 後で調べる
      }),
    });
    // HTTP ステータスコード が 200 以外の場合
    if (!response.ok) {
      return null;
    }
    // レスポンスのボディをJSONオブジェクトにパース
    const data: TaskEntity = await response.json();

    return data;
  }

  public async getTasks(): Promise<TaskEntity[]> {
    const response = await fetch('http://localhost:8787/api/v1/tasks', {
      headers: {
        Accept: 'application/json', // サーバー側にヘッダーでjson形式で返してください。を受け入れてくださいと伝える
      },
    });
    const data: TaskEntity[] = await response.json();

    return data;
  }
}
