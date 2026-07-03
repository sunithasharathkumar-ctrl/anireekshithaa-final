/* ==========================================================================
   ANIREEKSHITHAA - FRONTEND ROUTING, TICKET WIZARD & ADMIN CONTROLLER
   ========================================================================== */

// Supabase Configuration
// Replace YOUR_SUPABASE_ANON_KEY with the 'anon public' key from your Supabase dashboard API settings.
const supabaseUrl = 'https://eoojknstseevgnurigzg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvb2prbnN0c2VldmdudXJpZ3pnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3NjM5NzQsImV4cCI6MjA5NjMzOTk3NH0.xnzj97ZrOef2q7eDMBWTC7Q3ZaThsErneMh0IlU43Sc';
const supabaseClient = window.supabase ? window.supabase.createClient(supabaseUrl, supabaseKey) : null;

// DOM Elements & Initial Setup
document.addEventListener('DOMContentLoaded', () => {
    initScrollNavbar();
    initVideoPlayer();
    initMobileNav();
    initProfessionDropdown();
    loadSampleData(); // Pre-populate some bookings if database is empty for rich visual experience
    loadSampleFeedbacks(); // Pre-populate audience feedbacks
    initReviewCorner(); // Setup voice note and stars triggers
    initCountdown();
    initShareButtons();
});

function initProfessionDropdown() {
    const professionSelect = document.getElementById('bookingProfession');
    const filmMakerRoleGroup = document.getElementById('filmMakerRoleGroup');
    const filmMakerRoleSelect = document.getElementById('filmMakerRole');

    if (professionSelect && filmMakerRoleGroup && filmMakerRoleSelect) {
        professionSelect.addEventListener('change', () => {
            if (professionSelect.value === 'Film Maker') {
                filmMakerRoleGroup.style.display = 'block';
                filmMakerRoleSelect.setAttribute('required', 'required');
            } else {
                filmMakerRoleGroup.style.display = 'none';
                filmMakerRoleSelect.removeAttribute('required');
                filmMakerRoleSelect.value = '';
            }
        });
    }
}

/* ==========================================================================
   NAVIGATION & MOBILE MENU CONTROLLER
   ========================================================================== */
function initScrollNavbar() {
    const header = document.querySelector('.header');
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('section');

    // Sticky Navbar toggle
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }

        // Active Section highlighting
        let currentSectionId = '';
        sections.forEach(sec => {
            const secTop = sec.offsetTop - 120;
            const secHeight = sec.clientHeight;
            if (window.scrollY >= secTop && window.scrollY < secTop + secHeight) {
                currentSectionId = sec.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentSectionId}`) {
                item.classList.add('active');
            }
        });
    });
}

function initMobileNav() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    const mobileNavClose = document.getElementById('mobileNavClose');
    const mobileLinks = document.querySelectorAll('.mobile-nav-item, .mobile-nav-btn');

    mobileMenuBtn.addEventListener('click', () => {
        mobileNav.classList.add('active');
    });

    const closeNav = () => {
        mobileNav.classList.remove('active');
    };

    mobileNavClose.addEventListener('click', closeNav);
    mobileLinks.forEach(link => link.addEventListener('click', closeNav));
}

/* ==========================================================================
   VIDEO PLAYER CONTROLLERS
   ========================================================================== */
function initVideoPlayer() {
    const container = document.getElementById('videoContainer');
    const thumb = document.getElementById('videoThumbnail');
    const frame = document.getElementById('videoPlayerFrame');
    const video = document.getElementById('promoVideo');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const progressBar = document.getElementById('progressBar');
    const muteBtn = document.getElementById('muteBtn');

    container.addEventListener('click', () => {
        if (frame.style.display === 'none') {
            thumb.style.display = 'none';
            frame.style.display = 'block';
            video.play();
            playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        }
    });

    playPauseBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Stop click from triggering parent
        if (video.paused) {
            video.play();
            playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        } else {
            video.pause();
            playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        }
    });

    video.addEventListener('timeupdate', () => {
        const percentage = (video.currentTime / video.duration) * 100;
        progressBar.style.width = `${percentage}%`;
    });

    muteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        video.muted = !video.muted;
        if (video.muted) {
            muteBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
        } else {
            muteBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
        }
    });

    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const customPlayer = document.querySelector('.custom-video-player');

    if (fullscreenBtn && customPlayer) {
        fullscreenBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            
            // Check if we are on iOS/mobile where we should use webkitEnterFullscreen directly
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
            if (isIOS && video.webkitEnterFullscreen) {
                try {
                    video.webkitEnterFullscreen();
                    return;
                } catch (err) {
                    console.warn('[Fullscreen] webkitEnterFullscreen failed:', err);
                }
            }

            if (!document.fullscreenElement && !document.webkitFullscreenElement) {
                try {
                    if (customPlayer.requestFullscreen) {
                        await customPlayer.requestFullscreen();
                    } else if (customPlayer.webkitRequestFullscreen) { // Safari
                        await customPlayer.webkitRequestFullscreen();
                    } else if (customPlayer.msRequestFullscreen) { // IE11
                        await customPlayer.msRequestFullscreen();
                    } else if (video.requestFullscreen) {
                        await video.requestFullscreen();
                    } else if (video.webkitEnterFullscreen) {
                        video.webkitEnterFullscreen();
                    }
                    fullscreenBtn.innerHTML = '<i class="fa-solid fa-compress"></i>';
                } catch (err) {
                    console.warn('[Fullscreen] requestFullscreen failed, trying direct video fallback:', err);
                    try {
                        if (video.requestFullscreen) {
                            await video.requestFullscreen();
                        } else if (video.webkitEnterFullscreen) {
                            video.webkitEnterFullscreen();
                        }
                    } catch (fallbackErr) {
                        console.error('[Fullscreen] Direct video fallback failed:', fallbackErr);
                    }
                }
            } else {
                try {
                    if (document.exitFullscreen) {
                        await document.exitFullscreen();
                    } else if (document.webkitExitFullscreen) {
                        await document.webkitExitFullscreen();
                    } else if (document.msExitFullscreen) {
                        await document.msExitFullscreen();
                    }
                    fullscreenBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
                } catch (err) {
                    console.error('[Fullscreen] exitFullscreen failed:', err);
                }
            }
        });

        const updateFullscreenIcon = () => {
            if (!document.fullscreenElement && !document.webkitFullscreenElement) {
                fullscreenBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
            } else {
                fullscreenBtn.innerHTML = '<i class="fa-solid fa-compress"></i>';
            }
        };

        document.addEventListener('fullscreenchange', updateFullscreenIcon);
        document.addEventListener('webkitfullscreenchange', updateFullscreenIcon);

        // Double click video to fullscreen/exit
        video.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            fullscreenBtn.click();
        });
    }
}

/* ==========================================================================
   PREMIERE COUNTDOWN & SOCIAL SHARING CONTROLLERS
   ========================================================================== */
function initCountdown() {
    const targetDate = new Date('2026-07-25T17:00:00+05:30').getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetDate - now;
        
        const daysEl = document.getElementById('countdown-days');
        const hoursEl = document.getElementById('countdown-hours');
        const minutesEl = document.getElementById('countdown-minutes');
        const secondsEl = document.getElementById('countdown-seconds');
        const container = document.getElementById('countdown-container');
        
        if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;
        
        if (difference < 0) {
            if (container) {
                container.innerHTML = `
                    <div class="countdown-started-msg"><i class="fa-solid fa-circle-play"></i> Premiere Has Begun!</div>
                `;
            }
            return;
        }
        
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

function initShareButtons() {
    const waBtn = document.getElementById('share-wa');
    const fbBtn = document.getElementById('share-fb');
    const igBtn = document.getElementById('share-ig');
    
    if (waBtn && fbBtn && igBtn) {
        const text = "Check out the official teaser and book premiere tickets for 'Anireekshithaa - The Unexpected' 🎬🍿! Let's watch it together. Book your seats here: ";
        const currentUrl = 'https://anireekshithaa-final.vercel.app/';
        
        waBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + currentUrl)}`;
        fbBtn.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
        
        igBtn.addEventListener('click', (e) => {
            e.preventDefault();
            navigator.clipboard.writeText(currentUrl).then(() => {
                showToast("Link copied to clipboard! Share it on your Instagram Story or Bio 📸");
                setTimeout(() => {
                    window.open('https://www.instagram.com', '_blank');
                }, 1500);
            }).catch(() => {
                showToast("Failed to copy link. Please copy the URL from your address bar!");
            });
        });
    }
}

function showToast(message) {
    let toast = document.getElementById('custom-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'custom-toast';
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background: rgba(10, 10, 12, 0.95);
            border: 1px solid var(--red-bright);
            color: #fff;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 0.9rem;
            font-family: 'Outfit', sans-serif;
            font-weight: 500;
            z-index: 9999;
            box-shadow: 0 10px 30px rgba(0,0,0,0.6), 0 0 15px rgba(217, 35, 42, 0.3);
            transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s;
            opacity: 0;
            display: flex;
            align-items: center;
            gap: 10px;
            pointer-events: none;
        `;
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--red-bright);"></i> ${message}`;
    
    // Trigger animation
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
    });
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(100px)';
    }, 3000);
}

/* ==========================================================================
   LIGHTBOX GALLLERY CONTROLLER
   ========================================================================== */
function openLightbox(imgSrc, captionText) {
    const lightbox = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');

    lightboxImg.src = imgSrc;
    lightboxCaption.textContent = captionText;
    lightbox.classList.add('active');
}

function closeLightbox() {
    document.getElementById('lightboxModal').classList.remove('active');
}

/* ==========================================================================
   TICKET WIZARD LOGIC
   ========================================================================== */
let bookingState = {
    step: 1,
    tickets: 1,
    ticketPrice: 123,
    attendee: {
        name: '',
        phone: '',
        profession: '',
        role: ''
    },
    bookingId: '',
    confirmed: false,
    paidStatus: 'PENDING',
    transactionId: ''
};

