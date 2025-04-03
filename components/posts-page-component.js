import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { goToPage, posts } from "../index.js";
/**
 * Дополнительно можно импортировать библиотеку для форматирования даты, например:
 * import { formatDistanceToNow } from "date-fns";
 */

export function renderPostsPageComponent({ appEl }) {
  const postsHtml = posts.length
    ? posts
        .map((post) => {
          const formattedDate = post.createdAt
            ? 
              new Date(post.createdAt).toLocaleString()
            : "";
          return `
          <li class="post">
            <div class="post-header" data-user-id="${post.user.id}">
                <img src="${post.user.imageUrl}" class="post-header__user-image">
                <p class="post-header__user-name">${post.user.name}</p>
            </div>
            <div class="post-image-container">
              <img class="post-image" src="${post.imageUrl}">
            </div>
            <div class="post-likes">
              <button data-post-id="${post.id}" class="like-button">
                <img src="./images/${
                  post.isLiked ? "like-active" : "like-not-active"
                }.svg">
              </button>
              <p class="post-likes-text">
                Нравится: <strong>${post.likes}</strong>
              </p>
            </div>
            <p class="post-text">
              <span class="user-name">${post.user.name}</span>
              ${post.description}
            </p>
            <p class="post-date">
              ${formattedDate}
            </p>
          </li>
          `;
        })
        .join("")
    : "<p>Нет постов</p>";

  const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <ul class="posts">
        ${postsHtml}
      </ul>
    </div>
  `;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });
  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }
}
