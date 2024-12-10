document.addEventListener('DOMContentLoaded', function() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const compressSettings = document.querySelector('.compress-settings');
    const previewArea = document.querySelector('.preview-area');
    const downloadBtn = document.getElementById('downloadBtn');

    // 拖拽上传处理
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#3498db';
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#bdc3c7';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#bdc3c7';
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleImage(files[0]);
        }
    });

    // 点击上传处理
    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleImage(e.target.files[0]);
        }
    });

    // 质量滑块处理
    qualitySlider.addEventListener('input', (e) => {
        qualityValue.textContent = e.target.value + '%';
        if (window.currentFile) {
            compressImage(window.currentFile, e.target.value);
        }
    });

    // 图片处理函数
    function handleImage(file) {
        if (!file.type.startsWith('image/')) {
            alert('请上传图片文件！');
            return;
        }

        window.currentFile = file;
        compressSettings.style.display = 'block';
        previewArea.style.display = 'block';

        // 显示原图
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('originalPreview').src = e.target.result;
            document.getElementById('originalSize').textContent = 
                `原始大小: ${(file.size / 1024).toFixed(2)} KB`;
        };
        reader.readAsDataURL(file);

        // 压缩图片
        compressImage(file, qualitySlider.value);
    }

    // 图片压缩函数
    function compressImage(file, quality) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                canvas.toBlob((blob) => {
                    const compressedUrl = URL.createObjectURL(blob);
                    document.getElementById('compressedPreview').src = compressedUrl;
                    document.getElementById('compressedSize').textContent = 
                        `压缩后大小: ${(blob.size / 1024).toFixed(2)} KB`;
                    
                    // 更新下载按钮
                    downloadBtn.onclick = () => {
                        const link = document.createElement('a');
                        link.href = compressedUrl;
                        link.download = 'compressed_' + file.name;
                        link.click();
                    };
                }, file.type, quality / 100);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}); 