function openBookingModal() {
    // Reset booking state
    bookingState = {
        step: 1,
        tickets: 1,
        ticketPrice: 123,
        showTime: '5:00 PM', // Default showtime
        attendee: { name: '', phone: '', profession: '', role: '' },
        bookingId: '',
        confirmed: false,
        paidStatus: 'PENDING',
        transactionId: ''
    };

    // Reset inputs
    document.getElementById('bookingForm').reset();
    
    // Reset conditional inputs UI
    const filmMakerRoleGroup = document.getElementById('filmMakerRoleGroup');
    const filmMakerRoleSelect = document.getElementById('filmMakerRole');
    if (filmMakerRoleGroup && filmMakerRoleSelect) {
        filmMakerRoleGroup.style.display = 'none';
        filmMakerRoleSelect.removeAttribute('required');
    }

    const mockWhatsappPopup = document.getElementById('mockWhatsappPopup');
    if (mockWhatsappPopup) {
        mockWhatsappPopup.style.display = 'none';
    }

    // Reset UI pricing displays
    document.getElementById('ticketQty').textContent = '1';
    document.getElementById('summaryTotal').textContent = '₹123.00';

    // Reset showtime radio selections to 5:00 PM
    const showTime500Radio = document.querySelector('input[name="showTimeSelect"][value="5:00 PM"]');
    if (showTime500Radio) showTime500Radio.checked = true;
    selectShowTime('5:00 PM');

    // Refresh live show capacities
    refreshShowCapacities();

    updateStepUI();
    document.getElementById('bookingModal').classList.add('active');
}

function closeBookingModal() {
    document.getElementById('bookingModal').classList.remove('active');
}

function adjustTickets(amount) {
    let newQty = bookingState.tickets + amount;
    if (newQty >= 1 && newQty <= 10) {
        bookingState.tickets = newQty;
        document.getElementById('ticketQty').textContent = newQty;

        // Recalculate cost
        const grandTotal = newQty * bookingState.ticketPrice;
        document.getElementById('summaryTotal').textContent = `₹${grandTotal.toFixed(2)}`;
    }
}

function selectShowTime(time) {
    bookingState.showTime = time;
    console.log('[Showtime] Selected show time:', time);

    const card500 = document.getElementById('showTimeCard-500');
    const card630 = document.getElementById('showTimeCard-630');

    if (time === '5:00 PM') {
        if (card500) {
            card500.style.border = '1px solid var(--red)';
            card500.style.background = 'rgba(217, 35, 42, 0.08)';
        }
        if (card630) {
            card630.style.border = '1px solid var(--border-glass)';
            card630.style.background = 'rgba(255, 255, 255, 0.01)';
        }
    } else {
        if (card500) {
            card500.style.border = '1px solid var(--border-glass)';
            card500.style.background = 'rgba(255, 255, 255, 0.01)';
        }
        if (card630) {
            card630.style.border = '1px solid var(--red)';
            card630.style.background = 'rgba(217, 35, 42, 0.08)';
        }
    }
}

async function refreshShowCapacities() {
    console.log('[Showtime] Fetching latest capacities from Supabase...');
    try {
        const bookings = await getBookingsFromSupabase();
        
        let booked500 = 0;
        let booked630 = 0;

        bookings.forEach(b => {
            if (b.paidStatus === 'Rejected') return;

            let showTime = '5:00 PM';
            if (b.category && b.category.includes(' | ')) {
                const parts = b.category.split(' | ');
                if (parts[0] === '5:00 PM' || parts[0] === '6:30 PM') {
                    showTime = parts[0];
                }
            }

            if (showTime === '5:00 PM') {
                booked500 += b.tickets;
            } else if (showTime === '6:30 PM') {
                booked630 += b.tickets;
            }
        });

        const maxSeats = 140;
        const remaining500 = Math.max(0, maxSeats - booked500);
        const remaining630 = Math.max(0, maxSeats - booked630);

        console.log(`[Showtime] Live stats - 5:00 PM: ${booked500} booked, ${remaining500} left. 6:30 PM: ${booked630} booked, ${remaining630} left.`);

        const seatsText500 = document.getElementById('seatsLeft-500');
        const seatsText630 = document.getElementById('seatsLeft-630');

        if (seatsText500) {
            if (remaining500 <= 0) {
                seatsText500.innerHTML = '<span style="color: #e74c3c; font-weight: bold;">HOUSEFULL</span>';
                document.getElementById('showTimeCard-500').style.opacity = '0.6';
            } else {
                seatsText500.textContent = `${remaining500} seats left`;
                document.getElementById('showTimeCard-500').style.opacity = '1';
            }
        }

        if (seatsText630) {
            if (remaining630 <= 0) {
                seatsText630.innerHTML = '<span style="color: #e74c3c; font-weight: bold;">HOUSEFULL</span>';
                document.getElementById('showTimeCard-630').style.opacity = '0.6';
            } else {
                seatsText630.textContent = `${remaining630} seats left`;
                document.getElementById('showTimeCard-630').style.opacity = '1';
            }
        }
    } catch (err) {
        console.error('[Showtime] Error refreshing capacities:', err);
    }
}

function goToStep(stepNumber) {
    if (stepNumber === 2 && bookingState.step === 1) {
        // Validate showtime remaining seats before proceeding
        const selectedShow = bookingState.showTime || '5:00 PM';
        const qty = bookingState.tickets;

        const seatsText = selectedShow === '5:00 PM' ? document.getElementById('seatsLeft-500') : document.getElementById('seatsLeft-630');
        if (seatsText) {
            const text = seatsText.textContent.toLowerCase();
            if (text.includes('housefull')) {
                alert(`The ${selectedShow} show is currently housefull. Please choose the other showtime.`);
                return;
            }
            const match = text.match(/(\d+)\s+seats?\s+left/);
            if (match) {
                const remaining = parseInt(match[1]);
                if (qty > remaining) {
                    alert(`Only ${remaining} seats are available for the ${selectedShow} show. Please select a maximum of ${remaining} tickets or choose the other showtime.`);
                    return;
                }
            }
        }
    }

    bookingState.step = stepNumber;
    updateStepUI();
}

function updateStepUI() {
    // Hide all steps
    for (let i = 1; i <= 3; i++) {
        const panel = document.getElementById(`stepPanel${i}`);
        if (panel) panel.classList.remove('active');
        
        const indicator = document.getElementById(`stepIndicator${i}`);
        if (indicator) {
            indicator.classList.remove('active');
        }
    }

    // Show current step panel and highlight indicator
    const currentPanel = document.getElementById(`stepPanel${bookingState.step}`);
    if (currentPanel) currentPanel.classList.add('active');

    // Highlight completed/current steps
    for (let i = 1; i <= bookingState.step; i++) {
        const indicator = document.getElementById(`stepIndicator${i}`);
        if (indicator) {
            indicator.classList.add('active');
        }
    }
}

function submitDetailsForm() {
    const name = document.getElementById('bookingName').value.trim();
    const phone = document.getElementById('bookingPhone').value.trim();
    
    const professionSelect = document.getElementById('bookingProfession');
    const roleSelect = document.getElementById('filmMakerRole');
    
    const profession = professionSelect ? professionSelect.value : 'Public Audience';
    const role = (profession === 'Film Maker' && roleSelect) ? roleSelect.value : '-';

    console.log('[Payment Flow] submitDetailsForm triggered. Input values:', { name, phone, profession, role });

    // Basic validation
    if (!name || !phone || !profession) {
        console.warn('[Payment Flow] Validation failed: Name, Phone, or Profession missing.');
        alert('Please fill all required details.');
        return;
    }

    if (profession === 'Film Maker' && (!role || role === '')) {
        console.warn('[Payment Flow] Validation failed: Filmmaker Role missing.');
        alert('Please select your Filmmaker role.');
        return;
    }

    // Check if phone matches 10-digit regex
    const phoneRegex = /^[6789]\d{9}$/;
    if (!phoneRegex.test(phone)) {
        console.warn('[Payment Flow] Validation failed: Phone is not a valid 10-digit Indian number:', phone);
        alert('Please enter a valid 10-digit Indian WhatsApp mobile number.');
        return;
    }

    // Save inputs to booking state
    bookingState.attendee = { name, phone, profession, role };

    // Generate Booking ID if not already generated (to support re-editing without generating a new ID)
    if (!bookingState.bookingId) {
        const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit code
        const alphabets = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
        const randomChar = alphabets[Math.floor(Math.random() * alphabets.length)];
        bookingState.bookingId = `ANR-${randomNum}-${randomChar}`;
    }
    
    // Set status
    bookingState.paidStatus = 'Pending Verification';
    bookingState.transactionId = '-';
    bookingState.confirmed = false;

    const grandTotal = bookingState.tickets * bookingState.ticketPrice;

    // Save booking to Database (Supabase + LocalStorage) asynchronously in background
    console.log('[Payment Flow] Saving/updating booking to database...');
    saveBookingToDatabase().then(() => {
        console.log('[Payment Flow] Database save complete.');
    }).catch(err => {
        console.error('[Payment Flow] Database save failed:', err);
    });

    // Populate confirmation display elements
    const displayBookingId = document.getElementById('displayBookingId');
    if (displayBookingId) displayBookingId.textContent = bookingState.bookingId;

    const displayCustomerName = document.getElementById('displayCustomerName');
    if (displayCustomerName) displayCustomerName.textContent = bookingState.attendee.name;

    const displayCustomerPhone = document.getElementById('displayCustomerPhone');
    if (displayCustomerPhone) displayCustomerPhone.textContent = `+91 ${bookingState.attendee.phone}`;

    const displayTicketsCount = document.getElementById('displayTicketsCount');
    if (displayTicketsCount) displayTicketsCount.textContent = `${bookingState.tickets} Seat${bookingState.tickets > 1 ? 's' : ''}`;

    const displayAmountPaid = document.getElementById('displayAmountPaid');
    if (displayAmountPaid) displayAmountPaid.textContent = `₹${grandTotal.toFixed(2)}`;

    const displayShowTime = document.getElementById('displayShowTime');
    if (displayShowTime) displayShowTime.textContent = bookingState.showTime || '5:00 PM';

    const displayBookingStatus = document.getElementById('displayBookingStatus');
    if (displayBookingStatus) {
        displayBookingStatus.textContent = 'Pending Verification';
        displayBookingStatus.style.backgroundColor = 'rgba(241, 196, 15, 0.1)';
        displayBookingStatus.style.color = '#f1c40f';
    }

    // Set dynamic UPI payment intent link for QR Code
    const upiId = '9986048332@ybl';
    const upiDeepLink = `upi://pay?pa=${upiId}&pn=ADARSH%20R&am=${grandTotal}&cu=INR`;
    
    // Set dynamic QR code image URL
    const qrImg = document.getElementById('upiQrCodeImg');
    if (qrImg) {
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(upiDeepLink)}`;
        qrImg.setAttribute('src', qrUrl);
        console.log('[Payment Flow] Generated QR Code URL:', qrUrl);
    }

    // Configure the WhatsApp screenshot upload button
    const sendScreenshotBtn = document.getElementById('sendScreenshotBtn');
    if (sendScreenshotBtn) {
        const textMsg = `Hi, I have completed the payment of ₹${grandTotal.toFixed(2)} for ${bookingState.tickets} seat${bookingState.tickets > 1 ? 's' : ''} of Anireekshithaa. My Booking ID is *${bookingState.bookingId}*. Here is my payment screenshot for verification.`;
        const encodedText = encodeURIComponent(textMsg);
        sendScreenshotBtn.setAttribute('href', `https://wa.me/919986048332?text=${encodedText}`);
    }

    // Go to step 3 (Payment & Confirmation)
    goToStep(3);
}

