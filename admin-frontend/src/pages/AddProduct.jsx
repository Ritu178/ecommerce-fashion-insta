import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const [form, setForm] = useState({});
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem("adminToken");

  const validate = () => {
    if (!form.title?.trim()) return 'Title is required';
    if (!form.price || isNaN(form.price) || parseFloat(form.price) <= 0) return 'Valid positive price is required';
    if (!form.category) return 'Category is required';
    if (!form.description?.trim()) return 'Description is required';
    if (!form.image) return 'Image is required';
    return '';
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    const valErr = validate();
    if (valErr) {
      setError(valErr);
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("price", form.price);
      formData.append("category", form.category);
      formData.append("description", form.description);
      formData.append("image", form.image);

      const res = await fetch("http://localhost:5000/admin/add-product", {
        method: "POST",
        headers: { Authorization: token },
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.text();
        throw new Error(errData || 'Failed to add product');
      }

      setSuccess('Product added successfully ✅');
      setTimeout(() => {
        setForm({});
        setPreview(null);
        navigate("/products");
      }, 1500);
    } catch (err) {
      setError(err.message || 'An error occurred while adding product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Add Product</h3>

      <input
        className="form-control mb-2"
        placeholder="Title"
        value={form.title || ''}
        onChange={e => setForm({ ...form, title: e.target.value })}
      />

      <input
        className="form-control mb-2"
        placeholder="Price"
        type="number"
        step="0.01"
        min="0"
        value={form.price || ''}
        onChange={e => setForm({ ...form, price: e.target.value })}
      />

      <textarea
        className="form-control mb-2"
        placeholder="Description"
        value={form.description || ''}
        onChange={e => setForm({ ...form, description: e.target.value })}
      />

      <select
        className="form-control mb-2"
        value={form.category || ''}
        onChange={e => setForm({ ...form, category: e.target.value })}
      >
        <option value="">Select Category</option>
        <option value="women">Women</option>
        <option value="men">Men</option>
        <option value="children">Children</option>
      </select>

      <input
        type="file"
        className="form-control mb-2"
        accept="image/*"
        onChange={e => {
          const file = e.target.files[0];
          if (file) {
            setForm({ ...form, image: file });
            setPreview(URL.createObjectURL(file));
          }
        }}
      />

      {preview && (
        <img src={preview} alt="Preview" width="150" className="mb-2" />
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success" role="alert">
          {success}
        </div>
      )}

      <button
        className="btn btn-success mt-2"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            Adding Product...
          </>
        ) : (
          'Add Product'
        )}
      </button>
    </div>
  );
}
