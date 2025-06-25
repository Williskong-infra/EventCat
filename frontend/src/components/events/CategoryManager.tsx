import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, List, Modal, message, Typography, Space } from 'antd';

interface Category {
  id: string;
  name: string;
}

const CategoryManager = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/categories');
      setCategories(res.data);
    } catch (err) {
      message.error('Failed to fetch categories');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async () => {
    if (!newCategory.trim()) return;
    try {
      await axios.post('/api/categories', { name: newCategory });
      setNewCategory('');
      message.success('Category added!');
      fetchCategories();
    } catch (err) {
      message.error('Failed to add category');
    }
  };

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditingName(cat.name);
    setModalVisible(true);
  };

  const handleUpdate = async () => {
    if (!editingName.trim() || !editingId) return;
    try {
      await axios.put(`/api/categories/${editingId}`, { name: editingName });
      message.success('Category updated!');
      setEditingId(null);
      setEditingName('');
      setModalVisible(false);
      fetchCategories();
    } catch (err) {
      message.error('Failed to update category');
    }
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: 'Delete this category?',
      content: 'Are you sure you want to delete this category?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await axios.delete(`/api/categories/${id}`);
          message.success('Category deleted!');
          fetchCategories();
        } catch (err) {
          message.error('Failed to delete category');
        }
      },
    });
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: 24, background: '#fff', borderRadius: 8 }}>
      <Typography.Title level={2}>Category Management</Typography.Title>
      <Form layout="inline" onFinish={handleAdd} style={{ marginBottom: 24 }}>
        <Form.Item>
          <Input
            value={newCategory}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCategory(e.target.value)}
            placeholder="New category name"
            onPressEnter={handleAdd}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={!newCategory.trim()}>
            Add Category
          </Button>
        </Form.Item>
      </Form>
      <List
        loading={loading}
        bordered
        dataSource={categories}
        locale={{ emptyText: 'No categories found.' }}
        renderItem={cat => (
          <List.Item
            actions={[
              <Button key="edit" type="link" onClick={() => handleEdit(cat)}>
                Edit
              </Button>,
              <Button key="delete" type="link" danger onClick={() => handleDelete(cat.id)}>
                Delete
              </Button>,
            ]}
          >
            {cat.name}
          </List.Item>
        )}
      />
      <Modal
        title="Edit Category"
        open={modalVisible}
        onOk={handleUpdate}
        onCancel={() => { setModalVisible(false); setEditingId(null); }}
        okText="Save"
        cancelText="Cancel"
      >
        <Input
          value={editingName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingName(e.target.value)}
          placeholder="Category name"
          onPressEnter={handleUpdate}
        />
      </Modal>
    </div>
  );
};

export default CategoryManager; 