async function copyTextToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        console.log('[Clipboard] Copied successfully:', text);
    } catch (err) {
        console.warn('[Clipboard] Failed to copy using navigator.clipboard, trying fallback...', err);
        try {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.top = "0";
            textArea.style.left = "0";
            textArea.style.position = "fixed";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            if (successful) {
                console.log('[Clipboard] Copied using legacy fallback.');
            } else {
                console.error('[Clipboard] Legacy fallback failed.');
            }
        } catch (fallbackErr) {
            console.error('[Clipboard] Legacy fallback threw error:', fallbackErr);
        }
    }
}

function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.position = 'fixed';
        container.style.bottom = '30px';
        container.style.left = '50%';
        container.style.transform = 'translateX(-50%)';
        container.style.zIndex = '9999';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '10px';
        container.style.pointerEvents = 'none';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.style.background = 'rgba(15, 15, 20, 0.95)';
    toast.style.border = '1px solid rgba(255, 255, 255, 0.1)';
    toast.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
    toast.style.color = '#fff';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '8px';
    toast.style.fontSize = '0.9rem';
    toast.style.fontWeight = '500';
    toast.style.textAlign = 'center';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '8px';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    toast.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

    let icon = '<i class="fa-solid fa-circle-check" style="color: #2ecc71;"></i>';
    if (type === 'error') {
        icon = '<i class="fa-solid fa-circle-xmark" style="color: var(--red);"></i>';
    } else if (type === 'info') {
        icon = '<i class="fa-solid fa-circle-info" style="color: #f1c40f;"></i>';
    }

    toast.innerHTML = `${icon} <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }, 10);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

function copyPayText(text, label) {
    copyTextToClipboard(text).then(() => {
        showToast(`${label} copied to clipboard!`);
    }).catch(err => {
        console.error('Failed to copy: ', err);
        showToast('Failed to copy. Please copy manually.', 'error');
    });
}

function launchUpiApp(appName) {
    const upiId = '9986048332@ybl';
    
    // Copy UPI ID to clipboard
    copyTextToClipboard(upiId).then(() => {
        showToast(`UPI ID Copied! Opening App...`);
        
        // Schemes to open app home screen directly
        const schemes = {
            phonepe: 'phonepe://',
            gpay: 'tez://',
            paytm: 'paytm://',
            bhim: 'bhim://'
        };
        
        const scheme = schemes[appName] || 'upi://';
        
        setTimeout(() => {
            window.location.href = scheme;
        }, 600);
    }).catch(err => {
        console.error('Failed to copy UPI ID: ', err);
        showToast('Failed to copy UPI ID. Please copy manually.', 'error');
    });
}



/* ==========================================================================
   DATABASE CONTROLLER (LOCAL BACKUP + SUPABASE LIVE DB)
   ========================================================================== */
function getBookings() {
    const stored = localStorage.getItem('anireekshithaa_bookings');
    const bookings = stored ? JSON.parse(stored) : [];
    return bookings.map(b => {
        if (b.paidStatus === 'PENDING' || b.paidStatus === 'PENDING_VERIFICATION') {
            b.paidStatus = 'Pending Verification';
        } else if (b.paidStatus === 'SUCCESSFUL') {
            b.paidStatus = 'Confirmed';
        }
        return b;
    });
}

async function getBookingsFromSupabase() {
    if (!supabaseClient || supabaseKey === 'YOUR_SUPABASE_ANON_KEY') {
        console.log('[Supabase] Client not configured. Falling back to local storage.');
        return getBookings();
    }
    try {
        console.log('[Supabase] Fetching latest registry from database...');
        const { data, error } = await supabaseClient
            .from('bookings')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Map properties and normalize status
        const list = (data || []).map(b => {
            let status = b.paid_status;
            if (status === 'PENDING' || status === 'PENDING_VERIFICATION') {
                status = 'Pending Verification';
            } else if (status === 'SUCCESSFUL') {
                status = 'Confirmed';
            }
            return {
                bookingId: b.booking_id,
                name: b.name,
                phone: b.phone,
                profession: b.profession,
                category: b.category,
                tickets: b.tickets,
                totalAmount: b.total_amount,
                paidStatus: status,
                bookingDate: b.booking_date
            };
        });

        // Keep local cache fully synchronized
        localStorage.setItem('anireekshithaa_bookings', JSON.stringify(list));
        console.log(`[Supabase] Successfully loaded and synchronized ${list.length} records.`);
        return list;
    } catch (err) {
        console.error('[Supabase] Error fetching bookings from Supabase:', err);
        return getBookings(); // fallback to local storage
    }
}

async function saveBookingToDatabase() {
    // Generate new booking record
    const newBookingLocal = {
        bookingId: bookingState.bookingId,
        name: bookingState.attendee.name,
        phone: bookingState.attendee.phone,
        profession: bookingState.attendee.profession === 'Film Maker' ? `Film Maker - ${bookingState.attendee.role}` : bookingState.attendee.profession,
        category: (bookingState.showTime || '5:00 PM') + ' | ' + bookingState.attendee.profession + ' | ' + bookingState.attendee.role,
        transactionId: bookingState.transactionId || '-',
        tickets: bookingState.tickets,
        totalAmount: bookingState.tickets * bookingState.ticketPrice,
        paidStatus: bookingState.paidStatus || 'Pending Verification',
        bookingDate: new Date().toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };

    // 1. Save/Update in Local Storage (prevent duplicates)
    const bookings = getBookings();
    const existingIndex = bookings.findIndex(b => b.bookingId === newBookingLocal.bookingId);
    if (existingIndex !== -1) {
        // Preserve original booking date if re-editing
        newBookingLocal.bookingDate = bookings[existingIndex].bookingDate || newBookingLocal.bookingDate;
        bookings[existingIndex] = newBookingLocal;
    } else {
        bookings.unshift(newBookingLocal);
    }
    localStorage.setItem('anireekshithaa_bookings', JSON.stringify(bookings));

    // 2. Save/Upsert to Supabase Cloud if configured
    if (supabaseClient && supabaseKey !== 'YOUR_SUPABASE_ANON_KEY') {
        const cloudCategory = newBookingLocal.category + (newBookingLocal.transactionId !== '-' ? ' | Txn: ' + newBookingLocal.transactionId : '');
        const newBookingCloud = {
            booking_id: newBookingLocal.bookingId,
            name: newBookingLocal.name,
            phone: newBookingLocal.phone,
            profession: newBookingLocal.profession,
            category: cloudCategory,
            tickets: newBookingLocal.tickets,
            total_amount: newBookingLocal.totalAmount,
            paid_status: newBookingLocal.paidStatus,
            booking_date: newBookingLocal.bookingDate
        };
        try {
            const { error } = await supabaseClient
                .from('bookings')
                .upsert([newBookingCloud], { onConflict: 'booking_id' });
            if (error) throw error;
            console.log('Successfully saved/updated booking in Supabase!');
        } catch (err) {
            console.error('Failed to upsert to Supabase, backed up locally:', err);
        }
    }
}

// Generate pre-loaded sample database values to showcase beautiful dashboard metrics immediately (Local Only)
function loadSampleData() {
    const currentBookings = getBookings();
    if (currentBookings.length === 0) {
        const dummyRecords = [
            {
                bookingId: 'ANR-4512-Y',
                name: 'Kiran Hegde',
                phone: '9845210214',
                profession: 'Confirmed | Ticket: TKT-451230',
                category: 'kiran.hegde@gmail.com',
                tickets: 2,
                totalAmount: 246,
                paidStatus: 'Confirmed',
                bookingDate: '06 Jun 2026, 05:20 PM'
            },
            {
                bookingId: 'ANR-8921-A',
                name: 'Rohit Sharma',
                phone: '7022145896',
                profession: 'Audience',
                category: 'rohit.sharma@yahoo.com',
                tickets: 1,
                totalAmount: 123,
                paidStatus: 'Pending Verification',
                bookingDate: '06 Jun 2026, 03:10 PM'
            },
            {
                bookingId: 'ANR-3401-G',
                name: 'Pooja Bhat',
                phone: '8095412356',
                profession: 'Confirmed | Ticket: TKT-340158',
                category: 'pooja.bhat@gmail.com',
                tickets: 4,
                totalAmount: 492,
                paidStatus: 'Confirmed',
                bookingDate: '05 Jun 2026, 08:45 PM'
            },
            {
                bookingId: 'ANR-7112-L',
                name: 'Suhas K',
                phone: '9900885522',
                profession: 'Audience',
                category: 'suhas.k@outlook.com',
                tickets: 2,
                totalAmount: 246,
                paidStatus: 'Pending Verification',
                bookingDate: '05 Jun 2026, 11:15 AM'
            },
            {
                bookingId: 'ANR-1250-F',
                name: 'Anjali Shetty',
                phone: '8884442211',
                profession: 'Confirmed | Ticket: TKT-125087',
                category: 'anjali.shetty@gmail.com',
                tickets: 1,
                totalAmount: 123,
                paidStatus: 'Confirmed',
                bookingDate: '04 Jun 2026, 06:12 PM'
            }
        ];
        localStorage.setItem('anireekshithaa_bookings', JSON.stringify(dummyRecords));
    }
}

/* ==========================================================================
   WHATSAPP INTEGRATION & MOCK NOTIFICATIONS
   ========================================================================== */

function closeWhatsappPopup() {
    const mockWhatsappPopup = document.getElementById('mockWhatsappPopup');
    if (mockWhatsappPopup) {
        mockWhatsappPopup.style.display = 'none';
    }
}

/* ==========================================================================
   ORGANIZER SECURITY PORTAL (ADMIN DIALOG)
   ========================================================================== */
function promptAdminAccess() {
    // Reset key input and validation errors
    document.getElementById('adminPasskey').value = '';
    document.getElementById('adminPasskeyError').style.display = 'none';

    document.getElementById('adminPasscodeModal').classList.add('active');
}

function closeAdminPasscode() {
    document.getElementById('adminPasscodeModal').classList.remove('active');
}

function submitAdminPasskey() {
    const keyInput = document.getElementById('adminPasskey').value;

    if (keyInput === 'cinema2026') {
        closeAdminPasscode();
        openAdminDashboard();
    } else {
        document.getElementById('adminPasskeyError').style.display = 'block';
    }
}

/* ==========================================================================
   ADMIN DASHBOARD SYSTEM (REAL-TIME METRICS)
   ========================================================================== */
async function openAdminDashboard() {
    await switchAdminTab('pending');
    document.getElementById('adminDashboardModal').classList.add('active');
}

function closeAdminDashboard() {
    document.getElementById('adminDashboardModal').classList.remove('active');
}

async function renderAdminMetrics() {
    const bookings = await getBookingsFromSupabase();

    // Aggregate calculations
    let totalBookingsCount = bookings.length;
    let totalTicketsCount = 0;
    let totalRevenueSum = 0;
    let pendingRequestsCount = 0;

    bookings.forEach(b => {
        if (b.paidStatus === 'Confirmed') {
            totalTicketsCount += b.tickets;
            totalRevenueSum += b.totalAmount;
        } else if (b.paidStatus === 'Pending Verification') {
            pendingRequestsCount++;
        }
    });

    // Populate stats
    const statTotalBookings = document.getElementById('statTotalBookings');
    if (statTotalBookings) statTotalBookings.textContent = totalBookingsCount;

    const statTicketsSold = document.getElementById('statTicketsSold');
    if (statTicketsSold) statTicketsSold.textContent = totalTicketsCount;

    const statTotalRevenue = document.getElementById('statTotalRevenue');
    if (statTotalRevenue) statTotalRevenue.textContent = `₹${totalRevenueSum.toLocaleString('en-IN')}`;

    const statPendingRequests = document.getElementById('statPendingRequests');
    if (statPendingRequests) statPendingRequests.textContent = pendingRequestsCount;

    // Filter and Render Pending Table
    const pendingBookings = bookings.filter(b => b.paidStatus === 'Pending Verification');
    renderPendingTableRows(pendingBookings);

    // Render directory table list
    renderTableRows(bookings);
}

function parseCategory(category) {
    let showTime = '5:00 PM'; // Default fallback
    let email = '-';
    let txnId = '-';

    if (category && category.includes(' | ')) {
        const parts = category.split(' | ');
        // New category format: showTime | profession | role | [Txn: txnId]
        // Older category format: showTime | email | [Txn: txnId]
        if (parts[0] === '5:00 PM' || parts[0] === '6:30 PM') {
            showTime = parts[0];
            const part1 = parts[1] || '-';
            const part2 = parts[2] || '-';
            
            if (part1 === 'Student' || part1 === 'Public Audience' || part1 === 'Film Maker') {
                if (part1 === 'Film Maker') {
                    email = `Film Maker - ${part2}`;
                } else {
                    email = part1;
                }
                
                const possibleTxn = parts[3] || '';
                if (possibleTxn.startsWith('Txn: ')) {
                    txnId = possibleTxn.replace('Txn: ', '');
                } else if (possibleTxn) {
                    txnId = possibleTxn;
                }
            } else {
                email = part1;
                if (part2.startsWith('Txn: ')) {
                    txnId = part2.replace('Txn: ', '');
                } else if (part2 && part2 !== '-') {
                    txnId = part2;
                }
            }
        } else {
            email = parts[0];
            if (parts[1]) txnId = parts[1];
        }
    } else if (category) {
        email = category;
    }
    return { showTime, email, txnId };
}

function renderPendingTableRows(pendingList) {
    const tbody = document.getElementById('adminPendingTableBody');
    const noPendingAlert = document.getElementById('noPendingDataAlert');

    if (!tbody) return;
    tbody.innerHTML = '';

    if (pendingList.length === 0) {
        if (noPendingAlert) noPendingAlert.style.display = 'block';
        return;
    }

    if (noPendingAlert) noPendingAlert.style.display = 'none';

    pendingList.forEach(booking => {
        const tr = document.createElement('tr');

        const parsed = parseCategory(booking.category);
        const showTimeVal = parsed.showTime;
        const emailVal = parsed.email;

        const statusBadge = `<span class="badge-paid pending"><i class="fa-solid fa-clock"></i> PENDING</span>`;

        const approveBtn = `<button class="btn-success" style="padding: 6px 12px; font-size: 0.75rem; border-radius: 4px; display: inline-flex; align-items: center; gap: 4px; border: none; font-weight: 600; cursor: pointer; background-color: #2ecc71; color: white;" onclick="event.stopPropagation(); approveBookingRequest('${booking.bookingId}')"><i class="fa-solid fa-check"></i> Approve</button>`;

        const rejectBtn = `<button class="btn-danger" style="padding: 6px 12px; font-size: 0.75rem; border-radius: 4px; display: inline-flex; align-items: center; gap: 4px; border: none; font-weight: 600; cursor: pointer; background-color: #e74c3c; color: white; margin-left: 5px;" onclick="event.stopPropagation(); rejectBookingRequest('${booking.bookingId}')"><i class="fa-solid fa-xmark"></i> Reject</button>`;

        tr.innerHTML = `
            <td><strong>${booking.bookingId}</strong></td>
            <td>${escapeHtml(booking.name)}</td>
            <td>+91 ${escapeHtml(booking.phone)}</td>
            <td>${escapeHtml(emailVal)}</td>
            <td><span class="showtime-badge" style="background: rgba(255,255,255,0.05); padding: 4px 8px; border-radius: 4px; font-weight: 600; font-size: 0.8rem; border: 1px solid var(--border-glass);">${escapeHtml(showTimeVal)}</span></td>
            <td>${booking.tickets} seat${booking.tickets > 1 ? 's' : ''}</td>
            <td>₹${booking.totalAmount.toFixed(2)}</td>
            <td><small>${booking.bookingDate}</small></td>
            <td>${statusBadge}</td>
            <td>${approveBtn} ${rejectBtn}</td>
        `;

        tbody.appendChild(tr);
    });
}

function renderTableRows(bookingsList) {
    const tbody = document.getElementById('adminTableBody');
    const noDataAlert = document.getElementById('noDataAlert');

    if (!tbody) return;
    tbody.innerHTML = '';

    if (bookingsList.length === 0) {
        if (noDataAlert) noDataAlert.style.display = 'block';
        return;
    }

    if (noDataAlert) noDataAlert.style.display = 'none';

    bookingsList.forEach(booking => {
        const tr = document.createElement('tr');

        const parsed = parseCategory(booking.category);
        const showTimeVal = parsed.showTime;
        const emailVal = parsed.email;

        let paidBadge = '';
        let actionBtn = '';

        if (booking.paidStatus === 'Confirmed') {
            paidBadge = `<span class="badge-paid" style="background-color: rgba(46, 204, 113, 0.1); color: #2ecc71; border: 1px solid rgba(46, 204, 113, 0.2);"><i class="fa-solid fa-circle-check"></i> CONFIRMED</span>`;
            actionBtn = `<button class="btn-secondary" style="padding: 6px 12px; font-size: 0.75rem; border-radius: 4px; display: inline-flex; align-items: center; gap: 4px; border: none; font-weight: 600; cursor: pointer;" onclick="event.stopPropagation(); resendWhatsAppText('${booking.bookingId}')"><i class="fa-brands fa-whatsapp"></i> Resend</button>`;
        } else if (booking.paidStatus === 'Rejected') {
            paidBadge = `<span class="badge-paid" style="background-color: rgba(231, 76, 60, 0.1); color: #e74c3c; border: 1px solid rgba(231, 76, 60, 0.2);"><i class="fa-solid fa-circle-xmark"></i> REJECTED</span>`;
            actionBtn = `<span style="color: var(--text-dark); font-size: 0.8rem;">No Actions</span>`;
        } else {
            // Default to Pending Verification
            paidBadge = `<span class="badge-paid pending"><i class="fa-solid fa-clock"></i> PENDING</span>`;
            const approveBtn = `<button class="btn-success" style="padding: 6px 12px; font-size: 0.75rem; border-radius: 4px; display: inline-flex; align-items: center; gap: 4px; border: none; font-weight: 600; cursor: pointer; background-color: #2ecc71; color: white;" onclick="event.stopPropagation(); approveBookingRequest('${booking.bookingId}')"><i class="fa-solid fa-check"></i> Approve</button>`;
            const rejectBtn = `<button class="btn-danger" style="padding: 6px 12px; font-size: 0.75rem; border-radius: 4px; display: inline-flex; align-items: center; gap: 4px; border: none; font-weight: 600; cursor: pointer; background-color: #e74c3c; color: white; margin-left: 5px;" onclick="event.stopPropagation(); rejectBookingRequest('${booking.bookingId}')"><i class="fa-solid fa-xmark"></i> Reject</button>`;
            actionBtn = `${approveBtn} ${rejectBtn}`;
        }

        tr.innerHTML = `
            <td><strong>${booking.bookingId}</strong></td>
            <td>${escapeHtml(booking.name)}</td>
            <td>+91 ${escapeHtml(booking.phone)}</td>
            <td>${escapeHtml(emailVal)}</td>
            <td><span class="showtime-badge" style="background: rgba(255,255,255,0.05); padding: 4px 8px; border-radius: 4px; font-weight: 600; font-size: 0.8rem; border: 1px solid var(--border-glass);">${escapeHtml(showTimeVal)}</span></td>
            <td>${booking.tickets} seat${booking.tickets > 1 ? 's' : ''}</td>
            <td>${paidBadge}</td>
            <td><small>${booking.bookingDate}</small></td>
            <td>${actionBtn}</td>
        `;

        tbody.appendChild(tr);
    });
}

function sendWhatsAppConfirmation(booking, ticketNumber) {
    const name = booking.name;
    const phone = booking.phone;
    const bookingId = booking.bookingId;
    const tickets = booking.tickets;
    
    const parsed = parseCategory(booking.category);
    const showTimeVal = parsed.showTime;

    const textMsg = `Hi *${name}*, your booking for the psychological thriller *ANIREEKSHITHAA* (The Unexpected) is *CONFIRMED*! 🎬🍿\n\n` +
        `🎫 *TICKET SLIP*:\n` +
        `• *Ticket No*: ${ticketNumber}\n` +
        `• *Booking ID*: ${bookingId}\n` +
        `• *Seats*: ${tickets} Ticket${tickets > 1 ? 's' : ''}\n` +
        `• *Venue*: Chamundeshwari Studios, Bangalore\n` +
        `• *Date*: Saturday, July 25, 2026\n` +
        `• *Time*: ${showTimeVal}\n\n` +
        `Please display this Ticket Number or Booking ID at the counter to retrieve your physical passes. See you at the movies! 🎥`;

    const encodedText = encodeURIComponent(textMsg);
    const waUrl = `https://api.whatsapp.com/send?phone=91${phone}&text=${encodedText}`;

    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        window.location.href = waUrl;
    } else {
        window.open(waUrl, '_blank');
    }
}

