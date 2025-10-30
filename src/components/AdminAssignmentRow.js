import React from 'react';
import ProgressBar from './ProgressBar';

export default function AdminAssignmentRow({ assignment, students, onToggleSubmission }) {
  const submittedCount = Object.values(assignment.submissions || {}).filter(Boolean).length;
  const total = (assignment.assignedTo && assignment.assignedTo.length) || 1;
  const percent = (submittedCount / total) * 100;

  return (
    <article className="card">
      <div className="card-main">
        <div>
          <h4 className="card-title">{assignment.title}</h4>
          <div className="muted">Due: {assignment.dueDate}</div>
          {assignment.driveLink && (
            <a className="link" href={assignment.driveLink} target="_blank" rel="noreferrer">Drive link</a>
          )}
        </div>

        <div className="admin-progress">
          <ProgressBar value={percent} />
          <div className="muted small">{Math.round(percent)}%</div>
        </div>
      </div>

      <div className="student-grid">
        {(assignment.assignedTo || []).map((sid) => {
          const student = students.find((s) => s.id === sid) || { name: sid };
          const sub = !!assignment.submissions?.[sid];
          return (
            <div key={sid} className="student-row">
              <div className="student-name">{student.name}</div>
              <div className="student-actions">
                <div className="muted tiny">{sub ? 'Submitted' : 'Not'}</div>
                <button className={`tiny-btn ${sub ? 'tiny-btn-danger' : 'tiny-btn-success'}`} onClick={() => onToggleSubmission(assignment.id, sid)}>
                  {sub ? 'Mark not' : 'Mark submitted'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}
