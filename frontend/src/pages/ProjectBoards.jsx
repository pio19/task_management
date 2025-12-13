import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import KanbanColumn from "../components/KanbanColumn";
import TaskModal from "../components/TaskModal";
import TaskFormModal from "../components/TaskFormModal";
import InviteModal from "../components/InviteModal";

const COLUMNS = [
  { key: "todo", title: "To Do" },
  { key: "in_progress", title: "In Progress" },
  { key: "done", title: "Done" },
];

export default function ProjectBoard() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [openTaskId, setOpenTaskId] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.get("/projects").then(setProjects);
    api.get(`/projects/${id}`).then(setProject);
    api
      .get(`/projects/${id}/tasks`)
      .then((data) => {
        console.log("fetched tasks for project", id, data); // <-- kiểm tra ở đây
        setTasks(data);
      })
      .catch((err) => console.error("fetch tasks error", err));
  }, [id]);
  api.get(`/projects/${id}/tasks`).then((data) => {
    const normalized = (data || []).map((t) => ({
      ...t,
      status: String(t.status || "")
        .trim()
        .toLowerCase(),
    }));
    setTasks(normalized);
  });

  const openTask = (task) => setOpenTaskId(task.id);
  const closeModal = () => setOpenTaskId(null);
  const moveTask = async (taskId, toStatus) => {
    const prev = tasks;
    setTasks(
      prev.map((t) => (t.id === taskId ? { ...t, status: toStatus } : t))
    );
    try {
      await api.patch(`/tasks/${taskId}`, { status: toStatus, version: 1 });
    } catch (e) {
      alert("Cập nhật thất bại (mock)");
      const refreshed = await api.get(`/projects/${id}/tasks`);
      setTasks(refreshed);
    }
  };

  const afterCreate = (newTask) => {
    setTasks([newTask, ...tasks]);
  };

  const afterInvite = (inv) => {
    alert("Đã gửi lời mời (mock) tới " + inv.email);
  };

  return (
    <div style={{ display: "flex", gap: 12 }}>
      <Sidebar projects={projects} />
      <div style={{ flex: 1 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <h2>{project ? project.name : "Dự án"}</h2>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn" onClick={() => setShowCreate(true)}>
              Tạo nhiệm vụ
            </button>
            <button className="btn" onClick={() => setShowInvite(true)}>
              Mời thành viên
            </button>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          {COLUMNS.map((col) => (
            <div key={col.key} style={{ flex: 1 }}>
              <KanbanColumn
                title={col.title}
                tasks={tasks.filter((t) => t.status === col.key)}
                onOpen={openTask}
                onMove={moveTask}
              />
            </div>
          ))}
        </div>
      </div>

      {openTaskId && (
        <TaskModal
          taskId={openTaskId}
          onClose={closeModal}
          onUpdated={() => api.get(`/projects/${id}/tasks`).then(setTasks)}
        />
      )}
      {showCreate && (
        <TaskFormModal
          projectId={id}
          onClose={() => setShowCreate(false)}
          onCreated={afterCreate}
        />
      )}
      {showInvite && (
        <InviteModal
          projectId={id}
          onClose={() => setShowInvite(false)}
          onInvited={afterInvite}
        />
      )}
    </div>
  );
}
