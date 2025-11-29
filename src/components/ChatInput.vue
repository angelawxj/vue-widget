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
          <img :src="sendIcon" alt="发送" class="send-icon" v-if="!isLoading" />
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
            <img :src="deepThinkingIcon" alt="深度思考" class="action-icon" />
            {{ deepThinking ? '88 深度思考' : '深度思考' }}
          </button>
          <button
            class="footer-action-btn"
            :class="{ active: webSearch }"
            @click="handleToggleWebSearch"
            :title="webSearch ? '关闭联网搜索' : '开启联网搜索'"
          >
            <img :src="webSearchIcon" alt="联网搜索" class="action-icon" />
            {{ webSearch ? '联网搜索' : '联网搜索' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 导入 SVG 图标
import deepThinkingIcon from '@/assets/svg/deep-thinking.svg';
import sendIcon from '@/assets/svg/send.svg';
import webSearchIcon from '@/assets/svg/web-search.svg';

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
      sendIcon,
      deepThinkingIcon,
      webSearchIcon,
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

.send-icon {
  width: 18px;
  height: 18px;
  fill: #fff;
}

.action-icon {
  width: 14px;
  height: 14px;
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

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
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
