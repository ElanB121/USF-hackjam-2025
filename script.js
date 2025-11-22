// Only allow backspace in username and password fields (for scotland.html)
window.addEventListener('DOMContentLoaded', function() {
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    function restrictToBackspace(e) {
        if (e.key !== 'Backspace') {
            e.preventDefault();
        }
    }
    if (username) username.addEventListener('keydown', restrictToBackspace);
    if (password) password.addEventListener('keydown', restrictToBackspace);

    // Clear all textboxes on reload
    const inputs = document.querySelectorAll('input[type="text"], input[type="number"], input[type="password"]');
    inputs.forEach(input => {
        input.value = '';
    });
});
// Math Input Tool Logic (for UI panel)
function insertMathFunction() {
    const funcSelect = document.getElementById('mathFuncSelect');
    const inputSelect = document.getElementById('mathTargetSelect');
    if (!funcSelect || !inputSelect) return;
    const func = funcSelect.value;
    const inputId = inputSelect.value;
    const input = document.getElementById(inputId);
    if (input) {
        const start = input.selectionStart || 0;
        const end = input.selectionEnd || 0;
        const value = input.value;
        input.value = value.slice(0, start) + func + value.slice(end);
        input.focus();
        input.selectionStart = input.selectionEnd = start + func.length;
    }
}

function updateMathTargetSelect() {
    // Find all text/number/password inputs
    const inputs = Array.from(document.querySelectorAll('input[type="text"], input[type="number"], input[type="password"]'));
    const select = document.getElementById('mathTargetSelect');
    if (!select) return;
    select.innerHTML = '';
    inputs.forEach(input => {
        if (input.id) {
            const option = document.createElement('option');
            option.value = input.id;
            option.textContent = input.id;
            select.appendChild(option);
        }
    });
}

window.addEventListener('DOMContentLoaded', updateMathTargetSelect);
// Scotland flag color scheme
document.body.classList.add('scotland-flag');

// Make scrolling really slow
let scrollTimeout;
let targetScrollY = window.scrollY;

function slowScroll(e) {
    e.preventDefault();
    
    // Get the scroll delta (how much they want to scroll)
    const delta = e.deltaY || e.detail || e.wheelDelta;
    
    // Reduce scroll speed dramatically (divide by 20 for very slow scrolling)
    targetScrollY += delta / 20;
    
    // Clear any existing scroll animation
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    
    // Smoothly animate to the target position
    const currentScroll = window.scrollY;
    const distance = targetScrollY - currentScroll;
    window.scrollTo(0, currentScroll + distance * 0.1);
    
    // Continue the animation
    scrollTimeout = setTimeout(() => {
        if (Math.abs(targetScrollY - window.scrollY) > 1) {
            slowScroll(e);
        }
    }, 50);
}

// Add slow scroll listeners
window.addEventListener('wheel', slowScroll, { passive: false });
window.addEventListener('mousewheel', slowScroll, { passive: false });
window.addEventListener('DOMMouseScroll', slowScroll, { passive: false });

// Increase space between input fields over time
const usernameGroup = document.getElementById('usernameGroup');
let currentMarginTop = 20; // Starting margin in pixels

function increaseFieldSpacing() {
    currentMarginTop += 20; // Increase by 2px every interval
    usernameGroup.style.marginTop = currentMarginTop + 'px';
}

// Increase spacing every 2 seconds
setInterval(increaseFieldSpacing, 2000);

// Timer functionality
let timeLeft = 30;
const timerElement = document.getElementById('timer');
let audioPlayed = false;

// Preload the audio
const audio = new Audio();
audio.src = 'joyful login v1.flac';
audio.preload = 'auto';
audio.volume = 1.0;

// Load the audio
audio.load();

function updateTimer() {
    timerElement.textContent = timeLeft;
    
    // Play audio when timer reaches 0
    if (timeLeft === 0 && !audioPlayed) {
        console.log('Timer reached 0, attempting to play audio...');
        audioPlayed = true;
        audio.play()
            .then(() => console.log('Audio playing successfully'))
            .catch(err => {
                console.error('Audio playback failed:', err);
                // Try again after a short delay
                setTimeout(() => {
                    audio.play().catch(e => console.error('Second attempt failed:', e));
                }, 100);
            });
    }
    
    // When timer goes negative
    if (timeLeft < 0) {
        timerElement.classList.add('negative');
    }
    
    timeLeft--;
}

