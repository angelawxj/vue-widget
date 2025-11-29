<template> 
  <div class="messages-list">
    <div 
      v-for="message in messages" 
      :key="message.id"
      :class="['message-bubble', message.type === 'user' ? 'user-bubble' : 'ai-bubble']"
    >
      <!-- 用户消息 -->
      <div v-if="message.type === 'user'" class="user-message">
        <div class="message-content">
          <div class="text-content">{{ message.content }}</div>
          <div class="message-time">{{ formatTime(message.time) }}</div>
        </div>
        <div class="message-avatar user-avatar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="5" stroke="currentColor" stroke-width="2"/>
            <path d="M20 20V5A2 2 0 0 0 18 2H6A2 2 0 0 0 4 5V20" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
      </div>

      <!-- AI 消息 -->
      <div v-else class="ai-message">
        <div class="message-avatar ai-avatar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <circle cx="12" cy="9" r="3" fill="currentColor"/>
            <path d="M7 19.6C7.8 18.1 9.8 17 12 17s4.2 1.1 5 1.6" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <div class="message-content">
          <!-- 如果是正在流式传输的消息，显示加载状态 -->
          <div v-if="message.isStreaming && !message.content" class="text-content loading-content">
            <div class="typing-indicator">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </div>
          </div>
          <!-- 正常显示消息内容 -->
          <div v-else class="text-content" v-html="message.htmlContent || message.content"></div>
          
          <div class="message-actions" v-if="!message.isStreaming && message.content">
            <div class="action-buttons">
              <button class="action-btn" @click="handleCopyMessage(message.content)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                  <path d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5" stroke="currentColor" stroke-width="2"/>
                </svg>
                复制
              </button>
              <button class="action-btn" @click="handleRegenerateResponse(message.id)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M23 4V10H17M1 20V14H7" stroke="currentColor" stroke-width="2"/>
                  <path d="M20.49 9C19.9828 7.56678 19.1209 6.2854 17.9845 5.27542C16.8482 4.26543 15.4745 3.55976 13.9917 3.22426C12.5089 2.88875 10.9652 2.93434 9.50481 3.35677C8.04437 3.77921 6.71475 4.56471 5.64 5.64L1 10M23 14L18.36 18.36C17.2853 19.4353 15.9556 20.2208 14.4952 20.6432C13.0348 21.0657 11.4911 21.1113 10.0083 20.7757C8.52547 20.4402 7.1518 19.7346 6.01547 18.7246C4.87913 17.7146 4.01717 16.4332 3.51 15" stroke="currentColor" stroke-width="2"/>
                </svg>
                重新生成
              </button>
            </div>
          </div>
          <div class="message-time" v-if="message.content">{{ formatTime(message.time) }}</div>
        </div>
      </div>
    </div>

    <!-- 全局加载状态（当没有具体的AI消息时显示） -->
    <div v-if="isLoading && !hasStreamingMessage" class="loading-message">
      <div class="message-avatar ai-avatar">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          <circle cx="12" cy="9" r="3" fill="currentColor"/>
          <path d="M7 19.6C7.8 18.1 9.8 17 12 17s4.2 1.1 5 1.6" stroke="currentColor" stroke-width="2"/>
        </svg>
      </div>
      <div class="message-content">
        <div class="text-content loading-content">
          <div class="typing-indicator">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MessagesList',
  props: {
    messages: {
      type: Array,
      default: () => []
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['copy-message', 'regenerate-response', 'insert-code'],
  computed: {
    // 检查是否有正在流式传输的AI消息
    hasStreamingMessage() {
      return this.messages.some(message => 
        message.type === 'ai' && message.isStreaming
      );
    }
  },
  methods: {
    handleCopyMessage(content) {
      this.$emit('copy-message', content);
    },
    
    handleRegenerateResponse(messageId) {
      this.$emit('regenerate-response', messageId);
    },
    
    handleInsertCode(code) {
      this.$emit('insert-code', code);
    },

    formatTime(timestamp) {
      if (!timestamp) return '';
      const time = timestamp instanceof Date ? timestamp : new Date(timestamp);
      return `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.messages-list {
  max-width: 800px;
  margin: 0 auto;
}

.message-bubble {
  margin-bottom: 24px;
  animation: fadeIn 0.3s ease-in;
}

.user-message,
.ai-message {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.user-message {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 4px;
}

.user-avatar {
  background: var(--user-bubble);
  color: white;
}

.ai-avatar {
  background: var(--ai-bubble);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.message-content {
  max-width: 85%;
  position: relative;
}

.user-message .message-content {
  text-align: right;
}

.text-content {
  padding: 16px 20px;
  border-radius: 18px;
  line-height: 1.6;
  word-wrap: break-word;
}

.user-message .text-content {
  background: var(--user-bubble);
  color: white;
}

.ai-message .text-content {
  background: var(--ai-bubble);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

// 加载内容样式
.loading-content {
  background: var(--ai-bubble);
  border: 1px solid var(--border-color);
  min-height: 20px;
  display: flex;
  align-items: center;
}

// 代码块样式
.ai-message .text-content {
  :deep(.code-block) {
    margin: 16px 0;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid var(--code-border);
  }

  :deep(.code-header) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background: var(--code-bg);
    border-bottom: 1px solid var(--code-border);
    font-size: 12px;
  }

  :deep(.language-label) {
    color: var(--text-secondary);
    font-weight: 500;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  }

  :deep(.code-actions) {
    display: flex;
    gap: 8px;
  }

  :deep(.code-action-btn) {
    background: var(--accent-primary);
    color: white;
    border: none;
    border-radius: 4px;
    padding: 4px 8px;
    font-size: 11px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
    transition: all 0.2s ease;

    &:hover {
      background: var(--accent-secondary);
      transform: translateY(-1px);
    }
  }

  :deep(pre) {
    margin: 0;
    padding: 16px;
    background: var(--code-bg);
    overflow-x: auto;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 13px;
    line-height: 1.4;
    color: var(--text-primary);
  }

  :deep(code) {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  }

  // Markdown 内容样式
  :deep(h1),
  :deep(h2),
  :deep(h3) {
    margin: 20px 0 12px 0;
    color: var(--text-primary);
    font-weight: 600;
  }

  :deep(h1) { font-size: 1.5em; }
  :deep(h2) { font-size: 1.3em; }
  :deep(h3) { font-size: 1.1em; }

  :deep(p) {
    margin: 12px 0;
    line-height: 1.6;
  }

  :deep(ul),
  :deep(ol) {
    margin: 12px 0;
    padding-left: 24px;
  }

  :deep(li) {
    margin: 6px 0;
  }

  :deep(blockquote) {
    border-left: 4px solid var(--accent-primary);
    padding-left: 16px;
    margin: 16px 0;
    color: var(--text-secondary);
    font-style: italic;
  }

  :deep(strong) {
    font-weight: 600;
    color: var(--text-primary);
  }

  :deep(em) {
    font-style: italic;
    color: var(--text-secondary);
  }
}

// 消息操作按钮
.message-actions {
  margin-top: 8px;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.action-btn {
  background: none;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 6px 12px;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: var(--bg-tertiary);
    color: var(--text-primary);
  }
}

.message-time {
  font-size: 12px;
  color: var(--text-tertiary);
  margin-top: 6px;
}

.user-message .message-time {
  text-align: right;
}

// 加载状态
.loading-message {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 4px 0;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--text-tertiary);
  animation: typing 1.4s infinite ease-in-out;

  &:nth-child(1) { animation-delay: -0.32s; }
  &:nth-child(2) { animation-delay: -0.16s; }
}

@keyframes typing {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@include mobile {
  .message-content {
    max-width: 90%;
  }
  
  .text-content {
    padding: 12px 16px;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 8px;
  }
}
</style>