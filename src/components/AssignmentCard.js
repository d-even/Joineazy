import React from 'react';

export default function AssignmentCard({ assignment, onConfirmClick, confirmPending, isStudentView }) {
  const submitted = assignment.submitted;
  return (
    <article className="card">
      <div className="card-main">
        <div>
          <h3 className="card-title">{assignment.title}</h3>
          <p className="muted">Due: {assignment.dueDate}</p>
          {assignment.driveLink && (
            <a className="link" href={assignment.driveLink} target="_blank" rel="noreferrer">Submission Link</a>
          )}
        </div>

        <div className="card-status">
          <div className="muted">Status</div>
          <div className="status-text">{submitted ? 'Submitted' : 'Not submitted'}</div>
        </div>
      </div>

      {isStudentView && (
        <div className="card-actions">
          <button className={confirmPending ? 'btn-warning' : 'btn'} onClick={() => onConfirmClick(assignment.id)}>
            {submitted ? 'Submitted' : confirmPending ? 'Confirm final' : "Yes, I've submitted"}
          </button>
        </div>
      )}
    </article>
  );
}
