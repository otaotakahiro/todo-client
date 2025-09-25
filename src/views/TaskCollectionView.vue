<script setup lang="ts">
import type { FormDataEntity } from '@/Entity/TaskEntity';
import { ref } from 'vue';

const tasks = ref<FormDataEntity[]>([
  {
    id: '07d42c3c-2fdc-4dec-b3a9-dda55f751aa7',
    title: 'task1',
    description: 'task詳細11111111',
    status: 'pending',
    priority: 'low',
    tags: ['やる気', '元気', 'いわきNEW'],
    startedAt: '2025-90-16',
    expiresAt: '2025-90-15',
    completedAt: '',
  },
  {
    id: '11fd97df-711c-4998-8970-f876134f6f3b',
    title: 'task2',
    description: 'task詳細22222222222222',
    status: 'pending',
    priority: 'low',
    tags: ['やる気', '元気', 'いわきNEW'],
    startedAt: '',
    expiresAt: '',
    completedAt: '',
  },
  {
    id: '2664efdf-a9b7-410b-b60c-736178186537',
    title: 'task3',
    description: 'task詳細3333333333333333',
    status: 'pending',
    priority: 'low',
    tags: ['やる気', '元気', 'いわきNEW'],
    startedAt: '',
    expiresAt: '',
    completedAt: '',
  },
]);

void (async () => {
  const response = await window.fetch(`http://localhost:8787/api/v1/tasks`, {
    // method: 'GET',
    headers: {
      'Content-type': 'application/json',
    },
  });
  const json = await response.json();
  console.log(json);
  tasks.value = json;
})();
</script>
<template>
  <div>タスク一覧</div>
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
  border: aliceblue solid;
  width: 150px;
}
.tasksDescription {
  border: aliceblue solid;
  width: 300px;
}

.tasksPriority {
  border: aliceblue solid;
  width: 100px;
}

.tasksTags {
  border: aliceblue solid;
  width: 100%;
}

.tasksExpiresat {
  border: aliceblue solid;
  width: 100%;
}

.tasksCompletedat {
  border: aliceblue solid;
  width: 100%;
}
</style>