// Enable audio on first user interaction (browsers often require this)
document.addEventListener('click', function enableAudio() {
    audio.load();
    console.log('Audio preloaded on user interaction');
}, { once: true });

// Start timer countdown
setInterval(updateTimer, 1000);

// Make elements on green login box move away from mouse
const loginBox = document.querySelector('.login-box');
const avoidableElements = [
    document.querySelector('.login-box h2'),
    ...document.querySelectorAll('.input-group'),
    ...document.querySelectorAll('.input-group label'),
    ...document.querySelectorAll('.input-group input'),
    document.querySelector('.login-btn'),
    ...document.querySelectorAll('.links a')
];

let maxExpansion = 0;

loginBox.addEventListener('mousemove', function(e) {
    const boxRect = loginBox.getBoundingClientRect();
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    let currentMaxExpansion = 0;
    
    avoidableElements.forEach(element => {
        if (!element) return;
        
        const rect = element.getBoundingClientRect();
        const elementCenterX = rect.left + rect.width / 2;
        const elementCenterY = rect.top + rect.height / 2;
        
        // Calculate distance from mouse to element center
        const distanceX = elementCenterX - mouseX;
        const distanceY = elementCenterY - mouseY;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        
        // If mouse is within 200px, move element away (increased threshold)
        const threshold = 200;
        if (distance < threshold) {
            const force = (threshold - distance) / threshold;
            const moveX = (distanceX / distance) * force * 100; // Increased from 30 to 100
            const moveY = (distanceY / distance) * force * 100; // Increased from 30 to 100
            
            element.style.transform = `translate(${moveX}px, ${moveY}px)`;
            
            // Calculate how much the element has moved
            const totalMove = Math.sqrt(moveX * moveX + moveY * moveY);
            currentMaxExpansion = Math.max(currentMaxExpansion, totalMove);
        } else {
            element.style.transform = 'translate(0, 0)';
        }
    });
    
    // Expand login box based on maximum element displacement (multiplied by 2 for faster expansion)
    if (currentMaxExpansion > 0) {
        const expansion = Math.ceil(currentMaxExpansion * 2); // Multiplied by 2 for faster expansion
        loginBox.style.padding = `${40 + expansion}px`;
        maxExpansion = expansion;
    }
});

// Reset login box when mouse leaves
loginBox.addEventListener('mouseleave', function() {
    loginBox.style.padding = '40px';
    avoidableElements.forEach(element => {
        if (element) {
            element.style.transform = 'translate(0, 0)';
        }
    });
    maxExpansion = 0;
});

// Login Form Handler
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Show robot verification modal instead of logging in directly
    showRobotVerification();
});

// Robot verification
const robotModal = document.getElementById('robotModal');
const equations = [
    { question: "dy/dx = 2x, solve for y", answer: "x^2+c" },
    { question: "dy/dx = 3x^2, solve for y", answer: "x^3+c" },
    { question: "dy/dx = e^x, solve for y", answer: "e^x+c" },
    { question: "dy/dx = 1/x, solve for y", answer: "ln(x)+c" },
    { question: "dy/dx = cos(x), solve for y", answer: "sin(x)+c" },
    { question: "dy/dx = sin(x), solve for y", answer: "-cos(x)+c" },
    { question: "d^2y/dx^2 = 0, solve for y", answer: "ax+b" }
];

let currentEquation;

function showRobotVerification() {
    // Pick random equation
    currentEquation = equations[Math.floor(Math.random() * equations.length)];
    document.getElementById('equation').textContent = currentEquation.question;
    document.getElementById('robotAnswer').value = '';
    document.getElementById('robotMessage').style.display = 'none';
    robotModal.style.display = 'block';
}

