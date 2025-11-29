<template>
  <div class="chat-widget">
    <div class="chat-header">
      <h2>AI 问答</h2>
      <el-button @click="toggleTheme">切换主题</el-button>
    </div>
    <div class="chat-body">
      <div 
        v-for="(message, index) in messages" 
        :key="index" 
        class="chat-message"
        :class="{ 'isUser': message.isUser }"
      >
        <p>{{ message.text }}</p>
      </div>
    </div>
    <div class="chat-footer">
      <el-input 
        v-model="userInput" 
        @keyup.enter="sendMessage" 
        placeholder="输入问题..."
        :disabled="isLoading"
      ></el-input>
      <el-button @click="sendMessage" :disabled="isLoading">发送</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChatWidget', // 确保有明确的 name
  data() {
    return {
      userInput: '',
      messages: [],
      isLoading: false,
      loadingMessage: "加载中",
    };
  },
  methods: {
    sendMessage() {
      if (this.userInput.trim() && !this.isLoading) {
        const newMessage = { text: this.userInput, isUser: true };
        this.messages.push(newMessage);
        const userInput = this.userInput;
        this.userInput = '';
        this.isLoading = true;
        
        // 移除之前的加载消息（如果有）
        if (this.messages[this.messages.length - 1]?.text === this.loadingMessage) {
          this.messages.pop();
        }
        
        this.messages.push({ text: this.loadingMessage, isUser: false });
        this.getAIResponse(userInput);
      }
    },
    getAIResponse(prompt) {
      let answer = `我听到了你的问题："${prompt}"，这是一个模拟响应。在实际使用中，这里会调用真实的AI API。`;
      let dotCount = 0;
      
      // 先清除加载消息
      this.messages.pop();
      
      const interval = setInterval(() => {
        if (dotCount < 3) {
          this.loadingMessage = "加载中" + '.'.repeat(dotCount + 1);
          this.messages.push({ text: this.loadingMessage, isUser: false });
          dotCount++;
        } else {
          clearInterval(interval);
          // 清除最后的加载消息
          this.messages.pop();
          // 添加最终响应
          this.messages.push({ text: answer, isUser: false });
          this.isLoading = false;
          this.loadingMessage = "加载中"; // 重置
        }
      }, 500);
    },
    toggleTheme() {
      // 移除 Vuex 依赖，使用本地状态
      document.body.classList.toggle('dark-theme');
    },
  },
};
</script>

<style scoped>
.chat-widget {
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: white;
  display: flex;
  flex-direction: column;
  margin: 20px auto;
  max-width: 500px;
  height: 400px;
}

.chat-header {
  background-color: #2d3a4a;
  color: white;
  padding: 10px;
  text-align: center;
  border-radius: 10px 10px 0 0;
}

.chat-body {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  max-height: 300px;
}

.chat-footer {
  display: flex;
  padding: 10px;
  gap: 10px;
}

.chat-message {
  padding: 8px 12px;
  margin-bottom: 10px;
  background-color: #f1f1f1;
  border-radius: 5px;
  word-wrap: break-word;
}

.chat-message.isUser {
  background-color: #e0f7fa;
  text-align: right;
}
</style>