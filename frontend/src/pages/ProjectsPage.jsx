import { useCallback, useEffect, useState } from 'react'
import AppLayout from '../components/AppLayout'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAuth } from '../context/AuthContext'
import { getAuthErrorMessage } from '../services/authService'
import { addProjectMember, createProject, getProjects, removeProjectMember } from '../services/projectService'
import { getUsers } from '../services/userService'

function FlashNotice({ notice, onDismiss }) {
  if (!notice) return null
  const styles =
    notice.type === 'success'
      ? 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-100'
      : 'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-100'

  return (
    <div
      role="alert"
      className={`mb-4 flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${styles}`}
    >
      <span>{notice.text}</span>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 rounded p-0.5 hover:bg-black/5"
        aria-label="Dismiss"
      >
        x
      </button>
    </div>
  )
}

export default function ProjectsPage() {
  const { isAdmin } = useAuth()
  const [projects, setProjects] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [memberUpdatingId, setMemberUpdatingId] = useState('')
  const [newProjectName, setNewProjectName] = useState('')
  const [selectedUsersByProject, setSelectedUsersByProject] = useState({})
  const [listError, setListError] = useState('')
  const [notice, setNotice] = useState(null)

  const showNotice = useCallback((type, text) => {
    setNotice(text ? { type, text } : null)
  }, [])

  useEffect(() => {
    if (!notice) return
    const t = setTimeout(() => setNotice(null), 5000)
    return () => clearTimeout(t)
  }, [notice])

  const fetchProjects = useCallback(async () => {
    setListError('')
    try {
      const data = await getProjects()
      setProjects(data.projects || [])
    } catch (err) {
      setProjects([])
      setListError(getAuthErrorMessage(err, 'Could not load projects.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  useEffect(() => {
    if (!isAdmin) return
    let cancelled = false
    const loadUsers = async () => {
      try {
        const data = await getUsers()
        if (!cancelled) setUsers(data.users || [])
      } catch (err) {
        if (!cancelled) {
          setUsers([])
          showNotice('error', getAuthErrorMessage(err, 'Could not load users for team management.'))
        }
      }
    }
    loadUsers()
    return () => {
      cancelled = true
    }
  }, [isAdmin, showNotice])

  const handleCreateProject = async (event) => {
    event.preventDefault()
    if (!newProjectName.trim()) return

    setCreating(true)
    try {
      await createProject({ name: newProjectName.trim() })
      setNewProjectName('')
      showNotice('success', 'Project created successfully.')
      await fetchProjects()
    } catch (err) {
      showNotice('error', getAuthErrorMessage(err, 'Could not create project.'))
    } finally {
      setCreating(false)
    }
  }

  const replaceProject = (updatedProject) => {
    setProjects((prev) =>
      prev.map((project) => (project._id === updatedProject._id ? updatedProject : project)),
    )
  }

  const handleSelectedUserChange = (projectId, userId) => {
    setSelectedUsersByProject((prev) => ({ ...prev, [projectId]: userId }))
  }

  const handleAddMember = async (projectId) => {
    const userId = selectedUsersByProject[projectId]
    if (!userId) return

    setMemberUpdatingId(`${projectId}:add`)
    try {
      const data = await addProjectMember(projectId, userId)
      replaceProject(data.project)
      setSelectedUsersByProject((prev) => ({ ...prev, [projectId]: '' }))
      showNotice('success', 'Member added to project.')
    } catch (err) {
      showNotice('error', getAuthErrorMessage(err, 'Could not add member.'))
    } finally {
      setMemberUpdatingId('')
    }
  }

  const handleRemoveMember = async (projectId, userId) => {
    setMemberUpdatingId(`${projectId}:${userId}`)
    try {
      const data = await removeProjectMember(projectId, userId)
      replaceProject(data.project)
      showNotice('success', 'Member removed from project.')
    } catch (err) {
      showNotice('error', getAuthErrorMessage(err, 'Could not remove member.'))
    } finally {
      setMemberUpdatingId('')
    }
  }

  return (
    <AppLayout title="Projects">
      <FlashNotice notice={notice} onDismiss={() => setNotice(null)} />

      {isAdmin && (
        <form onSubmit={handleCreateProject} className="mb-6 rounded-xl border border-blue-100 bg-white p-4 shadow-sm dark:border-blue-950 dark:bg-neutral-950">
          <h3 className="mb-3 text-lg font-semibold text-slate-950 dark:text-white">Create New Project</h3>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder="Project name"
              value={newProjectName}
              onChange={(event) => setNewProjectName(event.target.value)}
              className="flex-1 rounded-lg border border-blue-200 bg-white px-3 py-2 text-slate-900 outline-none ring-blue-500 focus:ring dark:border-blue-900 dark:bg-black dark:text-slate-100"
            />
            <button
              type="submit"
              disabled={creating}
              className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {creating ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <LoadingSpinner label="Loading projects..." />
      ) : (
        <>
          {listError && (
            <p className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-100">{listError}</p>
          )}
          <div className="grid gap-4 md:grid-cols-2">
            {projects.map((project) => (
              <div key={project._id} className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm dark:border-blue-950 dark:bg-neutral-950">
                <h3 className="text-lg font-semibold text-slate-950 dark:text-white">{project.name}</h3>
                <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">Members</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(project.members || []).map((member) => (
                    <span key={member._id} className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-200">
                      <span>{member.name}</span>
                      {isAdmin && String(project.createdBy) !== String(member._id) && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(project._id, member._id)}
                          disabled={memberUpdatingId === `${project._id}:${member._id}`}
                          className="rounded-full px-1 text-blue-500 transition hover:bg-blue-100 hover:text-blue-700 disabled:opacity-50 dark:text-blue-300 dark:hover:bg-blue-900"
                          aria-label={`Remove ${member.name} from ${project.name}`}
                        >
                          x
                        </button>
                      )}
                    </span>
                  ))}
                </div>
                {isAdmin && (
                  <div className="mt-4 flex flex-col gap-2 border-t border-blue-100 pt-4 dark:border-blue-950 sm:flex-row">
                    <select
                      value={selectedUsersByProject[project._id] || ''}
                      onChange={(event) => handleSelectedUserChange(project._id, event.target.value)}
                      className="min-w-0 flex-1 rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-blue-500 focus:ring dark:border-blue-900 dark:bg-black dark:text-slate-100"
                      aria-label={`Select user for ${project.name}`}
                    >
                      <option value="">Select member</option>
                      {users
                        .filter(
                          (user) =>
                            !(project.members || []).some((member) => String(member._id) === String(user._id)),
                        )
                        .map((user) => (
                          <option key={user._id} value={user._id}>
                            {user.name} ({user.role})
                          </option>
                        ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => handleAddMember(project._id)}
                      disabled={!selectedUsersByProject[project._id] || memberUpdatingId === `${project._id}:add`}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Add Member
                    </button>
                  </div>
                )}
              </div>
            ))}
            {!projects.length && !listError && (
              <div className="rounded-xl border border-dashed border-blue-200 bg-white p-8 text-center text-slate-500 dark:border-blue-900 dark:bg-neutral-950 dark:text-slate-400">
                No projects found.
              </div>
            )}
          </div>
        </>
      )}
    </AppLayout>
  )
}