async function approveBookingRequest(bookingId) {
    // Before update log
    console.log("Booking ID:", bookingId);

    if (!confirm(`Are you sure you want to approve booking request ${bookingId}?`)) {
        return;
    }

    const ticketNumber = 'TKT-' + Math.floor(100000 + Math.random() * 900000);
    const updatedProfession = `Confirmed | Ticket: ${ticketNumber}`;

    let success = false;

    // 2. Update status to "Confirmed" in Supabase
    if (supabaseClient && supabaseKey !== 'YOUR_SUPABASE_ANON_KEY') {
        try {
            const { data, error } = await supabaseClient
                .from('bookings')
                .update({ 
                    paid_status: 'Confirmed',
                    profession: updatedProfession
                })
                .eq('booking_id', bookingId)
                .select();

            if (error) throw error;

            if (!data || data.length === 0) {
                const rlsError = new Error("No rows were updated on Supabase. Row Level Security (RLS) update policy is missing. Please run: create policy \"Allow public update to bookings\" on bookings for update using (true); in Supabase SQL editor.");
                throw rlsError;
            }

            console.log("Supabase status updated successfully");
            success = true;
        } catch (err) {
            console.error(err);
            alert(`Approval failed: ${err.message || err}`);
            return; // Abort further execution (no reload/no WhatsApp!)
        }
    } else {
        // Fallback for LocalStorage
        let bookings = getBookings();
        const bookingIdx = bookings.findIndex(b => b.bookingId === bookingId);
        if (bookingIdx !== -1) {
            bookings[bookingIdx].paidStatus = 'Confirmed';
            bookings[bookingIdx].profession = updatedProfession;
            localStorage.setItem('anireekshithaa_bookings', JSON.stringify(bookings));
            console.log("Supabase status updated successfully (Local fallback)");
            success = true;
        }
    }

    if (success) {
        // 3. Immediately refresh and reload booking data
        const reloaded = await getBookingsFromSupabase();
        
        // Find the reloaded booking status to print to console
        const reloadedBooking = reloaded.find(b => b.bookingId === bookingId);
        const status = reloadedBooking ? reloadedBooking.paidStatus : 'Not Found';
        console.log("Reloaded booking status:", status);

        // 4. Re-run dashboard rendering metrics to update statistics and badges immediately
        await renderAdminMetrics();

        // 5. Launch WhatsApp confirmation intent
        const targetBooking = reloaded.find(b => b.bookingId === bookingId);
        if (targetBooking) {
            sendWhatsAppConfirmation(targetBooking, ticketNumber);
        }
    }
}

