import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Category {
  id: string;
  name: string;
}

const CategoryManager = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const fetchCategories = async () => {
    const res = await axios.get('/api/categories');
    setCategories(res.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    await axios.post('/api/categories', { name: newCategory });
    setNewCategory('');
    fetchCategories();
  };

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditingName(cat.name);
  };

  const handleUpdate = async (id: string) => {
    if (!editingName.trim()) return;
    await axios.put(`/api/categories/${id}`, { name: editingName });
    setEditingId(null);
    setEditingName('');
    fetchCategories();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this category?')) {
      await axios.delete(`/api/categories/${id}`);
      fetchCategories();
    }
  };

  return (
    <div>
      <h2>Category Management</h2>
      <form onSubmit={handleAdd} style={{ marginBottom: 16 }}>
        <input
          type="text"
          value={newCategory}
          onChange={e => setNewCategory(e.target.value)}
          placeholder="New category name"
        />
        <button type="submit">Add Category</button>
      </form>
      <ul>
        {categories.map(cat => (
          <li key={cat.id}>
            {editingId === cat.id ? (
              <>
                <input
                  value={editingName}
                  onChange={e => setEditingName(e.target.value)}
                />
                <button onClick={() => handleUpdate(cat.id)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                {cat.name}
                <button onClick={() => handleEdit(cat)}>Edit</button>
                <button onClick={() => handleDelete(cat.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryManager; 