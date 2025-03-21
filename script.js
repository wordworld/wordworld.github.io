// 视频数据
const videos = [
    {
        title: "闪耀 SHINE 直拍",
        url: "https://b23.tv/PlVoA3v",
        thumbnail: "shine-cover.jpg" // 使用实际的封面图片路径
    },
    {
        title: "一天一天 直拍",
        url: "https://b23.tv/D7RTtPh",
        thumbnail: "oneday-cover.jpg"
    },
    {
        title: "怪胎秀 横版4K直拍",
        url: "https://b23.tv/VH9qvJ3",
        thumbnail: "monster-cover.jpg"
    },
    {
        title: "LALALALA 直拍",
        url: "https://b23.tv/CCQqJQR",
        thumbnail: "lalalala-cover.jpg"
    },
    {
        title: "Dynamite Cover",
        url: "https://b23.tv/axTAHVn",
        thumbnail: "dynamite-cover.jpg"
    },
    {
        title: "明天地球要爆炸 直拍",
        url: "https://b23.tv/ZpFCCMO",
        thumbnail: "earth-cover.jpg"
    },
    {
        title: "娃娃脸 直拍",
        url: "https://b23.tv/Wb23sXL",
        thumbnail: "doll-cover.jpg"
    },
    {
        title: "Baggy Jeans 双机位直拍",
        url: "https://b23.tv/QErvNqP",
        thumbnail: "baggy-cover.jpg"
    },
    {
        title: "Guilty 四机位直拍",
        url: "https://b23.tv/0Ty4jMq",
        thumbnail: "guilty-cover.jpg"
    },
    {
        title: "盖世英雄 四机位直拍",
        url: "https://b23.tv/4d0qjwH",
        thumbnail: "hero-cover.jpg"
    },
    {
        title: "耶yeah 4K直拍",
        url: "https://b23.tv/AVyM6fB",
        thumbnail: "yeah-cover.jpg"
    },
    {
        title: "十八岁生日音乐分享小会",
        url: "https://b23.tv/JChQHhq",
        thumbnail: "birthday-cover.jpg"
    }
];

// 初始化外层轮播图
const groupSwiper = new Swiper('.group-swiper', {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true,
    navigation: {
        nextEl: '.group-next',
        prevEl: '.group-prev',
    },
    pagination: {
        el: '.group-pagination',
        clickable: true,
    },
    effect: 'fade',
    fadeEffect: {
        crossFade: true
    },
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
});

// 初始化内层轮播图
function initSuSwipers() {
    const suSwipers = document.querySelectorAll('.su-swiper');
    suSwipers.forEach(swiper => {
        new Swiper(swiper, {
            slidesPerView: 1,
            spaceBetween: 0,
            loop: true,
            navigation: {
                nextEl: swiper.querySelector('.swiper-button-next'),
                prevEl: swiper.querySelector('.swiper-button-prev'),
            },
            pagination: {
                el: swiper.querySelector('.swiper-pagination'),
                clickable: true,
            },
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            },
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
        });
    });
}

// API配置
const API_URL = 'http://localhost:5000/api';
let isAdmin = false;

// 显示评论
function loadComments() {
    const commentsContainer = document.querySelector('.comments-container');
    
    try {
        // 从本地存储获取评论
        const comments = JSON.parse(localStorage.getItem('comments') || '[]');
        
        if (comments.length === 0) {
            commentsContainer.innerHTML = '<p class="no-comments">还没有评论，来说点什么吧~</p>';
            return;
        }
        
        commentsContainer.innerHTML = comments.map(comment => `
            <div class="comment">
                <div class="comment-header">
                    <span class="comment-author">${comment.author.name}</span>
                    <span class="comment-date">${new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                <div class="comment-content">${comment.content}</div>
            </div>
        `).join('');
    } catch (error) {
        console.error('加载评论失败:', error);
        commentsContainer.innerHTML = '<p class="error">加载评论失败，请稍后再试</p>';
    }
}

// 举报评论
async function reportComment(commentId) {
    try {
        const response = await fetch(`${API_URL}/comments/${commentId}/report`, {
            method: 'POST'
        });
        const result = await response.json();
        alert(result.message);
    } catch (error) {
        console.error('举报失败:', error);
        alert('举报失败，请稍后再试');
    }
}

