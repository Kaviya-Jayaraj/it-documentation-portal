const API_URL = 'http://localhost:3002/api';
let token = localStorage.getItem('token');
let user = JSON.parse(localStorage.getItem('user'));

if (!token || user.role !== 'admin') {
  window.location.href = 'login.html';
}

document.getElementById('userName').textContent = `Welcome, ${user.name}`;

const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};

async function loadDocuments() {
  try {
    const response = await fetch(`${API_URL}/documents`, { headers });
    const data = await response.json();
    displayDocuments(data.documents);
  } catch (error) {
    console.error('Error loading documents:', error);
  }
}

function displayDocuments(documents) {
  const list = document.getElementById('documentsList');
  
  if (documents.length === 0) {
    list.innerHTML = '<p>No documents found.</p>';
    return;
  }
  
  list.innerHTML = documents.map(doc => `
    <div class="document-card">
      <h3>${doc.title}</h3>
      <p><strong>Category:</strong> <span class="badge">${doc.category}</span></p>
      <p><strong>Description:</strong> ${doc.description}</p>
      <p><strong>Uploaded by:</strong> ${doc.uploadedBy ? doc.uploadedBy.name : 'Unknown'}</p>
      <p><strong>Date:</strong> ${new Date(doc.createdAt).toLocaleDateString()}</p>
      <div class="actions">
        <button class="btn btn-small btn-secondary" onclick="openEditModal('${doc._id}', '${doc.title}', '${doc.description}', '${doc.category}')">Edit</button>
        <button class="btn btn-small btn-danger" onclick="deleteDocument('${doc._id}')">Delete</button>
        <button class="btn btn-small" onclick="downloadDocument('${doc._id}')">Download</button>
      </div>
    </div>
  `).join('');
}

document.getElementById('uploadForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData();
  formData.append('title', document.getElementById('title').value);
  formData.append('description', document.getElementById('description').value);
  formData.append('category', document.getElementById('category').value);
  formData.append('file', document.getElementById('file').files[0]);
  
  try {
    const response = await fetch(`${API_URL}/documents`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    
    const data = await response.json();
    
    if (response.ok) {
      closeUploadModal();
      loadDocuments();
      e.target.reset();
    } else {
      document.getElementById('uploadError').textContent = data.message;
    }
  } catch (error) {
    document.getElementById('uploadError').textContent = 'Upload failed';
  }
});

document.getElementById('editForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const id = document.getElementById('editDocId').value;
  const body = {
    title: document.getElementById('editTitle').value,
    description: document.getElementById('editDescription').value,
    category: document.getElementById('editCategory').value
  };
  
  try {
    const response = await fetch(`${API_URL}/documents/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body)
    });
    
    if (response.ok) {
      closeEditModal();
      loadDocuments();
    } else {
      const data = await response.json();
      document.getElementById('editError').textContent = data.message;
    }
  } catch (error) {
    document.getElementById('editError').textContent = 'Update failed';
  }
});

async function deleteDocument(id) {
  if (!confirm('Are you sure you want to delete this document?')) return;
  
  try {
    await fetch(`${API_URL}/documents/${id}`, {
      method: 'DELETE',
      headers
    });
    loadDocuments();
  } catch (error) {
    alert('Delete failed');
  }
}

async function downloadDocument(id) {
  try {
    const response = await fetch(`${API_URL}/documents/${id}/download`, { 
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'document';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } else {
      alert('Download failed');
    }
  } catch (error) {
    alert('Download error');
  }
}

document.getElementById('searchInput').addEventListener('input', async (e) => {
  const query = e.target.value;
  
  if (query.length > 0) {
    try {
      const response = await fetch(`${API_URL}/documents/search?query=${query}`, { headers });
      const data = await response.json();
      displayDocuments(data.documents);
    } catch (error) {
      console.error('Search error:', error);
    }
  } else {
    loadDocuments();
  }
});

function openUploadModal() {
  document.getElementById('uploadModal').classList.add('active');
}

function closeUploadModal() {
  document.getElementById('uploadModal').classList.remove('active');
  document.getElementById('uploadError').textContent = '';
}

function openEditModal(id, title, description, category) {
  document.getElementById('editDocId').value = id;
  document.getElementById('editTitle').value = title;
  document.getElementById('editDescription').value = description;
  document.getElementById('editCategory').value = category;
  document.getElementById('editModal').classList.add('active');
}

function closeEditModal() {
  document.getElementById('editModal').classList.remove('active');
  document.getElementById('editError').textContent = '';
}

function logout() {
  localStorage.clear();
  window.location.href = 'login.html';
}

loadDocuments();
