const APP_CONFIG = window.APP_CONFIG || {};
const EMAIL_CONFIG = APP_CONFIG.email || {};
const menuData = window.MENU_DATA || [];

const CART_STORAGE_KEY = "dinner_product_cart_complete_v1";

let activeCategory = menuData[0]?.id || "";
let cart = loadCart();
let searchText = "";
let favoriteOnly = false;
let emailReady = false;

const $ = (id) => document.getElementById(id);

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function getEmailConfig() {
  return {
    publicKey: EMAIL_CONFIG.publicKey || "",
    serviceId: EMAIL_CONFIG.serviceId || "",
    templateId: EMAIL_CONFIG.templateId || "",
    toEmail: EMAIL_CONFIG.toEmail || ""
  };
}

function initEmailJS() {
  const config = getEmailConfig();

  if (!config.publicKey || !window.emailjs) {
    emailReady = false;
    return;
  }

  try {
    emailjs.init({ publicKey: config.publicKey });
    emailReady = true;
  } catch (error) {
    emailReady = false;
    console.error(error);
  }
}

function loadHeaderImage() {
  const headerImage = APP_CONFIG.headerImage || "";
  const headerBg = document.querySelector(".store-bg");

  if (!headerBg || !headerImage) return;

  headerBg.style.backgroundImage = `url("${headerImage}")`;
  headerBg.classList.add("has-photo");
}

function allDishes() {
  return menuData.flatMap(category => category.dishes.map(dish => ({
    ...dish,
    categoryId: category.id,
    categoryName: category.name
  })));
}

function findDish(id) {
  return allDishes().find(dish => dish.id === id);
}

function categoryCount(categoryId) {
  const category = menuData.find(c => c.id === categoryId);
  if (!category) return 0;
  return category.dishes.reduce((sum, dish) => sum + (cart[dish.id] || 0), 0);
}

function cartCount() {
  return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
}

function cartTotal() {
  return Object.entries(cart).reduce((sum, [id, qty]) => {
    const dish = findDish(id);
    return dish ? sum + dish.price * qty : sum;
  }, 0);
}

function visibleDishes() {
  const query = searchText.trim().toLowerCase();

  if (query) {
    return allDishes()
      .filter(dish => {
        const haystack = `${dish.name} ${dish.desc} ${dish.tag || ""} ${dish.categoryName}`.toLowerCase();
        return haystack.includes(query);
      })
      .filter(dish => !favoriteOnly || dish.favorite);
  }

  const category = menuData.find(c => c.id === activeCategory);
  const list = category ? category.dishes.map(d => ({ ...d, categoryId: category.id, categoryName: category.name })) : [];
  return favoriteOnly ? list.filter(d => d.favorite) : list;
}

function fallbackSvg(name) {
  const text = encodeURIComponent(name || "暂无图片");
  return `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect width='100%25' height='100%25' fill='%23f1f1f1'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='28' font-family='Arial'%3E${text}%3C/text%3E%3C/svg%3E`;
}

function renderCategories() {
  $("categorySidebar").innerHTML = menuData.map(category => {
    const count = categoryCount(category.id);
    return `
      <button class="category-item ${category.id === activeCategory && !searchText ? "active" : ""}" data-id="${category.id}">
        ${category.name}
        ${count ? `<span class="category-count">${count}</span>` : ""}
      </button>
    `;
  }).join("");

  document.querySelectorAll(".category-item").forEach(btn => {
    btn.addEventListener("click", () => {
      activeCategory = btn.dataset.id;
      searchText = "";
      $("searchInput").value = "";
      render();
    });
  });
}

function renderDishes() {
  const dishes = visibleDishes();
  const title = searchText ? "搜索结果" : (menuData.find(c => c.id === activeCategory)?.name || "菜单");

  if (!dishes.length) {
    $("dishPanel").innerHTML = `
      <div class="panel-title">${title}</div>
      <div class="empty-state">没有找到菜品</div>
    `;
    return;
  }

  $("dishPanel").innerHTML = `
    <div class="panel-title">${title}</div>
    ${dishes.map(dish => {
      const qty = cart[dish.id] || 0;
      return `
        <article class="dish-card">
          <div class="dish-img-wrap">
            ${dish.favorite ? `<span class="favorite-mark">常点</span>` : ""}
            <img class="dish-img" src="${dish.image}" alt="${dish.name}" loading="lazy"
              onerror="this.onerror=null;this.src='${fallbackSvg(dish.name)}';" />
          </div>
          <div class="dish-body">
            <div class="dish-top">
              <div class="dish-name">${dish.name}</div>
              ${dish.tag ? `<span class="tag">${dish.tag}</span>` : ""}
            </div>
            <div class="dish-desc">${dish.desc || ""}</div>
            <div class="dish-bottom">
              <div class="price">￥${dish.price}</div>
              <div class="counter">
                ${qty ? `<button class="icon-btn minus" data-action="minus" data-id="${dish.id}">−</button><span class="qty">${qty}</span>` : ""}
                <button class="icon-btn" data-action="plus" data-id="${dish.id}">+</button>
              </div>
            </div>
          </div>
        </article>
      `;
    }).join("")}
  `;

  document.querySelectorAll("[data-action]").forEach(btn => {
    btn.addEventListener("click", (event) => {
      event.stopPropagation();
      const id = btn.dataset.id;
      if (btn.dataset.action === "plus") addDish(id);
      if (btn.dataset.action === "minus") removeDish(id);
    });
  });
}

