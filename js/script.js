const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

const navLinks = document.querySelectorAll('.nav-menu ul li a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        
        navLinks.forEach(item => item.classList.remove('active'));
        link.classList.add('active');
    });
});


const themeToggle = document.getElementById('themeToggle');
const bodyElement = document.body;

const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    bodyElement.className = currentTheme;
} else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = prefersDark ? 'dark-mode' : 'light-mode';
    bodyElement.className = initialTheme;
    localStorage.setItem('theme', initialTheme);
}

themeToggle.addEventListener('click', () => {
    if (bodyElement.classList.contains('light-mode')) {
        bodyElement.classList.replace('light-mode', 'dark-mode');
        localStorage.setItem('theme', 'dark-mode');
        showToast('Tema Gelap Diaktifkan', true);
    } else {
        bodyElement.classList.replace('dark-mode', 'light-mode');
        localStorage.setItem('theme', 'light-mode');
        showToast('Tema Terang Diaktifkan', true);
    }
});

function showToast(message, isSuccess = true) {
    let toast = document.getElementById('customToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'customToast';
        toast.style.position = 'fixed';
        toast.style.bottom = '30px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%) translateY(100px)';
        toast.style.backgroundColor = 'var(--surface-color)';
        toast.style.color = 'var(--text-color)';
        toast.style.border = '1px solid var(--accent)';
        toast.style.padding = '12px 24px';
        toast.style.borderRadius = '30px';
        toast.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.25)';
        toast.style.zIndex = '3000';
        toast.style.opacity = '0';
        toast.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s ease';
        toast.style.display = 'flex';
        toast.style.alignItems = 'center';
        toast.style.gap = '10px';
        toast.style.fontWeight = '600';
        toast.style.fontSize = '14px';
        document.body.appendChild(toast);
    }
    
    toast.innerHTML = `<span>${isSuccess ? '🌲' : '⚠️'}</span> <span>${message}</span>`;
    
    setTimeout(() => {
        toast.style.transform = 'translateX(-50%) translateY(0)';
        toast.style.opacity = '1';
    }, 50);
    
    setTimeout(() => {
        toast.style.transform = 'translateX(-50%) translateY(100px)';
        toast.style.opacity = '0';
    }, 3000);
}

const defaultReviews = [
    {
        id: 1,
        name: "Budi Santoso",
        status: "Alumni Angkatan 2018",
        rating: 5,
        avatar: "🧗",
        comment: "Pengalaman yang mengubah hidup saya. Di sini saya belajar arti sebenarnya dari bertahan hidup, kepemimpinan, dan bagaimana menghargai alam. Solidaritasnya luar biasa!",
        date: "2026-05-15T08:30:00Z"
    },
    {
        id: 2,
        name: "Siti Aminah",
        status: "Anggota Aktif",
        rating: 4,
        avatar: "🏕️",
        comment: "Sebelum gabung, saya ragu bisa naik gunung. Tapi berkat pelatihan dan bimbingan senior di divisi Mountaineering, saya berhasil mencapai puncak pertama saya dengan aman.",
        date: "2026-06-02T10:15:00Z"
    },
    {
        id: 3,
        name: "Andi Wijaya",
        status: "Ketua Divisi Konservasi",
        rating: 5,
        avatar: "🥾",
        comment: "Bukan cuma soal naik gunung, tapi juga soal aksi nyata. Program tanam 1000 pohon tahun lalu adalah momen paling membanggakan buat saya selama jadi mahasiswa.",
        date: "2026-06-20T14:45:00Z"
    }
];

let reviews = JSON.parse(localStorage.getItem('mapala_reviews'));
if (!reviews || reviews.length === 0) {
    reviews = defaultReviews;
    localStorage.setItem('mapala_reviews', JSON.stringify(reviews));
}

const reviewsList = document.getElementById('reviewsList');
const avgRatingNum = document.getElementById('avgRatingNum');
const avgRatingStars = document.getElementById('avgRatingStars');
const totalReviewsCount = document.getElementById('totalReviewsCount');
const liveReviewForm = document.getElementById('liveReviewForm');
const starRatingInput = document.getElementById('starRatingInput');
const selectedRatingInput = document.getElementById('selectedRating');
const reviewSort = document.getElementById('reviewSort');

