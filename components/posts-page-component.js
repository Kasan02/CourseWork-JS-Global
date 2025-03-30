import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts } from "../index.js";
/**
 * Дополнительно можно импортировать библиотеку для форматирования даты, например:
 * import { formatDistanceToNow } from "date-fns";
 */

export function renderPostsPageComponent({ appEl }) {
  // Формируем список постов на основе данных из posts
  const postsHtml = posts.length
    ? posts
        .map((post) => {
          // Предполагается, что API возвращает следующие поля:
          // id, user: { id, name, imageUrl }, imageUrl, description, likes, createdAt, isLiked
          const formattedDate = post.createdAt
            ? /* Если нужна библиотека date-fns: formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) */
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

  // Рендерим шапку страницы
  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  // Обработчик клика по заголовку каждого поста для перехода на страницу пользователя
  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }
}
