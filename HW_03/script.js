
//--Get HTML DOM Element References 
const form = document.getElementById('songForm');
const list = document.getElementById('songList');
const songCards = document.getElementById('songCards');
const submitBtn = document.getElementById('submitBtn');
const viewToggle = document.getElementById('viewIcon');
const tableView = document.getElementById('tableView');
const cardsView = document.getElementById('cardsView');

// Global songs array - will be loaded from localStorage
let songs = [];

// View mode: 'table' or 'cards'
let viewMode = 'table';

/**
 * Extract YouTube video ID from URL
 * Supports various YouTube URL formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 */
function extractYouTubeId(url) {
    if (!url) return null;
    
    // Pattern for standard YouTube URLs: youtube.com/watch?v=VIDEO_ID
    let match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    if (match && match[1]) {
        return match[1];
    }
    return null;
}

/**
 * Get YouTube thumbnail URL from video ID
 */
function getYouTubeThumbnail(videoId) {
    if (!videoId) return '';
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
}

/**
 * Get YouTube embed URL for playing video in popup
 */
function getYouTubeEmbedUrl(videoId) {
    if (!videoId) return '';
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
}

/**
 * Open YouTube player in popup window
 */
function playVideo(videoId) {
    if (!videoId) return;
    const embedUrl = getYouTubeEmbedUrl(videoId);
    const width = 800;
    const height = 600;
    const left = (screen.width - width) / 2;
    const top = (screen.height - height) / 2;
    
    window.open(
        embedUrl,
        'YouTube Player',
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );
}

/**
 * Update old songs data to include videoId and thumbnail if missing
 * This ensures backward compatibility with old localStorage data
 */
function updateOldSongsData() {
    let updated = false;
    songs.forEach(song => {
        if (!song.videoId || !song.thumbnail) {
            const videoId = song.videoId || extractYouTubeId(song.url);
            if (videoId) {
                song.videoId = videoId;
                song.thumbnail = getYouTubeThumbnail(videoId);
                updated = true;
            }
        }
        // Ensure rating exists (default to 5 if missing)
        if (!song.rating) {
            song.rating = 5;
            updated = true;
        }
    });
    if (updated) {
        localStorage.setItem('songs', JSON.stringify(songs));
    }
}

// This runs automatically when the page finishes loading
document.addEventListener('DOMContentLoaded', () => {

    //1) Get From Local Storage
    const storedData = localStorage.getItem('songs');
    //02) if exist
    if (storedData) {
        // If yes, turn the JSON string back into an Array
        songs = JSON.parse(storedData);
        // Update old data to include videoId and thumbnail
        updateOldSongsData();
    } else {
        // If no, start with an empty array
        songs = [];
    }

    // SHOW the data
    renderSongs();

    // Add event listeners for search
    const searchInput = document.getElementById('search');
    searchInput.addEventListener('input', () => {
        renderSongs();
    });

    // Add event listeners for radio button sorting
    const sortRadios = document.querySelectorAll('input[name="sortOption"]');
    sortRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            renderSongs();
        });
    });

    // Toggle view mode (table/cards)
    document.getElementById('viewToggle').addEventListener('click', () => {
        viewMode = viewMode === 'table' ? 'cards' : 'table';
        renderSongs();
    });
});

/**
 * User Click the Add/Update Button
 */
form.addEventListener('submit', (e) => {
    // Don't submit the form to the server, let me handle it here
    e.preventDefault();

    // Read Forms Data
    const title = document.getElementById('title').value;
    const url = document.getElementById('url').value;
    const rating = parseInt(document.getElementById('rating').value);
    const songId = document.getElementById('songId').value;

    // Extract YouTube ID from URL
    const videoId = extractYouTubeId(url);
    if (!videoId) {
        alert('Invalid YouTube URL. Please enter a valid YouTube link.');
        return;
    }

    if (songId) {
        // Update existing song
        const songIndex = songs.findIndex(song => song.id === parseInt(songId));
        if (songIndex !== -1) {
            songs[songIndex].title = title;
            songs[songIndex].url = url;
            songs[songIndex].rating = rating;
            songs[songIndex].videoId = videoId;
            songs[songIndex].thumbnail = getYouTubeThumbnail(videoId);
        }
    } else {
        // Add new song
        const song = {
            id: Date.now(),  // Unique ID
            title: title,
            url: url,
            rating: rating,
            videoId: videoId,
            thumbnail: getYouTubeThumbnail(videoId),
            dateAdded: Date.now()
        };
        songs.push(song);
    }

    saveAndRender();

    // Reset form and button
    form.reset();
    submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add';
    submitBtn.classList.replace('btn-warning', 'btn-success');
});

/**
 * Save to Local storage and render UI
 */
function saveAndRender() {
    localStorage.setItem('songs', JSON.stringify(songs));
    renderSongs();
}

/**
 * Display Songs in current view mode (table or cards)
 */
