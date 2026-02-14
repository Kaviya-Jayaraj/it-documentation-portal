const API_URL = 'http://localhost:3002/api';
let token = localStorage.getItem('token');
let user = JSON.parse(localStorage.getItem('user'));

if (!token || user.role !== 'user') {
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
        <button class="btn btn-small" onclick="viewDocument('${doc._id}')">View Document</button>
        <button class="btn btn-small btn-secondary" onclick="downloadDocument('${doc._id}')">Download</button>
      </div>
    </div>
  `).join('');
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

async function viewDocument(id) {
  // Same as download but open in new tab
  try {
    const response = await fetch(`${API_URL}/documents/${id}/download`, { 
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } else {
      alert('View failed');
    }
  } catch (error) {
    alert('View error');
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

function logout() {
  localStorage.clear();
  window.location.href = 'login.html';
}

loadDocuments();