// Robot verification form handler
document.getElementById('robotForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const userAnswer = document.getElementById('robotAnswer').value.toLowerCase().trim();
    const robotMessageDiv = document.getElementById('robotMessage');
    const correctAnswer = currentEquation.answer.toLowerCase();
    
    // Check if answer is "scotland forever" (always valid)
    const isScotlandForever = userAnswer === 'scotland forever';
    
    // Check if answer is correct (allow some variations)
    const isCorrect = isScotlandForever ||
                     userAnswer.includes(correctAnswer.replace('+c', '')) || 
                     userAnswer === correctAnswer ||
                     userAnswer === correctAnswer.replace('+c', '') + ' + c' ||
                     userAnswer === correctAnswer.replace('+c', '') + '+c';
    
    if (isCorrect) {
        robotMessageDiv.textContent = isScotlandForever ? 
            'SCOTLAND FOREVER! 🏴󠁧󠁢󠁳󠁣󠁴󠁿 Verification successful!' : 
            'Verification successful! Processing login...';
        robotMessageDiv.className = 'message success';
        
        setTimeout(() => {
            robotModal.style.display = 'none';
            actuallyLogin();
        }, 1500);
    } else {
        robotMessageDiv.textContent = 'Incorrect! Robots would know this. Try again.';
        robotMessageDiv.className = 'message error';
        
        // Show another equation after 2 seconds
        setTimeout(() => {
            showRobotVerification();
        }, 2000);
    }
});

// Actual login function (called after robot verification)
function actuallyLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('message');
    
    // Basic validation (you can customize this)
    if (username && password) {
        // Check for Scotland credentials
        if (username === 'scotland' && password === 'forever') {
            messageDiv.textContent = 'SCOTLAND FOREVER! 🏴󠁧󠁢󠁳󠁣󠁴󠁿 Redirecting...';
            messageDiv.className = 'message success';
            
            // Redirect to victory page
            setTimeout(() => {
                window.location.href = 'victory.html';
            }, 1500);
        } else if (username === 'admin' && password === 'password') {
            messageDiv.textContent = 'Login successful! Welcome, ' + username + '!';
            messageDiv.className = 'message success';
            
            // Redirect or perform action after successful login
            setTimeout(() => {
                // window.location.href = 'dashboard.html';
                console.log('Redirecting to dashboard...');
            }, 1500);
        } else {
            messageDiv.textContent = 'Invalid username or password!';
            messageDiv.className = 'message error';
        }
    } else {
        messageDiv.textContent = 'Please fill in all fields!';
        messageDiv.className = 'message error';
    }
    
    // Clear message after 3 seconds
    setTimeout(() => {
        messageDiv.style.display = 'none';
        messageDiv.className = 'message';
    }, 3000);
}

// Modal Functionality
const modal = document.getElementById('forgotPasswordModal');
const forgotPasswordLink = document.querySelector('.links a[href="#"]');
const closeBtn = document.querySelector('.close');
const signUpLink = document.querySelectorAll('.links a[href="#"]')[1];
const signImage = document.getElementById('signImage');
let signMoveDistance = 0;

// Open modal when "Forgot Password?" is clicked
forgotPasswordLink.addEventListener('click', function(e) {
    e.preventDefault();
    modal.style.display = 'block';
});

// Move sign image up more each time "Sign Up" is clicked
signUpLink.addEventListener('click', function(e) {
    e.preventDefault();
    signMoveDistance += 20;
    signImage.style.transform = `translateY(-${signMoveDistance}px)`;
});

// Close modal when X is clicked
closeBtn.addEventListener('click', function() {
    modal.style.display = 'none';
});

