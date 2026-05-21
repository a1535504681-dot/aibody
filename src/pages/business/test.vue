<template>
  <div class="health-page">

    <!-- 顶部标题 -->
    <div class="title">
      AI 健康助手
    </div>

    <div class="main-container">

      <!-- 左侧聊天 -->
      <div class="chat-container">

        <div class="message-list">

          <div
            v-for="(item,index) in messages"
            :key="index"
            class="message-item"
            :class="item.role"
          >
            {{ item.content }}
          </div>

        </div>

        <div class="input-area">

          <el-input
            v-model="inputText"
            placeholder="请输入身体信息..."
            @keyup.enter="sendMessage"
            clearable
          />

          <el-button type="primary" @click="sendMessage">
            发送
          </el-button>

        </div>

      </div>

      <!-- 右侧 -->
      <div class="profile-container">

        <el-collapse v-model="activeNames">

          <!-- 基础档案 -->
          <el-collapse-item title="身体健康档案" name="1">

            <el-form label-width="100px" :model="profile">

              <el-form-item label="年龄">
                <el-input v-model="profile.age"/>
              </el-form-item>

              <el-form-item label="性别">
                <el-input v-model="profile.gender"/>
              </el-form-item>

              <el-form-item label="身高(cm)">
                <el-input v-model="profile.height"/>
              </el-form-item>

              <el-form-item label="体重(kg)">
                <el-input v-model="profile.weight"/>
              </el-form-item>

              <el-form-item label="目标体重">
                <el-input v-model="profile.targetWeight"/>
              </el-form-item>

              <el-form-item label="目标">
                <el-input v-model="profile.goal"/>
              </el-form-item>

              <el-form-item label="活动水平">
                <el-input v-model="profile.activityLevel"/>
              </el-form-item>

              <el-form-item label="BMI">
                <el-tag type="success">
                  {{ profile.bmi }}
                  <span v-if="bmiText">（{{ bmiText }}）</span>
                </el-tag>
              </el-form-item>

              <el-form-item label="体脂率">
                <el-input v-model="profile.bodyFat"/>
              </el-form-item>

              <el-button type="success" style="width:100%" @click="saveProfile">
                保存数据
              </el-button>

            </el-form>

          </el-collapse-item>

          <!-- 体重记录 -->
          <el-collapse-item title="周期历史体重记录" name="2">

            <div class="weight-history">

              <div
                v-for="(item,index) in weightList"
                :key="index"
                class="weight-item"
              >

                <div class="date-box">
                  <div class="date">{{ item.date }}</div>
                  <div class="time">{{ item.time }}</div>
                </div>

                <div class="weight">
                  {{ item.weight }} kg
                </div>

              </div>

              <div v-if="weightList.length === 0" class="empty">
                暂无体重记录
              </div>

            </div>

          </el-collapse-item>
          <div class="report-btn-box">
  <el-button
    type="warning"
    size="large"
    style="width:100%;margin-top:20px"
    @click="generateReport"
    :loading="reportLoading"
  >
    生成 AI 健康报告
  </el-button>
</div>

        </el-collapse>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { ElMessage } from "element-plus"
import { sendbody } from "../../api"
import { addUserHealth, getUserHealth, getWeightHistory } from "../../api/aibody"
import { useUserStore } from '@/stores'

const userStore = useUserStore()

/** ---------------- 用户档案 ---------------- */
const profile = ref({
  userId: userStore.userId,
  age: '',
  gender: '',
  height: '',
  weight: '',
  targetWeight: '',
  goal: '',
  activityLevel: '',
  bmi: '',
  bodyFat: ''
})

/** ---------------- 体重记录 ---------------- */
const weightList = ref([])

const loadWeightHistory = async () => {
  try {
    const res = await getWeightHistory(userStore.userId)

    if (res.code === 200 && res.data) {

      weightList.value = res.data.map(item => ({
        date: item.recordTime?.slice(0, 10),
        time: item.recordTime?.slice(11, 16),
        weight: item.weight
      }))
    }

  } catch (e) {
    console.log("加载体重记录失败", e)
  }
}

/** ---------------- 聊天 ---------------- */
const messages = ref([
  {
    role: 'ai',
    content: '你好，健康助手很高兴为你服务'
  }
])

const inputText = ref('')

const activeNames = ref(['1'])

/** ---------------- BMI ---------------- */
const bmiText = computed(() => {
  const bmi = Number(profile.value.bmi)
  if (!bmi) return ''

  if (bmi < 18.5) return '偏瘦'
  if (bmi < 24) return '正常'
  if (bmi < 28) return '超重'
  return '肥胖'
})

