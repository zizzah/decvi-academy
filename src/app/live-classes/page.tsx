'use client';

import React, { useState, useEffect } from 'react';
import { Video, Calendar, Clock, Users, Plus, Play, Edit, Trash2, ExternalLink } from 'lucide-react';
import Pusher from 'pusher-js';

// Type Definitions
type LiveClassStatus = 'SCHEDULED' | 'LIVE' | 'COMPLETED' | 'CANCELLED';

interface Cohort {
  id: number;
  name: string;
}

interface Instructor {
  id: number;
  firstName: string;
  lastName: string;
  photoUrl: string | null;
}

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  photoUrl: string | null;
}

interface Enrollment {
  id: string;
  liveClassId: string;
  studentId: number;
  attended: boolean;
  student: Student;
}

interface LiveClass {
  id: number;
  title: string;
  description: string | null;
  cohortId: number;
  instructorId: number;
  scheduledAt: string;
  duration: number;
  meetingLink: string | null;
  maxStudents: number | null;
  status: LiveClassStatus;
  cohort: Cohort;
  instructor: Instructor;
  enrollments: Enrollment[];
  _count: {
    enrollments: number;
  };
}

interface Course {
  id: string;
  name: string;
}

interface FormData {
  title: string;
  description: string;
  courseId: string;
  scheduledAt: string;
  duration: number;
  meetingLink: string;
  maxStudents: string;
}

type UserRole = 'Instructor' | 'Student';

const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY || '', {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || '',
});

