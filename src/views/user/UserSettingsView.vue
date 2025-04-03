<template>
  <div class="settings-container">
    <div class="settings-wrapper">
      <!-- 左侧导航 -->
      <div class="settings-sidebar">
        <h2 class="settings-title">账号设置</h2>
        <a-menu
          :selected-keys="[activeTab]"
          @menu-item-click="changeTab"
          class="settings-menu"
        >
          <a-menu-item key="profile">
            <template #icon>
              <icon-user />
            </template>
            个人资料
          </a-menu-item>
          <a-menu-item key="security">
            <template #icon>
              <icon-safe />
            </template>
            账号安全
          </a-menu-item>
        </a-menu>
      </div>

      <!-- 右侧内容区 -->
      <div class="settings-content">
        <!-- 个人资料 -->
        <div v-show="activeTab === 'profile'" class="content-panel">
          <h3 class="panel-title">个人资料</h3>
          <a-divider />

          <a-form :model="profileForm" layout="vertical" auto-label-width>
            <!-- 头像上传 -->
            <div class="avatar-upload-section">
              <div class="avatar-wrapper">
                <a-avatar :size="100" class="avatar-preview">
                  <img v-if="profileForm.avatar" :src="profileForm.avatar" />
                  <icon-user v-else :size="50" />
                </a-avatar>
                <div class="avatar-actions">
                  <a-upload
                    :custom-request="uploadAvatar"
                    :show-file-list="false"
                    accept="image/*"
                    :before-upload="beforeAvatarUpload"
                  >
                    <a-button type="primary">更换头像</a-button>
                  </a-upload>
                  <a-typography-text type="secondary" style="margin-top: 8px">
                    支持 jpg、png 格式，文件小于 2MB
                  </a-typography-text>
                </div>
              </div>
            </div>

            <!-- 基本信息 -->
            <div class="profile-section-row">
              <div class="profile-section-col">
                <a-form-item label="昵称" field="nickname">
                  <a-input
                    v-model="profileForm.nickname"
                    placeholder="请输入昵称"
                  />
                </a-form-item>
              </div>
            </div>

            <div class="profile-section-row">
              <div class="profile-section-col">
                <a-form-item label="性别" field="gender">
                  <a-radio-group v-model="profileForm.gender">
                    <a-radio value="male">
                      <template #radio="{ checked }">
                        <a-space :class="{ 'gender-checked': checked }">
                          <icon-man /> 男性
                        </a-space>
                      </template>
                    </a-radio>
                    <a-radio value="female">
                      <template #radio="{ checked }">
                        <a-space :class="{ 'gender-checked': checked }">
                          <icon-woman /> 女性
                        </a-space>
                      </template>
                    </a-radio>
                  </a-radio-group>
                </a-form-item>
              </div>
            </div>

            <div class="profile-section-row">
              <div class="profile-section-col">
                <a-form-item label="生日" field="birthday">
                  <a-date-picker
                    v-model="profileForm.birthday"
                    style="width: 100%"
                    format="YYYY/MM/DD"
                  />
                </a-form-item>
              </div>
            </div>

            <div class="profile-section-row">
              <div class="profile-section-col">
                <a-form-item label="现居地" field="location">
                  <a-cascader
                    v-model="profileForm.location"
                    placeholder="输入选择您的位置"
                    :options="locationOptions"
                    path-mode
                    allow-clear
                    allow-search
                  />
                </a-form-item>
              </div>
            </div>

            <div class="profile-section-row">
              <div class="profile-section-col">
                <a-form-item label="个人介绍" field="bio">
                  <a-textarea
                    v-model="profileForm.bio"
                    placeholder="关于你的介绍..."
                    :max-length="200"
                    show-word-limit
                    :auto-size="{ minRows: 3, maxRows: 6 }"
                  />
                </a-form-item>
              </div>
            </div>

            <div class="profile-section-row">
              <div class="profile-section-col">
                <a-form-item label="个人网站" field="website">
                  <a-input
                    v-model="profileForm.website"
                    placeholder="你的个人站点，博客等"
                    allow-clear
                  />
                </a-form-item>
              </div>
            </div>

            <div class="profile-section-row">
              <div class="profile-section-col">
                <a-form-item label="GitHub" field="github">
                  <a-input
                    v-model="profileForm.github"
                    placeholder="GitHub 用户名"
                    allow-clear
                  />
                </a-form-item>
              </div>
            </div>

            <div class="profile-section-row">
              <div class="profile-section-col">
                <a-form-item label="就读学校" field="school">
                  <a-input
                    v-model="profileForm.school"
                    placeholder="您就读的学校"
                    allow-clear
                  />
                </a-form-item>
              </div>
            </div>

            <div class="profile-section-row">
              <div class="profile-section-col" style="flex: 1">
                <a-form-item label="所在公司" field="company">
                  <a-input
                    v-model="profileForm.company"
                    placeholder="您所在的公司"
                    allow-clear
                  />
                </a-form-item>
              </div>
              <div class="profile-section-col" style="flex: 1">
                <a-form-item label="职位" field="jobTitle">
                  <a-input
                    v-model="profileForm.jobTitle"
                    placeholder="您的职位"
                    allow-clear
                  />
                </a-form-item>
              </div>
            </div>

            <!-- 技能标签 -->
            <div class="form-section">
              <div class="form-label">技能标签</div>
              <div class="form-content">
                <a-input-tag
                  v-model="profileForm.skillTags"
                  placeholder="添加标签，按 Enter 确认"
                  allow-clear
                  :max-tag-count="10"
                  @change="handleSkillTagsChange"
                  class="simple-input"
                />
                <div class="tags-counter">
                  {{ profileForm.skillTags.length }}/10
                </div>
                <div class="quick-tags-title">选择常用标签</div>
                <div class="quick-tags">
                  <a-tag
                    v-for="(tag, index) in availableSkillTags"
                    :key="index"
                    class="quick-tag"
                    :class="{
                      'tag-selected': profileForm.skillTags.includes(tag.value),
                    }"
                    @click="quickAddSkillTag(tag.value)"
                  >
                    {{ tag.label }}
                  </a-tag>
                </div>
              </div>
            </div>

            <a-form-item>
              <a-button type="primary" @click="saveProfileSettings">
                保存
              </a-button>
            </a-form-item>
          </a-form>
        </div>

        <!-- 账号安全 -->
        <div v-show="activeTab === 'security'" class="content-panel">
          <h3 class="panel-title">账号安全</h3>
          <a-divider />

          <!-- 密码修改 -->
          <div class="security-item">
            <div class="security-header">
              <div class="security-title">
                <icon-lock :size="24" />
                <span>账号密码</span>
              </div>
              <a-button
                type="text"
                @click="showPasswordModal = true"
                status="success"
              >
                修改
              </a-button>
            </div>
            <div class="security-desc">
              定期修改密码可以提高账号安全性，建议使用高强度密码
            </div>
          </div>
          <a-divider />

          <!-- 绑定邮箱 -->
          <div class="security-item">
            <div class="security-header">
              <div class="security-title">
                <icon-email :size="24" />
                <span>绑定邮箱</span>
              </div>
              <a-button
                type="text"
                @click="showEmailModal = true"
                :status="securityForm.email ? 'success' : 'danger'"
              >
                {{ securityForm.email ? "修改" : "绑定" }}
              </a-button>
            </div>
            <div class="security-desc">
              <span v-if="securityForm.email">
                已绑定邮箱: {{ maskEmail(securityForm.email) }}
              </span>
              <span v-else>绑定邮箱可以接收重要通知，并用于账号找回</span>
            </div>
          </div>
          <a-divider />

          <!-- 第三方账号 -->
          <div class="security-item">
            <div class="security-header">
              <div class="security-title">
                <icon-github :size="24" />
                <span>GitHub 账号</span>
              </div>
              <a-button
                type="text"
                @click="handleBindGithub"
                :status="securityForm.githubBound ? 'success' : 'danger'"
              >
                {{ securityForm.githubBound ? "解绑" : "绑定" }}
              </a-button>
            </div>
            <div class="security-desc">
              <span v-if="securityForm.githubBound">
                已关联 GitHub 账号，可用于快速登录
              </span>
              <span v-else>关联 GitHub 账号后可以使用 GitHub 快速登录</span>
            </div>
          </div>
          <a-divider />

          <div class="security-item">
            <div class="security-header">
              <div class="security-title">
                <icon-code :size="24" />
                <span>Gitee 账号</span>
              </div>
              <a-button
                type="text"
                @click="handleBindGitee"
                :status="securityForm.giteeBound ? 'success' : 'danger'"
              >
                {{ securityForm.giteeBound ? "解绑" : "绑定" }}
              </a-button>
            </div>
            <div class="security-desc">
              <span v-if="securityForm.giteeBound">
                已关联 Gitee 账号，可用于快速登录
              </span>
              <span v-else>关联 Gitee 账号后可以使用 Gitee 快速登录</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 修改密码弹窗 -->
    <a-modal
      v-model:visible="showPasswordModal"
      title="修改密码"
      @cancel="resetPasswordForm"
      :mask-closable="false"
      :footer="false"
    >
      <a-form
        :model="passwordForm"
        ref="passwordFormRef"
        layout="vertical"
        auto-label-width
      >
        <a-form-item
          label="当前密码"
          field="oldPassword"
          :rules="[{ required: true, message: '请输入当前密码' }]"
        >
          <a-input-password
            v-model="passwordForm.oldPassword"
            placeholder="请输入当前密码"
            allow-clear
          />
        </a-form-item>
        <a-form-item
          label="新密码"
          field="newPassword"
          :rules="[
            { required: true, message: '请输入新密码' },
            { minLength: 8, message: '密码长度不能少于8位' },
          ]"
        >
          <a-input-password
            v-model="passwordForm.newPassword"
            placeholder="请输入新密码"
            allow-clear
          />
        </a-form-item>
        <a-form-item
          label="确认新密码"
          field="confirmPassword"
          :rules="[
            { required: true, message: '请确认新密码' },
            {
              validator: (value) => value === passwordForm.newPassword,
              message: '两次输入的密码不一致',
            },
          ]"
        >
          <a-input-password
            v-model="passwordForm.confirmPassword"
            placeholder="请再次输入新密码"
            allow-clear
          />
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button @click="resetPasswordForm">取消</a-button>
            <a-button type="primary" @click="changePassword">确认修改</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 绑定邮箱弹窗 -->
    <a-modal
      v-model:visible="showEmailModal"
      title="绑定邮箱"
      @cancel="resetEmailForm"
      :mask-closable="false"
      :footer="false"
    >
      <a-form
        :model="emailForm"
        ref="emailFormRef"
        layout="vertical"
        auto-label-width
      >
        <a-form-item
          label="邮箱地址"
          field="email"
          :rules="[
            { required: true, message: '请输入邮箱地址' },
            { type: 'email', message: '请输入正确的邮箱格式' },
          ]"
        >
          <a-input
            v-model="emailForm.email"
            placeholder="请输入邮箱地址"
            allow-clear
          >
            <template #prefix>
              <icon-email />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item
          label="验证码"
          field="code"
          :rules="[{ required: true, message: '请输入验证码' }]"
        >
          <a-space>
            <a-input
              v-model="emailForm.code"
              placeholder="请输入验证码"
              style="width: 240px"
            />
            <a-button
              type="outline"
              status="success"
              :disabled="!!emailForm.countDown"
              @click="sendVerificationCode"
            >
              {{
                emailForm.countDown ? `${emailForm.countDown}s` : "获取验证码"
              }}
            </a-button>
          </a-space>
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button @click="resetEmailForm">取消</a-button>
            <a-button type="primary" @click="bindEmail">确认绑定</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { Message } from "@arco-design/web-vue";
