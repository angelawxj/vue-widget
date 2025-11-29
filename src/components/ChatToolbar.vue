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
        <img :src="themeToggleIcon" alt="切换主题" class="toolbar-icon" />
      </button>
      <button class="toolbar-btn" @click="$emit('clear-chat')" title="清空对话">
        <img :src="clearChatIcon" alt="清空对话" class="toolbar-icon" />
      </button>
    </div>
  </div>
</template>

<script>
// 导入 SVG 图标
import clearChatIcon from '@/assets/svg/clear-chat.svg';
import themeToggleIcon from '@/assets/svg/theme-toggle.svg';

export default {
  name: 'ChatToolbar',
  emits: ['toggle-theme', 'clear-chat'],
  data() {
    return {
      themeToggleIcon,
      clearChatIcon,
    };
  },
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

.toolbar-icon {
  width: 16px;
  height: 16px;
}

@include mobile {
  .chat-toolbar {
    padding: 10px 16px;
  }
}
</style>
