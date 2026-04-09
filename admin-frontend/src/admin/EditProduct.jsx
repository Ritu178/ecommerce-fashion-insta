

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./Edit.css";
export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

const [form, setForm] = useState({});
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    fetch(`http://localhost:5000/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setForm(data);
        setPreview(`http://localhost:5000/uploads/${data.image}`);
      });
  }, [id]);

  const validate = () => {
    if (!form.title?.trim()) return 'Title is required';
    if (!form.price || parseFloat(form.price) <= 0) return 'Valid price required';
    if (!form.category) return 'Category is required';
    if (!form.description || !form.description.trim()) return 'Description is required';
    return '';
  };

  // const handleUpdate = async () => {
  //   setError('');
  //   setSuccess('');
  //   const valErr = validate();
  //   if (valErr) {
  //     setError(valErr);
  //     return;
  //   }
  //   setLoading(true);
  //   try {
  //     const formData = new FormData();

  //     formData.append("title", form.title);
  //     formData.append("price", form.price);
  //     formData.append("category", form.category);
  //     formData.append("description", form.description || '');

  //     if (form.image instanceof File) {
  //       formData.append("image", form.image);
  //     }

  //     const res = await fetch(`http://localhost:5000/admin/update-product/${id}`, {
  //       method: "PUT",
  //       headers: { Authorization: token },
  //       body: formData
  //     });

  //     if (!res.ok) {
  //       const errData = await res.text();
  //       throw new Error(errData || 'Update failed');
  //     }

  //     setSuccess('Product updated successfully ');
  //     setTimeout(() => navigate("/products"), 1500);
  //   } catch (err) {
  //     setError(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // return (

  //   <div className="container mt-4">
  //     <h3>Edit Product</h3>

  //     <input
  //       className="form-control mb-2"
  //       value={form.title || ""}
  //       onChange={e => setForm({ ...form, title: e.target.value })}
  //     />

  //     <input
  //       className="form-control mb-2"
  //       type="number"
  //       step="0.01"
  //       min="0"
  //       value={form.price || ""}
  //       onChange={e => setForm({ ...form, price: e.target.value })}
  //     />

  //     <textarea
  //       className="form-control mb-2"
  //       placeholder="Description"
  //       value={form.description || ""}
  //       onChange={e => setForm({ ...form, description: e.target.value })}
  //     />

  //     <input
  //       className="form-control mb-2"
  //       value={form.category || ""}
  //       onChange={e => setForm({ ...form, category: e.target.value })}
  //     />

  //     <input
  //       type="file"
  //       className="form-control mb-2"
  //       onChange={e => {
  //         setForm({ ...form, image: e.target.files[0] });
  //         setPreview(URL.createObjectURL(e.target.files[0]));
  //       }}
  //     />

  //     {preview && <img src={preview} alt="Product preview" width="150" className="mb-2" />}

  //     {error && <div className="alert alert-danger mb-2">{error}</div>}
  //     {success && <div className="alert alert-success mb-2">{success}</div>}

  //     <button 
  //       className="btn btn-success" 
  //       onClick={handleUpdate}
  //       disabled={loading}
  //     >
  //       {loading ? 'Updating...' : 'Update Product'}
  //     </button>
  //   </div>
  // );
  const handleUpdate = async () => {
  setError('');
  setSuccess('');

  const valErr = validate();
  if (valErr) {
    setError(valErr);

    // ERROR ALERT
    Swal.fire({
      title: "Error!",
      text: valErr,
      icon: "error"
    });

    return;
  }

  setLoading(true);

  try {
    const formData = new FormData();

    formData.append("title", form.title);
    formData.append("price", form.price);
    formData.append("category", form.category);
    formData.append("description", form.description || '');

    if (form.image instanceof File) {
      formData.append("image", form.image);
    }

    const res = await fetch(`http://localhost:5000/admin/update-product/${id}`, {
      method: "PUT",
      headers: { Authorization: token },
      body: formData
    });

    if (!res.ok) {
      const errData = await res.text();
      throw new Error(errData || 'Update failed');
    }

    setSuccess('Product updated successfully');

    // SUCCESS ALERT (AMAZON STYLE)
    Swal.fire({
      title: "Updated!",
      text: "Product updated successfully",
      icon: "success",
      confirmButtonColor: "#ffd814",
      timer: 1500,
      showConfirmButton: false
    });

    setTimeout(() => navigate("/products"), 1500);

  } catch (err) {
    setError(err.message);

    // ERROR ALERT
    Swal.fire({
      title: "Error!",
      text: err.message,
      icon: "error"
    });

  } finally {
    setLoading(false);
  }
};

  return (
  <div className="amz-edit-page">

    <div className="amz-container">

      <h2>Edit Product</h2>

      <div className="amz-grid">

        {/* LEFT */}
        <div className="amz-box">

          <label>Product Title</label>
          <input
            className="amz-input"
            value={form.title || ""}
            onChange={e => setForm({ ...form, title: e.target.value })}
          />

          <label>Price</label>
          <input
            className="amz-input"
            type="number"
            step="0.01"
            min="0"
            value={form.price || ""}
            onChange={e => setForm({ ...form, price: e.target.value })}
          />

          <label>Description</label>
          <textarea
            className="amz-textarea"
            value={form.description || ""}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />

          <label>Category</label>
          <input
            className="amz-input"
            value={form.category || ""}
            onChange={e => setForm({ ...form, category: e.target.value })}
          />

        </div>

        {/* RIGHT */}
        <div className="amz-box">

          <label>Product Image</label>

          <input
            type="file"
            className="amz-input"
            onChange={e => {
              setForm({ ...form, image: e.target.files[0] });
              setPreview(URL.createObjectURL(e.target.files[0]));
            }}
          />

          {preview && (
            <img src={preview} className="preview-img" />
          )}

          {error && <div className="amz-error">{error}</div>}
          {success && <div className="amz-success">{success}</div>}

          <button
            className="amz-btn"
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Product"}
          </button>

        </div>

      </div>

    </div>
  </div>
);
}
