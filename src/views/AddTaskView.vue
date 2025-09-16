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

//title　のフォーム部分
const formData: FormDataEntity = reactive({
  title: '',
  description: '',
  priority: '',
  tags: [],
  expiresAt: '',
});
// エラー時の対応
// const errors: FormDataEntity = reactive({
//   title: '',
//   description: '',
//   priority: '',
//   tags: [],
//   expiresAt: '',
// });

// const validateTitle = () => {
//   if (!formData.title.trim()) {
//     errors.title = 'タイトルは必須です';
//   } else if (formData.title.length > 30) {
//     errors.title = 'タイトルは30文字以内です';
//   } else {
//     errors.title = '';
//   }
// };

// const handleSubmit = () => {
//   validateTitle();
//   if (!errors.title) {
//     console.log('送信:', formData);
//   }
// };

const addTag = () => {
  const tag = tagInput.value.trim();
  if (tag && !formData.tags.includes(tag)) {
    formData.tags.push(tag);
    tagInput.value = '';
  }
};

const removeTag = (tagToRemove: string) => {
  const index = formData.tags.indexOf(tagToRemove);
  if (index > -1) {
    formData.tags.splice(index, 1);
  }
};

const getToday = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const formDataAll = {
  title: formData.title,
  description: formData.description,
  priority: formData.priority,
  tags: formData.tags,
  expiresAt: formData.expiresAt,
};

console.log(formData);
console.log(formDataAll);
</script>

<template>
  <div>---------------------------------------</div>
  <span>挙動テスト領域</span>
  <pre>title： {{ taskForm.title }} </pre>
  <pre>description: {{ taskForm.description }} </pre>
  <pre>priority: {{ taskForm.priority }} </pre>
  <pre>expiresAt: {{ taskForm.expiresAt }} </pre>
  <pre>tags: {{ taskForm.tags }} </pre>
  <div>---------------------------------------</div>
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
      <button type="button" @click="">タスク登録</button>
      <button type="button" @click="">クリア</button>
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