// 更新评论状态
async function updateCommentStatus(commentId, status) {
    try {
        const response = await fetch(`${API_URL}/comments/${commentId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });
        const result = await response.json();
        alert(result.message);
        loadAdminComments();
        loadComments();
    } catch (error) {
        console.error('更新评论状态失败:', error);
        alert('更新评论状态失败，请稍后再试');
    }
}

// 删除评论
async function deleteComment(commentId) {
    if (confirm('确定要删除这条评论吗？')) {
        try {
            const response = await fetch(`${API_URL}/comments/${commentId}`, {
                method: 'DELETE'
            });
            const result = await response.json();
            alert(result.message);
            loadAdminComments();
            loadComments();
        } catch (error) {
            console.error('删除评论失败:', error);
            alert('删除评论失败，请稍后再试');
        }
    }
}

// 加载所有评论（管理员视图）
function loadAdminComments() {
    const adminCommentsContainer = document.querySelector('.admin-comments');
    
    try {
        // 从本地存储获取所有评论
        const comments = JSON.parse(localStorage.getItem('comments') || '[]');
        
        adminCommentsContainer.innerHTML = comments.map(comment => `
            <div class="admin-comment">
                <div class="comment-header">
                    <span class="comment-author">${comment.author.name}</span>
                    <span class="comment-date">${new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                <div class="comment-content">${comment.content}</div>
                <div class="admin-actions">
                    <button class="delete-btn" onclick="deleteAdminComment('${comment._id}')">删除</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('加载评论失败:', error);
        adminCommentsContainer.innerHTML = '<p class="error">加载评论失败，请稍后再试</p>';
    }
}

// 管理员删除评论
function deleteAdminComment(commentId) {
    if (confirm('确定要删除这条评论吗？')) {
        try {
            // 从本地存储获取评论
            const comments = JSON.parse(localStorage.getItem('comments') || '[]');
            // 过滤掉要删除的评论
            const newComments = comments.filter(comment => comment._id !== commentId);
            // 保存更新后的评论列表
            localStorage.setItem('comments', JSON.stringify(newComments));
            // 重新加载评论列表
            loadComments();
            loadAdminComments();
            alert('评论已删除！');
        } catch (error) {
            console.error('删除评论失败:', error);
            alert('删除评论失败，请稍后再试');
        }
    }
}

// 管理员登出
function adminLogout() {
    isAdmin = false;
    adminPanel.style.display = 'none';
    alert('已退出管理员模式');
}

// 在页面加载完成后初始化所有功能
document.addEventListener('DOMContentLoaded', () => {
    // 初始化主轮播图
    const mainSwiper = new Swiper('.main-swiper', {
        spaceBetween: 0,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        loop: true,
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        on: {
            init: function() {
                console.log('Swiper initialized');
            }
        }
    });

    // 初始化小苏想说轮播图
    initSuSwipers();

    // 渲染视频列表
    function renderVideos() {
        const performancesGrid = document.querySelector('.performances-grid');
        performancesGrid.innerHTML = videos.map(video => `
            <div class="video-card">
                <a href="${video.url}" target="_blank" class="video-link">
                    <div class="video-thumbnail">
                        <img src="${video.thumbnail}" alt="${video.title}" loading="lazy">
                        <div class="play-icon">▶</div>
                    </div>
                    <h3>${video.title}</h3>
                </a>
            </div>
        `).join('');
    }

    // 提交评论
    const submitButton = document.getElementById('submitComment');
    const contentInput = document.getElementById('content');

    submitButton.addEventListener('click', () => {
        const content = contentInput.value.trim();
        if (!content) {
            alert('请输入评论内容！');
            return;
        }
        
        try {
            // 从本地存储获取现有评论
            const comments = JSON.parse(localStorage.getItem('comments') || '[]');
            
            // 创建新评论
            const newComment = {
                _id: Date.now().toString(),
                content: content,
                author: {
                    name: '匿名用户'
                },
                createdAt: new Date().toISOString(),
                status: 'approved'
            };
            
            // 添加新评论到数组开头（最新的评论显示在最上面）
            comments.unshift(newComment);
            
            // 保存到本地存储
            localStorage.setItem('comments', JSON.stringify(comments));
            
            // 清空输入框并重新加载评论
            contentInput.value = '';
            loadComments();
            
            alert('评论提交成功！');
        } catch (error) {
            console.error('提交评论失败:', error);
            alert('提交评论失败，请稍后再试');
        }
    });

    // 管理员登录相关
    const adminLoginBtn = document.getElementById('adminLoginBtn');
    const adminModal = document.getElementById('adminModal');
    const adminLoginForm = document.getElementById('adminLogin');
    const adminPassword = document.getElementById('adminPassword');
    const closeModal = document.querySelector('.close-modal');
    const adminPanel = document.getElementById('adminPanel');

    // 显示管理员登录模态框
    adminLoginBtn.addEventListener('click', () => {
        if (isAdmin) {
            // 如果已经是管理员，点击按钮则登出
            adminLogout();
            adminLoginBtn.textContent = '管理员登录';
        } else {
            // 否则显示登录框
            adminModal.style.display = 'flex';
        }
    });

    // 关闭模态框
    closeModal.addEventListener('click', () => {
        adminModal.style.display = 'none';
    });

    // 点击模态框外部关闭
    window.addEventListener('click', (e) => {
        if (e.target === adminModal) {
            adminModal.style.display = 'none';
        }
    });

    // 管理员登录
    adminLoginForm.addEventListener('click', () => {
        const password = adminPassword.value;
        
        if (password === 'ruby0601') {
            isAdmin = true;
            adminModal.style.display = 'none';
            adminPanel.style.display = 'block';
            adminLoginBtn.textContent = '退出管理';
            loadAdminComments();
            alert('登录成功！');
        } else {
            alert('密码错误！');
        }
        
        adminPassword.value = '';
    });

    // 初始化其他功能
    renderVideos();
    loadComments();
}); 
