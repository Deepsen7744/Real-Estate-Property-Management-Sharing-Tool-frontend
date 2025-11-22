"use client";

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { apiRequest } from '@/lib/api';
import type { Role, User } from '@/types';
import { useAuth } from '@/context/AuthContext';

type EmployeeFormState = {
  name: string;
  email: string;
  password: string;
  role: Role;
};

const defaultForm: EmployeeFormState = {
  name: '',
  email: '',
  password: '',
  role: 'residential',
};

export default function EmployeesPage() {
  const { token, user } = useAuth();
  const [form, setForm] = useState<EmployeeFormState>(defaultForm);
  const [employees, setEmployees] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const fetchEmployees = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await apiRequest<User[]>('/api/users', { token });
      setEmployees(data.filter((item) => item.role !== 'admin'));
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormLoading(true);
    try {
      await apiRequest('/api/users', { method: 'POST', body: form, token });
      toast.success('Employee created');
      setForm(defaultForm);
      fetchEmployees();
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this employee?')) return;
    try {
      await apiRequest(`/api/users/${id}`, { method: 'DELETE', token });
      toast.success('Employee removed');
      fetchEmployees();
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  if (user?.role !== 'admin') {
    return <p className="card text-center text-sm text-slate-500">Only admins can manage employees.</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Employees</h1>
        <p className="text-sm text-slate-500">Create, update, and delete employee accounts.</p>
      </div>
      <form className="card grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <label className="text-sm font-medium text-slate-700">
          Full name
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2"
          />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Email
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2"
          />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Temporary password
          <input
            required
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2"
          />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Role
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2"
          >
            <option value="residential">Residential employee</option>
            <option value="commercial">Commercial employee</option>
          </select>
        </label>
        <div className="md:col-span-2">
          <button type="submit" className="btn-primary w-full md:w-auto" disabled={formLoading}>
            {formLoading ? 'Saving...' : 'Add Employee'}
          </button>
        </div>
      </form>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <p className="px-4 py-6 text-center text-sm text-slate-500">Loading employees...</p>
        ) : (
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map((employee) => (
                <tr key={employee.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{employee.name}</td>
                  <td className="px-4 py-3 text-slate-600">{employee.email}</td>
                  <td className="px-4 py-3 text-slate-600 capitalize">{employee.role}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(employee.id)}
                      className="text-sm font-semibold text-rose-500 hover:text-rose-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {!employees.length && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-sm text-slate-500">
                    No employees yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

