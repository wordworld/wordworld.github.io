// 视频数据
const videos = [
    {
        title: "闪耀 SHINE 直拍",
        url: "https://b23.tv/PlVoA3v",
        thumbnail: "shine-cover.jpg"
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

// Firebase 配置
const firebaseConfig = {
    apiKey: "AIzaSyBoaAX7c-v2lfBUC2N5SyyhmHQtWc9yBAU",
    authDomain: "su-website-660df.firebaseapp.com",
    projectId: "su-website-660df",
    storageBucket: "su-website-660df.firebasestorage.app",
    messagingSenderId: "231122069625",
    appId: "1:231122069625:web:01368378632569cce4cca8",
    databaseURL: "https://su-website-660df-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// 初始化 Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// 显示评论
function loadComments() {
    const commentsContainer = document.querySelector('.comments-container');
    
    // 监听数据变化
    database.ref('comments').on('value', (snapshot) => {
        try {
            const comments = [];
            snapshot.forEach((childSnapshot) => {
                comments.unshift({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });
            
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
    });
}

// 提交评论
function submitComment() {
    const contentInput = document.getElementById('content');
    const content = contentInput.value.trim();
    
    if (!content) {
        alert('请输入评论内容！');
        return;
    }
    
    try {
        // 创建新评论
        const newComment = {
            content: content,
            author: {
                name: '匿名用户'
            },
            createdAt: firebase.database.ServerValue.TIMESTAMP
        };
        
        // 保存到 Firebase
        database.ref('comments').push(newComment)
            .then(() => {
                contentInput.value = '';
                alert('评论提交成功！');
            })
            .catch((error) => {
                console.error('提交评论失败:', error);
                alert('提交评论失败，请稍后再试');
            });
    } catch (error) {
        console.error('提交评论失败:', error);
        alert('提交评论失败，请稍后再试');
    }
}

// 管理员删除评论
function deleteAdminComment(commentId) {
    if (confirm('确定要删除这条评论吗？')) {
        database.ref('comments/' + commentId).remove()
            .then(() => {
                alert('评论已删除！');
            })
            .catch((error) => {
                console.error('删除评论失败:', error);
                alert('删除评论失败，请稍后再试');
            });
    }
}

// 加载管理员评论
function loadAdminComments() {
    const adminCommentsContainer = document.querySelector('.admin-comments');
    
    database.ref('comments').on('value', (snapshot) => {
        try {
            const comments = [];
            snapshot.forEach((childSnapshot) => {
                comments.unshift({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });
            
            adminCommentsContainer.innerHTML = comments.map(comment => `
                <div class="admin-comment">
                    <div class="comment-header">
                        <span class="comment-author">${comment.author.name}</span>
                        <span class="comment-date">${new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div class="comment-content">${comment.content}</div>
                    <div class="admin-actions">
                        <button class="delete-btn" onclick="deleteAdminComment('${comment.id}')">删除</button>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('加载评论失败:', error);
            adminCommentsContainer.innerHTML = '<p class="error">加载评论失败，请稍后再试</p>';
        }
    });
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

    // 初始化评论提交按钮
    const submitButton = document.getElementById('submitComment');
    submitButton.addEventListener('click', submitComment);

    // 初始化管理员功能
    const adminLoginBtn = document.getElementById('adminLoginBtn');
    const adminModal = document.getElementById('adminModal');
    const adminLoginForm = document.getElementById('adminLogin');
    const adminPassword = document.getElementById('adminPassword');
    const closeModal = document.querySelector('.close-modal');
    const adminPanel = document.getElementById('adminPanel');

    // 显示管理员登录模态框
    adminLoginBtn.addEventListener('click', () => {
        if (isAdmin) {
            adminLogout();
            adminLoginBtn.textContent = '管理员登录';
        } else {
            adminModal.style.display = 'flex';
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

    // 初始化其他功能
    renderVideos();
    loadComments();
}); 