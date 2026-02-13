const API_URL = 'http://localhost:5000/api';
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
      <p><strong>Uploaded by:</strong> ${doc.uploadedBy.name}</p>
      <p><strong>Date:</strong> ${new Date(doc.createdAt).toLocaleDateString()}</p>
      <div class="actions">
        <button class="btn btn-small btn-secondary" onclick="openEditModal('${doc._id}', '${doc.title}', '${doc.description}', '${doc.category}')">Edit</button>
        <button class="btn btn-small btn-danger" onclick="deleteDocument('${doc._id}')">Delete</button>
        <button class="btn btn-small" onclick="downloadDocument('${doc._id}')">Download</button>
      </div>
    </div>
  `).join('');
}

async function loadUsers() {
  try {
    const response = await fetch(`${API_URL}/users`, { headers });
    const data = await response.json();
    displayUsers(data.users);
  } catch (error) {
    console.error('Error loading users:', error);
  }
}

function displayUsers(users) {
  const list = document.getElementById('usersList');
  
  list.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${users.map(u => `
          <tr>
            <td>${u.name}</td>
            <td>${u.email}</td>
            <td>${u.role}</td>
            <td>
              ${u._id !== user.id ? `<button class="btn btn-small btn-danger" onclick="deleteUser('${u._id}')">Delete</button>` : ''}
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
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

document.getElementById('userForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const body = {
    name: document.getElementById('userName').value,
    email: document.getElementById('userEmail').value,
    password: document.getElementById('userPassword').value,
    role: document.getElementById('userRole').value
  };
  
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      closeUserModal();
      loadUsers();
      e.target.reset();
    } else {
      document.getElementById('userError').textContent = data.message;
    }
  } catch (error) {
    document.getElementById('userError').textContent = 'User creation failed';
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

async function deleteUser(id) {
  if (!confirm('Are you sure you want to delete this user?')) return;
  
  try {
    await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers
    });
    loadUsers();
  } catch (error) {
    alert('Delete failed');
  }
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

function openUserModal() {
  document.getElementById('userModal').classList.add('active');
}

function closeUserModal() {
  document.getElementById('userModal').classList.remove('active');
  document.getElementById('userError').textContent = '';
}

function logout() {
  localStorage.clear();
  window.location.href = 'login.html';
}

loadDocuments();
loadUsers();
