// MonyGo Demo App

const balanceEl = document.getElementById("balance");
const postCountEl = document.getElementById("postCount");
const likeCountEl = document.getElementById("likeCount");

const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");

const publishBtn = document.getElementById("publishBtn");
const resetBtn = document.getElementById("resetBtn");
const messageEl = document.getElementById("message");
const feedList = document.getElementById("feedList");

const walletBtn = document.getElementById("walletBtn");
const walletDialog = document.getElementById("walletDialog");
const closeWallet = document.getElementById("closeWallet");
const closeWallet2 = document.getElementById("closeWallet2");
const walletBalance = document.getElementById("walletBalance");

const profileBtn = document.getElementById("profileBtn");

let balance = Number(localStorage.getItem("monygo_balance")) || 0;
let likes = Number(localStorage.getItem("monygo_likes")) || 0;
let posts = JSON.parse(localStorage.getItem("monygo_posts") || "[]");

function saveData() {
  localStorage.setItem("monygo_balance", String(balance));
  localStorage.setItem("monygo_likes", String(likes));
  localStorage.setItem("monygo_posts", JSON.stringify(posts));
}

function updateStats() {
  balanceEl.textContent = balance;
  postCountEl.textContent = posts.length;
  likeCountEl.textContent = likes;

  walletBalance.textContent = balance;
}

function renderPosts() {
  feedList.innerHTML = "";

  if (posts.length === 0) {
    feedList.innerHTML = `
      <div class="empty">
        No posts yet. Create your first post!
      </div>
    `;
    return;
  }

  posts.forEach((post, index) => {
    const article = document.createElement("article");
    article.className = "post-card";

    article.innerHTML = `
      <div class="post-head">
        <strong>${escapeHTML(post.title)}</strong>
        <span>+10</span>
      </div>

      <p>${escapeHTML(post.content)}</p>

      <div class="post-actions">
        <button class="like-btn" data-index="${index}">
          ❤️ ${post.likes || 0}
        </button>
      </div>
    `;

    feedList.appendChild(article);
  });

  document.querySelectorAll(".like-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.index);

      if (!posts[index]) return;

      posts[index].likes = (posts[index].likes || 0) + 1;
      likes += 1;

      saveData();
      updateStats();
      renderPosts();
    });
  });
}

function escapeHTML(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

publishBtn.addEventListener("click", () => {
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (!title || !content) {
    messageEl.textContent = "Please enter a title and content.";
    return;
  }

  const newPost = {
    title: title,
    content: content,
    likes: 0,
    createdAt: Date.now()
  };

  posts.unshift(newPost);

  balance += 10;

  saveData();
  updateStats();
  renderPosts();

  titleInput.value = "";
  contentInput.value = "";

  messageEl.textContent = "Post published! +10 MonyPoints 🎉";
});

resetBtn.addEventListener("click", () => {
  const confirmed = confirm("Reset the MonyGo demo?");

  if (!confirmed) return;

  balance = 0;
  likes = 0;
  posts = [];

  saveData();
  updateStats();
  renderPosts();

  messageEl.textContent = "Demo has been reset.";
});

walletBtn.addEventListener("click", () => {
  walletBalance.textContent = balance;

  if (typeof walletDialog.showModal === "function") {
    walletDialog.showModal();
  } else {
    alert(`Your balance is ${balance} MonyPoints.`);
  }
});

closeWallet.addEventListener("click", () => {
  walletDialog.close();
});

closeWallet2.addEventListener("click", () => {
  walletDialog.close();
});

profileBtn.addEventListener("click", () => {
  alert("MonyGo Profile\n\nDemo account");
});

document.querySelectorAll("[data-scroll]").forEach((button) => {
  button.addEventListener("click", () => {
    const targetId = button.dataset.scroll;
    const target = document.getElementById(targetId);

    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });
});

updateStats();
renderPosts();
