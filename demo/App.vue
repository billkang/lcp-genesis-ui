<template>
  <Button color="red" :round="false" @click="add">{{ num }}</Button>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const num = ref(0);
const add = () => {
  num.value++;
};
</script>
