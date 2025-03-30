import { renderHeaderComponent } from "./header-component.js";
import { uploadImage } from "../api.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  const render = () => {
    const appHtml = `
      <div class="page-container">
          <div class="header-container"></div>
          <div class="form">
              <h3 class="form-title">Добавить пост</h3>
              <div class="form-inputs">
                  <div class="upload-image-container">
                      <div class="upload-image">
                          <label class="file-upload-label secondary-button" id="file-upload-label">
                              <input type="file" class="file-upload-input" style="display:none">
                              Выберите фото
                          </label>
                      </div>
                  </div>
                  <label>
                      Опишите фотографию:
                      <textarea class="input textarea" id="post-description" rows="4"></textarea>
                  </label>
                  <button class="button center" id="add-button">Добавить</button>
              </div>
          </div>
      </div>
    `;

    appEl.innerHTML = appHtml;

    // Рендерим шапку через общий компонент
    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    // Переменные для хранения выбранного файла и превью
    let selectedFile = null;
    let previewUrl = null;

    const fileInput = document.querySelector(".file-upload-input");
    const fileUploadLabel = document.getElementById("file-upload-label");

    // Обработка выбора файла
    fileInput.addEventListener("change", (event) => {
      if (event.target.files && event.target.files[0]) {
        selectedFile = event.target.files[0];
        previewUrl = URL.createObjectURL(selectedFile);

        // Обновляем содержимое метки, чтобы показать превью и кнопку замены
        fileUploadLabel.innerHTML = `
        <div class="file-upload-preview-container">
          <img src="${previewUrl}" alt="Preview" class="upload-preview">
          <br>
          <button type="button" class="button form-button">Заменить фото</button>
        `;

        // Обработчик для кнопки "Заменить фото"
        const replaceButton = fileUploadLabel.querySelector(".replace-photo-button");
        replaceButton.addEventListener("click", (e) => {
          e.stopPropagation();
          fileInput.click();
        });
      }
    });

    // Обработчик клика по кнопке "Добавить"
    document.getElementById("add-button").addEventListener("click", () => {
      const description = document.getElementById("post-description").value.trim();

      if (!selectedFile) {
        alert("Пожалуйста, выберите фото");
        return;
      }

      // Сначала загружаем изображение на сервер
      uploadImage({ file: selectedFile })
        .then((uploadResult) => {
          // uploadResult должен содержать поле imageUrl
          const imageUrl = uploadResult.imageUrl;
          // Вызываем переданную callback-функцию для добавления поста
          onAddPostClick({ description, imageUrl });
        })
        .catch((error) => {
          console.error("Ошибка загрузки изображения:", error);
          alert("Ошибка загрузки изображения");
        });
    });
  };

  render();
}
