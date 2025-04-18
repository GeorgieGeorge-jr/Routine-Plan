// DOM Elements
const greetingElement = document.getElementById('greeting');
const timeOfDayElement = document.getElementById('time-of-day');
const usernameElement = document.getElementById('username');
const currentTimeElement = document.getElementById('current-time');
const currentDateElement = document.getElementById('current-date');
const progressCircle = document.querySelector('.circle-fill');
const percentageElement = document.querySelector('.percentage');
const completedCountElement = document.getElementById('completed-count');
const totalTasksElement = document.getElementById('total-tasks');
const motivationalQuoteElement = document.getElementById('motivational-quote');
const taskListElement = document.getElementById('task-list');
const categoryButtons = document.querySelectorAll('.category-btn');
const notificationToast = document.getElementById('notification-toast');
const reflectionForm = document.querySelector('.daily-reflection');
const learnedTodayInput = document.getElementById('learned-today');
const improveTodayInput = document.getElementById('improve-today');
const saveReflectionButton = document.getElementById('save-reflection');
const musicPlayer = document.getElementById('music-player');
const togglePlayerButton = document.getElementById('toggle-player');
const playPauseButton = document.getElementById('play-pause');
const prevTrackButton = document.getElementById('prev-track');
const nextTrackButton = document.getElementById('next-track');
const trackNameElement = document.getElementById('track-name');
const trackArtistElement = document.getElementById('track-artist');
const playlistButtons = document.querySelectorAll('.playlist-btn');
const settingsButton = document.getElementById('settings-btn');
const historyButton = document.getElementById('history-btn');

// App State
let state = {
    tasks: [],
    completedTasks: [],
    currentFilter: 'all',
    reflections: [],
    spotifyPlayer: null,
    isPlayerOpen: true,
    currentPlaylist: null,
    currentTrack: null,
    isPlaying: false,
    userPreferences: {
        username: 'Champ',
        morningStart: 5,
        middayStart: 12,
        eveningStart: 17,
        enableSounds: true,
        theme: 'default'
    }
};

// Motivational Quotes
const motivationalQuotes = [
    "Small daily improvements lead to stunning results.",
    "Discipline is choosing between what you want now and what you want most.",
    "The expert in anything was once a beginner.",
    "Productivity is never an accident. It's always the result of a commitment to excellence.",
    "You don't have to be great to start, but you have to start to be great.",
    "The secret of getting ahead is getting started.",
    "Every master was once a disaster.",
    "The only way to do great work is to love what you do.",
    "Your future is created by what you do today, not tomorrow.",
    "Success is the sum of small efforts, repeated day in and day out."
];

// Task Database
const taskDatabase = {
    morning: [
        "Gym or home workout (30-45 mins)",
        "Read (30 mins) - novel, self-improvement, or tech blog",
        "Plan your day (15 mins)",
        "Healthy breakfast",
        "Meditation or mindfulness (10 mins)"
    ],
    midday: [
        "University work & assignments",
        "JavaScript practice (1-2 hrs)",
        "Work on personal project",
        "Review GitHub contributions",
        "Learn a new programming concept",
        "Solve coding challenges",
        "Watch tech tutorial videos"
    ],
    evening: [
        "Chess, anime, or basketball",
        "Learn about money-making paths",
        "Write daily reflection",
        "Prepare for tomorrow",
        "Network on LinkedIn or dev communities",
        "Review what you learned today",
        "Wind down with light reading"
    ]
};

// Spotify Playlists (example IDs - replace with your own)
const spotifyPlaylists = {
    focus: "37i9dQZF1DWZeKCadgRdKQ",
    lofi: "37i9dQZF1DWWQRwui0ExPn",
    classical: "37i9dQZF1DWWEJlAGA9gs0"
};

// Initialize the app
function init() {
    loadUserPreferences();
    updateDateTime();
    setInterval(updateDateTime, 1000);
    setGreeting();
    generateDailyTasks();
    setupEventListeners();
    loadReflections();
    setupSpotifyPlayer();
    showNotification("Welcome to Daily Grind Master! Let's crush this day.");
    
    // Update motivational quote every hour
    updateMotivationalQuote();
    setInterval(updateMotivationalQuote, 3600000);
}

// Load user preferences from localStorage
function loadUserPreferences() {
    const savedPreferences = localStorage.getItem('dailyGrindPreferences');
    if (savedPreferences) {
        state.userPreferences = JSON.parse(savedPreferences);
    }
    usernameElement.textContent = state.userPreferences.username;
}

// Save user preferences to localStorage
function saveUserPreferences() {
    localStorage.setItem('dailyGrindPreferences', JSON.stringify(state.userPreferences));
}

// Update date and time display
function updateDateTime() {
    const now = new Date();
    const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
    const dateOptions = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    
    currentTimeElement.textContent = now.toLocaleTimeString('en-US', timeOptions);
    currentDateElement.textContent = now.toLocaleDateString('en-US', dateOptions);
}

