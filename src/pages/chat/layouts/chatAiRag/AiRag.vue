<script setup>
import { ref } from 'vue';

const content = ref('生成2道Java面试题');

const type = ref('single');

const questions = ref([]);

const showResult = ref(false);

const score = ref(0);

const isLoading = ref(false);

/**
 * AI生成题目
 */
async function loadQuestions() {
  try {
    isLoading.value = true;

    showResult.value = false;

    console.log('开始请求AI接口');

    const response = await fetch(
      'http://localhost:8080/ai/question',
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          content: content.value,
          type: type.value,
        }),
      },
    );

    // HTTP错误
    if (!response.ok) {
      throw new Error(`HTTP错误：${response.status}`);
    }

    // JSON
    const res = await response.json();

    console.log('后端返回：', res);

    // 新题目
    const list
      = res?.data?.questions || [];

    // 追加
    const newQuestions = list.map(item => ({
      ...item,
      userAnswer: '',
    }));

    questions.value.push(...newQuestions);

    console.log('追加完成：', questions.value);
  }
  catch (error) {
    console.error('请求失败：', error);
  }
  finally {
    isLoading.value = false;
  }
}

/**
 * 提交评分
 */
function submitExam() {
  showResult.value = true;

  if (!questions.value.length)
    return;

  const oneScore
    = 100 / questions.value.length;

  let total = 0;

  questions.value.forEach((item) => {
    if (item.userAnswer === item.answer) {
      total += oneScore;
    }
  });

  score.value = total.toFixed(0);
}

/**
 * 清空题目
 */
function clearQuestions() {
  questions.value = [];

  showResult.value = false;

  score.value = 0;
}
</script>

<template>
  <div class="container">
    <!-- 顶部操作栏 -->
    <el-card class="top-bar">
      <div class="bar-content">
        <!-- AI生成 -->
        <el-button
          type="primary"
          :loading="isLoading"
          @click="loadQuestions"
        >
          AI 生成题目
        </el-button>

        <!-- 输入 -->
        <el-input
          v-model="content"
          placeholder="请输入出题要求，例如：Java多线程"
          class="input"
        />

        <!-- 题型 -->
        <el-select
          v-model="type"
          placeholder="题目类型"
          style="width: 160px"
        >
          <el-option
            label="单选题"
            value="single"
          />

          <el-option
            label="多选题"
            value="multi"
          />

          <el-option
            label="判断题"
            value="judge"
          />
        </el-select>

        <!-- 清空 -->
        <el-button
          type="danger"
          plain
          @click="clearQuestions"
        >
          清空题目
        </el-button>
      </div>
    </el-card>

    <!-- 题目滚动区域 -->
    <div class="list">
      <el-card
        v-for="(item, index) in questions"
        :key="index"
        class="question-card"
      >
        <!-- 标题 -->
        <div class="title">
          {{ index + 1 }}. {{ item.title }}
        </div>

        <!-- 单选 -->
        <el-radio-group
          v-model="item.userAnswer"
        >
          <el-radio value="A">
            A. {{ item.optionA }}
          </el-radio>

          <el-radio value="B">
            B. {{ item.optionB }}
          </el-radio>

          <el-radio value="C">
            C. {{ item.optionC }}
          </el-radio>

          <el-radio value="D">
            D. {{ item.optionD }}
          </el-radio>
        </el-radio-group>

        <!-- 结果 -->
        <div
          v-if="showResult"
          class="result"
        >
          <div>
            正确答案：

            <span class="ok">
              {{ item.answer }}
            </span>
          </div>

          <div>
            你的答案：

            <span
              :class="
                item.userAnswer === item.answer
                  ? 'ok'
                  : 'err'
              "
            >
              {{ item.userAnswer || '未作答' }}
            </span>
          </div>

          <div class="analysis">
            {{ item.analysis }}
          </div>
        </div>
      </el-card>

      <!-- 空状态 -->
      <el-empty
        v-if="!questions.length"
        description="暂无题目"
      />
    </div>

    <!-- 底部 -->
    <div
      v-if="questions.length"
      class="footer"
    >
      <el-button
        type="success"
        @click="submitExam"
      >
        提交并评分
      </el-button>
    </div>

    <!-- 分数 -->
    <div
      v-if="showResult"
      class="score"
    >
      得分：{{ score }}
    </div>
  </div>
</template>

<style scoped>
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}

/* 主容器必须允许撑开 */
.container {

  width: 1000px;

  margin: 20px auto;

  min-height: 100vh; /* 🔥关键：不是固定高度 */
  
}

/* 顶部 */
.top-bar {

  margin-bottom: 20px;
}

/* 顶部内容 */
.bar-content {

  display: flex;

  gap: 15px;

  align-items: center;
}

.input {
  flex: 1;
}

/* 列表（不再限制高度） */
.list {

  display: flex;

  flex-direction: column;

  gap: 15px;
}

/* 卡片 */
.question-card {
  padding: 10px;
}

/* 标题 */
.title {

  font-size: 18px;

  font-weight: bold;

  margin-bottom: 15px;

  line-height: 1.8;
}

/* 选项 */
.el-radio {

  display: block;

  margin: 10px 0;
}

/* 结果 */
.result {

  margin-top: 15px;

  padding: 12px;

  background: #f5f7fa;

  border-radius: 8px;
}

/* 正确 */
.ok {
  color: green;
  font-weight: bold;
}

/* 错误 */
.err {
  color: red;
  font-weight: bold;
}

/* 解析 */
.analysis {

  margin-top: 10px;

  color: #666;

  line-height: 1.8;
}

/* 底部 */
.footer {

  text-align: center;

  margin: 25px 0;
}

/* 分数 */
.score {

  text-align: center;

  font-size: 30px;

  color: #409eff;

  font-weight: bold;

  margin-bottom: 30px;
}
</style>
