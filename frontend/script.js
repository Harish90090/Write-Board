class WriteBoardApp {
    constructor() {
        this.API_BASE = 'http://localhost:5001/api/notes';
        this.currentNote = null;
        this.notes = [];
        this.autoSaveTimeout = null;
        this.hasChanges = false;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadNotes();
    }

    bindEvents() {
        // Button events
        document.getElementById('newNoteBtn').addEventListener('click', () => this.createNote());
        document.getElementById('saveBtn').addEventListener('click', () => this.saveNote());
        document.getElementById('refreshBtn').addEventListener('click', () => this.loadNotes());
        document.getElementById('deleteBtn').addEventListener('click', () => this.deleteNote());

        // Editor events
        document.getElementById('noteTitle').addEventListener('input', () => this.onContentChange());
        document.getElementById('noteContent').addEventListener('input', () => this.onContentChange());

        // Search
        document.getElementById('searchInput').addEventListener('input', (e) => this.filterNotes(e.target.value));

        // Toast close
        document.querySelector('.toast-close').addEventListener('click', () => this.hideToast());
    }

    async loadNotes() {
        this.showLoading(true);
        
        try {
            const response = await fetch(this.API_BASE);
            if (!response.ok) throw new Error('Failed to fetch notes');
            
            this.notes = await response.json();
            this.renderNotes();
            this.hideLoading();
        } catch (error) {
            console.error('Error loading notes:', error);
            this.showToast('Failed to load notes', 'error');
            this.hideLoading();
        }
    }

    renderNotes() {
        const container = document.getElementById('notesList');
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        
        const filteredNotes = this.notes.filter(note => 
            note.title.toLowerCase().includes(searchTerm) ||
            note.content.toLowerCase().includes(searchTerm)
        );

        if (filteredNotes.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-sticky-note"></i>
                    <p>No notes found</p>
                    <button class="btn btn-primary" onclick="app.createNote()">
                        <i class="fas fa-plus"></i> Create First Note
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = filteredNotes.map(note => `
            <div class="note-item ${this.currentNote?._id === note._id ? 'active' : ''}" 
                 onclick="app.selectNote('${note._id}')">
                <div class="note-title">${this.escapeHtml(note.title) || 'Untitled Note'}</div>
                <div class="note-preview">${this.escapeHtml(note.content.substring(0, 100))}${note.content.length > 100 ? '...' : ''}</div>
                <div class="note-meta">
                    <span>${new Date(note.updatedAt).toLocaleDateString()}</span>
                    <span>${this.getWordCount(note.content)} words</span>
                </div>
            </div>
        `).join('');
    }

    selectNote(noteId) {
        const note = this.notes.find(n => n._id === noteId);
        if (!note) return;

        this.currentNote = note;
        this.hasChanges = false;
        
        document.getElementById('noteTitle').value = note.title;
        document.getElementById('noteContent').value = note.content;
        document.getElementById('deleteBtn').disabled = false;
        
        this.updateStats();
        this.updateSaveStatus('saved');
        this.renderNotes();
    }

    createNote() {
        // Save current note if has changes
        if (this.hasChanges && this.currentNote) {
            this.saveNote();
        }

        this.currentNote = null;
        this.hasChanges = false;
        
        document.getElementById('noteTitle').value = '';
        document.getElementById('noteContent').value = '';
        document.getElementById('deleteBtn').disabled = true;
        
        this.updateStats();
        this.updateSaveStatus('saved');
        this.renderNotes();
        
        document.getElementById('noteTitle').focus();
    }

    onContentChange() {
        if (!this.hasChanges) {
            this.hasChanges = true;
            this.updateSaveStatus('unsaved');
        }
        
        this.updateStats();
        
        // Auto-save after 3 seconds of inactivity
        clearTimeout(this.autoSaveTimeout);
        this.autoSaveTimeout = setTimeout(() => {
            if (this.hasChanges) {
                this.saveNote();
            }
        }, 3000);
    }

    async saveNote() {
        const title = document.getElementById('noteTitle').value.trim();
        const content = document.getElementById('noteContent').value.trim();

        // Don't save empty notes
        if (!title && !content) {
            this.showToast('Note cannot be empty', 'error');
            return;
        }

        this.updateSaveStatus('saving');

        try {
            let response;
            
            if (this.currentNote) {
                // Update existing note - matches your PUT /api/notes/:id
                response = await fetch(`${this.API_BASE}/${this.currentNote._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ title, content })
                });
            } else {
                // Create new note - matches your POST /api/notes
                response = await fetch(this.API_BASE, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ title, content })
                });
            }

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to save note');
            }

            const result = await response.json();
            this.hasChanges = false;
            this.updateSaveStatus('saved');
            this.showToast(this.currentNote ? 'Note updated successfully' : 'Note created successfully');
            
            // Reload to get updated data
            await this.loadNotes();
            
            // Select the new note if it was created
            if (!this.currentNote && result.note) {
                this.selectNote(result.note._id);
            }
            
        } catch (error) {
            console.error('Error saving note:', error);
            this.updateSaveStatus('error');
            this.showToast(error.message || 'Failed to save note', 'error');
        }
    }

    async deleteNote() {
        if (!this.currentNote) return;

        if (!confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
            return;
        }

        this.showLoading(true);

        try {
            // Matches your DELETE /api/notes/:id
            const response = await fetch(`${this.API_BASE}/${this.currentNote._id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete note');
            }

            this.showToast('Note deleted successfully');
            this.createNote(); // Clear editor
            await this.loadNotes(); // Reload list
            
        } catch (error) {
            console.error('Error deleting note:', error);
            this.showToast('Failed to delete note', 'error');
            this.hideLoading();
        }
    }

    filterNotes(searchTerm) {
        this.renderNotes();
    }

    updateStats() {
        const content = document.getElementById('noteContent').value;
        const words = content.trim() ? content.trim().split(/\s+/).length : 0;
        const chars = content.length;

        document.getElementById('wordCount').textContent = `${words} words`;
        document.getElementById('charCount').textContent = `${chars} characters`;
    }

    updateSaveStatus(status) {
        const icon = document.getElementById('saveIcon');
        const text = document.getElementById('saveText');

        icon.className = 'fas fa-circle';
        text.textContent = 'All changes saved';

        switch (status) {
            case 'saving':
                icon.classList.add('saving');
                text.textContent = 'Saving...';
                break;
            case 'saved':
                icon.classList.add('saved');
                text.textContent = 'All changes saved';
                break;
            case 'unsaved':
                icon.style.color = 'var(--warning-color)';
                text.textContent = 'Unsaved changes';
                break;
            case 'error':
                icon.classList.add('error');
                text.textContent = 'Error saving';
                break;
        }
    }

    getWordCount(text) {
        return text.trim() ? text.trim().split(/\s+/).length : 0;
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showLoading(show = true) {
        document.getElementById('loading').classList.toggle('active', show);
    }

    hideLoading() {
        this.showLoading(false);
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const messageEl = document.getElementById('toastMessage');
        const icon = toast.querySelector('.toast-content i');
        
        messageEl.textContent = message;
        toast.className = `toast ${type === 'error' ? 'error' : ''} active`;
        
        icon.className = type === 'error' ? 'fas fa-exclamation-circle' : 'fas fa-check-circle';

        setTimeout(() => this.hideToast(), 4000);
    }

    hideToast() {
        document.getElementById('toast').classList.remove('active');
    }
}

// Initialize the app
const app = new WriteBoardApp();