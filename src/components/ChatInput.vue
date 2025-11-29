<template>
  <div class="chat-input-container">
    <div class="input-wrapper">
      <div class="input-box" :class="{ focused: isFocused }">
        <textarea
          v-model="modelValue"
          @input="handleInput"
          @keydown.enter.exact.prevent="handleSend"
          @focus="isFocused = true"
          @blur="isFocused = false"
          placeholder="输入您的问题..."
          :disabled="isLoading"
          rows="1"
          class="message-input"
          ref="messageInput"
        ></textarea>
        <button
          class="send-button"
          @click="handleSend"
          :disabled="!modelValue.trim() || isLoading"
          :title="modelValue.trim() ? '发送消息' : '请输入消息'"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" v-if="!isLoading">
            <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="currentColor" />
          </svg>
          <div class="loading-spinner" v-else></div>
        </button>
      </div>
      <div class="input-footer">
        <div class="footer-tips">
          <span>内容由 AI 生成，请仔细甄别</span>
        </div>
        <div class="footer-actions">
          <button
            class="footer-action-btn"
            :class="{ active: deepThinking }"
            @click="handleToggleDeepThinking"
            :title="deepThinking ? '关闭深度思考' : '开启深度思考'"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z"
                stroke="currentColor"
                stroke-width="2"
              />
              <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" />
            </svg>
            {{ deepThinking ? '88 深度思考' : '深度思考' }}
          </button>
          <button
            class="footer-action-btn"
            :class="{ active: webSearch }"
            @click="handleToggleWebSearch"
            :title="webSearch ? '关闭联网搜索' : '开启联网搜索'"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                stroke="currentColor"
                stroke-width="2"
              />
            </svg>
            {{ webSearch ? '联网搜索' : '联网搜索' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChatInput',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    deepThinking: {
      type: Boolean,
      default: false,
    },
    webSearch: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue', 'send-message', 'toggle-deep-thinking', 'toggle-web-search'],
  data() {
    return {
      isFocused: false,
    };
  },
  mounted() {
    this.setupAutoResize();
  },
  methods: {
    setupAutoResize() {
      const textarea = this.$refs.messageInput;
      if (textarea) {
        textarea.addEventListener('input', this.autoResize);
      }
    },

    autoResize(event) {
      const textarea = event.target;
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    },

    handleInput(event) {
      this.$emit('update:modelValue', event.target.value);
    },

    handleSend() {
      this.$emit('send-message', this.modelValue);
    },

    handleToggleDeepThinking() {
      this.$emit('toggle-deep-thinking');
    },

    handleToggleWebSearch() {
      this.$emit('toggle-web-search');
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.chat-input-container {
  background: var(--bg-primary);
  border-top: 1px solid var(--border-color);
  padding: 20px;
}

.input-wrapper {
  max-width: 800px;
  margin: 0 auto;
}

.input-box {
  display: flex;
  gap: 12px;
  align-items: flex-end;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 12px;
  transition: all 0.2s ease;
  align-items: center;
  &.focused {
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
  }
}

.message-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  resize: none;
  font-size: 14px;
  line-height: 1.5;
  color: var(--text-primary);
  font-family: inherit;
  max-height: 120px;

  &::placeholder {
    color: var(--text-tertiary);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.send-button {
  background: var(--accent-primary);
  border: none;
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    background: var(--accent-secondary);
    transform: scale(1.05);
  }
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.input-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.footer-tips {
  font-size: 12px;
  color: var(--text-tertiary);
}

.footer-actions {
  display: flex;
  gap: 16px;
}

.footer-action-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
  padding: 4px 8px;
  border-radius: 4px;

  &:hover,
  &.active {
    background: var(--accent-primary);
    color: white;
  }
}

@include mobile {
  .chat-input-container {
    padding: 16px;
  }

  .input-footer {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }

  .footer-actions {
    align-self: flex-end;
  }
}
</style>
