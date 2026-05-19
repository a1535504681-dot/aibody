<template>
  <div class="health-page">

    <!-- 顶部标题 -->
    <div class="title">
      AI 健康助手
    </div>

    <!-- 主区域 -->
    <div class="main-container">

      <!-- 左边聊天区域 -->
      <div class="chat-container">

        <!-- 消息列表 -->
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

        <!-- 输入区域 -->
        <div class="input-area">

          <el-input
            v-model="inputText"
            placeholder="请输入身体信息..."
            @keyup.enter="sendMessage"
            clearable
          />

          <el-button
            type="primary"
            @click="sendMessage"
          >
            发送
          </el-button>

        </div>

      </div>

      <!-- 右边用户档案 -->
      <div class="profile-container">

        <el-collapse v-model="activeNames">

          <el-collapse-item
            title="身体健康档案"
            name="1"
          >

            <el-form
              label-width="100px"
              :model="profile"
            >

              <el-form-item label="年龄">
                <el-input v-model="profile.age"/>
              </el-form-item>

              <el-form-item label="性别">
                <el-input v-model="profile.sex"/>
              </el-form-item>

              <el-form-item label="身高(cm)">
                <el-input v-model="profile.height"/>
              </el-form-item>

              <el-form-item label="体重(kg)">
                <el-input v-model="profile.weight"/>
              </el-form-item>

              <el-form-item label="目标体重">
                <el-input v-model="profile.target_weight"/>
              </el-form-item>

              <el-form-item label="目标">
                <el-input v-model="profile.goal"/>
              </el-form-item>

              <el-form-item label="活动水平">
                <el-input v-model="profile.activityLevel"/>
              </el-form-item>

              <!-- BMI 自动显示 -->
              <el-form-item label="BMI">

                <el-tag type="success">

                  {{ profile.bmi }}

                  <template v-if="bmiText">
                    （{{ bmiText }}）
                  </template>

                </el-tag>

              </el-form-item>

              <el-form-item label="体脂率">
                <el-input v-model="profile.bodyFat"/>
              </el-form-item>

              <el-button
                type="success"
                style="width:100%"
                @click="saveProfile"
              >
                保存数据
              </el-button>

            </el-form>

          </el-collapse-item>

        </el-collapse>

      </div>

    </div>

  </div>
</template>

<script setup>

import {ref, computed} from "vue";
import {ElMessage} from "element-plus";
import {sendbody} from "../../api";
import { addUserHealth,getUserHealth } from "../../api/aibody";
import { onMounted } from "vue"
import { useUserStore } from '@/stores'


const userStore = useUserStore()

/**
 * 聊天记录
 */
const messages = ref([
  {
    role: 'ai',
    content: '你好，请输入你的身体信息，例如：我22岁 男 175cm 70kg 想减脂'
  }
])
/**
 * 加载初始数据
 */
onMounted(() => {
  loadProfile()
})

const loadProfile = async () => {

  try {

    const res = await getUserHealth(userStore.userId)
    console.log("userid",res.data);
    

    if (res.code === 200 && res.data) {

      profile.value = {
        ...profile.value,
        ...res.data
      }
    }

  } catch (e) {

    console.log("加载用户档案失败", e)
  }
}
/**
 * 输入框
 */
const inputText = ref('')

/**
 * 折叠面板
 */
const activeNames = ref(['1'])

/**
 * 用户档案
 */
const profile = ref({

  userId: userStore.userId,

  age: '',

  sex: '',

  height: '',

  weight: '',

  target_weight: '',

  goal: '',

  activityLevel: '',

  bmi: '',

  bodyFat: ''

})

/**
 * BMI计算
 */
const calculateBMI = (height, weight) => {

  if (!height || !weight) {

    return ''
  }

  // cm -> m
  const h = height / 100

  return (weight / (h * h)).toFixed(2)

}

/**
 * BMI状态
 */
const bmiText = computed(() => {

  const bmi = Number(profile.value.bmi)

  if (!bmi) {

    return ''
  }

  if (bmi < 18.5) {

    return '偏瘦'
  }

  if (bmi < 24) {

    return '正常'
  }

  if (bmi < 28) {

    return '超重'
  }

  return '肥胖'

})

