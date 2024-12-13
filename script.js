// 获取DOM元素
const dropZone = document.getElementById('drop-zone');
const uploadInput = document.getElementById('upload');
const removeButton = document.getElementById('remove-bg');
const resultDiv = document.getElementById('result');

// 直接使用 API key，因为这是公开的前端应用
const API_KEY = 'kZyajyoVynW1kKERK7CtEdBs';
const API_URL = 'https://api.remove.bg/v1.0/removebg';

// 处理文件上传
function handleFile(file) {
    if (file) {
        // 检查文件类型
        if (!file.type.startsWith('image/')) {
            alert('请上传图片文件！');
            return;
        }
        // 显示原始图片
        displayImage(file, 'original');
    }
}

// 文件输入变化事件
uploadInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
});

// 拖拽相关事件
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.style.borderColor = '#2ecc71';
});

dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.style.borderColor = '#4a90e2';
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.style.borderColor = '#4a90e2';
    const file = e.dataTransfer.files[0];
    if (file) {
        uploadInput.files = e.dataTransfer.files;
        handleFile(file);
    }
});

// 去除背景按钮点击事件
removeButton.addEventListener('click', async function() {
    if (!uploadInput.files || uploadInput.files.length === 0) {
        alert('请先上传一张图片！');
        return;
    }

    const file = uploadInput.files[0];
    
    // 显示加载状态
    removeButton.disabled = true;
    removeButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 处理中...';
    
    try {
        const formData = new FormData();
        formData.append('image_file', file);
        formData.append('size', 'auto');

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'X-Api-Key': API_KEY
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 获取二进制图片数据
        const blob = await response.blob();
        
        // 创建URL对象
        const url = URL.createObjectURL(blob);
        
        // 显示处理后的图片
        const img = document.createElement('img');
        img.src = url;
        img.alt = '处理后的图片';
        resultDiv.innerHTML = '';
        resultDiv.appendChild(img);
        
        // 添加下载按钮
        const downloadBtn = document.createElement('a');
        downloadBtn.href = url;
        downloadBtn.download = 'removed-bg.png';
        downloadBtn.className = 'download-button';
        downloadBtn.innerHTML = '<i class="fas fa-download"></i> 下载图片';
        resultDiv.appendChild(downloadBtn);

    } catch (error) {
        console.error('Error:', error);
        alert('处理失败，请重试: ' + error.message);
    } finally {
        // 恢复按钮状态
        removeButton.disabled = false;
        removeButton.innerHTML = '<i class="fas fa-magic"></i> 去除背景';
    }
});

// 显示图片函数
function displayImage(file, targetId) {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(event) {
        if (event.target && event.target.result) {
            const img = document.createElement('img');
            img.src = event.target.result;
            img.alt = '上传的图片';
            const container = document.getElementById(targetId);
            if (container) {
                container.innerHTML = '';
                container.appendChild(img);
            }
        }
    };
    reader.onerror = function(error) {
        console.error('Error reading file:', error);
        alert('读取图片失败，请重试');
    };
    reader.readAsDataURL(file);
}
