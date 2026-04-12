import { useState, useEffect } from 'react';
import { useDocs } from '../context/DocContext';
import Navbar from '../components/Navbar';
import api from '../api/axios';

export default function UserDashboard() {
  const { documents, myDocuments, loading, error, fetchApprovedDocuments, fetchMyDocuments, uploadDocument } = useDocs();
  const [search, setSearch]     = useState('');
  const [tab, setTab]           = useState('browse');
  const [viewDoc, setViewDoc]   = useState(null);
  const [msg, setMsg]           = useState({ type: '', text: '' });
  const [uploadForm, setUploadForm] = useState({ title: '', description: '', category: '' });
  const [file, setFile]             = useState(null);
  const [uploading, setUploading]   = useState(false);
  const CATEGORIES = ['Networking', 'Server', 'Security', 'Hardware', 'Software', 'General'];

  useEffect(() => { fetchApprovedDocuments(); fetchMyDocuments(); }, [fetchApprovedDocuments, fetchMyDocuments]);

  const showMsg = (type, text) => { setMsg({ type, text }); setTimeout(() => setMsg({ type: '', text: '' }), 3000); };

  const handleSearch = (e) => { e.preventDefault(); fetchApprovedDocuments(search); };

  const handleDownload = async (doc) => {
    try {
      const res = await api.get(`/documents/${doc._id}/download`, { responseType: 'blob' });
      const a   = document.createElement('a');
      a.href    = URL.createObjectURL(new Blob([res.data]));
      a.download = doc.filePath?.split(/[\\/]/).pop() || doc.title;
      a.click();
    } catch { showMsg('error', 'Download failed.'); }
  };

  const handleView = async (doc) => {
    try {
      const res  = await api.get(`/documents/${doc._id}/download`, { responseType: 'blob' });
      const ext  = doc.filePath?.split('.').pop().toLowerCase();
      const mime = { pdf: 'application/pdf', txt: 'text/plain', docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }[ext] || 'application/octet-stream';
      window.open(URL.createObjectURL(new Blob([res.data], { type: mime })), '_blank');
    } catch { showMsg('error', 'View failed.'); }
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
          <button className={`nav-link ${tab === 'browse'    ? 'active' : ''}`} onClick={() => setTab('browse')}>Browse Documents</button>
          <button className={`nav-link ${tab === 'upload'    ? 'active' : ''}`} onClick={() => setTab('upload')}>Upload Document</button>
          <button className={`nav-link ${tab === 'myuploads' ? 'active' : ''}`} onClick={() => setTab('myuploads')}>My Uploads</button>
        </aside>

        <main className="main-content">
          {msg.text && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

          {/* ── BROWSE TAB ── */}
          {tab === 'browse' && (
            <>
              {viewDoc && (
                <div className="card detail-card">
                  <div className="detail-header">
                    <h2>{viewDoc.title}</h2>
                    <button className="btn btn-secondary btn-sm" onClick={() => setViewDoc(null)}>Back</button>
                  </div>
                  <div className="detail-body">
                    <p><strong>Category:</strong> <span className="badge-cat">{viewDoc.category}</span></p>
                    <p><strong>Description:</strong> {viewDoc.description || 'No description.'}</p>
                    <p><strong>Uploaded By:</strong> {viewDoc.uploadedBy?.name || 'N/A'}</p>
                    <p><strong>Date:</strong> {new Date(viewDoc.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="btn-group">
                    <button className="btn btn-success" onClick={() => handleView(viewDoc)}>View File</button>
                    <button className="btn btn-primary" onClick={() => handleDownload(viewDoc)}>Download</button>
                  </div>
                </div>
              )}

              <div className="section-header">
                <h2>Available Documents <span className="badge">{documents.length}</span></h2>
                <form onSubmit={handleSearch} className="search-form">
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title or category..." />
                  <button className="btn btn-primary btn-sm" type="submit">Search</button>
                  {search && <button className="btn btn-secondary btn-sm" type="button" onClick={() => { setSearch(''); fetchApprovedDocuments(); }}>Clear</button>}
                </form>
              </div>

              {loading ? <div className="loading">Loading...</div> : error ? <div className="alert alert-error">{error}</div> : (
                documents.length === 0 ? <div className="empty-state">No documents available.</div> : (
                  <div className="doc-grid">
                    {documents.map((doc) => (
                      <div key={doc._id} className="doc-card">
                        <div className="doc-icon">📄</div>
                        <div className="doc-info">
                          <h3>{doc.title}</h3>
                          <p>{doc.description?.substring(0, 80)}...</p>
                          <span className="badge-cat">{doc.category}</span>
                          <p className="doc-meta">{new Date(doc.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="doc-actions">
                          <button className="btn btn-primary btn-sm"   onClick={() => setViewDoc(doc)}>Details</button>
                          <button className="btn btn-success btn-sm"   onClick={() => handleView(doc)}>View</button>
                          <button className="btn btn-secondary btn-sm" onClick={() => handleDownload(doc)}>Download</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </>
          )}

          {/* ── UPLOAD TAB ── */}
          {tab === 'upload' && (
            <section>
              <h2>Upload Document</h2>
              <div className="card">
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  if (!file) return showMsg('error', 'Please select a file.');
                  const ext = file.name.split('.').pop().toLowerCase();
                  if (!['pdf','docx','txt'].includes(ext)) return showMsg('error', 'Only PDF, DOCX, TXT allowed.');
                  setUploading(true);
                  try {
                    const fd = new FormData();
                    fd.append('title', uploadForm.title);
                    fd.append('description', uploadForm.description);
                    fd.append('category', uploadForm.category);
                    fd.append('file', file);
                    await uploadDocument(fd);
                    await fetchMyDocuments();
                    setUploadForm({ title: '', description: '', category: '' });
                    setFile(null);
                    e.target.reset();
                    showMsg('success', 'Document uploaded! Pending admin review.');
                    setTimeout(() => setTab('myuploads'), 1500);
                  } catch (err) {
                    showMsg('error', err.response?.data?.message || 'Upload failed.');
                  } finally { setUploading(false); }
                }}>
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

          {/* ── MY UPLOADS TAB ── */}
          {tab === 'myuploads' && (
            <section>
              <h2>My Uploads <span className="badge">{myDocuments.length}</span></h2>
              {myDocuments.length === 0 ? (
                <div className="empty-state">You have not uploaded any documents yet.</div>
              ) : (
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr><th>#</th><th>Title</th><th>Category</th><th>Status</th><th>Remark</th><th>Date</th><th>Action</th></tr>
                    </thead>
                    <tbody>
                      {myDocuments.map((doc, i) => (
                        <tr key={doc._id}>
                          <td>{i + 1}</td>
                          <td>{doc.title}</td>
                          <td><span className="badge-cat">{doc.category}</span></td>
                          <td>{statusBadge(doc.status)}</td>
                          <td>{doc.remark ? <span className="remark-text">{doc.remark}</span> : '—'}</td>
                          <td>{new Date(doc.createdAt).toLocaleDateString()}</td>
                          <td>
                            {doc.status === 'approved' && (
                              <button className="btn btn-success btn-sm" onClick={() => handleView(doc)}>View</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}
        </main>
      </div>
    </>
  );
}
