<template>
  <div class="chat-content" ref="messagesContainer">
    <WelcomeSection
      v-if="messages.length === 0"
      @select-quick-question="$emit('select-quick-question', $event)"
    />

    <MessagesList
      :messages="messages"
      :is-loading="isLoading"
      @copy-code="$emit('copy-code', $event)"
      @copy-message="$emit('copy-message', $event)"
      @regenerate-response="$emit('regenerate-response', $event)"
      @insert-code="$emit('insert-code', $event)"
    />
  </div>
</template>

<script>
import WelcomeSection from './WelcomeSection.vue';
import MessagesList from './MessagesList.vue';

export default {
  name: 'ChatContent',
  components: {
    WelcomeSection,
    MessagesList,
  },
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
  emits: ['select-quick-question', 'copy-message', 'regenerate-response', 'insert-code'],
  mounted() {
    this.scrollToBottom();
  },
  watch: {
    messages: {
      handler() {
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      },
      deep: true,
    },
  },
  methods: {
    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.chat-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: var(--bg-primary);
  @include scrollbar;
}

@include mobile {
  .chat-content {
    padding: 16px;
  }
}
</style>