async function rejectBookingRequest(bookingId) {
    // Before update log
    console.log("Booking ID:", bookingId);

    if (!confirm(`Are you sure you want to reject booking request ${bookingId}?`)) {
        return;
    }

    let success = false;

    // 2. Update status to "Rejected" in Supabase
    if (supabaseClient && supabaseKey !== 'YOUR_SUPABASE_ANON_KEY') {
        try {
            const { data, error } = await supabaseClient
                .from('bookings')
                .update({ paid_status: 'Rejected' })
                .eq('booking_id', bookingId)
                .select();

            if (error) throw error;

            if (!data || data.length === 0) {
                const rlsError = new Error("No rows were updated on Supabase. Row Level Security (RLS) update policy is missing. Please run: create policy \"Allow public update to bookings\" on bookings for update using (true); in Supabase SQL editor.");
                throw rlsError;
            }

            console.log("Supabase status updated successfully");
            success = true;
        } catch (err) {
            console.error(err);
            alert(`Rejection failed: ${err.message || err}`);
            return; // Abort further execution
        }
    } else {
        // Fallback for LocalStorage
        let bookings = getBookings();
        const bookingIdx = bookings.findIndex(b => b.bookingId === bookingId);
        if (bookingIdx !== -1) {
            bookings[bookingIdx].paidStatus = 'Rejected';
            localStorage.setItem('anireekshithaa_bookings', JSON.stringify(bookings));
            console.log("Supabase status updated successfully (Local fallback)");
            success = true;
        }
    }

    if (success) {
        // 3. Immediately refresh and reload booking data
        const reloaded = await getBookingsFromSupabase();
        
        // Find the reloaded booking status to print to console
        const reloadedBooking = reloaded.find(b => b.bookingId === bookingId);
        const status = reloadedBooking ? reloadedBooking.paidStatus : 'Not Found';
        console.log("Reloaded booking status:", status);

        // 4. Re-run dashboard rendering metrics to update statistics and badges immediately
        await renderAdminMetrics();
    }
}

function resendWhatsAppText(bookingId) {
    const bookings = getBookings();
    const targetBooking = bookings.find(b => b.bookingId === bookingId);
    if (targetBooking) {
        let ticketNumber = 'TKT-000000';
        if (targetBooking.profession && targetBooking.profession.includes('Ticket: ')) {
            ticketNumber = targetBooking.profession.split('Ticket: ')[1].trim();
        } else {
            ticketNumber = 'TKT-' + Math.floor(100000 + Math.random() * 900000);
        }
        sendWhatsAppConfirmation(targetBooking, ticketNumber);
    }
}

async function filterAdminTable() {
    const searchVal = document.getElementById('adminSearch').value.toLowerCase().trim();
    const filterStatus = document.getElementById('adminFilterStatus').value;

    const bookings = await getBookingsFromSupabase();

    const filtered = bookings.filter(b => {
        // Search matches Name, Phone, Email, or Booking ID
        const matchSearch = b.name.toLowerCase().includes(searchVal) ||
            b.phone.includes(searchVal) ||
            b.bookingId.toLowerCase().includes(searchVal) ||
            (b.category && b.category.toLowerCase().includes(searchVal));

        // Status matches filter dropdown
        let matchStatus = true;
        if (filterStatus !== 'all') {
            matchStatus = b.paidStatus === filterStatus;
        }

        return matchSearch && matchStatus;
    });

    renderTableRows(filtered);
}

async function filterAdminPendingTable() {
    const searchVal = document.getElementById('adminPendingSearch').value.toLowerCase().trim();
    const bookings = await getBookingsFromSupabase();
    const pending = bookings.filter(b => b.paidStatus === 'Pending Verification');

    const filtered = pending.filter(b => {
        return b.name.toLowerCase().includes(searchVal) ||
            b.phone.includes(searchVal) ||
            b.bookingId.toLowerCase().includes(searchVal) ||
            (b.category && b.category.toLowerCase().includes(searchVal));
    });

    renderPendingTableRows(filtered);
}

