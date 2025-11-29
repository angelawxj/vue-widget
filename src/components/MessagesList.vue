<template>
  <div class="messages-list">
    <div
      v-for="message in messages"
      :key="message.id"
      :class="['message-bubble', message.type === 'user' ? 'user-bubble' : 'ai-bubble']"
    >
      <!-- 用户消息 -->
      <div v-if="message.type === 'user'" class="user-message">
        <div class="message-content message-user-content">
          <div class="text-content">{{ message.content }}</div>
          <div class="message-time">{{ formatTime(message.time) }}</div>
        </div>
        <div class="message-avatar user-avatar">
          <img :src="userIcon" alt="用户" class="icon-img" />
        </div>
      </div>

      <!-- AI 消息 -->
      <div v-else class="ai-message">
        <div class="message-avatar ai-avatar">
          <img :src="aiIcon" alt="AI" class="icon-img" />
        </div>
        <div class="message-content message-ai-content">
          <!-- 流式传输加载状态 -->
          <div v-if="message.isStreaming && !message.content" class="text-content loading-content">
            <div class="typing-indicator">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </div>
          </div>

          <!-- 正常消息内容 -->
          <div v-else class="text-content" v-html="formatMessageContent(message)"></div>

          <!-- 消息操作按钮 -->
          <div class="message-actions" v-if="!message.isStreaming && message.content">
            <div class="action-buttons">
              <button class="action-btn" @click="handleCopyMessage(message.content)">
                <img :src="copyIcon" alt="复制" class="action-icon" />
                复制
              </button>
              <button class="action-btn" @click="handleRegenerateResponse(message.id)">
                <img :src="refreshIcon" alt="重新生成" class="action-icon" />
                重新生成
              </button>
            </div>
          </div>

          <div class="message-time" v-if="message.content">{{ formatTime(message.time) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import MarkdownIt from 'markdown-it';

// 导入 SVG 图标
import aiIcon from '@/assets/svg/ai.svg';
import copyIcon from '@/assets/svg/copy.svg';
import refreshIcon from '@/assets/svg/refresh.svg';
import userIcon from '@/assets/svg/user.svg';

export default {
  name: 'MessagesList',
  props: {
    messages: {
      type: Array,
      default: () => [],
      validator: (value) => {
        return value.every(
          (item) =>
            item &&
            typeof item.id === 'string' &&
            ['user', 'ai'].includes(item.type) &&
            typeof item.content === 'string'
        );
      },
    },
  },
  emits: ['copy-message', 'regenerate-response'],
  data() {
    return {
      userIcon,
      aiIcon,
      copyIcon,
      refreshIcon,
      md: null,
    };
  },
  created() {
    this.initMarkdownIt();
  },
  methods: {
    initMarkdownIt() {
      this.md = new MarkdownIt({
        html: true,
        linkify: true,
        typographer: true,
        highlight: this.highlightCode.bind(this),
      });
    },

    // 代码高亮函数 - 添加DeepSeek风格的header
    highlightCode(str, lang) {
      let codeContent = '';

      if (lang && hljs.getLanguage(lang)) {
        try {
          codeContent = hljs.highlight(str, {
            language: lang,
            ignoreIllegals: true,
          }).value;
        } catch (e) {
          console.warn('代码高亮错误:', e);
          codeContent = this.md.utils.escapeHtml(str);
        }
      } else {
        try {
          codeContent = hljs.highlightAuto(str).value;
        } catch (e) {
          codeContent = this.md.utils.escapeHtml(str);
        }
      }

      // DeepSeek风格的代码块header
      const languageLabel = lang || 'text';
      const copyButton = `
        <button class="code-copy-btn" title="复制代码">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
          </svg>
        </button>
      `;

      return `
        <div class="code-block-wrapper">
          <div class="code-header">
            <div class="code-language">${languageLabel}</div>
            <div class="code-actions">
              ${copyButton}
            </div>
          </div>
          <div class="code-content">
            <pre><code class="hljs ${lang || ''}">${codeContent}</code></pre>
          </div>
        </div>
      `;
    },

    handleCopyMessage(content) {
      this.$emit('copy-message', content);
    },

    handleRegenerateResponse(messageId) {
      this.$emit('regenerate-response', messageId);
    },

    formatTime(timestamp) {
      if (!timestamp) return '';

      const time = timestamp instanceof Date ? timestamp : new Date(timestamp);
      if (isNaN(time.getTime())) return '';

      return time.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    },

    // 格式化消息内容
    formatMessageContent(message) {
      if (!message.content) return '';
      const renderedContent = this.md.render(message.content);

      // 在内容渲染后绑定复制事件
      this.$nextTick(() => {
        this.bindCodeCopyEvents();
      });

      return renderedContent;
    },

    // 绑定代码复制事件
    bindCodeCopyEvents() {
      const codeBlocks = this.$el.querySelectorAll('.code-block-wrapper');
      codeBlocks.forEach((block) => {
        const copyBtn = block.querySelector('.code-copy-btn');
        const codeElement = block.querySelector('code');

        if (copyBtn && codeElement) {
          // 移除旧的事件监听器
          copyBtn.replaceWith(copyBtn.cloneNode(true));
          const newCopyBtn = block.querySelector('.code-copy-btn');

          newCopyBtn.addEventListener('click', async () => {
            const code = codeElement.textContent;
            await this.handleCopyCode(code, newCopyBtn);
          });
        }
      });
    },

    // 处理代码复制
    async handleCopyCode(code, button) {
      try {
        await navigator.clipboard.writeText(code);
        this.$emit('copy-code', code);
        // 复制成功反馈
        const originalHTML = button.innerHTML;

        button.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        `;
        button.style.color = '#10b981';

        setTimeout(() => {
          button.innerHTML = originalHTML;
          button.style.color = '';
        }, 2000);
      } catch (err) {
        console.error('复制失败:', err);
      }
    },
  },
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

.message-ai-content {
  width: 100%;
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

// 图标样式
.icon-img {
  width: 20px;
  height: 20px;
}

.action-icon {
  width: 14px;
  height: 14px;
}

// 加载内容样式
.loading-content {
  background: var(--ai-bubble);
  border: 1px solid var(--border-color);
  min-height: 20px;
  display: flex;
  align-items: center;
}

// DeepSeek风格的代码块样式
.ai-message .text-content {
  :deep(.code-block-wrapper) {
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid var(--code-border, #e5e7eb);
    background: var(--code-bg, #f8f9fa);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
  }

  :deep(.code-header) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: var(--code-header-bg, #f1f3f4);
    border-bottom: 1px solid var(--code-border, #e5e7eb);
    font-size: 13px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    min-height: 44px;
    box-sizing: border-box;
  }

  :deep(.code-language) {
    color: var(--text-secondary, #6b7280);
    font-weight: 500;
    font-size: 13px;
    text-transform: none;
    letter-spacing: 0;
    padding: 4px 8px;
    border-radius: 6px;
  }

  :deep(.code-actions) {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  :deep(.code-copy-btn) {
    background: transparent;
    border: 1px solid var(--code-btn-border, #d1d5db);
    border-radius: 6px;
    padding: 6px 8px;
    color: var(--text-secondary, #6b7280);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    width: 32px;
    height: 32px;

    &:hover {
      background: var(--code-btn-hover-bg, #f3f4f6);
      border-color: var(--code-btn-hover-border, #9ca3af);
      color: var(--text-primary, #374151);
      transform: none;
    }

    &:active {
      transform: scale(0.95);
    }

    svg {
      width: 16px;
      height: 16px;
    }
  }

  :deep(.code-content) {
    background: var(--code-content-bg, #ffffff);
    padding: 10px;
    display: flex;
  }

  :deep(pre) {
    margin: 0;
    overflow-x: auto;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 14px;
    color: var(--text-primary, #1f2937);

    &::-webkit-scrollbar {
      height: 8px;
    }

    &::-webkit-scrollbar-track {
      background: var(--scrollbar-track, #f1f1f1);
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: var(--scrollbar-thumb, #c1c1c1);
      border-radius: 4px;

      &:hover {
        background: var(--scrollbar-thumb-hover, #a8a8a8);
      }
    }
  }

  :deep(code) {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    background: transparent !important;
    padding: 0 !important;
    font-size: 14px;
  }

  :deep(.inline-code) {
    background: var(--code-inline-bg, #f3f4f6);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.9em;
    color: var(--code-inline-color, #dc2626);
    border: 1px solid var(--code-inline-border, #e5e7eb);
  }

  // 高亮样式覆盖
  :deep(.hljs) {
    background: transparent !important;
  }

  // Markdown 内容样式
  :deep(h1),
  :deep(h2),
  :deep(h3) {
    margin: 20px 0 12px 0;
    color: var(--text-primary);
    font-weight: 600;
  }

  :deep(h1) {
    font-size: 1.5em;
  }
  :deep(h2) {
    font-size: 1.3em;
  }
  :deep(h3) {
    font-size: 1.1em;
  }

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

  &:nth-child(1) {
    animation-delay: -0.32s;
  }
  &:nth-child(2) {
    animation-delay: -0.16s;
  }
}

@keyframes typing {
  0%,
  80%,
  100% {
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

// 移动端适配
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

  .ai-message .text-content {
    :deep(.code-header) {
      padding: 10px 12px;
      min-height: 40px;
    }

    :deep(pre) {
      padding: 16px;
      font-size: 13px;
    }
  }
}
</style>