import { useStore } from "vuex";
import type { TagData } from "@arco-design/web-vue";
import {
  IconUser,
  IconSafe,
  IconLock,
  IconEmail,
  IconGithub,
  IconCode,
  IconMan,
  IconWoman,
} from "@arco-design/web-vue/es/icon";
import {
  UserControllerService,
  FileControllerService,
} from "../../../generated";
import { chinaRegions } from "../../data/china-regions";

// 选中的标签页
const activeTab = ref("profile");

// 切换标签页
const changeTab = (key: string) => {
  activeTab.value = key;
};

// 个人资料表单数据
const profileForm = reactive({
  avatar: "",
  username: "",
  nickname: "",
  gender: "male" as "male" | "female",
  birthday: "",
  location: [] as string[],
  bio: "",
  website: "",
  github: "",
  school: "",
  company: "",
  jobTitle: "",
  skillTags: [] as string[],
});

// 可选技能标签
const availableSkillTags = ref([
  { value: "c", label: "C" },
  { value: "cpp", label: "C++" },
  { value: "java", label: "Java" },
  { value: "python", label: "Python" },
  { value: "javascript", label: "JavaScript" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "typescript", label: "TypeScript" },
  { value: "csharp", label: "C#" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby" },
]);

// 处理技能标签变化
const handleSkillTagsChange = (value: (string | number | TagData)[]) => {
  // 限制最多10个标签
  if (value.length > 10) {
    // 将输入值转为字符串数组
    profileForm.skillTags = value.slice(0, 10).map((item) => item.toString());
    Message.warning("最多添加10个技能标签");
  }
};

// 快速添加技能标签
const quickAddSkillTag = (value: string) => {
  // 如果已存在该标签，则移除
  if (profileForm.skillTags.includes(value)) {
    profileForm.skillTags = profileForm.skillTags.filter(
      (tag) => tag !== value
    );
    return;
  }

  // 限制最多10个标签
  if (profileForm.skillTags.length >= 10) {
    Message.warning("最多添加10个技能标签");
    return;
  }

  // 添加标签
  profileForm.skillTags.push(value);
};

// 省市级联数据
const locationOptions = ref(chinaRegions);

// 账号安全表单数据
const securityForm = reactive({
  email: "",
  githubBound: false,
  giteeBound: false,
});

// 修改密码表单
const passwordForm = reactive({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});
const passwordFormRef = ref();
const showPasswordModal = ref(false);

// 绑定邮箱表单
const emailForm = reactive({
  email: "",
  code: "",
  countDown: 0,
});
const emailFormRef = ref();
const showEmailModal = ref(false);

// 获取Vuex store
const store = useStore();

// 组件挂载时获取用户信息
onMounted(async () => {
  const loginUser = store.state.user.loginUser;
  try {
    // 使用API获取用户个人资料
    const response = await UserControllerService.getUserProfileUsingGet(
      loginUser.id
    );
    if (response.code === 0 && response.data) {
      const userProfile = response.data;

      // 填充个人资料表单
      profileForm.avatar = userProfile.userAvatar || "";
      profileForm.nickname = userProfile.nickname || "";
      profileForm.gender = (userProfile.gender || "male") as "male" | "female";
      profileForm.birthday = userProfile.birthday || "";
      profileForm.location = (userProfile.location?.split("/") ||
        "") as string[];
      profileForm.bio = userProfile.bio || "";
      profileForm.website = userProfile.website || "";
      profileForm.github = userProfile.github || "";
      profileForm.school = userProfile.school || "";
      profileForm.company = userProfile.company || "";
      profileForm.jobTitle = userProfile.jobTitle || "";
      profileForm.skillTags = userProfile.skillTags
        ? userProfile.skillTags
        : [];
      // 填充安全信息
      securityForm.email = loginUser?.email || "";
      securityForm.githubBound = !!loginUser?.githubId;
      securityForm.giteeBound = !!loginUser?.giteeId;
      // 获取用户基本信息
      // const userResponse = await UserControllerService.getLoginUserUsingGet();
      // if (userResponse.code === 0 && userResponse.data) {
      //   const userInfo = userResponse.data;
      // }
    }
  } catch (error) {
    Message.error("获取用户信息失败");
    console.error("获取用户信息失败:", error);
  }
});

// 保存个人资料
const saveProfileSettings = async () => {
  console.log(typeof profileForm.location);
  console.log(JSON.stringify(profileForm.location));
  try {
    // 调用API保存用户个人资料
    await UserControllerService.updateUserProfileUsingPost({
      userAvatar: profileForm.avatar,
      nickname: profileForm.nickname,
      gender: profileForm.gender,
      birthday: profileForm.birthday,
      location: profileForm.location.join("/"),
      bio: profileForm.bio,
      website: profileForm.website,
      github: profileForm.github,
      school: profileForm.school,
      company: profileForm.company,
      jobTitle: profileForm.jobTitle,
      skillTags: profileForm.skillTags,
    });

    Message.success("个人资料保存成功");
  } catch (error) {
    Message.error("保存个人资料失败");
    console.error("保存个人资料失败:", error);
  }
};

// 头像上传前验证
const beforeAvatarUpload = (file: File) => {
  const isImage = file.type.startsWith("image/");
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isImage) {
    Message.error("只能上传图片文件");
    return false;
  }
  if (!isLt2M) {
    Message.error("图片大小不能超过 2MB");
    return false;
  }
  console.log("文件对象:", file, "类型:", Object.prototype.toString.call(file));
  return true;
};