function renderReviews() {
    if (!reviewsList) return;

    const sortBy = reviewSort ? reviewSort.value : 'newest';
    let sortedReviews = [...reviews];

    if (sortBy === 'newest') {
        sortedReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'highest') {
        sortedReviews.sort((a, b) => b.rating - a.rating || new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'lowest') {
        sortedReviews.sort((a, b) => a.rating - b.rating || new Date(b.date) - new Date(a.date));
    }

    reviewsList.innerHTML = '';

    sortedReviews.forEach(review => {
        const dateFormatted = new Date(review.date).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        let starsHTML = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= review.rating) {
                starsHTML += '<span style="color: var(--star-color);">★</span>';
            } else {
                starsHTML += '<span style="color: var(--text-muted); opacity: 0.3;">★</span>';
            }
        }

        let photoHTML = '';
        if (review.photo) {
            photoHTML = `
                <div class="review-card-photo-container">
                    <img src="${review.photo}" alt="Foto ulasan oleh ${review.name}" class="review-card-photo">
                </div>
            `;
        }

        const card = document.createElement('div');
        card.className = 'review-card';
        card.innerHTML = `
            <div class="review-card-header">
                <div class="review-card-avatar">${review.avatar || '🧗'}</div>
                <div class="review-card-user-info">
                    <h4>${review.name}</h4>
                    <span>${review.status}</span>
                </div>
                <div class="review-card-rating">
                    ${starsHTML}
                </div>
            </div>
            <p class="review-card-comment">"${review.comment}"</p>
            ${photoHTML}
            <div class="review-card-date">${dateFormatted}</div>
        `;
        reviewsList.appendChild(card);
    });

    const totalCount = reviews.length;
    let sum = 0;
    reviews.forEach(r => sum += r.rating);
    const average = totalCount > 0 ? (sum / totalCount).toFixed(1) : 0.0;

    if (avgRatingNum) avgRatingNum.textContent = average;
    if (totalReviewsCount) totalReviewsCount.textContent = `Berdasarkan ${totalCount} ulasan`;

    if (avgRatingStars) {
        avgRatingStars.innerHTML = '';
        const avgNum = parseFloat(average);
        for (let i = 1; i <= 5; i++) {
            const starSpan = document.createElement('span');
            if (i <= Math.round(avgNum)) {
                starSpan.textContent = '★';
                starSpan.style.color = 'var(--star-color)';
            } else {
                starSpan.textContent = '★';
                starSpan.style.color = 'var(--text-muted)';
                starSpan.style.opacity = '0.3';
            }
            avgRatingStars.appendChild(starSpan);
        }
    }
}

if (starRatingInput) {
    const starBtns = starRatingInput.querySelectorAll('.star-btn');
    starBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const ratingVal = parseInt(btn.getAttribute('data-rating'));
            selectedRatingInput.value = ratingVal;
            
            starBtns.forEach(star => {
                const starVal = parseInt(star.getAttribute('data-rating'));
                if (starVal <= ratingVal) {
                    star.classList.add('active');
                } else {
                    star.classList.remove('active');
                }
            });
        });

        btn.addEventListener('mouseenter', () => {
            const ratingVal = parseInt(btn.getAttribute('data-rating'));
            starBtns.forEach(star => {
                const starVal = parseInt(star.getAttribute('data-rating'));
                if (starVal <= ratingVal) {
                    star.style.color = 'var(--star-color)';
                } else {
                    star.style.color = '';
                }
            });
        });

        btn.addEventListener('mouseleave', () => {
            const activeRating = parseInt(selectedRatingInput.value);
            starBtns.forEach(star => {
                const starVal = parseInt(star.getAttribute('data-rating'));
                if (starVal <= activeRating) {
                    star.style.color = 'var(--star-color)';
                } else {
                    star.style.color = '';
                }
            });
        });
    });
}

if (reviewSort) {
    reviewSort.addEventListener('change', renderReviews);
}


