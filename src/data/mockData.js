// src/data/mockData.js

// 快捷问题数据
export const quickQuestions = [
  { text: '🤔 解释冒泡排序算法', prompt: '解释一下冒泡排序算法的原理和优化方法' },
  { text: '💻 Python快速排序实现', prompt: '用Python实现一个快速排序算法' },
  { text: '🛠️ Vue组件通信方式', prompt: 'Vue.js 组件通信的几种方式' },
  { text: '🎨 CSS Flex布局', prompt: 'CSS Flex布局的常用属性' }
];

// AI 响应数据
export const aiResponses = {
  '解释一下冒泡排序算法的原理和优化方法': `## 冒泡排序算法

### 基本思想
冒泡排序是一种简单的排序算法，它重复地遍历要排序的数列，一次比较两个元素，如果它们的顺序错误就把它们交换过来。

### 时间复杂度
- 最坏情况：O(n²)
- 平均情况：O(n²)
- 最好情况：O(n) - 当数组已经有序时

### 空间复杂度
O(1) - 只需要常数级的额外空间

### 优化版本

\`\`\`python
def bubble_sort_optimized(arr):
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
                swapped = True
        # 如果这一轮没有发生交换，说明数组已经有序
        if not swapped:
            break
    return arr
\`\`\`

优化版本增加了一个标志位，如果某一轮遍历中没有发生交换，说明数组已经有序，可以提前结束排序。`,

  '用Python实现一个快速排序算法': `## 快速排序算法实现

\`\`\`python
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    
    return quick_sort(left) + middle + quick_sort(right)

# 使用示例
numbers = [3, 6, 8, 10, 1, 2, 1]
sorted_numbers = quick_sort(numbers)
print(sorted_numbers)
\`\`\`

### 算法特点
- 时间复杂度：平均 O(n log n)，最坏 O(n²)
- 空间复杂度：O(log n)
- 稳定性：不稳定排序`,

  'Vue.js 组件通信的几种方式': `## Vue.js 组件通信方式

### 1. Props / $emit
\`\`\`vue
<!-- 父组件 -->
<child-component :message="parentMsg" @update="handleUpdate"></child-component>

<!-- 子组件 -->
<script>
export default {
  props: ['message'],
  methods: {
    sendMessage() {
      this.$emit('update', 'new message')
    }
  }
}
</script>
\`\`\`

### 2. Event Bus
\`\`\`javascript
// event-bus.js
import Vue from 'vue'
export const EventBus = new Vue()

// 组件 A
EventBus.$emit('message', data)

// 组件 B
EventBus.$on('message', (data) => {
  console.log(data)
})
\`\`\`

### 3. Vuex (状态管理)
适合大型应用的状态管理方案。`,

  'CSS Flex布局的常用属性': `## CSS Flex 布局常用属性

### 容器属性
\`\`\`css
.container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}
\`\`\`

### 项目属性
\`\`\`css
.item {
  flex: 1;
  order: 1;
  align-self: flex-start;
}
\`\`\``
};

// 默认响应
export const getDefaultResponse = (userMessage) => {
  return `关于 "${userMessage}"，我来为您详细解答：

这是一个模拟的 AI 响应。在实际应用中，这里会连接真实的 AI 模型来生成回答。

如果您需要更具体的帮助，请告诉我更多细节。`;
};

