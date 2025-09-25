<script setup lang="ts">
import type { TaskEntity } from '@/entities/TaskEntity';
import { TaskRepository } from '@/repositories/TaskRepository';
import { taskRepository } from '@/store';
import { ref } from 'vue';

const tasks = ref<TaskEntity[]>([]);

async function getTasks() {
  tasks.value = await taskRepository.getTasks();
}

getTasks();
</script>
<template>
  <div>タスク一覧（全{{ tasks.length }}件）</div>
  <RouterLink v-for="task of tasks" :key="task.id" :class="$style.tasksList" :to="`/task/${task.id}`">
    <div :class="$style.tasksTitle">
      <span>{{ task.id }}</span>
    </div>
    <div :class="$style.tasksTitle">
      <span>{{ task.title }}</span>
    </div>
    <div :class="$style.tasksDescription">
      <span>{{ task.description }}</span>
    </div>
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
  </RouterLink>
</template>

<style lang="scss" module>
.tasksList {
  display: flex;
  border: aliceblue solid;
  width: 100%;
}
.tasksTitle {
  padding: 5px;
  border: aliceblue solid 0.5px;
  width: 100%;
}
.tasksDescription {
  padding: 5px;
  border: aliceblue solid 0.5px;
  width: 100%;
}

.tasksPriority {
  padding: 5px;
  border: aliceblue solid 0.5px;
  width: 100%;
}

.tasksTags {
  padding: 5px;
  border: aliceblue solid 0.5px;
  width: 100%;
}

.tasksExpiresat {
  padding: 5px;
  border: aliceblue solid 0.5px;
  width: 100%;
}

.tasksCompletedat {
  padding: 5px;
  border: aliceblue solid 0.5px;
  width: 100%;
}
</style>
