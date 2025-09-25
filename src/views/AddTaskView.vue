<script setup lang="ts">
import type { FormDataEntity } from '@/Entity/TaskEntity';
import { reactive, ref } from 'vue';

// interface TaskEntity {
//   title: string;
//   description?: string;
//   status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
//   priority?: 'low' | 'medium' | 'high' | 'urgent';
//   tags: string[]; // ? でtagが無い場合にするか？それとも記載なしでも空の配列が存在する。という状態にするか？
//   startedAt?: string;
//   expiresAt?: string;
//   completedAt?: string;
// }

const tagInput = ref('');

// リアクティブな変数を定義する

const taskForm = reactive({
  title: '',
  description: '',
  priority: '',
  expiresAt: '',
  tags: '',
});

const status = ref<'idle' | 'pending' | 'success' | 'error'>('idle');

async function addTask() {
  status.value = 'pending';
  const requestURL = 'http://localhost:8787/api/v1/tasks';
  const response = await fetch(requestURL, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      title: taskForm.title,
      description: taskForm.description,
      priority: taskForm.priority || undefined,
      expiresAt: taskForm.expiresAt || undefined,
      tags: taskForm.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean), // 後で調べる
    }),
  });

  // HTTP ステータスコード が 200 以外の場合
  if (!response.ok) {
    status.value = 'error';
    return;
  }
  // レスポンスのボディをJSONオブジェクトにパース
  const data = await response.json();
  console.log(data);

  status.value = 'success';
}

function clearForm() {
  taskForm.title = '';
  taskForm.description = '';
  taskForm.priority = '';
  taskForm.expiresAt = '';
  taskForm.tags = '';
}
</script>

<template>
  <pre>{{ status }}</pre>
  <div class="about">
    <h1>タスク入力フォーム</h1>
    <form>
      <!-- フォーム項目をここに配置 -->
      <h2>タスクタイトル</h2>
      <label for="title" class="formLabel"> <span>※必須</span>※30文字以内　[{{ taskForm.title.length }}/30]</label>
      <div class="formGroup">
        <input
          type="text"
          id="title"
          v-model="taskForm.title"
          maxlength="30"
          placeholder="タイトルを入力してください"
          class="formLabel"
          required
        />
      </div>
      <h2>説明文</h2>
      <label for="description" class="formLabel">
        （任意）※50文字以内 [{{ taskForm.description?.length || 0 }}/50]
      </label>
      <input
        id="description"
        v-model="taskForm.description"
        maxlength="50"
        placeholder="タスクの詳細を入力してください"
        rows="3"
      />
      <h2>優先度</h2>
      <select id="priority" v-model="taskForm.priority">
        <option value="">-</option>
        <option value="low">低</option>
        <option value="medium">中</option>
        <option value="high">高</option>
        <option value="urgent">緊急</option>
      </select>
      <h2>タグ</h2>
      <div class="tagInput">
        <label></label>
        <input v-model="taskForm.tags" placeholder="タグを入力してEnter" />
      </div>
      <h2>作成日</h2>
      <label for="expiresAt" class="formLabel">期限（任意）</label>
      <input type="date" id="expiresAt" v-model="taskForm.expiresAt" />
      <h2>タスク登録</h2>
      <button type="button" :disabled="status === 'pending'" @click="addTask">タスク登録</button>
      <button type="button" @click="clearForm">クリア</button>
      <p v-if="status === 'success'">タスクを作成しました</p>
      <p v-if="status === 'error'">タスク作成に失敗しました</p>
    </form>
  </div>
</template>
<!-- 条件　CSSは module SCSS スクリプト書くならTypescript -->

<style lang="scss" module>
.formGroup {
  font-size: 1em; // スペースを削除
  width: 150px; // 追加
}

input {
  width: 100%; // 親要素の幅に合わせる
  box-sizing: border-box; // パディングを含めた幅計算
}

.formLabel {
  font-size: 1em; // スペースを削除
  word-wrap: break-word; // 長い単語を折り返し
  white-space: normal; // 改行を許可
  line-height: 1.4; // 行間を調整
}

.charCount {
  text-align: right;
  font-size: 0.875rem;
  color: #666;
  margin-top: 0.25rem;
  width: 150px; // 親要素の幅に合わせる
}

@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
