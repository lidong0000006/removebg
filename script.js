// 获取DOM元素
const dropZone = document.getElementById('drop-zone');
const uploadInput = document.getElementById('upload');
const removeButton = document.getElementById('remove-bg');
const resultDiv = document.getElementById('result');

const API_KEY = process.env.REMOVE_BG_API_KEY || 'kZyajyoVynW1kKERK7CtEdBs';
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
    handleFile(e.target.files[0]);
});

// 拖拽相关事件
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#2ecc71';
});

dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#4a90e2';
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#4a90e2';
    const file = e.dataTransfer.files[0];
    uploadInput.files = e.dataTransfer.files;
    handleFile(file);
});

// 去除背景按钮点击事件
removeButton.addEventListener('click', async function() {
    if (uploadInput.files.length === 0) {
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
                'X-Api-Key': API_KEY,
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('背景去除失败');
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
        alert('处理失败，请重试');
    } finally {
        // 恢复按钮状态
        removeButton.disabled = false;
        removeButton.innerHTML = '<i class="fas fa-magic"></i> 去除背景';
    }
});

// 显示图片函数
function displayImage(file, targetId) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = document.createElement('img');
        img.src = event.target.result;
        img.alt = '上传的图片';
        const container = document.getElementById(targetId);
        container.innerHTML = '';
        container.appendChild(img);
    };
    reader.readAsDataURL(file);
}
