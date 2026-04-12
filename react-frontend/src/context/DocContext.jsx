import { createContext, useContext, useState, useCallback } from 'react';
import api from '../api/axios';

const DocContext = createContext(null);

export function DocProvider({ children }) {
  const [documents,   setDocuments]   = useState([]);
  const [myDocuments, setMyDocuments] = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');

  // Admin: all documents
  const fetchDocuments = useCallback(async (search = '') => {
    setLoading(true); setError('');
    try {
      const url = search ? `/documents/search?query=${search}` : '/documents';
      const { data } = await api.get(url);
      setDocuments(data.documents);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch documents');
    } finally { setLoading(false); }
  }, []);

  // User: approved documents only
  const fetchApprovedDocuments = useCallback(async (search = '') => {
    setLoading(true); setError('');
    try {
      const url = search ? `/documents/search?query=${search}` : '/documents/approved';
      const { data } = await api.get(url);
      setDocuments(data.documents);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch documents');
    } finally { setLoading(false); }
  }, []);

  // User: own uploaded documents
  const fetchMyDocuments = useCallback(async () => {
    try {
      const { data } = await api.get('/documents/my-documents');
      setMyDocuments(data.documents);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const uploadDocument = async (formData) => {
    const { data } = await api.post('/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  };

  const reviewDocument = async (id, status, remark) => {
    const { data } = await api.put(`/documents/${id}/review`, { status, remark });
    await fetchDocuments();
    return data;
  };

  const updateDocument = async (id, payload) => {
    const { data } = await api.put(`/documents/${id}`, payload);
    await fetchDocuments();
    return data;
  };

  const deleteDocument = async (id) => {
    await api.delete(`/documents/${id}`);
    setDocuments((prev) => prev.filter((d) => d._id !== id));
  };

  return (
    <DocContext.Provider value={{
      documents, myDocuments, loading, error,
      fetchDocuments, fetchApprovedDocuments, fetchMyDocuments,
      uploadDocument, reviewDocument, updateDocument, deleteDocument
    }}>
      {children}
    </DocContext.Provider>
  );
}

export const useDocs = () => useContext(DocContext);