// 自定义上传头像方法
const uploadAvatar = (
  options: any
): {
  abort: () => void;
} => {
  const { onProgress, onError, onSuccess, fileItem, name } = options;

  // 使用FileControllerService进行上传
  const controller = new AbortController();

  FileControllerService.uploadFileToMinioUsingPost(
    "user_avatar",
    fileItem.file,
    fileItem?.name
  )
    .then((result) => {
      if (result.code === 0 && result.data) {
        profileForm.avatar = result.data;
        Message.success("头像上传成功");
        onSuccess(result);
      } else {
        Message.error(result.message || "头像上传失败");
        onError(new Error(result.message || "头像上传失败"));
      }
    })
    .catch((error) => {
      console.error("头像上传失败:", error);
      Message.error("头像上传失败");
      onError(error);
    });

  // 返回一个对象，包含abort方法用于取消上传
  return {
    abort: () => controller.abort(),
  };
};

// 修改密码
const changePassword = () => {
  // 直接进行手动验证，不使用框架的验证
  if (!passwordForm.oldPassword) {
    Message.error("请输入当前密码");
    return;
  }

  if (!passwordForm.newPassword) {
    Message.error("请输入新密码");
    return;
  }

  if (passwordForm.newPassword.length < 8) {
    Message.error("新密码长度不能少于8位");
    return;
  }

  if (!passwordForm.confirmPassword) {
    Message.error("请确认新密码");
    return;
  }

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    Message.error("两次输入的密码不一致");
    return;
  }

  // 所有验证通过后，调用API
  UserControllerService.changePasswordUsingPost({
    oldPassword: passwordForm.oldPassword,
    newPassword: passwordForm.newPassword,
    confirmPassword: passwordForm.confirmPassword,
  })
    .then((res) => {
      if (res.code === 0) {
        Message.success("密码修改成功");
        showPasswordModal.value = false;
        resetPasswordForm();
      } else {
        Message.error(res.message || "密码修改失败");
      }
    })
    .catch((error) => {
      Message.error("密码修改失败，请稍后再试");
      console.error("密码修改失败:", error);
    });
};

