<script setup lang="ts">
import TaskDialog, { type TaskForm } from '@/components/TaskDialog.vue';
import type { TaskEntity } from '@/entities/TaskEntity';
import { TaskRepository } from '@/repositories/TaskRepository';
import { taskRepository } from '@/store';
import { ref } from 'vue';

const tasks = ref<TaskEntity[]>([]);

async function getTasks() {
  tasks.value = await taskRepository.getTasks();
}

getTasks();

async function updateTask(task: TaskForm) {
  // 選択されたタスクがない場合、何もしない
  if (!selectedTask.value) {
    return;
  }
  //サーバーのタスクを更新する
  const updatedTask = await taskRepository.updateTask(
    selectedTask.value.id,
    task,
  ); /** 書き方　まずTaskDialogで関数と引数を作る、その後戻ってきて関数に与える引数を記載*/

  // 更新したタスクを配列に反映する
  const taskIndex = tasks.value.findIndex(task => task.id === updatedTask.id);

  if (taskIndex !== -1) {
    tasks.value[taskIndex] = updatedTask;
  }

  //ダイヤログを閉じる
  isDialogOpened.value = false;
  // selectTaskを空にする
  selectedTask.value = undefined;
}

async function deleteTask(taskId: string) {
  try {
    await taskRepository.deleteTask(taskId);
    const taskIndex = tasks.value.findIndex(task => task.id === taskId); // findIndex で

    if (taskIndex !== -1) {
      tasks.value.splice(taskIndex, 1);
    }
  } catch {
    console.log('タスクの削除に失敗しました');
  }
}

const selectedTask = ref<TaskEntity>(); // 更新ボタンを押したときにtaskを引数として取得しているのでそれを格納する変数を宣言する
async function openDialog(task: TaskEntity) {
  // 更新ボタンを押すと@clickで実行されてここが動く
  isDialogOpened.value = true;

  // 選択されたタスクを格納する
  selectedTask.value = task;
}

const isDialogOpened = ref(false); // 最初にfalseを入れて非表示にさせる TaskDialog を表示非表示させる

function closeDialog() {
  isDialogOpened.value = false;
}

// 変数が更新されるとき<pre>で表示動作確認をすること <pre></pre>
</script>
<template>
  <TaskDialog v-if="isDialogOpened && selectedTask" :task="selectedTask" @accept="updateTask" @cancel="closeDialog" />

  <div>タスク一覧（全{{ tasks.length }}件）</div>
  <div :class="$style.tasksContainer">
    <!-- 見出し行を追加 -->
    <div :class="$style.tasksHeader">
      <div :class="$style.tasksHeaderTitle">No.</div>
      <!-- <div :class="$style.tasksHeaderTitle">ID</div> -->
      <div :class="$style.tasksHeaderTitle">タイトル</div>
      <!-- <div :class="$style.tasksHeaderDescription">説明</div> -->
      <div :class="$style.tasksHeaderPriority">優先度</div>
      <div :class="$style.tasksHeaderTags">タグ</div>
      <div :class="$style.tasksHeaderExpiresat">期限</div>
      <div :class="$style.tasksHeaderCompletedat">完了日</div>
      <div :class="$style.tasksHeaderButton">編集</div>
      <div :class="$style.tasksHeaderButton">削除</div>
    </div>

    <!-- 既存のタスク一覧 -->
    <div v-for="(task, index) of tasks" :key="task.id" :class="$style.tasksList">
      <div :class="$style.tasksTitle">
        <span>{{ index + 1 }}</span>
      </div>
      <!-- <div :class="$style.tasksTitle">
        <span>{{ task.id }}</span>
      </div> -->
      <div :class="$style.tasksTitle">
        <span>{{ task.title }}</span>
      </div>
      <!-- <div :class="$style.tasksDescription">
        <span>{{ task.description }}</span>
      </div> -->
      <div :class="$style.tasksPriority">
        <span>{{ task.priority }}</span>
      </div>
      <div :class="$style.tasksTags">
        <span>{{ task.tags }}</span>
      </div>
      <div :class="$style.tasksExpiresat">
        <span>{{ task.expiresAt }}</span>
      </div>
      <div :class="$style.tasksCompletedat">
        <span>{{ task.completedAt }}</span>
      </div>
      <div :class="$style.buttonContainer">
        <button type="button" @click="openDialog(task)" :class="$style.tasksButton">更新</button>
        <button type="button" @click="deleteTask(task.id)" :class="$style.tasksButtonDelete">削除</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