// Close modal when clicking outside of it
window.addEventListener('click', function(e) {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Forgot Password Form Handler
document.getElementById('forgotPasswordForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('resetEmail').value;
    const modalMessageDiv = document.getElementById('modalMessage');
    
    if (email) {
        // Simulate sending reset link
        modalMessageDiv.textContent = 'Password reset link sent to ' + email + '!';
        modalMessageDiv.className = 'message success';
        
        // Close modal after 2 seconds
        setTimeout(() => {
            modal.style.display = 'none';
            modalMessageDiv.style.display = 'none';
            modalMessageDiv.className = 'message';
            document.getElementById('forgotPasswordForm').reset();
        }, 2000);
    } else {
        modalMessageDiv.textContent = 'Please enter a valid email address!';
        modalMessageDiv.className = 'message error';
    }
});

// Secondary verification system
const secondaryModal = document.getElementById('secondaryModal');
const scenarios = [
    { text: "Born before June", type: "before" },
    { text: "Born after June", type: "after" },
    { text: "First letter in username starts before 'n'", type: "before" },
    { text: "First letter in username starts after 'n'", type: "after" },
    { text: "Password is above 8 characters", type: "above" },
    { text: "Password is below 8 characters", type: "below" }
];

const actions = [
    { text: "Solve for x: x + 37 = 56", answer: 19 },
    { text: "Enter your phone number (last 4 digits)", answer: null }, // Any 4 digit number
    { text: "Enter your E-mail domain number (e.g., gmail.com = 5)", answer: null }, // Any number
    { text: "Solve for x: 2x - 15 = 45", answer: 30 },
    { text: "Solve for x: x / 3 = 12", answer: 36 },
    { text: "Enter your birth year (last 2 digits)", answer: null } // Any 2 digit number
];

let currentScenario;
let currentAction;
let secondaryVerificationShown = false;

// Show secondary verification after 15 seconds
setTimeout(() => {
    if (!secondaryVerificationShown && document.querySelector('.login-box')) {
        showSecondaryVerification();
    }
}, 15000);

function showSecondaryVerification() {
    secondaryVerificationShown = true;
    
    // Randomly select scenario and action
    currentScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    currentAction = actions[Math.floor(Math.random() * actions.length)];
    
    document.getElementById('scenarioText').textContent = "If you are: " + currentScenario.text;
    document.getElementById('actionText').textContent = currentAction.text;
    document.getElementById('secondaryAnswer').value = '';
    document.getElementById('secondaryMessage').style.display = 'none';
    
    secondaryModal.style.display = 'block';
}

// Secondary form handler
document.getElementById('secondaryForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const userAnswer = parseInt(document.getElementById('secondaryAnswer').value);
    const secondaryMessageDiv = document.getElementById('secondaryMessage');
    
    // For actions with specific answers, check if correct
    if (currentAction.answer !== null) {
        if (userAnswer === currentAction.answer) {
            secondaryMessageDiv.textContent = 'Verification complete!';
            secondaryMessageDiv.className = 'message success';
            
            setTimeout(() => {
                secondaryModal.style.display = 'none';
            }, 1500);
        } else {
            secondaryMessageDiv.textContent = 'Incorrect answer! Try again.';
            secondaryMessageDiv.className = 'message error';
        }
    } else {
        // For open-ended number inputs, accept any valid number
        if (!isNaN(userAnswer) && userAnswer > 0) {
            secondaryMessageDiv.textContent = 'Thank you! Verification complete.';
            secondaryMessageDiv.className = 'message success';
            
            setTimeout(() => {
                secondaryModal.style.display = 'none';
            }, 1500);
        } else {
            secondaryMessageDiv.textContent = 'Please enter a valid number.';
            secondaryMessageDiv.className = 'message error';
        }
    }
});

// Flying Scotland flags
function initFlyingFlags() {
    const flagContainer = document.getElementById('flagContainer');
    
    if (!flagContainer) {
        console.error('Flag container not found!');
        return;
    }
    
    console.log('Flag container found, starting flags...');
    
    function createFlyingFlag() {
        const flag = document.createElement('div');
        flag.className = 'flying-flag';
        flag.innerHTML = '🏴󠁧󠁢󠁳󠁣󠁴󠁿';
        flag.style.fontSize = '50px';
        flag.style.top = Math.random() * 80 + 10 + '%'; // Random vertical position
        
        const duration = Math.random() * 5 + 3; // 3-8 seconds
        flag.style.animationDuration = duration + 's';
        
        // Refresh page on hover
        flag.addEventListener('mouseenter', function() {
            console.log('Flag hovered, refreshing page...');
            location.reload();
        });
        
        flagContainer.appendChild(flag);
        console.log('Flag created!');
        
        // Remove flag after animation completes
        setTimeout(() => {
            if (flag.parentNode) {
                flag.parentNode.removeChild(flag);
            }
        }, duration * 1000);
    }
    
    // Create flags at random intervals
    function startFlyingFlags() {
        createFlyingFlag(); // Create first flag immediately
        setInterval(() => {
            createFlyingFlag();
        }, 2000); // New flag every 2 seconds
    }
    
    // Start flying flags immediately
    startFlyingFlags();
}

// Initialize flying flags when DOM is ready
if (document.getElementById('flagContainer')) {
    initFlyingFlags();
} else {
    window.addEventListener('DOMContentLoaded', initFlyingFlags);
}