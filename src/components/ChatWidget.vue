<template>
  <div class="deepseek-chat" :class="currentTheme">
    <ChatToolbar
      :current-theme="currentTheme"
      @toggle-theme="toggleTheme"
      @clear-chat="clearChat"
    />

    <ChatContent
      :messages="messages"
      :is-loading="isLoading"
      @select-quick-question="selectQuickQuestion"
      @copy-code="insertCode"
      @copy-message="copyMessage"
      @regenerate-response="regenerateResponse"
      @insert-code="handleInsertCode"
    />

    <ChatInput
      v-model="userInput"
      :is-loading="isLoading"
      :deep-thinking="deepThinking"
      :web-search="webSearch"
      @send-message="sendMessage"
      @toggle-deep-thinking="toggleDeepThinking"
      @toggle-web-search="toggleWebSearch"
    />
  </div>
</template>

<script>
import { getDefaultResponse, welcomeMessage } from '@/data/mockData';
import '@/styles/theme.scss';
import ChatContent from './ChatContent.vue';
import ChatInput from './ChatInput.vue';
import ChatToolbar from './ChatToolbar.vue';

export default {
  name: 'ChatWidget',
  components: {
    ChatToolbar,
    ChatContent,
    ChatInput,
  },
  props: {
    theme: {
      type: String,
      default: 'light',
      validator: (value) => ['light', 'dark'].includes(value),
    },
  },
  data() {
    return {
      messages: [],
      userInput: '',
      isLoading: false,
      markdownIt: null,
      messageIdCounter: 1,
      currentTheme: 'light',
      modelValue: '',
      deepThinking: false,
      webSearch: false,
    };
  },
  mounted() {
    this.currentTheme = this.theme;
    this.initializeMarkdown();
    this.addWelcomeMessage();
  },
  watch: {
    theme(newTheme) {
      if (newTheme === 'light' || newTheme === 'dark') {
        this.currentTheme = newTheme;
      }
    },
  },
  methods: {
    async initializeMarkdown() {
      try {
        const MarkdownIt = await import('markdown-it');
        this.markdownIt = new MarkdownIt.default({
          html: true,
          linkify: true,
          typographer: true,
          breaks: true,
        });
      } catch (error) {
        console.warn('Markdown初始化失败:', error);
        this.markdownIt = {
          render: (text) => text.replace(/\n/g, '<br>'),
        };
      }
    },

    // ChatWidget.vue 中的 addWelcomeMessage 方法
    addWelcomeMessage() {
      // 确保 welcomeMessage 正确导入
      console.log('welcomeMessage:', welcomeMessage); // 添加调试

      if (welcomeMessage && welcomeMessage.content) {
        this.messages.push({
          id: this.messageIdCounter++,
          type: 'ai',
          content: welcomeMessage.content,
          htmlContent: welcomeMessage.content, // 直接使用 content，因为还没有 markdown 渲染
          time: new Date(),
        });
      }
    },

    selectQuickQuestion(question) {
      this.userInput = question;
      this.sendMessage();
    },

    async sendMessage(inputText) {
      const question = this.userInput.trim() || inputText;
      if (!question || this.isLoading) return;

      const userMessage = {
        id: this.messageIdCounter++,
        type: 'user',
        content: question,
        time: new Date(),
      };
      this.messages.push(userMessage);

      this.userInput = '';
      this.isLoading = true;

      await this.simulateAIResponse();

      this.isLoading = false;
    },

    async simulateAIResponse() {
      const aiMessage = {
        id: this.messageIdCounter++,
        type: 'ai',
        content: '',
        htmlContent: '',
        isStreaming: true,
        time: new Date(),
      };
      this.messages.push(aiMessage);
      await this.delay(1000);
      const lastUserMessage = this.messages[this.messages.length - 2].content;
      const response = getDefaultResponse(lastUserMessage);
      const messageIndex = this.messages.findIndex((msg) => msg.id === aiMessage.id);

      // 直接设置完整的响应内容
      this.messages[messageIndex].content = response;
      this.messages[messageIndex].isStreaming = false;
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },
    copyCode(code) {
      navigator.clipboard
        .writeText(code)
        .then(() => {
          this.$message.success('代码已复制到剪贴板');
        })
        .catch(() => {
          // 降级方案
          const textarea = document.createElement('textarea');
          textarea.value = code;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
          this.$message.success('代码已复制到剪贴板');
        });
    },
    copyMessage(content) {
      navigator.clipboard
        .writeText(content)
        .then(() => {
          this.$message.success('已复制到剪贴板');
        })
        .catch(() => {
          // 降级方案
          const textarea = document.createElement('textarea');
          textarea.value = content;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
          this.$message.success('已复制到剪贴板');
        });
    },

    regenerateResponse(messageId) {
      const messageIndex = this.messages.findIndex((msg) => msg.id === messageId);
      if (messageIndex > 0) {
        const userMessage = this.messages[messageIndex - 1];
        this.messages.splice(messageIndex, 1);
        this.userInput = userMessage.content;
        this.sendMessage();
      }
    },

    handleInsertCode(code) {
      this.$emit('insert-code', code);
    },

    toggleTheme() {
      const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
      this.currentTheme = newTheme;
      this.$emit('theme-change', newTheme);
    },

    toggleDeepThinking() {
      this.deepThinking = !this.deepThinking;
    },

    toggleWebSearch() {
      this.webSearch = !this.webSearch;
    },

    clearChat() {
      this.messages = [];
      this.addWelcomeMessage();
    },

    delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },

    scrollToBottom() {
      this.$nextTick(() => {
        // 滚动逻辑在 ChatContent 组件中实现
      });
    },

    // 外部调用方法
    setTheme(theme) {
      if (theme === 'light' || theme === 'dark') {
        this.currentTheme = theme;
        this.$emit('theme-change', theme);
      }
    },

    askQuestions(params) {
      if (params && params.prompt) {
        this.userInput = params.prompt;
        this.$nextTick(() => {
          this.sendMessage();
        });
      }
    },

    setWindowState(state) {
      this.$emit('window-state-change', Boolean(state));
    },

    insertCode(code) {
      if (code) {
        const codeMessage = {
          id: this.messageIdCounter++,
          type: 'ai',
          content: `插入的代码：\n\n\`\`\`\n${code}\n\`\`\``,
          htmlContent: '',
          time: new Date(),
        };

        if (this.markdownIt) {
          codeMessage.htmlContent = this.markdownIt.render(codeMessage.content);
        }

        this.messages.push(codeMessage);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.deepseek-chat {
  @extend .chat-container;

  &.light {
    @include light-theme;
  }

  &.dark {
    @include dark-theme;
  }
}
</style>