.tasksContainer {
  display: flex;
  flex-direction: column; /* 縦方向に配置 */
}
/* 見出し行のスタイル */
.tasksHeader {
  display: flex;
  background-color: #f0f8ff; /* 薄い青色 */
  border: aliceblue solid 2px;
  width: 100%;
  font-weight: bold;
  overflow-x: auto;
  min-width: 0;
  position: sticky; /* スクロール時に固定 */
  top: 0;
  z-index: 10;
}

/* 見出し項目のスタイル（データ行と同じ幅に設定） */
.tasksHeaderTitle:nth-child(1) {
  flex: 0 0 50px;
  min-width: 40px;
} /* No. */

.tasksHeaderTitle:nth-child(2) {
  flex: 0 0 100px;
  min-width: 80px;
} /* ID */

.tasksHeaderTitle:nth-child(3) {
  flex: 2;
  min-width: 150px;
} /* タイトル */

.tasksHeaderDescription {
  flex: 1.5;
  min-width: 100px;
}

.tasksHeaderPriority {
  flex: 0 0 80px;
  min-width: 60px;
}

.tasksHeaderTags {
  flex: 1;
  min-width: 80px;
}

.tasksHeaderExpiresat {
  flex: 0 0 120px;
  min-width: 100px;
}

.tasksHeaderCompletedat {
  flex: 0 0 120px;
  min-width: 100px;
}

.tasksHeaderButton {
  flex: 0 0 80px;
  min-width: 60px;
}

