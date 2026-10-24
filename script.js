const dropZone = document.getElementById('drop-zone');
const uploadInput = document.getElementById('upload');
const removeButton = document.getElementById('remove-bg');
const originalDiv = document.getElementById('original');
const resultDiv = document.getElementById('result');
const statusMessage = document.getElementById('status');
const MAX_FILE_SIZE = 5 * 1024 * 1024;
let selectedFile = null;
let resultObjectUrl = null;

function setStatus(message, state = '') {
    statusMessage.textContent = message;
    statusMessage.dataset.state = state;
}

function showPlaceholder(container, message) {
    const placeholder = document.createElement('span');
    placeholder.className = 'empty-state';
    placeholder.textContent = message;
    container.replaceChildren(placeholder);
}

function displayImage(file, container, alt) {
    const img = document.createElement('img');
    img.alt = alt;
    img.src = URL.createObjectURL(file);
    container.replaceChildren(img);
}

function handleFile(file) {
    if (!file) return;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        selectedFile = null;
        uploadInput.value = '';
        removeButton.disabled = true;
        showPlaceholder(originalDiv, '上传后在此预览原图');
        setStatus('文件格式不支持。请选择 JPG、PNG 或 WebP 图片。', 'error');
        return;
    }
    if (file.size > MAX_FILE_SIZE) {
        selectedFile = null;
        uploadInput.value = '';
        removeButton.disabled = true;
        showPlaceholder(originalDiv, '上传后在此预览原图');
        setStatus('图片超过 5 MB，请选择较小的文件。', 'error');
        return;
    }
    selectedFile = file;
    removeButton.disabled = true;
    displayImage(file, originalDiv, '待处理的原始图片');
    showPlaceholder(resultDiv, '点击“去除背景”后在此查看结果');
    setStatus(`已选择 ${file.name}。图片预览正常；处理服务尚未完成安全配置，暂不可提交图片。`, 'error');
}

uploadInput.addEventListener('change', () => handleFile(uploadInput.files[0]));
dropZone.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        uploadInput.click();
    }
});
dropZone.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropZone.classList.add('is-dragging');
});
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('is-dragging'));
dropZone.addEventListener('drop', (event) => {
    event.preventDefault();
    dropZone.classList.remove('is-dragging');
    const file = event.dataTransfer.files[0];
    if (file) handleFile(file);
});

removeButton.addEventListener('click', () => {
    if (selectedFile) setStatus('处理服务尚未完成安全配置。为保护您的图片和服务凭据，本站暂不提交该文件。', 'error');
});
