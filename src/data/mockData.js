// src/data/mockData.js

// 快捷问题数据
export const quickQuestions = [
  { text: '🤔 解释冒泡排序算法', prompt: '解释一下冒泡排序算法的原理和优化方法' },
  { text: '💻 Python快速排序实现', prompt: '用Python实现一个快速排序算法' },
  { text: '🛠️ Vue组件通信方式', prompt: 'Vue.js 组件通信的几种方式' },
  { text: '🎨 CSS Flex布局', prompt: 'CSS Flex布局的常用属性' },
];

// 默认响应
export const getDefaultResponse = (userMessage) => {
  return `关于 "${userMessage}"，我来为您详细解答：

这是一个模拟的 AI 响应。在实际应用中，这里会连接真实的 AI 模型来生成回答。
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


如果您需要更具体的帮助，请告诉我更多细节。`;
};
