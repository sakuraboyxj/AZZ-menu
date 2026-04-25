// App 配置文件
// 这里改顶部照片和 EmailJS 配置。
// 前台点菜页面不会显示这些配置。

window.APP_CONFIG = {
  // 顶部 banner 照片：
  // 把你们的照片放到 images 文件夹，例如 images/us.jpg
  // 然后改成 headerImage: "images/us.jpg"
  // 如果想恢复默认橙色背景，写成：headerImage: ""
  headerImage: "images/header-photo.svg",

  // EmailJS 配置：
  // 从 EmailJS 后台复制这三个 ID 进来。
  email: {
    publicKey: "RUfnZ2PPclauixw2E",
    serviceId: "dinner_menu",
    templateId: "template_3bt0zmq",

    // 可选。如果 EmailJS 模板用了 {{to_email}}，这里填你的邮箱。
    toEmail: "sakuraboyxj@gmail.com"
  }
};