function renderSongs() {
    // Clear current list
    list.innerHTML = '';
    songCards.innerHTML = '';

    // Get search and sort values
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const selectedSort = document.querySelector('input[name="sortOption"]:checked').value;

    // Filter songs based on search term
    let filteredSongs = songs.filter(song => 
        song.title.toLowerCase().includes(searchTerm)
    );

    // Sort songs based on selected option
    if (selectedSort === 'newest') {
        filteredSongs = filteredSongs.sort((a, b) => b.dateAdded - a.dateAdded);
    } else if (selectedSort === 'az') {
        filteredSongs = filteredSongs.sort((a, b) => a.title.localeCompare(b.title));
    } else if (selectedSort === 'rating') {
        filteredSongs = filteredSongs.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    // Update view toggle icon
    if (viewMode === 'table') {
        tableView.style.display = 'block';
        cardsView.style.display = 'none';
        viewToggle.className = 'fas fa-th';
        renderTableView(filteredSongs);
    } else {
        tableView.style.display = 'none';
        cardsView.style.display = 'block';
        viewToggle.className = 'fas fa-table';
        renderCardsView(filteredSongs);
    }
}

/**
 * Render songs in table view
 */
function renderTableView(filteredSongs) {
    filteredSongs.forEach(song => {
        // Create table row
        const row = document.createElement('tr');

        // Ensure we have videoId and thumbnail (for old data that might not have them)
        const videoId = song.videoId || extractYouTubeId(song.url);
        const thumbnail = song.thumbnail || getYouTubeThumbnail(videoId);

        row.innerHTML = `
            <td>
                ${thumbnail ? `<img src="${thumbnail}" alt="${song.title}" style="width: 120px; height: 90px; object-fit: cover; cursor: pointer;" onclick="playVideo('${videoId}')" title="Click to play">` : 'No thumbnail'}
            </td>
            <td>${song.title}</td>
            <td>
                <span class="badge bg-primary">${song.rating || 'N/A'}/10</span>
            </td>
            <td>
                <a href="${song.url}" target="_blank" class="text-info me-2">
                    <i class="fas fa-external-link-alt"></i> Watch
                </a>
                <button class="btn btn-sm btn-info" onclick="playVideo('${videoId}')" title="Play in popup">
                    <i class="fas fa-play"></i>
                </button>
            </td>
            <td class="text-end">
                <button class="btn btn-sm btn-warning me-2" onclick="editSong(${song.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteSong(${song.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        list.appendChild(row);
    });
}

/**
 * Render songs in cards view
 */
function renderCardsView(filteredSongs) {
    filteredSongs.forEach(song => {
        // Ensure we have videoId and thumbnail (for old data that might not have them)
        const videoId = song.videoId || extractYouTubeId(song.url);
        const thumbnail = song.thumbnail || getYouTubeThumbnail(videoId);

        // Create card
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-4';
        
        col.innerHTML = `
            <div class="card h-100">
                ${thumbnail ? `
                    <img src="${thumbnail}" class="card-img-top" alt="${song.title}" style="height: 200px; object-fit: cover; cursor: pointer;" onclick="playVideo('${videoId}')" title="Click to play">
                ` : ''}
                <div class="card-body">
                    <h5 class="card-title">${song.title}</h5>
                    <p class="card-text">
                        <span class="badge bg-primary">Rating: ${song.rating || 'N/A'}/10</span>
                    </p>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <div>
                        <a href="${song.url}" target="_blank" class="btn btn-sm btn-info me-2">
                            <i class="fas fa-external-link-alt"></i> Watch
                        </a>
                        <button class="btn btn-sm btn-success" onclick="playVideo('${videoId}')" title="Play in popup">
                            <i class="fas fa-play"></i> Play
                        </button>
                    </div>
                    <div>
                        <button class="btn btn-sm btn-warning me-2" onclick="editSong(${song.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteSong(${song.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        songCards.appendChild(col);
    });
}

/**
 * Delete a song from the list
 */
function deleteSong(id) {
    if (confirm('Are you sure you want to delete this song?')) {
        // Filter out the song with the matching ID
        songs = songs.filter(song => song.id !== id);
        saveAndRender();
    }
}

/**
 * Edit a song - populate form with song data
 */
function editSong(id) {
    const songToEdit = songs.find(song => song.id === id);
    if (!songToEdit) return;

    document.getElementById('title').value = songToEdit.title;
    document.getElementById('url').value = songToEdit.url;
    document.getElementById('rating').value = songToEdit.rating || '';
    document.getElementById('songId').value = songToEdit.id; // Set Hidden ID

    submitBtn.innerHTML = '<i class="fas fa-save"></i> Update';
    submitBtn.classList.replace('btn-success', 'btn-warning');
    
    // Scroll to form
    document.getElementById('songForm').scrollIntoView({ behavior: 'smooth' });
}
