<template>
  <div class="chat-toolbar">
    <div class="toolbar-left">
      <div class="model-selector">
        <span class="model-name">DeepSeek</span>
        <span class="model-version">V3</span>
      </div>
    </div>
    <div class="toolbar-right">
      <button class="toolbar-btn" @click="$emit('toggle-theme')" title="切换主题">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" stroke-width="2"/>
          <path d="M12 2V4" stroke="currentColor" stroke-width="2"/>
          <path d="M12 20V22" stroke="currentColor" stroke-width="2"/>
          <path d="M4.93 4.93L6.34 6.34" stroke="currentColor" stroke-width="2"/>
          <path d="M17.66 17.66L19.07 19.07" stroke="currentColor" stroke-width="2"/>
          <path d="M2 12H4" stroke="currentColor" stroke-width="2"/>
          <path d="M20 12H22" stroke="currentColor" stroke-width="2"/>
          <path d="M6.34 17.66L4.93 19.07" stroke="currentColor" stroke-width="2"/>
          <path d="M19.07 4.93L17.66 6.34" stroke="currentColor" stroke-width="2"/>
        </svg>
      </button>
      <button class="toolbar-btn" @click="$emit('clear-chat')" title="清空对话">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M3 6H5H21M5 6V20C5 20.5304 5.21071 21.0391 5.58579 21.4142C5.96086 21.7893 6.46957 22 7 22H17C17.5304 22 18.0391 21.7893 18.4142 21.4142C18.7893 21.0391 19 20.5304 19 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6" stroke="currentColor" stroke-width="2"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChatToolbar',
  emits: ['toggle-theme', 'clear-chat']
};
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.chat-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: var(--toolbar-bg);
  border-bottom: 1px solid var(--border-color);
}

.model-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}

.model-name {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 16px;
}

.model-version {
  background: var(--accent-primary);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.toolbar-right {
  display: flex;
  gap: 8px;
}

.toolbar-btn {
  background: none;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 6px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--bg-tertiary);
    color: var(--text-primary);
  }
}

@include mobile {
  .chat-toolbar {
    padding: 10px 16px;
  }
}
</style>