/**
 * 发送消息
 */
const sendMessage = async () => {

  // 空判断
  if (!inputText.value.trim()) {

    return
  }

  /**
   * 保存用户输入
   */
  const userMessage = inputText.value

  // 添加用户消息
  messages.value.push({

    role: 'user',

    content: userMessage

  })

  // 清空输入框
  inputText.value = ''

  try {

    /**
     * 调用AI接口
     */
    const res = await sendbody({

      message: {

        content: userMessage,

        role: 'user'

      }

    })

    console.log(res)

    /**
     * AI返回数据
     */
/**
 * AI返回数据
 */
const data = res.data

/**
 * 组装数据
 * 有值才覆盖
 */
const aiResult = {

  ...(data.sex && {

    sex: data.sex

  }),

  ...(data.age && {

    age: data.age

  }),

  ...(data.height && {

    height: data.height

  }),

  ...(data.weight && {

    weight: data.weight

  }),

  ...(data.level && {

    goal: data.level

  }),

  ...(
    data.height &&
    data.weight && {

      bmi: calculateBMI(data.height, data.weight)

    }
  ), ...(data.target_weight && {

    target_weight: data.target_weight

  })

}

    /**
     * AI回复
     */
    messages.value.push({

      role: 'ai',

      content: '已成功识别你的身体数据'

    })

    /**
     * 渲染右边
     */
    profile.value = {

      ...profile.value,

      ...aiResult

    }

  } catch (e) {

    console.log(e)

    messages.value.push({

      role: 'ai',

      content: '识别失败，请重新输入'

    })

    ElMessage.error("AI识别失败")

  }

}

/**
 * 保存用户数据
 */
const saveProfile = async () => {

  console.log(profile.value,"2222222222222222",userStore.userId)


   const res =  await addUserHealth(profile.value)
   console.log(res);
   if(res.code==200){
    ElMessage.success("保存成功")
   }

  /**
   * 这里调用保存接口
   */
}

</script>

<style scoped>

.health-page {

  width: 100%;

  height: 100vh;

  background: #f5f7fa;

  padding: 20px;

  box-sizing: border-box;

  overflow: hidden;

  display: flex;

  flex-direction: column;
}

/* 标题 */

.title {

  height: 60px;

  line-height: 60px;

  font-size: 28px;

  font-weight: bold;

  text-align: center;

  background: white;

  border-radius: 12px;

  margin-bottom: 20px;

  flex-shrink: 0;
}

/* 主区域 */

.main-container {

  flex: 1;

  display: flex;

  gap: 20px;

  overflow: hidden;

  min-height: 0;
}

/* 左边聊天 */

.chat-container {

  flex: 1;

  height: 100%;

  background: white;

  border-radius: 12px;

  display: flex;

  flex-direction: column;

  padding: 20px;

  box-sizing: border-box;

  overflow: hidden;
}

/* 消息区域 */

.message-list {

  flex: 1;

  overflow-y: auto;

  padding-right: 5px;
}

/* 消息 */

.message-item {

  max-width: 70%;

  padding: 12px 16px;

  border-radius: 12px;

  margin-bottom: 15px;

  line-height: 1.6;

  word-break: break-word;
}

/* 用户 */

.user {

  background: #409eff;

  color: white;

  margin-left: auto;
}

/* AI */

.ai {

  background: #f4f4f5;

  color: #333;
}

/* 输入区域 */

.input-area {

  height: 70px;

  display: flex;

  align-items: center;

  gap: 10px;

  padding-top: 10px;

  flex-shrink: 0;
}

/* 输入框 */

.input-area :deep(.el-input) {

  flex: 1;
}

/* 按钮 */

.input-area .el-button {

  width: 100px;

  height: 40px;
}

/* 右边档案 */

.profile-container {

  width: 400px;

  height: 100%;

  background: white;

  border-radius: 12px;

  padding: 20px;

  box-sizing: border-box;

  overflow-y: auto;

  flex-shrink: 0;
}

</style>