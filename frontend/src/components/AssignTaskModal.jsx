import { useState, useEffect } from 'react';
import './Modal.css';

function AssignTaskModal({ isOpen, onClose, onSubmit, children, tasks }) {
  const [selectedChild, setSelectedChild] = useState('');
  const [selectedTask, setSelectedTask] = useState('');
  const [points, setPoints] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedChild && selectedTask && points > 0) {
      onSubmit({ 
        child_id: parseInt(selectedChild), 
        task_id: parseInt(selectedTask), 
        points: parseInt(points) }, 
        editData?.id);
      setSelectedChild('');
      setSelectedTask('');
      setPoints('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>שיוך משימה לילד</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>בחר ילד</label>
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              required
            >
              <option value="">-- בחר ילד --</option>
              {children.map(child => (
                <option key={child.id} value={child.id}>
                  {child.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>בחר משימה</label>
            <select
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
              required
            >
              <option value="">-- בחר משימה --</option>
              {tasks.map(task => (
                <option key={task.id} value={task.id}>
                  {task.icon} {task.name} ({task.category})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>נקודות</label>
            <input
              type="number"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              placeholder="הזן את מספר הנקודות"
              min="1"
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="modal-button secondary" onClick={onClose}>
              ביטול
            </button>
            <button type="submit" className="modal-button primary" >
              {editData ? 'עדכן הקצאה' : 'הקצה משימה'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AssignTaskModal;