export default function LiveClassManagement() {
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState<LiveClass | null>(null);
  const [loading, setLoading] = useState(false);
  const [userRole] = useState<UserRole>('Instructor');
  const [courses] = useState<Course[]>([
    { id: 'cohort-1-web-dev', name: 'Web Development' },
    { id: 'cohort-1-web-dev', name: 'Data Science' },
  ]);

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    courseId: '',
    scheduledAt: '',
    duration: 60,
    meetingLink: '',
    maxStudents: '',
  });

  useEffect(() => {
    fetchLiveClasses();
    
    // Debug: Check if we're authenticated
    fetch('/api/auth/me', { credentials: 'same-origin' })
      .then(res => res.json())
      .then(data => console.log('Current user:', data))
      .catch(err => console.error('Auth check failed:', err));
  }, []);

  // Subscribe to live class updates
  useEffect(() => {
    const channels: Record<number, ReturnType<typeof pusher.subscribe>> = {};

    liveClasses.forEach((liveClass) => {
      const channel = pusher.subscribe(`live-class-${liveClass.id}`);
      channels[liveClass.id] = channel;
      
      channel.bind('class-started', () => {
        alert(`Live class "${liveClass.title}" has started!`);
        fetchLiveClasses();
      });

      channel.bind('class-updated', (updatedClass: LiveClass) => {
        setLiveClasses((prev) =>
          prev.map((c) => (c.id === updatedClass.id ? updatedClass : c))
        );
      });
    });

    return () => {
      Object.values(channels).forEach((channel) => {
        channel.unbind_all();
        channel.unsubscribe();
      });
    };
  }, [liveClasses]);

  const fetchLiveClasses = async () => {
    try {
      const res = await fetch('/api/live-classes', {
        credentials: 'same-origin',
      });
      if (!res.ok) throw new Error('Failed to fetch live classes');
      const data: LiveClass[] = await res.json();
      setLiveClasses(data);
    } catch (error) {
      console.error('Error fetching live classes:', error);
    }
  };

  const createLiveClass = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/live-classes', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify(formData),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create live class');
      }
      
      const newClass: LiveClass = await res.json();
      setLiveClasses([newClass, ...liveClasses]);
      setShowCreateModal(false);
      resetForm();
      alert('Live class created successfully!');
    } catch (error) {
      console.error('Error creating live class:', error);
      alert(error instanceof Error ? error.message : 'Failed to create live class');
    } finally {
      setLoading(false);
    }
  };

  const startLiveClass = async (classId: number) => {
    try {
      const res = await fetch(`/api/live-classes/${classId}/start`, {
        method: 'POST',
        credentials: 'same-origin',
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to start class');
      }
      
      const updatedClass: LiveClass = await res.json();
      setLiveClasses(
        liveClasses.map((c) => (c.id === classId ? updatedClass : c))
      );
      
      // Open meeting link
      if (updatedClass.meetingLink) {
        window.open(updatedClass.meetingLink, '_blank');
      }
    } catch (error) {
      console.error('Error starting class:', error);
      alert(error instanceof Error ? error.message : 'Failed to start class');
    }
  };

  const enrollInClass = async (classId: number) => {
    try {
      const res = await fetch(`/api/live-classes/${classId}/enroll`, {
        method: 'POST',
        credentials: 'same-origin',
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to enroll in class');
      }
      
      fetchLiveClasses();
      alert('Successfully enrolled in class!');
    } catch (error) {
      console.error('Error enrolling in class:', error);
      alert(error instanceof Error ? error.message : 'Failed to enroll in class');
    }
  };

  const deleteClass = async (classId: number) => {
    if (!confirm('Are you sure you want to delete this class?')) return;

    try {
      const res = await fetch(`/api/live-classes/${classId}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete class');
      }
      
      setLiveClasses(liveClasses.filter((c) => c.id !== classId));
      alert('Class deleted successfully!');
    } catch (error) {
      console.error('Error deleting class:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete class');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      courseId: '',
      scheduledAt: '',
      duration: 60,
      meetingLink: '',
      maxStudents: '',
    });
  };

  const getStatusColor = (status: LiveClassStatus): string => {
    switch (status) {
      case 'LIVE':
        return 'bg-red-500 text-white';
      case 'SCHEDULED':
        return 'bg-blue-500 text-white';
      case 'COMPLETED':
        return 'bg-gray-500 text-white';
      case 'CANCELLED':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-gray-300 text-gray-700';
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Video className="w-8 h-8 text-blue-600" />
              Live Classes
            </h1>
            <p className="text-gray-600 mt-2">
              {userRole === 'Instructor'
                ? 'Manage your live classes and schedule new sessions'
                : 'Join live classes and view your schedule'}
            </p>
          </div>
          {userRole === 'Instructor' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              Create Live Class
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <button className="px-4 py-2 bg-white border-2 border-blue-600 text-blue-600 rounded-lg font-medium">
            All Classes
          </button>
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:border-blue-600">
            Scheduled
          </button>
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:border-blue-600">
            Live Now
          </button>
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:border-blue-600">
            Completed
          </button>
        </div>

        {/* Live Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {liveClasses.map((liveClass) => (
            <div
              key={liveClass.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <div className="relative h-40 bg-gradient-to-r from-blue-500 to-purple-600">
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      liveClass.status
                    )}`}
                  >
                    {liveClass.status}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold">{liveClass.title}</h3>
                  <p className="text-sm opacity-90">{liveClass.cohort?.name || 'No cohort'}</p>
                </div>
              </div>

              <div className="p-4">
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {liveClass.description || 'No description provided'}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(liveClass.scheduledAt)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>
                      {formatTime(liveClass.scheduledAt)} • {liveClass.duration} min
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>
                      {liveClass._count?.enrollments || 0}
                      {liveClass.maxStudents && ` / ${liveClass.maxStudents}`} students
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {userRole === 'Instructor' ? (
                    <>
                      {liveClass.status === 'SCHEDULED' && (
                        <button
                          onClick={() => startLiveClass(liveClass.id)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          <Play className="w-4 h-4" />
                          Start
                        </button>
                      )}
                      {liveClass.status === 'LIVE' && liveClass.meetingLink && (
                        <button
                          onClick={() => window.open(liveClass.meetingLink!, '_blank')}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Join
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedClass(liveClass)}
                        className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteClass(liveClass.id)}
                        className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      {liveClass.status === 'LIVE' && liveClass.meetingLink && (
                        <button
                          onClick={() => window.open(liveClass.meetingLink!, '_blank')}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                          <Play className="w-4 h-4" />
                          Join Now
                        </button>
                      )}
                      {liveClass.status === 'SCHEDULED' && (
                        <button
                          onClick={() => enrollInClass(liveClass.id)}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Enroll
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {liveClasses.length === 0 && (
          <div className="text-center py-12">
            <Video className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">No live classes scheduled yet</p>
            {userRole === 'Instructor' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Your First Class
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-6">Create Live Class</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Introduction to React"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe what will be covered in this class..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course *
                </label>
                <select
                  value={formData.courseId}
                  onChange={(e) =>
                    setFormData({ ...formData, courseId: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Scheduled Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.scheduledAt}
                    onChange={(e) =>
                      setFormData({ ...formData, scheduledAt: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes) *
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: parseInt(e.target.value) || 60 })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="15"
                    step="15"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Link (Zoom, Google Meet, etc.)
                </label>
                <input
                  type="url"
                  value={formData.meetingLink}
                  onChange={(e) =>
                    setFormData({ ...formData, meetingLink: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://zoom.us/j/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Students (optional)
                </label>
                <input
                  type="number"
                  value={formData.maxStudents}
                  onChange={(e) =>
                    setFormData({ ...formData, maxStudents: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  placeholder="Leave empty for unlimited"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={createLiveClass}
                disabled={
                  loading ||
                  !formData.title ||
                  !formData.courseId ||
                  !formData.scheduledAt
                }
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Live Class'}
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}