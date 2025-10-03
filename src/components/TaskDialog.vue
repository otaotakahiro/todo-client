<script setup lang="ts">
import type { TaskEntity } from '@/entities/TaskEntity';
import { reactive, watch } from 'vue';

// 状態管理のは親側TaskCollectionViewで　動作管理はtaskDialogで行っている
// 親から子がprops　子から親は自分で作る

const taskForm = reactive({
  title: '',
  description: '',
  priority: '',
  expiresAt: '',
  tags: '',
});

const props = defineProps<{
  task: TaskEntity;
}>();

// 監視したいリアクティブな変数を第一引数
// 変更があったときに実行する関数｀
watch(
  props,
  newProps => {
    // watchで監視
    console.log(newProps);
    taskForm.title = newProps.task.title;
    taskForm.description = newProps.task.description ?? '';
    taskForm.priority = newProps.task.priority ?? '';
    taskForm.expiresAt = newProps.task.expiresAt ?? '';
    taskForm.tags = newProps.task.tags.join(',');
  },
  { immediate: true },
);

const emits = defineEmits<{
  (event: 'close'): void;
}>(); // シグナルの種類を定義した

function onClose() {
  emits('close'); // ここでイベントを発火させる　×ボタンを押下するとおｎClose関数が動く
  //閉じるボタンが押されて動作する動きを作る。動作確認する場合、console.logでちゃんと動作するかを確認するを一つ一つ行う
  console.log(new Date());
}
</script>

<template>
  <div class="overlay">
    <div class="dialog">
      <div class="header">
        <h2>タスク更新</h2>
        <button type="button" class="closeButton" @click="onClose">×</button>
      </div>

      <div class="content">
        <form>
          <pre>{{ taskForm }}</pre>
          <!-- タスクタイトル -->
          <div class="formGroup">
            <h3>タスクタイトル</h3>
            <label for="title" class="formLabel"> <span>※必須</span>※30文字以内　[0/30] </label>
            <input
              type="text"
              id="title"
              maxlength="30"
              placeholder="タイトルを入力してください"
              class="formInput"
              required
              v-model="taskForm.title"
            />
            <pre>{{ task.title }}</pre>
          </div>

          <!-- 説明文 -->
          <div class="formGroup">
            <h3>説明文</h3>
            <label for="description" class="formLabel"> （任意）※50文字以内 [0/50] </label>
            <textarea
              id="description"
              maxlength="50"
              placeholder="タスクの詳細を入力してください"
              rows="3"
              class="formTextarea"
              v-model="taskForm.description"
            ></textarea>
          </div>

          <!-- 優先度 -->
          <div class="formGroup">
            <h3>優先度</h3>
            <select id="priority" class="formSelect" v-model="taskForm.priority">
              <option value="">-</option>
              <option value="low">低</option>
              <option value="medium">中</option>
              <option value="high">高</option>
              <option value="urgent">緊急</option>
            </select>
          </div>

          <!-- タグ -->
          <div class="formGroup">
            <h3>タグ</h3>
            <input placeholder="タグを入力してEnter（カンマ区切り）" class="formInput" />
          </div>

          <!-- 期限 -->
          <div class="formGroup">
            <h3>期限</h3>
            <label for="expiresAt" class="formLabel">期限（任意）</label>
            <input type="date" id="expiresAt" class="formInput" v-model="taskForm.expiresAt" />
          </div>

          <!-- ボタン -->
          <div class="buttonGroup">
            <button type="submit" class="updateButton">タスク更新</button>
            <button type="button" class="clearButton">リセット</button>
            <button type="button" class="cancelButton" @click="onClose">キャンセル</button>
          </div>

          <div class="successMessage" style="display: none">タスクを更新しました</div>
          <div class="errorMessage" style="display: none">タスク更新に失敗しました</div>
        </form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
}

.dialog {
  background: #2c3e50;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
  animation: modalFadeIn 0.3s ease-out;
  border: 1px solid #34495e;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #34495e;
  background: #34495e;
  border-radius: 12px 12px 0 0;

  h2 {
    margin: 0;
    color: #ecf0f1;
  }
}

.closeButton {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #bdc3c7;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #ecf0f1;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
  }
}

.content {
  padding: 20px;
}

.formGroup {
  margin-bottom: 20px;

  h3 {
    margin: 0 0 8px 0;
    color: #ecf0f1;
    font-size: 16px;
  }
}

.formLabel {
  display: block;
  margin-bottom: 4px;
  font-size: 14px;
  color: #bdc3c7;

  span {
    color: #e74c3c;
  }
}

.formInput,
.formTextarea,
.formSelect {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #34495e;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
  background: #34495e;
  color: #ecf0f1;

  &:focus {
    outline: none;
    border-color: #3498db;
    background: #2c3e50;
  }

  &::placeholder {
    color: #7f8c8d;
  }
}

.formTextarea {
  resize: vertical;
  min-height: 80px;
}

.buttonGroup {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 30px;
}

.buttonGroup button {
  flex: 1;
  min-width: 0;
}

.updateButton {
  background-color: #5dade2;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;

  &:hover:not(:disabled) {
    background-color: #3498db;
  }

  &:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }
}

.clearButton {
  background-color: #f7c52d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #f39c12;
  }
}

.cancelButton {
  background-color: #aab7b8;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #95a5a6;
  }
}

.successMessage {
  color: #2ecc71;
  text-align: center;
  margin-top: 10px;
  font-weight: bold;
}

.errorMessage {
  color: #e74c3c;
  text-align: center;
  margin-top: 10px;
  font-weight: bold;
}

@media (max-width: 768px) {
  .dialog {
    width: 95%;
    margin: 10px;
  }

  .content {
    padding: 15px;
  }

  .buttonGroup {
    flex-direction: row;
    gap: 8px;
  }

  .buttonGroup button {
    flex: 1;
    min-width: 0;
    font-size: 12px;
    padding: 8px 4px;
  }
}
</style>