const photoInput = document.getElementById('reviewPhoto');
const uploadLabel = document.querySelector('.file-upload-label');
if (photoInput && uploadLabel) {
    photoInput.addEventListener('change', (e) => {
        if (photoInput.files && photoInput.files[0]) {
            const name = photoInput.files[0].name;
            const displayName = name.length > 22 ? name.substring(0, 19) + '...' : name;
            uploadLabel.textContent = `📄 ${displayName}`;
            uploadLabel.style.borderColor = 'var(--accent)';
        } else {
            uploadLabel.textContent = '📸 Pilih Foto Dokumentasi';
            uploadLabel.style.borderColor = '';
        }
    });
}

if (liveReviewForm) {
    liveReviewForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('reviewerName').value.trim();
        const status = document.getElementById('reviewerStatus').value.trim();
        const comment = document.getElementById('reviewerComment').value.trim();
        const rating = parseInt(selectedRatingInput.value);
        const selectedAvatarRadio = document.querySelector('input[name="avatar"]:checked');
        const avatar = selectedAvatarRadio ? selectedAvatarRadio.value : '🧗';

        if (!name || !status || !comment) {
            showToast('Semua kolom form wajib diisi!', false);
            return;
        }

        const saveReview = (photoBase64 = '') => {
            const newReview = {
                id: Date.now(),
                name,
                status,
                rating,
                avatar,
                comment,
                photo: photoBase64,
                date: new Date().toISOString()
            };

            reviews.unshift(newReview);
            localStorage.setItem('mapala_reviews', JSON.stringify(reviews));

            renderReviews();
            showToast('Ulasan Anda berhasil dikirim secara live!', true);

            liveReviewForm.reset();
            if (uploadLabel) {
                uploadLabel.textContent = '📸 Pilih Foto Dokumentasi';
                uploadLabel.style.borderColor = '';
            }
            
            selectedRatingInput.value = 5;
            if (starRatingInput) {
                const starBtns = starRatingInput.querySelectorAll('.star-btn');
                starBtns.forEach(star => star.classList.add('active'));
            }
        };

        if (photoInput && photoInput.files && photoInput.files[0]) {
            const file = photoInput.files[0];
            if (file.size > 1024 * 1024) {
                showToast('Ukuran foto maksimal 1MB!', false);
                return;
            }
            const reader = new FileReader();
            reader.onload = function(event) {
                saveReview(event.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            saveReview('');
        }
    });
}


const contactForm = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');

const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const messageError = document.getElementById('messageError');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        if (nameInput.value.trim() === '') {
            nameError.style.display = 'block';
            isValid = false;
        } else {
            nameError.style.display = 'none';
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailInput.value.trim())) {
            emailError.style.display = 'block';
            isValid = false;
        } else {
            emailError.style.display = 'none';
        }

        if (messageInput.value.trim() === '') {
            messageError.style.display = 'block';
            isValid = false;
        } else {
            messageError.style.display = 'none';
        }

        if (isValid) {
            showToast('Pesan Anda berhasil dikirim. Terima kasih!', true);
            contactForm.reset();
        }
    });
}



const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailVal = document.getElementById('newsletterEmail').value.trim();
        if (emailVal) {
            showToast(`Terima kasih! Email (${emailVal}) berhasil terdaftar.`, true);
            newsletterForm.reset();
        }
    });
}

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.querySelector('.lightbox-close');

if (lightbox) {
    document.body.addEventListener('click', (e) => {
        const item = e.target.closest('.gallery-item') || e.target.closest('.review-card-photo-container');
        if (item) {
            const img = item.tagName === 'IMG' ? item : item.querySelector('img');
            if (img && lightboxImg) {
                lightboxImg.src = img.src;
                if (lightboxCaption) {
                    lightboxCaption.textContent = img.alt || 'Dokumentasi Petualangan';
                }
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        }
    });

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-container')) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

const scrollToTopBtn = document.getElementById('scrollToTop');
if (scrollToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}


document.addEventListener('DOMContentLoaded', () => {
    renderReviews();
});
renderReviews();