async function confirmResetDatabase() {
    if (!confirm('Are you sure you want to delete all booking records?')) {
        return;
    }

    let success = true;

    if (supabaseClient && supabaseKey !== 'YOUR_SUPABASE_ANON_KEY') {
        try {
            console.log('[Reset] Initiating database reset on Supabase...');
            
            // Delete bookings from Supabase
            const { data, error: err1 } = await supabaseClient
                .from('bookings')
                .delete()
                .neq('name', '___non_existent___')
                .select();

            if (err1) throw err1;

            if (data && data.length === 0) {
                // Check if there were records to begin with (so we don't block empty reset)
                const { count } = await supabaseClient
                    .from('bookings')
                    .select('*', { count: 'exact', head: true });
                if (count > 0) {
                    throw new Error("No rows were deleted from bookings. This is likely because the database Row Level Security (RLS) delete policy is missing. Please run the SQL command in Supabase SQL Editor: create policy \"Allow public delete to bookings\" on bookings for delete using (true);");
                }
            }

            // Delete feedbacks from Supabase
            const { error: err2 } = await supabaseClient
                .from('feedbacks')
                .delete()
                .neq('name', '___non_existent___');
            if (err2) throw err2;

            console.log('Supabase database reset complete!');
        } catch (err) {
            console.error('Failed to reset Supabase database:', err);
            alert(`Reset failed: ${err.message || err}`);
            success = false;
        }
    }

    if (success) {
        localStorage.setItem('anireekshithaa_bookings', JSON.stringify([]));
        localStorage.setItem('anireekshithaa_feedbacks', JSON.stringify([]));

        // Refresh dashboard automatically
        await renderAdminMetrics();
        await renderReviewsTable();
        
        alert('Database reset completed successfully.');
    }
}

/* ==========================================================================
   CSV EXPORT GENERATOR
   ========================================================================== */
async function exportDatabaseToCSV() {
    const bookings = await getBookingsFromSupabase();

    if (bookings.length === 0) {
        alert('There is no booking data to export.');
        return;
    }

    // Create header columns
    let csvContent = 'Booking ID,Attendee Name,Phone,Profession,Filmmaker Sub-Role,Tickets,Total Amount (INR),Payment Status,Booking Date\n';

    bookings.forEach(b => {
        // Wrap strings in quotes to handle names with commas
        const safeName = `"${b.name.replace(/"/g, '""')}"`;
        const safeProfession = `"${b.profession.replace(/"/g, '""')}"`;
        const safeCategory = `"${b.category.replace(/"/g, '""')}"`;
        const dateString = `"${b.bookingDate}"`;

        csvContent += `${b.bookingId},${safeName},+91${b.phone},${safeProfession},${safeCategory},${b.tickets},${b.totalAmount},${b.paidStatus},${dateString}\n`;
    });

    // Download logic via dynamic anchor tag
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');

    downloadLink.setAttribute('href', url);
    downloadLink.setAttribute('download', `anireekshithaa_attendees_report_${new Date().toISOString().slice(0, 10)}.csv`);
    downloadLink.style.visibility = 'hidden';

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

/* ==========================================================================
   XSS PREVENTATIVE SECURITY ESCAPES
   ========================================================================== */
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/* ==========================================================================
   AUDIENCE ECHO - FEEDBACK INTERACTION SYSTEM
   ========================================================================== */
let starRating = 0;
function initReviewCorner() {
    const starBtns = document.querySelectorAll('.star-btn');
    const ratingInput = document.getElementById('reviewRatingInput');

    starBtns.forEach(btn => {
        // Hover highlight
        btn.addEventListener('mouseenter', () => {
            const val = parseInt(btn.getAttribute('data-value'));
            highlightStars(val);
        });

        // Mouse leave reverts to chosen rating
        btn.addEventListener('mouseleave', () => {
            highlightStars(starRating);
        });

        // Click selects rating
        btn.addEventListener('click', () => {
            const val = parseInt(btn.getAttribute('data-value'));
            starRating = val;
            ratingInput.value = val;
            highlightStars(val);
        });
    });

    // Voice record toggle hook
    const recordBtn = document.getElementById('recordBtn');
    if (recordBtn) {
        recordBtn.addEventListener('click', () => {
            toggleVoiceRecording();
        });
    }
}

function highlightStars(val) {
    const starBtns = document.querySelectorAll('.star-btn');
    starBtns.forEach(btn => {
        const starVal = parseInt(btn.getAttribute('data-value'));
        if (starVal <= val) {
            btn.classList.remove('fa-regular');
            btn.classList.add('fa-solid');
            btn.classList.add('active');
        } else {
            btn.classList.remove('fa-solid');
            btn.classList.add('fa-regular');
            btn.classList.remove('active');
        }
    });
}

/* ==========================================================================
   VOICE RECORDER / GRACEFUL AUDIO SIMULATOR
   ========================================================================== */
let isRecording = false;
let isSimulation = false;
let mediaRecorder = null;
let audioChunks = [];
let recordTimerInterval = null;
let recordingDuration = 0;

function toggleVoiceRecording() {
    if (isRecording) {
        stopVoiceRecording();
    } else {
        startVoiceRecording();
    }
}

function startVoiceRecording() {
    isRecording = true;
    isSimulation = false;
    audioChunks = [];
    recordingDuration = 0;

    const recordBtn = document.getElementById('recordBtn');
    const stopRecordBtn = document.getElementById('stopRecordBtn');
    const timerDisplay = document.getElementById('recordTimer');
    const instructions = document.getElementById('voiceInstructions');

    // UI states
    recordBtn.classList.add('recording');
    recordBtn.innerHTML = '<i class="fa-solid fa-microphone-slash"></i>';
    stopRecordBtn.style.display = 'inline-block';
    instructions.textContent = 'Recording live audio feedback... speak clearly.';
    timerDisplay.textContent = '00:00';

    // Check if mic capture is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        startSimulatedRecording('Sandbox mode: Recording simulated audio feedback...');
        return;
    }

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = e => {
                if (e.data && e.data.size > 0) {
                    audioChunks.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                // Free micro resources
                stream.getTracks().forEach(track => track.stop());

                const blob = new Blob(audioChunks, { type: 'audio/webm' });
                window.recordedAudioBlob = blob;

                const audioUrl = URL.createObjectURL(blob);
                document.getElementById('voicePlayback').src = audioUrl;
                document.getElementById('playbackContainer').style.display = 'block';
                instructions.textContent = 'Voice note review ready. Listen and enter your name to submit.';
            };

            mediaRecorder.start();
            startRecordClocks();
        })
        .catch(err => {
            console.warn('Microphone access blocked/unsupported. Falling back to synth audio simulator:', err);
            startSimulatedRecording('Sandbox simulator: Recording generated audio feedback...');
        });
}

function startSimulatedRecording(instructionMsg) {
    isSimulation = true;
    recordingDuration = 0;
    document.getElementById('voiceInstructions').textContent = instructionMsg;
    startRecordClocks();
}

function startRecordClocks() {
    const timerDisplay = document.getElementById('recordTimer');
    const waveBars = document.querySelectorAll('.waveform-container .wave-bar');

    // Clock tick
    recordTimerInterval = setInterval(() => {
        recordingDuration++;
        const mins = Math.floor(recordingDuration / 60).toString().padStart(2, '0');
        const secs = (recordingDuration % 60).toString().padStart(2, '0');
        timerDisplay.textContent = `${mins}:${secs}`;

        if (recordingDuration >= 60) {
            stopVoiceRecording();
        }
    }, 1000);

    // Animate visual equalizer bars
    waveBars.forEach(b => b.classList.add('active'));
    window.waveAnimateInterval = setInterval(() => {
        waveBars.forEach(bar => {
            const h = Math.floor(Math.random() * 25) + 8;
            bar.style.height = `${h}px`;
        });
    }, 150);
}

function stopVoiceRecording() {
    if (!isRecording) return;
    isRecording = false;

    clearInterval(recordTimerInterval);
    clearInterval(window.waveAnimateInterval);

    // Reset visual bars
    document.querySelectorAll('.waveform-container .wave-bar').forEach(bar => {
        bar.classList.remove('active');
        bar.style.height = '15px';
    });

    const recordBtn = document.getElementById('recordBtn');
    const stopRecordBtn = document.getElementById('stopRecordBtn');
    const instructions = document.getElementById('voiceInstructions');

    recordBtn.classList.remove('recording');
    recordBtn.innerHTML = '<i class="fa-solid fa-microphone"></i>';
    stopRecordBtn.style.display = 'none';

    if (isSimulation) {
        // Generate mock audio blob using synthesized procedural oscillator WAV
        const blob = generateMockAudioBlob();
        window.recordedAudioBlob = blob;

        const audioUrl = URL.createObjectURL(blob);
        document.getElementById('voicePlayback').src = audioUrl;
        document.getElementById('playbackContainer').style.display = 'block';
        instructions.textContent = 'Simulated voice note generated. Listen to the synth review and submit below.';
    } else {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
        }
    }
}

function resetVoiceRecorder() {
    document.getElementById('playbackContainer').style.display = 'none';
    document.getElementById('voicePlayback').src = '';
    window.recordedAudioBlob = null;
    document.getElementById('voiceReviewName').value = '';
    document.getElementById('recordTimer').textContent = '00:00';
    document.getElementById('voiceInstructions').textContent = 'Click the microphone button to start recording your feedback (Max 60s).';
}

// Simple procedural synthesizer producing a sequence of C-E-G beep notes in a WAV file
function generateMockAudioBlob() {
    const sampleRate = 8000;
    const duration = 1.8;
    const numSamples = sampleRate * duration;
    const buffer = new ArrayBuffer(44 + numSamples * 2);
    const view = new DataView(buffer);

    view.setUint32(0, 0x52494646, false); // "RIFF"
    view.setUint32(4, 36 + numSamples * 2, true);
    view.setUint32(8, 0x57415645, false); // "WAVE"
    view.setUint32(12, 0x666d7420, false); // "fmt "
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, 1, true); // Mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    view.setUint32(36, 0x64617461, false); // "data"
    view.setUint32(40, numSamples * 2, true);

    let offset = 44;
    for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        let freq = 261.63; // C4
        if (t > 0.6 && t <= 1.2) freq = 329.63; // E4
        if (t > 1.2) freq = 392.00; // G4

        const sample = Math.sin(2 * Math.PI * freq * t) * Math.exp(-3 * (t % 0.6)); // decaying oscillator
        view.setInt16(offset, sample * 0x5FFF, true);
        offset += 2;
    }
    return new Blob([buffer], { type: 'audio/wav' });
}

/* ==========================================================================
   FEEDBACK DATABASE CONTROLLER (LOCAL BACKUP + SUPABASE LIVE DB)
   ========================================================================== */