/* 見出し項目共通スタイル */
.tasksHeaderTitle,
.tasksHeaderDescription,
.tasksHeaderPriority,
.tasksHeaderTags,
.tasksHeaderExpiresat,
.tasksHeaderCompletedat,
.tasksHeaderButton {
  padding: 8px 5px;
  border: aliceblue solid 0.5px;
  color: #f0f8ff;
  background-color: rgb(99, 99, 99);
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tasksList {
  display: flex;
  border: aliceblue solid;
  width: 100%;
  margin-bottom: 3px;
  overflow-x: auto; /* 重要：横スクロール対応 */
  min-width: 0; /* flexの縮小を許可 */
}
/* 基本的にflexで比率指定（レスポンシブ） */
.tasksTitle:nth-child(1) {
  flex: 0 0 50px;
  min-width: 40px;
} /* 番号 */
.tasksTitle:nth-child(2) {
  flex: 0 0 100px;
  min-width: 80px;
} /* ID */
.tasksTitle:nth-child(3) {
  flex: 2;
  min-width: 150px;
} /* タイトル */
.tasksDescription {
  flex: 1.5;
  min-width: 100px;
}
.tasksPriority {
  flex: 0 0 80px;
  min-width: 60px;
}
.tasksTags {
  flex: 1;
  min-width: 80px;
}
.tasksExpiresat {
  flex: 0 0 120px;
  min-width: 100px;
}
.tasksCompletedat {
  flex: 0 0 120px;
  min-width: 100px;
}
.tasksButton {
  flex: 0 0 80px;
  min-width: 60px;
  background-color: hsla(160, 100%, 37%, 1);
  padding: 5px; /* この行も追加 */
}

.tasksButtonLink {
  color: rgb(255, 255, 255); /* この行が抜けていました */
  padding: 5px;
  width: 100%;
}

.tasksButtonDelete {
  flex: 0 0 80px;
  min-width: 60px;
  background-color: rgb(64, 64, 64); /* この行が抜けていました */
  color: aliceblue; /* この行も追加 */
  padding: 5px;
}
/* 全項目共通スタイル */
.tasksTitle,
.tasksDescription,
.tasksPriority,
.tasksTags,
.tasksExpiresat,
.tasksCompletedat {
  padding: 5px;
  border: aliceblue solid 0.5px;
  overflow: hidden;
  text-overflow: ellipsis; /* 長いテキストは省略 */
  white-space: nowrap;
}

/* ボタンコンテナ（デスクトップでは非表示） */
.buttonContainer {
  display: flex; /* display: none から変更 */
}
/* スマホ・タブレット用（768px以下） */
@media (max-width: 768px) {
  /* 見出し行を非表示 */
  .tasksHeader {
    display: none;
  }

  /* データ行をカード形式に変更 */
  .tasksList {
    flex-direction: column;
    border: 2px solid #ddd;
    border-radius: 8px;
    padding: 10px; /* 15px から変更 */
    margin-bottom: 15px;
  }

  /* 各項目を行として表示（上下幅を狭く） */
  .tasksTitle,
  .tasksPriority,
  .tasksTags,
  .tasksExpiresat,
  .tasksCompletedat {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 0; /* 8px から変更 */
    border: none;
    border-bottom: 1px solid #eee;
    margin-bottom: 2px; /* 5px から変更 */
  }

  /* ラベルを追加 レスポンシブの際に、ヘッダー要素を各タスクカードに表示させる */
  .tasksTitle:nth-child(1)::before {
    content: 'No. ';
    font-weight: bold;
  }
  .tasksTitle:nth-child(2)::before {
    content: 'タイトル: ';
    font-weight: bold;
  }
  .tasksPriority::before {
    content: '優先度: ';
    font-weight: bold;
  }
  .tasksTags::before {
    content: 'タグ: ';
    font-weight: bold;
  }
  .tasksExpiresat::before {
    content: '期限: ';
    font-weight: bold;
  }
  .tasksCompletedat::before {
    content: '完了日: ';
    font-weight: bold;
  }

  /* 最大3行表示の制御 */
  .tasksList .tasksTitle:nth-child(n + 4),
  .tasksList .tasksPriority:nth-child(n + 4),
  .tasksList .tasksTags:nth-child(n + 4),
  .tasksList .tasksExpiresat:nth-child(n + 4),
  .tasksList .tasksCompletedat:nth-child(n + 4) {
    display: none;
  }

  /* flex要素の固定幅を解除 */
  .tasksTitle:nth-child(1),
  .tasksTitle:nth-child(2) {
    flex: none; /* flex: 0 0 50px を解除 */
    min-width: auto; /* min-width を解除 */
    width: 100%; /* 幅を100%に設定 */
  }

  .tasksPriority {
    flex: none; /* flex: 0 0 80px を解除 */
    min-width: auto; /* min-width を解除 */
    width: 100%; /* 幅を100%に設定 */
  }

  /* 他のflex要素も同様に解除 */
  .tasksTags,
  .tasksExpiresat,
  .tasksCompletedat {
    flex: none;
    min-width: auto;
    width: 100%;
  }

  /* ボタンを可変サイズで表示（余白なし） */
  .tasksButton,
  .tasksButtonDelete {
    flex: 1; /* 均等に領域を分割 */
    margin: 0; /* margin変更 */
    padding: 8px;
    border-radius: 4px;
    text-align: center;
  }

  /* ボタンコンテナを表示 */
  .buttonContainer {
    display: flex;
    margin-top: 8px; /* 10px から変更 */
    width: 100%;
    /* gap: 10px を削除 */
    /* justify-content: space-between を削除 */
  }

  /* デスクトップ用のボタンを非表示 */
  .tasksList > .tasksButton,
  .tasksList > .tasksButtonDelete {
    display: none;
  }
}
</style>