/** ---------------- 加载 ---------------- */
const loadProfile = async () => {
  try {
    const res = await getUserHealth(userStore.userId)

    if (res.code === 200 && res.data) {
      profile.value = { ...profile.value, ...res.data }
    }

  } catch (e) {
    console.log(e)
  }
}

onMounted(() => {
  loadProfile()
  loadWeightHistory()
})

/** ---------------- AI发送 ---------------- */
const calculateBMI = (h, w) => {
  if (!h || !w) return ''
  const m = h / 100
  return (w / (m * m)).toFixed(2)
}

const sendMessage = async () => {

  if (!inputText.value.trim()) return

  const userMessage = inputText.value

  messages.value.push({ role: 'user', content: userMessage })
  inputText.value = ''

  try {

    const res = await sendbody({
      message: {
        content: userMessage,
        role: 'user'
      }
    })

    const data = res.data.data || {}

    const aiResult = {
      ...(data.gender && { gender: data.gender }),
      ...(data.age && { age: data.age }),
      ...(data.height && { height: data.height }),
      ...(data.weight && { weight: data.weight }),
      ...(data.level && { goal: data.level }),
      ...(data.targetWeight && { targetWeight: data.targetWeight }),
      ...(data.height && data.weight && {
        bmi: calculateBMI(data.height, data.weight)
      })
    }

    profile.value = { ...profile.value, ...aiResult }

    messages.value.push({
      role: 'ai',
      content: res.data.message || '暂无AI回复'
    })

  } catch (e) {
    console.log(e)
    ElMessage.error("AI识别失败")
  }
}
const reportLoading = ref(false)

const reportContent = ref('')
/** ---------------- 生成AI报告 ---------------- */
/** ---------------- 生成AI报告 ---------------- */
const generateReport = async () => {

  try {

    reportLoading.value = true

    // 用户数据
    const params = {
      profile: profile.value,
      weightHistory: weightList.value
    }

    // 拼接AI提示词
    const prompt = `
请根据以下用户身体数据生成一份详细健康分析报告。

【用户基础信息】
${JSON.stringify(params.profile, null, 2)}

【历史体重记录】
${JSON.stringify(params.weightHistory, null, 2)}

请从以下几个方面进行分析：

1.BMI分析
2.体重变化趋势
3.是否健康
4.减脂/增肌建议
5.饮食建议
6.运动建议
7.作息建议
8.未来30天改善计划

请使用专业且容易理解的中文回答。
`

    // 调AI接口
    const res = await sendbody({

      message: {
        role: 'user',
        content: prompt
      }

    })

    console.log("AI报告返回：", res)

    // 兼容不同返回结构
    const report =
      res?.data?.message ||
      res?.data?.data?.message ||
      res?.data?.data ||
      '暂无分析结果'

    // 保存报告
    reportContent.value = report
    console.log(reportContent,"报告！！！！！");
    

    // 放入聊天区
    messages.value.push({
      role: 'ai',
      content: report
    })

    ElMessage.success("AI报告生成成功")

  } catch (e) {

    console.log("AI报告生成失败", e)

    ElMessage.error("生成失败")

  } finally {

    reportLoading.value = false

  }
}
/** ---------------- 保存 ---------------- */
const saveProfile = async () => {
  const res = await addUserHealth(profile.value)

  if (res.code === 200) {
    ElMessage.success("保存成功")
  }
}

/** ---------------- AI报告 ---------------- */



</script>

<style scoped>
.health-page {
  width: 100%;
  height: 90vh;
  background: #f5f7fa;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.title {
  height: 60px;
  line-height: 60px;
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  background: white;
  border-radius: 12px;
  margin-bottom: 20px;
}

.main-container {
  flex: 1;
  display: flex;
  gap: 20px;
  overflow: hidden;
}

.chat-container {
  flex: 1;
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.message-list {
  flex: 1;
  overflow-y: auto;
}

.message-item {
  max-width: 70%;
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 10px;
}

.user {
  background: #409eff;
  color: white;
  margin-left: auto;
}

.ai {
  background: #f4f4f5;
}

.input-area {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.profile-container {
  width: 420px;
  background: white;
  border-radius: 12px;
  padding: 20px;
  overflow-y: auto;
}

.weight-history {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.weight-item {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 10px;
}

.date {
  font-size: 13px;
  color: #333;
}

.time {
  font-size: 12px;
  color: #999;
}

.weight {
  font-size: 18px;
  font-weight: bold;
  color: #409eff;
}

.empty {
  text-align: center;
  color: #999;
  padding: 20px;
}
</style>