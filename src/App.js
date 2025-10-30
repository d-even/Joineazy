import React, { useEffect, useState } from 'react';
import './index.css';
import './styles.css';

import AssignmentCard from './components/AssignmentCard';
import AdminAssignmentRow from './components/AdminAssignmentRow';
import AssignmentForm from './components/AssignmentForm';
import ProgressBar from './components/ProgressBar';

import { readLS, writeLS } from './utils/localStorage';
import { sampleUsers, sampleAssignments } from './data/sampleData';

const LS = {
  USERS: 'joineazy_users_v1',
  ASSIGNMENTS: 'joineazy_assignments_v1',
};

export default function App() {
  const [users] = useState(() => readLS(LS.USERS, sampleUsers));
  const [assignments, setAssignments] = useState(() => readLS(LS.ASSIGNMENTS, sampleAssignments));
  const [currentUserId, setCurrentUserId] = useState((users[0] && users[0].id) || '');
  const [confirmPendingId, setConfirmPendingId] = useState(null);

  useEffect(() => writeLS(LS.ASSIGNMENTS, assignments), [assignments]);

  const currentUser = users.find((u) => u.id === currentUserId) || users[0] || { id: '', name: 'Unknown', role: 'student' };
  const students = users.filter((u) => u.role === 'student');

  function createAssignment({ title, dueDate, driveLink, assignedTo }) {
    const id = `a-${Date.now()}`;
    const submissions = {};
    (assignedTo || []).forEach((sid) => (submissions[sid] = false));
    const a = { id, title, dueDate, driveLink, creatorId: currentUser.id, assignedTo: assignedTo || [], submissions };
    setAssignments((s) => [a, ...s]);
  }

  function toggleSubmission(assignmentId, studentId) {
    setAssignments((prev) =>
      prev.map((a) => {
        if (a.id !== assignmentId) return a;
        const submissions = { ...(a.submissions || {}), [studentId]: !(a.submissions && a.submissions[studentId]) };
        return { ...a, submissions };
      })
    );
  }

  function handleStudentConfirmClick(assignmentId) {
    const a = assignments.find((x) => x.id === assignmentId);
    if (!a) return;
    const already = !!(a.submissions && a.submissions[currentUser.id]);
    if (already) return;

    if (confirmPendingId === assignmentId) {
      toggleSubmission(assignmentId, currentUser.id);
      setConfirmPendingId(null);
    } else {
      setConfirmPendingId(assignmentId);
      setTimeout(() => setConfirmPendingId((v) => (v === assignmentId ? null : v)), 6000);
    }
  }

  const studentAssignments = assignments
    .filter((a) => (a.assignedTo || []).includes(currentUser.id))
    .map((a) => ({ ...a, submitted: !!(a.submissions && a.submissions[currentUser.id]) }));

  const adminAssignments = assignments.filter((a) => a.creatorId === currentUser.id);

  return (
    <div className="app-root">
      <div className="container">
        <header className="app-header">
          <div>
            <h1>Joineazy — Assignment Dashboard</h1>
        
          </div>

          <div>
            <select value={currentUserId} onChange={(e) => setCurrentUserId(e.target.value)}>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{`${u.name} (${u.role})`}</option>
              ))}
            </select>
          </div>
        </header>

        <main className="grid">
          <section className="main-col">
            {currentUser.role === 'student' && (
              <div>
                <h2>Your assignments</h2>
                <div className="stack">
                  {studentAssignments.length === 0 && <div className="muted">No assignments assigned to you.</div>}
                  {studentAssignments.map((a) => (
                    <AssignmentCard key={a.id} assignment={a} onConfirmClick={handleStudentConfirmClick} confirmPending={confirmPendingId === a.id} isStudentView />
                  ))}
                </div>
              </div>
            )}

            {currentUser.role === 'admin' && (
              <div>
                <h2>Assignments you created</h2>
                <div className="stack">
                  {adminAssignments.length === 0 && <div className="muted">No assignments created yet.</div>}
                  {adminAssignments.map((a) => (
                    <AdminAssignmentRow key={a.id} assignment={a} students={students} onToggleSubmission={toggleSubmission} />
                  ))}
                </div>
              </div>
            )}
          </section>

          <aside className="side-col">
            <div className="card">
              <div className="muted">Logged in as</div>
              <div className="strong">{currentUser.name} • {currentUser.role}</div>
            </div>

            {currentUser.role === 'admin' && (
              <AssignmentForm students={students} onCreate={createAssignment} />
            )}

            {currentUser.role === 'student' && (
              <div className="card">
                <h3>Progress</h3>
                <ProgressBar value={studentAssignments.length === 0 ? 0 : (studentAssignments.filter((a) => a.submitted).length / studentAssignments.length) * 100} />
                <div className="muted small">{studentAssignments.filter((a) => a.submitted).length}/{studentAssignments.length} completed</div>
              </div>
            )}
          </aside>
        </main>
      </div>
    </div>
  );
}
