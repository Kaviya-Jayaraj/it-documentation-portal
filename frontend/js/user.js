const API_URL = 'http://localhost:5000/api';
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
      <p><strong>Uploaded by:</strong> ${doc.uploadedBy.name}</p>
      <p><strong>Date:</strong> ${new Date(doc.createdAt).toLocaleDateString()}</p>
      <div class="actions">
        <button class="btn btn-small" onclick="viewDocument('${doc._id}')">View Details</button>
        <button class="btn btn-small btn-secondary" onclick="downloadDocument('${doc._id}')">Download</button>
      </div>
    </div>
  `).join('');
}

async function viewDocument(id) {
  try {
    const response = await fetch(`${API_URL}/documents/${id}`, { headers });
    const data = await response.json();
    
    const details = document.getElementById('documentDetails');
    details.innerHTML = `
      <h3>${data.document.title}</h3>
      <p><strong>Category:</strong> ${data.document.category}</p>
      <p><strong>Description:</strong> ${data.document.description}</p>
      <p><strong>Uploaded by:</strong> ${data.document.uploadedBy.name}</p>
      <p><strong>Date:</strong> ${new Date(data.document.createdAt).toLocaleString()}</p>
    `;
    
    document.getElementById('downloadBtn').onclick = () => downloadDocument(id);
    document.getElementById('viewModal').classList.add('active');
  } catch (error) {
    alert('Error loading document details');
  }
}

function closeViewModal() {
  document.getElementById('viewModal').classList.remove('active');
}

async function downloadDocument(id) {
  window.open(`${API_URL}/documents/${id}/download?token=${token}`, '_blank');
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
