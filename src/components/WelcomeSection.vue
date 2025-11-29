<template>
  <div class="welcome-section">
    <div class="welcome-avatar">
      <div class="avatar-circle">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          <circle cx="12" cy="9" r="3" fill="currentColor"/>
          <path d="M7 19.6C7.8 18.1 9.8 17 12 17s4.2 1.1 5 1.6" stroke="currentColor" stroke-width="2"/>
        </svg>
      </div>
    </div>
    <div class="welcome-text">
      <h2>我是 DeepSeek AI 助手</h2>
      <p>很高兴为您服务！我可以帮您解答问题、编写代码、分析问题等</p>
    </div>
    <div class="quick-questions">
      <div 
        v-for="(question, index) in quickQuestions" 
        :key="index"
        class="quick-question"
        @click="handleQuestionClick(question)"
      >
        {{ question.text }}
      </div>
    </div>
  </div>
</template>

<script>
import { quickQuestions } from '@/data/mockData';

export default {
  name: 'WelcomeSection',
  emits: ['select-quick-question'],
  data() {
    return {
      quickQuestions
    };
  },
  methods: {
    handleQuestionClick(question) {
      this.$emit('select-quick-question', question.prompt);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.welcome-section {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 20px;
}

.welcome-avatar {
  margin-bottom: 20px;
}

.avatar-circle {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--accent-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  color: white;
}

.welcome-text {
  h2 {
    margin: 0 0 12px 0;
    color: var(--text-primary);
    font-size: 24px;
    font-weight: 600;
  }

  p {
    margin: 0 0 30px 0;
    color: var(--text-secondary);
    font-size: 16px;
    line-height: 1.5;
  }
}

.quick-questions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  max-width: 500px;
  margin: 0 auto;
}

.quick-question {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 16px;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  text-align: left;

  &:hover {
    background: var(--accent-primary);
    color: white;
    transform: translateY(-2px);
  }
}

@include mobile {
  .welcome-section {
    padding: 20px 0;
  }
  
  .quick-questions {
    grid-template-columns: 1fr;
  }
}
</style>