// Set greeting based on time of day
function setGreeting() {
    const now = new Date();
    const hours = now.getHours();
    let timeOfDay;
    
    if (hours >= state.userPreferences.morningStart && hours < state.userPreferences.middayStart) {
        timeOfDay = 'Morning';
    } else if (hours >= state.userPreferences.middayStart && hours < state.userPreferences.eveningStart) {
        timeOfDay = 'Afternoon';
    } else {
        timeOfDay = 'Evening';
    }
    
    timeOfDayElement.textContent = timeOfDay;
}

// Generate daily tasks with some randomness
function generateDailyTasks() {
    // Clear previous tasks
    state.tasks = [];
    state.completedTasks = [];
    
    // Get current day of week (0-6)
    const dayOfWeek = new Date().getDay();
    
    // Generate morning tasks (2-3 items)
    const morningTasks = getRandomTasks(taskDatabase.morning, dayOfWeek % 2 === 0 ? 3 : 2);
    morningTasks.forEach(task => {
        state.tasks.push({
            id: generateId(),
            text: task,
            category: 'morning',
            completed: false
        });
    });
    
    // Generate midday tasks (3-5 items)
    const middayTasks = getRandomTasks(taskDatabase.midday, dayOfWeek % 3 === 0 ? 5 : (dayOfWeek % 2 === 0 ? 4 : 3));
    middayTasks.forEach(task => {
        state.tasks.push({
            id: generateId(),
            text: task,
            category: 'midday',
            completed: false
        });
    });
    
    // Generate evening tasks (2-3 items)
    const eveningTasks = getRandomTasks(taskDatabase.evening, dayOfWeek % 2 === 0 ? 3 : 2);
    eveningTasks.forEach(task => {
        state.tasks.push({
            id: generateId(),
            text: task,
            category: 'evening',
            completed: false
        });
    });
    
    // Save to localStorage with today's date
    const today = new Date().toDateString();
    localStorage.setItem('dailyGrindTasks', JSON.stringify({
        date: today,
        tasks: state.tasks
    }));
    
    renderTasks();
    updateProgress();
}

// Get random tasks from a category
function getRandomTasks(taskArray, count) {
    // Make a copy of the array
    const shuffled = [...taskArray];
    
    // Shuffle the array
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // Return the first 'count' items
    return shuffled.slice(0, count);
}