function getFeedbacks() {
    const stored = localStorage.getItem('anireekshithaa_feedbacks');
    return stored ? JSON.parse(stored) : [];
}

async function getFeedbacksFromSupabase() {
    if (!supabaseClient || supabaseKey === 'YOUR_SUPABASE_ANON_KEY') {
        return getFeedbacks();
    }
    try {
        const { data, error } = await supabaseClient
            .from('feedbacks')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return (data || []).map(f => ({
            id: f.feedback_id,
            type: f.type,
            name: f.name,
            rating: f.rating,
            comment: f.comment,
            audioData: f.audio_url,
            duration: f.duration,
            date: f.booking_date
        }));
    } catch (err) {
        console.error('Error fetching feedbacks from Supabase:', err);
        return getFeedbacks();
    }
}

async function uploadVoiceFile(blob) {
    if (!supabaseClient || supabaseKey === 'YOUR_SUPABASE_ANON_KEY') {
        return null;
    }
    try {
        const fileName = `voice_${Date.now()}_${Math.floor(Math.random() * 1000)}.wav`;
        const { data, error } = await supabaseClient.storage
            .from('voice-notes')
            .upload(fileName, blob, {
                contentType: 'audio/wav',
                cacheControl: '3600',
                upsert: false
            });

        if (error) throw error;

        // Get public URL
        const { data: publicUrlData } = supabaseClient.storage
            .from('voice-notes')
            .getPublicUrl(data.path);

        return publicUrlData.publicUrl;
    } catch (err) {
        console.error('Failed to upload voice note to Supabase Storage:', err);
        return null;
    }
}

async function submitTextReview() {
    const name = document.getElementById('reviewName').value.trim();
    const ratingInput = document.getElementById('reviewRatingInput').value;
    const text = document.getElementById('reviewText').value.trim();

    if (!name || !ratingInput || !text) {
        alert('Please fill out all required fields.');
        return;
    }

    const randomId = Math.floor(1000 + Math.random() * 9000);
    const dateStr = new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const reviewLocal = {
        id: `REV-${randomId}-T`,
        type: 'TEXT',
        name: name,
        rating: parseInt(ratingInput),
        comment: text,
        audioData: '',
        duration: '',
        date: dateStr
    };

    // 1. Backup to Local Storage
    const feedbacks = getFeedbacks();
    feedbacks.unshift(reviewLocal);
    localStorage.setItem('anireekshithaa_feedbacks', JSON.stringify(feedbacks));

    // 2. Save to Supabase Cloud
    if (supabaseClient && supabaseKey !== 'YOUR_SUPABASE_ANON_KEY') {
        const reviewCloud = {
            feedback_id: reviewLocal.id,
            type: reviewLocal.type,
            name: reviewLocal.name,
            rating: reviewLocal.rating,
            comment: reviewLocal.comment,
            audio_url: '',
            duration: '',
            booking_date: reviewLocal.date
        };
        try {
            const { error } = await supabaseClient.from('feedbacks').insert([reviewCloud]);
            if (error) throw error;
            console.log('Written feedback saved to Supabase!');
        } catch (err) {
            console.error('Error saving feedback to Supabase:', err);
        }
    }

    // Reset Form
    document.getElementById('textReviewForm').reset();
    starRating = 0;
    document.getElementById('reviewRatingInput').value = '';
    highlightStars(0);

    alert('Thank you! Your written review has been recorded.');

    if (document.getElementById('adminDashboardModal').classList.contains('active')) {
        await renderReviewsTable();
        await renderAdminMetrics();
    }
}

