// 视频数据
const videos = [
    {
        title: "闪耀 SHINE 直拍",
        url: "https://b23.tv/PlVoA3v",
        thumbnail: "images/shine-cover.jpg" // 使用实际的封面图片路径
    },
    {
        title: "一天一天 直拍",
        url: "https://b23.tv/D7RTtPh",
        thumbnail: "images/oneday-cover.jpg"
    },
    {
        title: "怪胎秀 横版4K直拍",
        url: "https://b23.tv/VH9qvJ3",
        thumbnail: "images/monster-cover.jpg"
    },
    {
        title: "LALALALA 直拍",
        url: "https://b23.tv/CCQqJQR",
        thumbnail: "images/lalalala-cover.jpg"
    },
    {
        title: "Dynamite Cover",
        url: "https://b23.tv/axTAHVn",
        thumbnail: "images/dynamite-cover.jpg"
    },
    {
        title: "明天地球要爆炸 直拍",
        url: "https://b23.tv/ZpFCCMO",
        thumbnail: "images/earth-cover.jpg"
    },
    {
        title: "娃娃脸 直拍",
        url: "https://b23.tv/Wb23sXL",
        thumbnail: "images/doll-cover.jpg"
    },
    {
        title: "Baggy Jeans 双机位直拍",
        url: "https://b23.tv/QErvNqP",
        thumbnail: "images/baggy-cover.jpg"
    },
    {
        title: "Guilty 四机位直拍",
        url: "https://b23.tv/0Ty4jMq",
        thumbnail: "images/guilty-cover.jpg"
    },
    {
        title: "盖世英雄 四机位直拍",
        url: "https://b23.tv/4d0qjwH",
        thumbnail: "images/hero-cover.jpg"
    },
    {
        title: "耶yeah 4K直拍",
        url: "https://b23.tv/AVyM6fB",
        thumbnail: "images/yeah-cover.jpg"
    },
    {
        title: "十八岁生日音乐分享小会",
        url: "https://b23.tv/JChQHhq",
        thumbnail: "images/birthday-cover.jpg"
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

let isAdmin = false;

// GitHub 配置
const GITHUB_REPO = 'wordworld/wordworld.github.io';
const GITHUB_ISSUES_API = `https://api.github.com/repos/${GITHUB_REPO}/issues`;
const ISSUE_NUMBER = 1; // 用第一个 issue 来存储评论
const GITHUB_TOKEN = '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';

// 显示评论
async function loadComments() {
    const commentsContainer = document.querySelector('.comments-container');
    const loadingElement = document.querySelector('.loading-comments');
    
    try {
        loadingElement.style.display = 'block';
        
        // 从 GitHub Issues 获取评论
        const response = await fetch(`${GITHUB_ISSUES_API}/${ISSUE_NUMBER}/comments`);
        const comments = await response.json();
        
        if (comments.length === 0) {
            commentsContainer.innerHTML = '<p class="no-comments">还没有评论，来说点什么吧~</p>';
            return;
        }
        
        commentsContainer.innerHTML = comments.map(comment => {
            const commentData = JSON.parse(comment.body);
            return `
                <div class="comment">
                    <div class="comment-header">
                        <span class="comment-author">${commentData.author}</span>
                        <span class="comment-date">${new Date(comment.created_at).toLocaleDateString()}</span>
                    </div>
                    <div class="comment-content">${commentData.content}</div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('加载评论失败:', error);
        commentsContainer.innerHTML = '<p class="error">加载评论失败，请稍后再试</p>';
    } finally {
        loadingElement.style.display = 'none';
    }
}

// 提交评论
async function submitComment(content) {
    try {
        // 创建评论数据
        const commentData = {
            author: '匿名用户',
            content: content
        };
        
        // 提交到 GitHub Issues
        const response = await fetch(`${GITHUB_ISSUES_API}/${ISSUE_NUMBER}/comments`, {
            method: 'POST',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                body: JSON.stringify(commentData)
            })
        });
        
        if (!response.ok) {
            throw new Error('评论提交失败');
        }
        
        return true;
    } catch (error) {
        console.error('提交评论失败:', error);
        return false;
    }
}

// 删除评论（管理员功能）
async function deleteComment(commentId) {
    try {
        const response = await fetch(`${GITHUB_ISSUES_API}/comments/${commentId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`
            }
        });
        
        if (!response.ok) {
            throw new Error('删除评论失败');
        }
        
        return true;
    } catch (error) {
        console.error('删除评论失败:', error);
        return false;
    }
}

// 加载所有评论（管理员视图）
async function loadAdminComments() {
    const adminCommentsContainer = document.querySelector('.admin-comments');
    
    try {
        // 从 GitHub Issues 获取评论
        const response = await fetch(`${GITHUB_ISSUES_API}/${ISSUE_NUMBER}/comments`);
        const comments = await response.json();
        
        adminCommentsContainer.innerHTML = comments.map(comment => `
            <div class="admin-comment">
                <div class="comment-header">
                    <span class="comment-author">${JSON.parse(comment.body).author}</span>
                    <span class="comment-date">${new Date(comment.created_at).toLocaleDateString()}</span>
                </div>
                <div class="comment-content">${JSON.parse(comment.body).content}</div>
                <div class="admin-actions">
                    <button class="delete-btn" onclick="deleteAdminComment('${comment.id}')">删除</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('加载评论失败:', error);
        adminCommentsContainer.innerHTML = '<p class="error">加载评论失败，请稍后再试</p>';
    }
}

// 管理员删除评论
async function deleteAdminComment(commentId) {
    if (confirm('确定要删除这条评论吗？')) {
        try {
            const response = await fetch(`${GITHUB_ISSUES_API}/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`
                }
            });
            
            if (!response.ok) {
                throw new Error('删除评论失败');
            }
            
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

    submitButton.addEventListener('click', async () => {
        const content = contentInput.value.trim();
        if (!content) {
            alert('请输入评论内容！');
            return;
        }
        
        const success = await submitComment(content);
        if (success) {
            contentInput.value = '';
            loadComments();
            alert('评论提交成功！');
        } else {
            alert('评论提交失败，请稍后再试');
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