function renderCartFab() {
  const count = cartCount();
  $("cartBubble").textContent = count;
  $("cartMainText").textContent = count ? `已选 ${count} 份` : "还没选菜";
  $("cartSubText").textContent = count ? `合计 ￥${cartTotal()}` : "点 + 加入今晚菜单";
}

function renderCartList() {
  const entries = Object.entries(cart).filter(([id]) => findDish(id));

  if (!entries.length) {
    $("cartList").innerHTML = `<div class="empty-state" style="padding:30px 0;">购物车是空的</div>`;
  } else {
    $("cartList").innerHTML = entries.map(([id, qty]) => {
      const dish = findDish(id);
      return `
        <div class="cart-row">
          <div>
            <div class="cart-name">${dish.name}</div>
            <div class="cart-note">￥${dish.price} × ${qty}</div>
          </div>
          <div class="counter">
            <button class="icon-btn minus" data-cart-action="minus" data-id="${id}">−</button>
            <span class="qty">${qty}</span>
            <button class="icon-btn" data-cart-action="plus" data-id="${id}">+</button>
          </div>
        </div>
      `;
    }).join("");
  }

  $("totalPrice").textContent = `￥${cartTotal()}`;

  document.querySelectorAll("[data-cart-action]").forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.dataset.cartAction === "plus") addDish(btn.dataset.id);
      if (btn.dataset.cartAction === "minus") removeDish(btn.dataset.id);
    });
  });
}

function render() {
  renderCategories();
  renderDishes();
  renderCartFab();
  renderCartList();
}

function addDish(id) {
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  showToast("已加入今晚菜单");
  render();
}

function removeDish(id) {
  if (!cart[id]) return;
  cart[id] -= 1;
  if (cart[id] <= 0) delete cart[id];
  saveCart();
  render();
}

function clearCart() {
  cart = {};
  saveCart();
  $("shareCard").classList.remove("show");
  render();
}

function generateOrderText() {
  const entries = Object.entries(cart).filter(([id]) => findDish(id));
  const lines = entries.map(([id, qty]) => {
    const dish = findDish(id);
    return `- ${dish.name} x${qty}    ￥${dish.price * qty}`;
  });

  const note = $("orderNote").value.trim();
  return `今晚菜单：\n${lines.join("\n")}\n\n合计：￥${cartTotal()}${note ? "\n备注：" + note : ""}\n\n下单时间：${new Date().toLocaleString()}`;
}

function getEmailParams(orderText) {
  const config = getEmailConfig();
  return {
    message: orderText,
    order_text: orderText,
    total: `￥${cartTotal()}`,
    time: new Date().toLocaleString(),
    to_email: config.toEmail || "",
    subject: "今晚菜单"
  };
}

async function sendOrderEmail(orderText) {
  const config = getEmailConfig();

  if (!config.publicKey || !config.serviceId || !config.templateId) {
    throw new Error("EmailJS 还没配置，请在 config.js 里填写 publicKey / serviceId / templateId");
  }

  if (!emailReady) {
    initEmailJS();
  }

  if (!emailReady) {
    throw new Error("EmailJS 初始化失败，请检查 Public Key");
  }

  return emailjs.send(config.serviceId, config.templateId, getEmailParams(orderText));
}

async function confirmOrder() {
  if (!cartCount()) {
    showToast("还没有选菜");
    return;
  }

  const text = generateOrderText();
  $("shareText").textContent = text;
  $("shareCard").classList.add("show");

  try {
    showToast("正在发送邮件...");
    await sendOrderEmail(text);
    showToast("菜单已发送到邮箱");
    await copyText(text, false);
  } catch (error) {
    console.error(error);
    showToast(error.message || "邮件发送失败");
  }
}

async function copyText(text, showSuccess = true) {
  try {
    await navigator.clipboard.writeText(text);
    if (showSuccess) showToast("菜单已复制");
  } catch {
    if (showSuccess) showToast("复制失败，可手动复制");
  }
}

async function shareOrder() {
  const text = generateOrderText();
  if (navigator.share) {
    try {
      await navigator.share({ title: "今晚菜单", text });
      return;
    } catch {}
  }
  copyText(text);
}

function openDrawer() {
  $("overlay").classList.add("show");
  $("cartDrawer").classList.add("show");
  renderCartList();
}

function closeDrawer() {
  $("overlay").classList.remove("show");
  $("cartDrawer").classList.remove("show");
}

let toastTimer = null;
function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
}

function bindEvents() {
  $("searchInput").addEventListener("input", (e) => {
    searchText = e.target.value;
    render();
  });

  $("favoriteOnlyBtn").addEventListener("click", () => {
    favoriteOnly = !favoriteOnly;
    $("favoriteOnlyBtn").classList.toggle("active", favoriteOnly);
    render();
  });

  $("cartFab").addEventListener("click", openDrawer);
  $("overlay").addEventListener("click", closeDrawer);
  $("clearCartBtn").addEventListener("click", clearCart);
  $("confirmBtn").addEventListener("click", confirmOrder);
  $("copyBtn").addEventListener("click", () => copyText(generateOrderText()));
  $("shareBtn").addEventListener("click", shareOrder);
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    });
  }
}

initEmailJS();
loadHeaderImage();
bindEvents();
render();
registerServiceWorker();