async function submitVoiceReview() {
    const name = document.getElementById('voiceReviewName').value.trim();
    if (!name) {
        alert('Please enter your name.');
        return;
    }

    if (!window.recordedAudioBlob) {
        alert('Please record a voice note first.');
        return;
    }

    const submitBtn = document.getElementById('submitVoiceBtn');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Uploading...';

    try {
        let audioUrl = '';
        if (supabaseClient && supabaseKey !== 'YOUR_SUPABASE_ANON_KEY') {
            audioUrl = await uploadVoiceFile(window.recordedAudioBlob);
        }

        let base64Data = await blobToBase64(window.recordedAudioBlob);
        if (!audioUrl) {
            audioUrl = base64Data; // Play locally if Supabase storage upload failed or not configured
        }

        const randomId = Math.floor(1000 + Math.random() * 9000);
        const mins = Math.floor(recordingDuration / 60).toString().padStart(2, '0');
        const secs = (recordingDuration % 60).toString().padStart(2, '0');
        const durationStr = `${mins}:${secs}`;
        const dateStr = new Date().toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const reviewLocal = {
            id: `REV-${randomId}-V`,
            type: 'VOICE',
            name: name,
            rating: 0,
            comment: `Voice Note review (${durationStr})`,
            audioData: base64Data,
            duration: durationStr,
            date: dateStr
        };

        // 1. Backup to Local Storage
        const feedbacks = getFeedbacks();
        feedbacks.unshift(reviewLocal);
        localStorage.setItem('anireekshithaa_feedbacks', JSON.stringify(feedbacks));

        // 2. Save to Supabase Cloud
        if (supabaseClient && supabaseKey !== 'YOUR_SUPABASE_ANON_KEY') {
            const reviewCloud = {
                feedback_id: reviewLocal.id,
                type: reviewLocal.type,
                name: reviewLocal.name,
                rating: reviewLocal.rating,
                comment: reviewLocal.comment,
                audio_url: audioUrl,
                duration: reviewLocal.duration,
                booking_date: reviewLocal.date
            };
            const { error } = await supabaseClient.from('feedbacks').insert([reviewCloud]);
            if (error) throw error;
            console.log('Voice feedback saved to Supabase!');
        }

        resetVoiceRecorder();
        alert('Thank you! Your voice review note has been recorded.');

        if (document.getElementById('adminDashboardModal').classList.contains('active')) {
            await renderReviewsTable();
            await renderAdminMetrics();
        }
    } catch (err) {
        console.error('Voice note submission failed:', err);
        alert('Failed to submit voice review. Please try again.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

/* ==========================================================================
   ADMIN PANEL TABS & REVIEWS MANAGER
   ========================================================================== */
async function switchAdminTab(tabName) {
    const tabPendingBtn = document.getElementById('tabPendingBtn');
    const tabBookingsBtn = document.getElementById('tabBookingsBtn');
    const tabReviewsBtn = document.getElementById('tabReviewsBtn');

    const pendingTabContent = document.getElementById('pendingTabContent');
    const bookingsTabContent = document.getElementById('bookingsTabContent');
    const reviewsTabContent = document.getElementById('reviewsTabContent');

    // Reset styles and active classes
    [tabPendingBtn, tabBookingsBtn, tabReviewsBtn].forEach(btn => {
        if (btn) {
            btn.classList.remove('active');
            btn.style.color = 'var(--text-dark)';
            btn.style.borderBottom = 'none';
        }
    });

    // Hide all contents
    if (pendingTabContent) pendingTabContent.style.display = 'none';
    if (bookingsTabContent) bookingsTabContent.style.display = 'none';
    if (reviewsTabContent) reviewsTabContent.style.display = 'none';

    if (tabName === 'pending') {
        if (tabPendingBtn) {
            tabPendingBtn.classList.add('active');
            tabPendingBtn.style.color = 'var(--text-white)';
            tabPendingBtn.style.borderBottom = '2px solid var(--red)';
        }
        if (pendingTabContent) pendingTabContent.style.display = 'block';
        await renderAdminMetrics();
    } else if (tabName === 'bookings') {
        if (tabBookingsBtn) {
            tabBookingsBtn.classList.add('active');
            tabBookingsBtn.style.color = 'var(--text-white)';
            tabBookingsBtn.style.borderBottom = '2px solid var(--red)';
        }
        if (bookingsTabContent) bookingsTabContent.style.display = 'block';
        await renderAdminMetrics();
    } else if (tabName === 'reviews') {
        if (tabReviewsBtn) {
            tabReviewsBtn.classList.add('active');
            tabReviewsBtn.style.color = 'var(--text-white)';
            tabReviewsBtn.style.borderBottom = '2px solid var(--red)';
        }
        if (reviewsTabContent) reviewsTabContent.style.display = 'block';
        await renderReviewsTable();
    }
}

async function renderReviewsTable(feedbacksList) {
    const tbody = document.getElementById('adminReviewsTableBody');
    const noReviewsAlert = document.getElementById('noReviewsDataAlert');

    tbody.innerHTML = '';
    const list = feedbacksList || await getFeedbacksFromSupabase();

    if (list.length === 0) {
        noReviewsAlert.style.display = 'block';
        return;
    }

    noReviewsAlert.style.display = 'none';

    list.forEach(rev => {
        const tr = document.createElement('tr');

        const typeBadge = rev.type === 'TEXT'
            ? `<span class="badge-profession" style="background-color: rgba(217, 35, 42, 0.1); color: var(--red-bright); border: 1px solid var(--border-red);"><i class="fa-solid fa-pen-nib"></i> Text</span>`
            : `<span class="badge-profession" style="background-color: rgba(0, 242, 254, 0.1); color: var(--cyan); border: 1px solid var(--border-glass);"><i class="fa-solid fa-microphone"></i> Voice</span>`;

        let ratingHTML = '';
        if (rev.type === 'TEXT') {
            for (let i = 1; i <= 5; i++) {
                if (i <= rev.rating) {
                    ratingHTML += `<i class="fa-solid fa-star" style="color: var(--red-bright); font-size: 0.8rem; margin-right: 2px;"></i>`;
                } else {
                    ratingHTML += `<i class="fa-regular fa-star" style="color: var(--text-dark); font-size: 0.8rem; margin-right: 2px;"></i>`;
                }
            }
        } else {
            ratingHTML = `<span style="color: var(--text-dark); font-size: 0.8rem;"><i class="fa-solid fa-microphone"></i> Voice note (${rev.duration})</span>`;
        }

        let contentHTML = '';
        if (rev.type === 'TEXT') {
            contentHTML = `<div style="max-width: 320px; white-space: normal; line-height: 1.4; color: var(--text-white);">${escapeHtml(rev.comment)}</div>`;
        } else {
            contentHTML = `<audio src="${rev.audioData}" controls style="height: 30px; width: 200px; background-color: #121319; border-radius: 4px; padding: 2px;"></audio>`;
        }

        tr.innerHTML = `
            <td><strong>${escapeHtml(rev.name)}</strong></td>
            <td>${typeBadge}</td>
            <td>${ratingHTML}</td>
            <td>${contentHTML}</td>
            <td><small>${rev.date}</small></td>
            <td>
                <button class="btn-danger" style="padding: 6px 12px; font-size: 0.8rem;" onclick="deleteFeedbackById('${rev.id}')">
                    <i class="fa-solid fa-trash-can"></i> Delete
                </button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

async function filterReviewsTable() {
    const searchVal = document.getElementById('adminReviewSearch').value.toLowerCase().trim();
    const feedbacks = await getFeedbacksFromSupabase();

    const filtered = feedbacks.filter(r => {
        return r.name.toLowerCase().includes(searchVal) || r.comment.toLowerCase().includes(searchVal);
    });

    renderReviewsTable(filtered);
}

async function deleteFeedbackById(id) {
    if (confirm('Are you sure you want to permanently delete this audience review?')) {
        // Delete locally first
        const localFeedbacks = getFeedbacks();
        const filteredLocal = localFeedbacks.filter(item => item.id !== id);
        localStorage.setItem('anireekshithaa_feedbacks', JSON.stringify(filteredLocal));

        // Delete from Supabase
        if (supabaseClient && supabaseKey !== 'YOUR_SUPABASE_ANON_KEY') {
            try {
                const { error } = await supabaseClient
                    .from('feedbacks')
                    .delete()
                    .eq('feedback_id', id);
                if (error) throw error;
                console.log('Review deleted from Supabase!');
            } catch (err) {
                console.error('Failed to delete review from Supabase:', err);
            }
        }

        await renderReviewsTable();
        await renderAdminMetrics();
    }
}

// Dummy review loader - stores to Local Storage only to pre-populate local fallback dashboard immediately
function loadSampleFeedbacks() {
    const currentFeedbacks = getFeedbacks();
    if (currentFeedbacks.length === 0) {
        const mockBlob = generateMockAudioBlob();
        blobToBase64(mockBlob)
            .then(base64Data => {
                const sampleReviews = [
                    {
                        id: 'REV-9874-T',
                        type: 'TEXT',
                        name: 'Aravind Shastry',
                        rating: 5,
                        comment: 'Anireekshithaa is a masterpiece of tension! The sound design in the last 5 minutes had me on the edge of my seat. Sharath Raj\'s performance was top-tier.',
                        audioData: '',
                        duration: '',
                        date: '06 Jun 2026, 06:15 PM'
                    },
                    {
                        id: 'REV-2541-T',
                        type: 'TEXT',
                        name: 'Deepa Rao',
                        rating: 4,
                        comment: 'Very well shot. The director\'s use of colors (red and blue hues) really represented Vikram\'s collapsing psyche. Kudos to the DOP Rajesh Varma!',
                        audioData: '',
                        duration: '',
                        date: '06 Jun 2026, 04:30 PM'
                    },
                    {
                        id: 'REV-1036-V',
                        type: 'VOICE',
                        name: 'Harish Kumar',
                        rating: 0,
                        comment: 'Voice Note review (00:03)',
                        audioData: base64Data,
                        duration: '00:03',
                        date: '05 Jun 2026, 09:20 PM'
                    }
                ];
                localStorage.setItem('anireekshithaa_feedbacks', JSON.stringify(sampleReviews));

                if (document.getElementById('adminDashboardModal').classList.contains('active')) {
                    renderReviewsTable();
                }
            })
            .catch(err => {
                console.error('Failed to encode sample voice review:', err);
                const sampleReviewsText = [
                    {
                        id: 'REV-9874-T',
                        type: 'TEXT',
                        name: 'Aravind Shastry',
                        rating: 5,
                        comment: 'Anireekshithaa is a masterpiece of tension! The sound design in the last 5 minutes had me on the edge of my seat. Sharath Raj\'s performance was top-tier.',
                        audioData: '',
                        duration: '',
                        date: '06 Jun 2026, 06:15 PM'
                    },
                    {
                        id: 'REV-2541-T',
                        type: 'TEXT',
                        name: 'Deepa Rao',
                        rating: 4,
                        comment: 'Very well shot. The director\'s use of colors (red and blue hues) really represented Vikram\'s collapsing psyche. Kudos to the DOP Rajesh Varma!',
                        audioData: '',
                        duration: '',
                        date: '06 Jun 2026, 04:30 PM'
                    }
                ];
                localStorage.setItem('anireekshithaa_feedbacks', JSON.stringify(sampleReviewsText));
            });
    }
}

// Global modal click-outside and keydown closures
window.addEventListener('click', (e) => {
    const bookingModal = document.getElementById('bookingModal');
    if (e.target === bookingModal) {
        closeBookingModal();
    }
    const adminDashboardModal = document.getElementById('adminDashboardModal');
    if (e.target === adminDashboardModal) {
        closeAdminDashboard();
    }
    const adminPasscodeModal = document.getElementById('adminPasscodeModal');
    if (e.target === adminPasscodeModal) {
        closeAdminPasscode();
    }
    const lightboxModal = document.getElementById('lightboxModal');
    if (e.target === lightboxModal) {
        closeLightbox();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeBookingModal();
        closeAdminDashboard();
        closeAdminPasscode();
        closeLightbox();
    }
});

/* ==========================================================================
   AUTO-GENERATED BRANDED PDF TICKETS
   ========================================================================== */
function getBase64ImageFromUrl(imageUrl) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.setAttribute('crossOrigin', 'anonymous');
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = (err) => reject(err);
        img.src = imageUrl;
    });
}

async function downloadPDFTicket() {
    if (!bookingState || !bookingState.bookingId) {
        alert('No active booking details found to generate a ticket.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('portrait', 'px', [380, 580]);

    // 1. Draw Background
    doc.setFillColor(11, 12, 18);
    doc.rect(0, 0, 380, 580, 'F');

    // 2. Draw Borders
    doc.setDrawColor(217, 35, 42);
    doc.setLineWidth(2);
    doc.rect(8, 8, 364, 564, 'D');

    // 3. Draw Header Brand
    doc.setTextColor(217, 35, 42);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('AANTHARYA CREATIONS PRESENTS', 190, 45, { align: 'center' });

    // 4. Draw Title
    doc.setTextColor(255, 255, 255);
    doc.setFont('times', 'bold');
    doc.setFontSize(28);
    doc.text('ANIREEKSHITHAA', 190, 75, { align: 'center' });

    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.5);
    doc.line(30, 95, 350, 95);

    // 5. Draw Metadata
    const isConfirmed = bookingState.paidStatus === 'Confirmed' || bookingState.paidStatus === 'SUCCESSFUL';
    const fields = [
        { label: 'ATTENDEE', val: bookingState.attendee.name, x: 40, y: 125 },
        { label: 'BOOKING ID', val: bookingState.bookingId, x: 220, y: 125, isRed: true },
        { label: 'SEATS', val: `${bookingState.tickets} Seat${bookingState.tickets > 1 ? 's' : ''}`, x: 40, y: 180 },
        { label: 'VENUE', val: 'Chamundeshwari Studios', x: 220, y: 180 },
        { label: 'DATE', val: 'July 25, 2026', x: 40, y: 235 },
        { label: 'TIME', val: `${bookingState.showTime || '5:00 PM'} onwards`, x: 220, y: 235 },
        { label: 'STATUS', val: isConfirmed ? 'CONFIRMED' : 'PENDING VERIFICATION', x: 40, y: 290, isYellow: !isConfirmed, isGreen: isConfirmed }
    ];

    fields.forEach(f => {
        doc.setTextColor(170, 170, 170);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.text(f.label, f.x, f.y);

        if (f.isRed) {
            doc.setTextColor(217, 35, 42);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(14);
        } else if (f.isYellow) {
            doc.setTextColor(241, 196, 15);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
        } else if (f.isGreen) {
            doc.setTextColor(46, 204, 113);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
        } else {
            doc.setTextColor(255, 255, 255);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(12);
        }
        doc.text(f.val, f.x, f.y + 15);
    });

    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.5);
    doc.line(30, 330, 350, 330);

    // 6. Draw QR Code Image
    let qrBase64 = null;
    try {
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(bookingState.bookingId)}`;
        qrBase64 = await getBase64ImageFromUrl(qrUrl);
    } catch (err) {
        console.warn('Failed to load QR code image, using placeholder:', err);
    }

    if (qrBase64) {
        doc.addImage(qrBase64, 'PNG', 115, 350, 150, 150);
    } else {
        doc.setDrawColor(100, 100, 100);
        doc.rect(115, 350, 150, 150, 'D');
        doc.setTextColor(150, 150, 150);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text('QR Code Offline', 190, 420, { align: 'center' });
        doc.setFontSize(8);
        doc.text(`(ID: ${bookingState.bookingId})`, 190, 435, { align: 'center' });
    }

    // 7. Draw Barcode
    doc.setFillColor(255, 255, 255);
    let startX = 60;
    [2, 4, 1, 6, 2, 4, 1, 8, 2, 1, 4, 2, 6, 1, 4].forEach(w => {
        doc.rect(startX, 520, w, 25, 'F');
        startX += w + 3;
    });

    // 8. Draw Footer Info
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('PRESENT THIS TICKET AT THE VENUE COUNTER', 190, 560, { align: 'center' });

    doc.save(`Ticket_ANIREEKSHITHAA_${bookingState.bookingId}.pdf`);
}

// Global dashboard and query functions compatibility window aliases
window.fetchBookingsFromSupabase = getBookingsFromSupabase;
window.refreshDashboard = renderAdminMetrics;
window.loadBookings = renderAdminMetrics;