// Generate unique ID for tasks
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// Render tasks based on current filter
function renderTasks() {
    taskListElement.innerHTML = '';
    
    const filteredTasks = state.currentFilter === 'all' 
        ? state.tasks 
        : state.tasks.filter(task => task.category === state.currentFilter);
    
    if (filteredTasks.length === 0) {
        taskListElement.innerHTML = '<li class="no-tasks">No tasks in this category. Enjoy your free time!</li>';
        return;
    }
    
    filteredTasks.forEach(task => {
        const taskElement = document.createElement('li');
        taskElement.className = `task-item ${task.category} ${task.completed ? 'completed' : ''}`;
        taskElement.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}">
            <span class="task-text">${task.text}</span>
            <span class="task-category">${task.category}</span>
        `;
        
        taskListElement.appendChild(taskElement);
    });
    
    // Add event listeners to checkboxes
    document.querySelectorAll('.task-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', handleTaskComplete);
    });
}

// Handle task completion
function handleTaskComplete(e) {
    const taskId = e.target.dataset.id;
    const task = state.tasks.find(t => t.id === taskId);
    
    if (task) {
        task.completed = e.target.checked;
        
        // Update completed tasks
        if (task.completed && !state.completedTasks.includes(taskId)) {
            state.completedTasks.push(taskId);
            
            // Play completion sound if enabled
            if (state.userPreferences.enableSounds) {
                playCompletionSound();
            }
        } else if (!task.completed) {
            state.completedTasks = state.completedTasks.filter(id => id !== taskId);
        }
        
        // Save to localStorage
        const today = new Date().toDateString();
        localStorage.setItem('dailyGrindTasks', JSON.stringify({
            date: today,
            tasks: state.tasks
        }));
        
        updateProgress();
        
        // Show notification for completed tasks
        if (task.completed) {
            showNotification(`Great job completing: ${task.text}`);
        }
    }
}

// Update progress circle and stats
function updateProgress() {
    const totalTasks = state.tasks.length;
    const completedTasks = state.completedTasks.length;
    const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // Update progress circle
    progressCircle.style.strokeDasharray = `${percentage}`, 100;
    percentageElement.textContent = `${percentage}%`;
    
    // Update stats
    completedCountElement.textContent = completedTasks;
    totalTasksElement.textContent = totalTasks;
    
    // Save progress to history
    saveDailyProgress(percentage);
}

// Save daily progress to history
function saveDailyProgress(percentage) {
    const today = new Date().toISOString().split('T')[0];
    const history = JSON.parse(localStorage.getItem('dailyGrindHistory') || []);
    
    const todayIndex = history.findIndex(entry => entry.date === today);
    
    if (todayIndex >= 0) {
        history[todayIndex].progress = percentage;
    } else {
        history.push({
            date: today,
            progress: percentage
        });
    }
    
    localStorage.setItem('dailyGrindHistory', JSON.stringify(history));
}

// Update motivational quote
function updateMotivationalQuote() {
    motivationalQuoteElement.textContent = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
}

// Show notification toast
function showNotification(message) {
    const toast = notificationToast;
    toast.querySelector('.toast-content').textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Play task completion sound
function playCompletionSound() {
    const audio = new Audio('assets/sounds/complete.mp3');
    audio.volume = 0.3;
    audio.play();
}

// Load reflections from localStorage
function loadReflections() {
    const savedReflections = localStorage.getItem('dailyGrindReflections');
    if (savedReflections) {
        state.reflections = JSON.parse(savedReflections);
        
        // Check if there's a reflection for today
        const today = new Date().toISOString().split('T')[0];
        const todayReflection = state.reflections.find(r => r.date === today);
        
        if (todayReflection) {
            learnedTodayInput.value = todayReflection.learned;
            improveTodayInput.value = todayReflection.improve;
        }
    }
}

// Save reflection
function saveReflection() {
    const learned = learnedTodayInput.value.trim();
    const improve = improveTodayInput.value.trim();
    
    if (learned || improve) {
        const today = new Date().toISOString().split('T')[0];
        
        // Remove existing reflection for today if it exists
        state.reflections = state.reflections.filter(r => r.date !== today);
        
        // Add new reflection
        state.reflections.push({
            date: today,
            learned,
            improve
        });
        
        // Save to localStorage
        localStorage.setItem('dailyGrindReflections', JSON.stringify(state.reflections));
        
        showNotification("Daily reflection saved successfully!");
    } else {
        showNotification("Please enter at least one reflection point.");
    }
}

// Setup Spotify Web Playback SDK
function setupSpotifyPlayer() {
    // This is a placeholder for Spotify Web Playback SDK integration
    // In a real implementation, you would need to:
    // 1. Authenticate with Spotify
    // 2. Initialize the player
    // 3. Handle player events
    
    // For demonstration, we'll simulate some player functionality
    playPauseButton.addEventListener('click', () => {
        if (state.isPlaying) {
            // Pause playback
            state.isPlaying = false;
            playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
            trackNameElement.textContent = "Playback Paused";
        } else {
            // Start playback
            if (state.currentPlaylist) {
                state.isPlaying = true;
                playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
                trackNameElement.textContent = "Now Playing";
                trackArtistElement.textContent = "From your selected playlist";
            } else {
                showNotification("Please select a playlist first");
            }
        }
    });
    
    // Simulate playlist selection
    playlistButtons.forEach(button => {
        button.addEventListener('click', () => {
            const playlist = button.dataset.playlist;
            state.currentPlaylist = playlist;
            
            // Update UI
            trackNameElement.textContent = Playlist; `${playlist.charAt(0).toUpperCase() + playlist.slice(1)}`;
            trackNameElement.textContent = `${playlist.charAt(0).toUpperCase() + playlist.slice(1)}`;
            
            // If player was playing, keep it playing
            if (state.isPlaying) {
                trackNameElement.textContent = "Now Playing";
                trackArtistElement.textContent = From `${playlist}`, playlist;
            }
            
            showNotification(Switched, to `${playlist}`, playlist);
        });
    });
    
    // Simulate track controls
    prevTrackButton.addEventListener('click', () => {
        if (state.isPlaying) {
            showNotification("Previous track");
        }
    });
    
    nextTrackButton.addEventListener('click', () => {
        if (state.isPlaying) {
            showNotification("Next track");
        }
    });
    
    // Toggle player visibility
    togglePlayerButton.addEventListener('click', () => {
        state.isPlayerOpen = !state.isPlayerOpen;
        const playerContent = musicPlayer.querySelector('.player-content');
        
        if (state.isPlayerOpen) {
            playerContent.style.display = 'block';
            togglePlayerButton.innerHTML = '<i class="fas fa-chevron-down"></i>';
        } else {
            playerContent.style.display = 'none';
            togglePlayerButton.innerHTML = '<i class="fas fa-chevron-up"></i>';
        }
    });
}

// Setup event listeners
function setupEventListeners() {
    // Category filter buttons
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            state.currentFilter = button.dataset.category;
            renderTasks();
        });
    });
    
    // Save reflection button
    saveReflectionButton.addEventListener('click', saveReflection);
    
    // Settings button
    settingsButton.addEventListener('click', () => {
        // In a full implementation, this would open a settings modal
        showNotification("Settings feature coming soon!");
    });
    
    // History button
    historyButton.addEventListener('click', () => {
        // This would navigate to the history page
        window.location.href = 'history.html';
    });
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);