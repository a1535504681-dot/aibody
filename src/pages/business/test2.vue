  ```vue
  <template>
    <div class="plan-page">

      <!-- 顶部 -->
      <div class="header">
        <div class="title">AI 计划中心</div>

        <el-button type="primary" @click="generatePlan" :loading="loading">
          生成AI计划
        </el-button>
      </div>

      <div class="container">

        <!-- 左侧 -->
        <div class="left">

          <el-card>
            <el-form label-width="80px">

              <el-form-item label="目标">
                <el-input
                  v-model="goal"
                  placeholder="减脂10kg / 增肌 / 作息优化"
                />
              </el-form-item>

              <el-form-item label="周期">
                <el-select v-model="days" style="width:100%">
                  <el-option label="7天" :value="7" />
                  <el-option label="30天" :value="30" />
                  <el-option label="60天" :value="60" />
                </el-select>
              </el-form-item>

              <el-button
                type="success"
                style="width:100%"
                @click="generatePlan"
                :loading="loading"
              >
                AI生成计划
              </el-button>

            </el-form>
          </el-card>

          <!-- 总进度 -->
          <el-card v-if="plan" style="margin-top:20px">
            <div style="margin-bottom:10px">
              整体完成度
            </div>

            <el-progress :percentage="progress" />
          </el-card>

        </div>

        <!-- 中间 -->
        <div class="center">

          <el-card v-if="plan">

            <div class="plan-title">
              {{ plan.title || '未命名计划' }}
            </div>

            <el-collapse v-model="activeDays">

              <el-collapse-item
                v-for="day in plan.days || []"
                :key="day.day"
                :name="day.day"
              >

                <template #title>
                  Day {{ day.day }}

                  <span class="day-count">
                    （{{ getDayProgress(day) }}%）
                  </span>
                </template>

                <div class="task-list">

                  <div
                    v-for="(task, i) in day.tasks || []"
                    :key="i"
                    class="task-item"
                  >

                    <el-checkbox
                      v-model="task.done"
                      @change="updateProgress"
                    >
                      <span :class="{ done: task.done }">
                        [{{ task.type }}]
                        {{ task.content }}
                      </span>
                    </el-checkbox>

                  </div>

                </div>

              </el-collapse-item>

            </el-collapse>

          </el-card>

          <el-empty
            v-else
            description="暂无计划，点击左侧生成"
          />

        </div>

        <!-- 右侧 -->
        <div class="right">

          <el-card>

            <div class="history-title">
              历史计划
            </div>

            <div
              v-for="(item, i) in history"
              :key="i"
              class="history-item"
              @click="loadHistory(item)"
            >
              {{ item.title }}
            </div>

          </el-card>

        </div>

      </div>
    </div>
  </template>

  <script setup>
  import { ref } from "vue"
  import { ElMessage } from "element-plus"
  import { sendbody } from "../../api"

  /** 输入 */
  const goal = ref("")
  const days = ref(30)

  /** 状态 */
  const loading = ref(false)
  const plan = ref(null)
  const activeDays = ref([])

  /** 历史 */
  const history = ref([])

  /** 进度 */
  const progress = ref(0)

  /** ================= JSON解析 ================= */
  const parseAIPlan = (raw) => {

    try {
      return JSON.parse(raw)
    } catch (e) {

      const start = raw.indexOf("{")
      const end = raw.lastIndexOf("}")

      if (start !== -1 && end !== -1) {

        try {
          return JSON.parse(raw.slice(start, end + 1))
        } catch (err) {
          return null
        }
      }

      return null
    }
  }

  /** ================= 文本转计划 ================= */
  const textToPlan = (text) => {

    const list = text
      .split(/；|\n|\./)
      .filter(item => item.trim())

    return {
      title: goal.value || "AI健康计划",

      days: list.map((item, index) => ({

        day: index + 1,

        tasks: [
          {
            type: "AI建议",
            content: item.trim(),
            done: false
          }
        ]

      }))
    }
  }

  /** ================= 生成计划 ================= */
  const generatePlan = async () => {

    if (!goal.value) {
      ElMessage.warning("请输入目标")
      return
    }

    loading.value = true

    const prompt = `
  你是AI健身教练。

  如果可以，请返回JSON格式：

  {
    "title":"计划名称",
    "days":[
      {
        "day":1,
        "tasks":[
          {
            "type":"运动",
            "content":"晨跑30分钟",
            "done":false
          }
        ]
      }
    ]
  }

  用户目标：${goal.value}
  周期：${days.value}天
  `

    try {

      const res = await sendbody({
        message: {
          role: "user",
          content: prompt
        }
      })

      console.log("AI返回", res.data)

      const raw =
        res?.data?.data?.message ||
        res?.data?.message ||
        ""

      if (!raw) {
        ElMessage.error("AI没有返回内容")
        return
      }

      let result = null

      /** 先尝试JSON */
      result = parseAIPlan(raw)

      /** JSON失败 -> 转普通计划 */
      if (!result) {
        result = textToPlan(raw)
      }

      plan.value = result

      /** 默认展开全部 */
      activeDays.value =
        result.days?.map(d => d.day) || []

      /** 保存历史 */
      history.value.unshift(result)

      updateProgress()

      ElMessage.success("计划生成成功")

    } catch (e) {

      console.log(e)

      ElMessage.error("生成失败")

    } finally {

      loading.value = false
    }
  }

  /** ================= 进度计算 ================= */
  const updateProgress = () => {

    if (!plan.value) return

    let total = 0
    let done = 0

    plan.value.days?.forEach(day => {

      day.tasks?.forEach(task => {

        total++

        if (task.done) {
          done++
        }

      })

    })

    progress.value =
      total
        ? Math.round((done / total) * 100)
        : 0
  }

  /** ================= 单日进度 ================= */
  const getDayProgress = (day) => {

    const tasks = day.tasks || []

    const done =
      tasks.filter(t => t.done).length

    return tasks.length
      ? Math.round((done / tasks.length) * 100)
      : 0
  }

  /** ================= 加载历史 ================= */
  const loadHistory = (item) => {

    plan.value = item

    activeDays.value =
      item.days?.map(d => d.day) || []

    updateProgress()
  }
  </script>

  <style scoped>
  .plan-page {
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: #f5f7fa;
  }

  .header {
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    background: white;
  }

  .title {
    font-size: 20px;
    font-weight: bold;
  }

  .container {
    flex: 1;
    display: flex;
    gap: 15px;
    padding: 15px;
    overflow: hidden;
  }

  .left {
    width: 280px;
  }

  .center {
    flex: 1;
    overflow-y: auto;
  }

  .right {
    width: 260px;
  }

  .plan-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 15px;
  }

  .task-item {
    padding: 8px 0;
  }

  .done {
    text-decoration: line-through;
    color: #999;
  }

  .day-count {
    margin-left: 10px;
    color: #409eff;
  }

  .history-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .history-item {
    padding: 10px;
    border-bottom: 1px solid #eee;
    cursor: pointer;
    transition: 0.2s;
  }

  .history-item:hover {
    background: #f5f7fa;
  }
  </style>
  ```