// 重置密码表单
const resetPasswordForm = () => {
  passwordForm.oldPassword = "";
  passwordForm.newPassword = "";
  passwordForm.confirmPassword = "";
  showPasswordModal.value = false;
  passwordFormRef.value?.resetFields();
};

// 发送验证码
const sendVerificationCode = async () => {
  if (!emailForm.email) {
    Message.warning("请先输入邮箱地址");
    return;
  }

  try {
    // 这里调用API发送验证码
    // 示例代码，实际开发中替换为真实API调用
    // await UserControllerService.sendEmailCodeUsingPost({
    //   email: emailForm.email,
    // });

    Message.success("验证码已发送");

    // 设置倒计时
    emailForm.countDown = 60;
    const timer = setInterval(() => {
      emailForm.countDown--;
      if (emailForm.countDown <= 0) {
        clearInterval(timer);
      }
    }, 1000);
  } catch (error) {
    Message.error("验证码发送失败");
    console.error("验证码发送失败:", error);
  }
};

// 绑定邮箱
const bindEmail = async () => {
  const validate = await emailFormRef.value.validate();
  if (validate) {
    try {
      // 这里调用API绑定邮箱
      // 示例代码，实际开发中替换为真实API调用
      // await UserControllerService.bindEmailUsingPost({
      //   email: emailForm.email,
      //   code: emailForm.code,
      // });

      Message.success("邮箱绑定成功");
      securityForm.email = emailForm.email;
      showEmailModal.value = false;
      resetEmailForm();

      // 更新用户信息
      // await store.dispatch("user/getLoginUser");
    } catch (error) {
      Message.error("邮箱绑定失败");
      console.error("邮箱绑定失败:", error);
    }
  }
};

