import { useState, useEffect } from 'react';
import { useDocs } from '../context/DocContext';
import Navbar from '../components/Navbar';
import api from '../api/axios';

export default function AdminDashboard() {
  const { documents, loading, error, fetchDocuments, uploadDocument, reviewDocument, deleteDocument } = useDocs();

  const [search, setSearch] = useState('');
  const [tab, setTab]       = useState('documents');
  const [users, setUsers]   = useState([]);
  const [msg, setMsg]       = useState({ type: '', text: '' });

  // Upload form
  const [uploadForm, setUploadForm] = useState({ title: '', description: '', category: '' });
  const [file, setFile]             = useState(null);
  const [uploading, setUploading]   = useState(false);

  // Review modal
  const [reviewDoc, setReviewDoc]   = useState(null);
  const [remark, setRemark]         = useState('');
  const [rejectMode, setRejectMode] = useState(false);

  // User form
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', role: 'user' });

  const CATEGORIES = ['Networking', 'Server', 'Security', 'Hardware', 'Software', 'General'];

  useEffect(() => { fetchDocuments(); }, [fetchDocuments]);
  useEffect(() => { if (tab === 'users') loadUsers(); }, [tab]);

  const showMsg = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: '', text: '' }), 3000);
  };

  const loadUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data.users);
    } catch { showMsg('error', 'Failed to load users.'); }
  };

  const handleSearch = (e) => { e.preventDefault(); fetchDocuments(search); };

  // ── UPLOAD ──────────────────────────────────────
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return showMsg('error', 'Please select a file.');
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'docx', 'txt'].includes(ext)) return showMsg('error', 'Only PDF, DOCX, TXT allowed.');
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('title', uploadForm.title);
      fd.append('description', uploadForm.description);
      fd.append('category', uploadForm.category);
      fd.append('file', file);
      await uploadDocument(fd);
      await fetchDocuments();
      setUploadForm({ title: '', description: '', category: '' });
      setFile(null);
      e.target.reset();
      showMsg('success', 'Document uploaded.');
    } catch (err) {
      showMsg('error', err.response?.data?.message || 'Upload failed.');
    } finally { setUploading(false); }
  };

  // ── REVIEW ────────────────────────────────────────
  const openReview = (doc) => {
    setReviewDoc(doc);
    setRemark('');
    setRejectMode(false);
  };

  const handleApprove = async () => {
    try {
      await reviewDocument(reviewDoc._id, 'approved', '');
      setReviewDoc(null);
      showMsg('success', 'Document approved.');
    } catch { showMsg('error', 'Approval failed.'); }
  };

  const handleReject = async () => {
    if (!remark.trim()) return showMsg('error', 'Please enter a remark for rejection.');
    try {
      await reviewDocument(reviewDoc._id, 'rejected', remark);
      setReviewDoc(null);
      showMsg('success', 'Document rejected.');
    } catch { showMsg('error', 'Rejection failed.'); }
  };

  // ── DELETE ────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this document?')) return;
    try {
      await deleteDocument(id);
      showMsg('success', 'Document deleted.');
    } catch { showMsg('error', 'Delete failed.'); }
  };

  // ── VIEW / DOWNLOAD ───────────────────────────────
  const handleView = async (doc) => {
    try {
      const res  = await api.get(`/documents/${doc._id}/download`, { responseType: 'blob' });
      const ext  = doc.filePath?.split('.').pop().toLowerCase();
      const mime = { pdf: 'application/pdf', txt: 'text/plain', docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }[ext] || 'application/octet-stream';
      window.open(URL.createObjectURL(new Blob([res.data], { type: mime })), '_blank');
    } catch { showMsg('error', 'View failed.'); }
  };

  const handleDownload = async (doc) => {
    try {
      const res = await api.get(`/documents/${doc._id}/download`, { responseType: 'blob' });
      const a   = document.createElement('a');
      a.href    = URL.createObjectURL(new Blob([res.data]));
      a.download = doc.filePath?.split(/[\\/]/).pop() || doc.title;
      a.click();
    } catch { showMsg('error', 'Download failed.'); }
  };

  // ── USER MANAGEMENT ───────────────────────────────
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users', userForm);
      setUserForm({ name: '', email: '', password: '', role: 'user' });
      loadUsers();
      showMsg('success', 'User created.');
    } catch (err) { showMsg('error', err.response?.data?.message || 'Failed to create user.'); }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await api.delete(`/users/${id}`);
      loadUsers();
      showMsg('success', 'User deleted.');
    } catch { showMsg('error', 'Failed to delete user.'); }
  };

  const statusBadge = (status) => {
    const map = { pending: 'badge-pending', approved: 'badge-approved', rejected: 'badge-rejected' };
    return <span className={`status-badge ${map[status]}`}>{status}</span>;
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-wrapper">
        <aside className="sidebar">
          <button className={`nav-link ${tab === 'documents' ? 'active' : ''}`} onClick={() => setTab('documents')}>Documents</button>
          <button className={`nav-link ${tab === 'upload'    ? 'active' : ''}`} onClick={() => setTab('upload')}>Upload</button>
          <button className={`nav-link ${tab === 'users'     ? 'active' : ''}`} onClick={() => setTab('users')}>Users</button>
        </aside>

        <main className="main-content">
          {msg.text && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

          {/* ── DOCUMENTS TAB ── */}
          {tab === 'documents' && (
            <section>
              <div className="section-header">
                <h2>All Documents <span className="badge">{documents.length}</span></h2>
                <form onSubmit={handleSearch} className="search-form">
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title or category..." />
                  <button className="btn btn-primary btn-sm" type="submit">Search</button>
                  {search && <button className="btn btn-secondary btn-sm" type="button" onClick={() => { setSearch(''); fetchDocuments(); }}>Clear</button>}
                </form>
              </div>

              {/* Review Modal */}
              {reviewDoc && (
                <div className="review-modal-overlay">
                  <div className="review-modal">
                    <h3>Review Document</h3>
                    <div className="review-details">
                      <p><strong>Title:</strong> {reviewDoc.title}</p>
                      <p><strong>Category:</strong> {reviewDoc.category}</p>
                      <p><strong>Description:</strong> {reviewDoc.description}</p>
                      <p><strong>Uploaded By:</strong> {reviewDoc.uploadedBy?.name || 'N/A'}</p>
                      <p><strong>Date:</strong> {new Date(reviewDoc.createdAt).toLocaleDateString()}</p>
                      <p><strong>Current Status:</strong> {statusBadge(reviewDoc.status)}</p>
                      {reviewDoc.remark && <p><strong>Previous Remark:</strong> {reviewDoc.remark}</p>}
                    </div>

                    <div className="review-actions">
                      <button className="btn btn-primary btn-sm" onClick={() => handleView(reviewDoc)}>View File</button>
                    </div>

                    {!rejectMode ? (
                      <div className="btn-group" style={{ marginTop: '16px' }}>
                        <button className="btn btn-success" onClick={handleApprove}>Approve</button>
                        <button className="btn btn-danger"  onClick={() => setRejectMode(true)}>Reject</button>
                        <button className="btn btn-secondary" onClick={() => setReviewDoc(null)}>Cancel</button>
                      </div>
                    ) : (
                      <div style={{ marginTop: '16px' }}>
                        <div className="form-group">
                          <label>Rejection Remark *</label>
                          <textarea
                            rows={3}
                            placeholder="Enter reason for rejection..."
                            value={remark}
                            onChange={(e) => setRemark(e.target.value)}
                          />
                        </div>
                        <div className="btn-group">
                          <button className="btn btn-danger"    onClick={handleReject}>Confirm Reject</button>
                          <button className="btn btn-secondary" onClick={() => setRejectMode(false)}>Back</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {loading ? <div className="loading">Loading...</div> : error ? <div className="alert alert-error">{error}</div> : (
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr><th>#</th><th>Title</th><th>Category</th><th>Uploaded By</th><th>Status</th><th>Date</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {documents.length === 0 ? (
                        <tr><td colSpan={7} className="text-center">No documents found.</td></tr>
                      ) : documents.map((doc, i) => (
                        <tr key={doc._id}>
                          <td>{i + 1}</td>
                          <td>{doc.title}</td>
                          <td><span className="badge-cat">{doc.category}</span></td>
                          <td>{doc.uploadedBy?.name || 'N/A'}</td>
                          <td>{statusBadge(doc.status)}</td>
                          <td>{new Date(doc.createdAt).toLocaleDateString()}</td>
                          <td className="actions">
                            <button className="btn btn-warning btn-sm" onClick={() => openReview(doc)}>Review</button>
                            <button className="btn btn-primary btn-sm" onClick={() => handleView(doc)}>View</button>
                            <button className="btn btn-success btn-sm" onClick={() => handleDownload(doc)}>Download</button>
                            <button className="btn btn-danger btn-sm"  onClick={() => handleDelete(doc._id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {/* ── UPLOAD TAB ── */}
          {tab === 'upload' && (
            <section>
              <h2>Upload Document</h2>
              <div className="card">
                <form onSubmit={handleUpload}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Title *</label>
                      <input placeholder="Document title" value={uploadForm.title} onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })} required />
                    </div>
                    <div className="form-group">
                      <label>Category *</label>
                      <select value={uploadForm.category} onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })} required>
                        <option value="">Select category</option>
                        {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea rows={3} placeholder="Brief description..." value={uploadForm.description} onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>File * (PDF, DOCX, TXT — max 10MB)</label>
                    <input type="file" accept=".pdf,.docx,.txt" onChange={(e) => setFile(e.target.files[0])} required />
                  </div>
                  <button className="btn btn-primary" type="submit" disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Upload Document'}
                  </button>
                </form>
              </div>
            </section>
          )}

          {/* ── USERS TAB ── */}
          {tab === 'users' && (
            <section>
              <h2>Manage Users <span className="badge">{users.length}</span></h2>
              <div className="card">
                <h3>Add New User</h3>
                <form onSubmit={handleAddUser}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Name *</label>
                      <input placeholder="Full name" value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} required />
                    </div>
                    <div className="form-group">
                      <label>Email *</label>
                      <input type="email" placeholder="Email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} required />
                    </div>
                    <div className="form-group">
                      <label>Password *</label>
                      <input type="password" placeholder="Password" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} required />
                    </div>
                    <div className="form-group">
                      <label>Role</label>
                      <select value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                  <button className="btn btn-primary" type="submit">Add User</button>
                </form>
              </div>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr><th>#</th><th>Name</th><th>Email</th><th>Role</th><th>Action</th></tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr key={u._id}>
                        <td>{i + 1}</td>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td><span className={`role-badge role-${u.role}`}>{u.role}</span></td>
                        <td><button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(u._id)}>Delete</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </main>
      </div>
    </>
  );
}
