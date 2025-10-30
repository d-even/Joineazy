import React, { useState } from 'react';

export default function AssignmentForm({ students, onCreate }) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [driveLink, setDriveLink] = useState('');
  const [assigned, setAssigned] = useState([]);

  function toggleStudent(id) {
    setAssigned((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  function submit(e) {
    e.preventDefault();
    if (!title || !dueDate) return alert('Please provide title and due date');
    onCreate({ title, dueDate, driveLink, assignedTo: assigned });
    setTitle('');
    setDueDate('');
    setDriveLink('');
    setAssigned([]);
  }

  return (
    <form onSubmit={submit} className="card">
      <h3 className="card-title">Create assignment</h3>

      <div className="form-row">
        <label className="label">Title</label>
        <input className="input" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div className="form-row">
        <label className="label">Due date</label>
        <input className="input" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      </div>

      <div className="form-row">
        <label className="label">Drive link</label>
        <input className="input" placeholder="Drive link (optional)" value={driveLink} onChange={(e) => setDriveLink(e.target.value)} />
      </div>

      <div className="form-row">
        <label className="label">Assign to</label>
        <div className="checkbox-list">
          {students.map((s) => (
            <label key={s.id} className="checkbox-item">
              <input type="checkbox" checked={assigned.includes(s.id)} onChange={() => toggleStudent(s.id)} /> {s.name}
            </label>
          ))}
        </div>
      </div>

      <div className="form-actions">
        <button className="btn-primary">Create</button>
      </div>
    </form>
  );
}
