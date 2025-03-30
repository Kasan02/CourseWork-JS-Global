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

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    let selectedFile = null;
    let previewUrl = null;

    const fileInput = document.querySelector(".file-upload-input");
    const fileUploadLabel = document.getElementById("file-upload-label");

    fileInput.addEventListener("change", (event) => {
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        selectedFile = file;
        previewUrl = URL.createObjectURL(selectedFile);
        fileUploadLabel.innerHTML = `
          <div class="file-upload-preview-container" style="display: flex; align-items: center; justify-content: flex-start;">
            <img src="${previewUrl}" alt="Preview" class="upload-preview">
            <button type="button" class="button form-button replace-photo-button">Заменить фото</button>
          </div>
        `;
        fileUploadLabel.addEventListener("click", (event) => {
          if (event.target.classList.contains("replace-photo-button")) {
            event.stopPropagation();
            fileInput.click();
          }
        });
      }
    });

    document.getElementById("add-button").addEventListener("click", () => {
      const description = document.getElementById("post-description").value.trim();
    
      if (!selectedFile) {
        alert("Пожалуйста, выберите фото");
        return;
      }
    
      if (!description) {
        alert("Пожалуйста, добавьте описание");
        return;
      }
      uploadImage({ file: selectedFile })
        .then((uploadResult) => {
          console.log("Ответ сервера:", uploadResult);
          if (!uploadResult || !uploadResult.fileUrl) {
            throw new Error("Сервер не вернул URL изображения");
          }
    
          console.log('Описание:', description);
          console.log('URL изображения:', uploadResult.fileUrl);
          onAddPostClick({ description, imageUrl: uploadResult.fileUrl });
        })
        .catch((error) => {
          console.error("Ошибка загрузки изображения:", error);
          alert(`Ошибка загрузки изображения: ${error.message || error}`);
        });
    });
    
  };

  render();
}

