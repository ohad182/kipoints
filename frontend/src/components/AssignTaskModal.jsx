import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useEscapeKey } from '../hooks/useEscapeKey';
import './Modal.css';

function AssignTaskModal({ isOpen, onClose, onSubmit, onBulkSubmit, children, tasks, selectedTasks = [], allAssignments = [], preselectedTaskId = null }) {
  const { t } = useLanguage();
  const [selectedChild, setSelectedChild] = useState('');
  const [selectedTask, setSelectedTask] = useState('');
  const [points, setPoints] = useState('');

  const isBulkMode = selectedTasks.length > 0;

  useEscapeKey(isOpen, onClose);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setselectedchild('');
      setselectedTask('');
      setPoints('');
    } else if (preselectedTaskId) {
      // Set the preselected task when modal opens
      setSelectedTask(preselectedTaskId.toString());
    }
  }, [isopen, preselectedTaskId]);

  // Clear selected child when task changes(to avoid invalid state)
  useEffect(() => {
    if (selectedTask && selectedchild && selectedchild !== 'all') {
      // Check if the currently selected child is now disabled for the new task
      if (isTaskAssignedToChild(parseInt(selectedChild), parseInt(selectedTask))) {
        setSelectedChild('');
      }
    }
  }, [selectedTask]);

  // Helper function to check if a child already has a task assigned
  const isTaskAssignedToChild = (childId, taskId) => {
    return allAssignments.some(assignment =>
      assignment.child_id === childId && assignment.task_id === taskId
    );
  };

  // Helper function to check if child has any of the selected tasks
  const hasAnySelectedTask = (childId) => {
    return selectedTasks.some(taskId => isTaskAssignedToChild(childId, taskId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isBulkMode && selectedChild && points > 0) {
      onBulkSubmit(selectedChild, points);
      setSelectedChild('');
      setPoints('');
    } else if (selectedChild && selectedTask && points > 0) {
      onSubmit({
        child_id: selectedChild,
        task_id: parseInt(selectedTask),
        points: parseInt(points)
      });
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
          <h2>{isBulkMode ? t('modal.assignMultipleTasks') : t('modal.assignTask')}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('modal.selectChild')}</label>
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              required
            >
              <option value="">-- {t('modal.selectChild')} --</option>
              <option value="all">{t('modal.allChildren')}</option>
              {children.map(child => {
                const alreadyAssigned = isBulkMode
                  ? hasAnySelectedTask(child.id)
                  : (selectedTask && isTaskAssignedToChild(child.id, parseInt(selectedTask)));

                return (
                  <option
                    key={child.id}
                    value={child.id}
                    disabled={alreadyAssigned}
                  >
                    {child.name}{alreadyAssigned ? ` -- ${t('modal.alreadyAssigned')}` : ''}
                  </option>
                  );
              })}
            </select>
          </div>

          {isBulkMode ? (
            <div className="form-group">
              <label>{t('modal.selectedTasks')} ({selectedTasks.length})</label>
              <div className="selected-tasks-list">
                {tasks.filter(task => selectedTasks.includes(task.id)).map(task => (
                  <div key={task.id} className="selected-task-item">
                    <span>{task.icon} {task.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="form-group">
              <label>{t('modal.selectTask')}</label>
              <select
                value={selectedTask}
                onChange={(e) => setSelectedTask(e.target.value)}
                required
              >
                <option value="">-- {t('modal.selectTask')} --</option>
                {tasks.map(task => (
                  <option key={task.id} value={task.id}>
                    {task.icon} {task.name} ({t(`categories.${task.category}`)})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label>{t('modal.points')}</label>
            <input
              type="number"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              placeholder="10"
              min="1"
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="modal-button secondary" onClick={onClose}>
              {t('modal.cancel')}
            </button>
            <button
              type="submit"
              className="modal-button primary"
              disabled={isBulkMode ? (!selectedChild || !points) : (!selectedChild || !selectedTask || !points)}
            >
              {t('modal.assign')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AssignTaskModal;