// 重置邮箱表单
const resetEmailForm = () => {
  emailForm.email = "";
  emailForm.code = "";
  emailForm.countDown = 0;
  showEmailModal.value = false;
  emailFormRef.value?.resetFields();
};

// 绑定GitHub账号
const handleBindGithub = () => {
  if (securityForm.githubBound) {
    // 解绑逻辑
    // await UserControllerService.unbindGithubUsingPost();
    Message.success("GitHub账号解绑成功");
    securityForm.githubBound = false;
  } else {
    // 跳转到GitHub授权页面
    // window.location.href = "/api/oauth2/authorization/github";
    Message.info("正在跳转至GitHub授权页面");
  }
};

// 绑定Gitee账号
const handleBindGitee = () => {
  if (securityForm.giteeBound) {
    // 解绑逻辑
    // await UserControllerService.unbindGiteeUsingPost();
    Message.success("Gitee账号解绑成功");
    securityForm.giteeBound = false;
  } else {
    // 跳转到Gitee授权页面
    // window.location.href = "/api/oauth2/authorization/gitee";
    Message.info("正在跳转至Gitee授权页面");
  }
};

// 邮箱部分隐藏
const maskEmail = (email: string) => {
  if (!email) return "";
  const parts = email.split("@");
  if (parts.length !== 2) return email;

  const name = parts[0];
  const domain = parts[1];

  // 显示前3个字符，其余用*代替
  const maskedName =
    name.length <= 3
      ? name
      : name.substring(0, 3) + "*".repeat(name.length - 3);

  return `${maskedName}@${domain}`;
};
</script>

