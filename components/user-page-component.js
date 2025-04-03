import { renderHeaderComponent } from "./header-component.js";
import { posts } from "../index.js";

export function renderUserPostsPageComponent({ appEl }) {
  const postsHtml = posts.length
    ? posts
        .map((post) => {
          const formattedDate = new Date(post.createdAt).toLocaleString();
          return `
            <li class="post">
              <div class="post-image-container">
                <img class="post-image" src="${post.imageUrl}">
              </div>
              <p class="post-text">${post.description}</p>
              <p class="post-date">${formattedDate}</p>
            </li>
          `;
        })
        .join("")
    : "<p>Нет постов</p>";

    const userImageUrl = posts.length > 0 ? posts[0].user.imageUrl : "default-avatar.png";
    const userName = posts.length > 0 ? posts[0].user.name : "Неизвестный пользователь";

  const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <div class="posts-user-header">
      <img src="${userImageUrl}" class="posts-user-header__user-image">
      <p class="posts-user-header__user-name">${userName}</p>
      </div>
      <ul class="posts">
        ${postsHtml}
      </ul>
    </div>
  `;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });
}