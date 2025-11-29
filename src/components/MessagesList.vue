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
          <!-- 如果是正在流式传输的消息，显示加载状态 -->
          <div v-if="message.isStreaming && !message.content" class="text-content loading-content">
            <div class="typing-indicator">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </div>
          </div>
          <!-- 正常显示消息内容 -->
          <div v-else class="text-content" v-html="formatMessageContent(message)"></div>

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
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['copy-message', 'regenerate-response', 'insert-code'],
  data() {
    return {
      userIcon,
      aiIcon,
      copyIcon,
      refreshIcon,
    };
  },
  computed: {
    // 检查是否有正在流式传输的AI消息
    hasStreamingMessage() {
      return this.messages.some((message) => message.type === 'ai' && message.isStreaming);
    },
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
      return `${time.getHours().toString().padStart(2, '0')}:${time
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;
    },

    // 格式化消息内容，处理代码高亮
    formatMessageContent(message) {
      // 如果已经有处理好的 HTML 内容，直接返回
      if (message.htmlContent) {
        return message.htmlContent;
      }

      // 如果是纯文本内容，进行 Markdown 和代码高亮处理
      if (message.content) {
        return this.processMarkdownAndCode(message.content);
      }

      return '';
    },

    // 处理 Markdown 和代码高亮
    processMarkdownAndCode(content) {
      // 简单的 Markdown 代码块解析
      const codeBlockRegex = /```(\w+)?\s*([\s\S]*?)```/g;

      let processedContent = content;
      let match;
      let lastIndex = 0;
      let result = '';

      // 处理代码块
      while ((match = codeBlockRegex.exec(content)) !== null) {
        // 添加代码块之前的内容
        result += this.escapeHtml(content.slice(lastIndex, match.index));

        const language = match[1] || 'plaintext';
        const code = match[2].trim();

        // 使用 highlight.js 高亮代码
        let highlightedCode;
        if (language && hljs.getLanguage(language)) {
          try {
            highlightedCode = hljs.highlight(code, { language }).value;
          } catch (e) {
            highlightedCode = hljs.highlightAuto(code).value;
          }
        } else {
          highlightedCode = hljs.highlightAuto(code).value;
        }

        // 创建代码块 HTML
        result += this.createCodeBlock(highlightedCode, language, code);

        lastIndex = match.index + match[0].length;
      }

      // 添加剩余内容
      result += this.escapeHtml(content.slice(lastIndex));

      // 处理简单的 Markdown 格式
      result = this.processSimpleMarkdown(result);

      return result;
    },

    // 创建代码块 HTML 结构
    createCodeBlock(highlightedCode, language, rawCode) {
      return `
        <div class="code-block">
          <div class="code-header">
            <span class="language-label">${language}</span>
            <div class="code-actions">
              <button class="code-action-btn" onclick="this.closest('.code-block').__vueParentComponent.ctx.handleCopyCode('${this.escapeSingleQuotes(
                rawCode
              )}')">
                <img src="${copyIcon}" alt="复制代码" class="code-action-icon" />
                复制代码
              </button>
            </div>
          </div>
          <pre><code class="hljs ${language}">${highlightedCode}</code></pre>
        </div>
      `;
    },

    // 处理简单的 Markdown 格式
    processSimpleMarkdown(text) {
      // 处理粗体 **text**
      text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

      // 处理斜体 *text*
      text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');

      // 处理行内代码 `code`
      text = text.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

      // 处理换行
      text = text.replace(/\n/g, '<br>');

      return text;
    },

    // HTML 转义
    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    },

    // 转义单引号，用于 JavaScript 字符串
    escapeSingleQuotes(text) {
      return text.replace(/'/g, "\\'").replace(/\n/g, '\\n');
    },

    // 复制代码块内容
    handleCopyCode(code) {
      navigator.clipboard
        .writeText(code)
        .then(() => {
          // 可以在这里添加复制成功的反馈
          console.log('代码已复制到剪贴板');
        })
        .catch((err) => {
          console.error('复制失败:', err);
        });
    },
  },

  mounted() {
    // 在组件挂载后，为代码块设置父组件引用
    this.$nextTick(() => {
      document.querySelectorAll('.code-block').forEach((block) => {
        block.__vueParentComponent = this.$.parent;
      });
    });
  },

  updated() {
    // 在组件更新后，重新为代码块设置父组件引用
    this.$nextTick(() => {
      document.querySelectorAll('.code-block').forEach((block) => {
        block.__vueParentComponent = this.$.parent;
      });
    });
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

.code-action-icon {
  width: 12px;
  height: 12px;
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
    background: var(--code-bg);
  }

  :deep(.code-header) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background: var(--code-header-bg, var(--code-bg));
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
    background: transparent !important;
    padding: 0 !important;
  }

  :deep(.inline-code) {
    background: var(--code-inline-bg);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.9em;
    color: var(--code-inline-color);
    border: 1px solid var(--code-border);
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