<style scoped>
.settings-container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px;
}

.settings-wrapper {
  display: flex;
  gap: 24px;
  min-height: 600px;
  margin: 20px 0;
  background-color: var(--color-bg-2);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.settings-sidebar {
  width: 240px;
  padding: 24px 0;
  border-right: 1px solid var(--color-border-2);
  background-color: var(--color-bg-1);
}

.settings-title {
  padding: 0 20px 20px;
  margin: 0;
  font-size: 20px;
  border-bottom: 1px solid var(--color-border-2);
}

.settings-menu {
  border-right: none;
}

.settings-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.content-panel {
  width: 100%;
}

.panel-title {
  font-size: 18px;
  margin: 0 0 8px;
  font-weight: 500;
}

/* 个人资料部分样式 */
.profile-section-row {
  display: flex;
  gap: 20px;
  margin-bottom: 8px;
}

.profile-section-col {
  flex: 1;
}

.gender-checked {
  color: rgb(var(--primary-6));
}

.skill-tags-container {
  position: relative;
  margin-bottom: 8px;
}

.tag-selected {
  background-color: rgb(var(--primary-1));
  border-color: rgb(var(--primary-4));
  color: rgb(var(--primary-6));
}

.tags-counter {
  position: absolute;
  right: 0;
  top: -24px;
  font-size: 12px;
  color: var(--color-text-3);
}

/* 头像上传样式 */
.avatar-upload-section {
  margin-bottom: 24px;
}

.avatar-wrapper {
  display: flex;
  gap: 24px;
  align-items: center;
  margin-bottom: 16px;
}

.avatar-preview {
  border: 2px solid var(--color-border-2);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: var(--color-fill-2);
  transition: all 0.3s;
}

.avatar-preview:hover {
  border-color: rgb(var(--primary-6));
  transform: scale(1.02);
}

.avatar-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 账号安全样式 */
.security-item {
  padding: 16px 0;
}

.security-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.security-title {
  display: flex;
  gap: 12px;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
}

.security-desc {
  color: var(--color-text-3);
  font-size: 14px;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .settings-wrapper {
    flex-direction: column;
  }

  .settings-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--color-border-2);
    padding: 16px 0;
  }

  .settings-title {
    padding: 0 16px 16px;
  }

  .settings-content {
    padding: 16px;
  }

  .avatar-wrapper {
    flex-direction: column;
    align-items: flex-start;
  }

  .profile-section-row {
    flex-direction: column;
    gap: 8px;
  }
}

@media screen and (max-width: 480px) {
  .settings-container {
    padding: 0 12px;
  }
}

.quick-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
}

.quick-tags-title {
  margin: 12px 0 4px;
  font-size: 13px;
  color: var(--color-text-3);
}

.quick-tag {
  cursor: pointer;
  transition: all 0.2s;
}

.quick-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tag-selected {
  background-color: rgb(var(--primary-1));
  border-color: rgb(var(--primary-4));
  color: rgb(var(--primary-6));
}
</style>
