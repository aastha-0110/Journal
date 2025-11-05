'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import { useUser } from '@/components/providers/user-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Plus, CalendarDays, Check } from 'lucide-react';
import Link from 'next/link';

type Task = {
  _id: string;
  userId: string;
  title: string;
  notes?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export default function TasksPage() {
  const { user, isLoading } = useUser();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState<string>('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [isPending, startTransition] = useTransition();

  // like your Journal page
  const [refreshKey, setRefreshKey] = useState(0);

  const filtered = useMemo(() => {
    if (filter === 'active') return tasks.filter(t => !t.completed);
    if (filter === 'completed') return tasks.filter(t => t.completed);
    return tasks;
  }, [tasks, filter]);

  async function loadTasks(uid: string) {
    const res = await fetch(`/api/tasks?userId=${uid}`, { cache: 'no-store' });
    const json = await res.json();
    // API shape: { success: boolean, data: Task[] }
    setTasks(Array.isArray(json?.data) ? json.data : []);
  }

  useEffect(() => {
    if (user?._id) loadTasks(user._id);
  }, [user?._id, refreshKey]); // ← refetch like Journal when key changes

  async function addTask() {
    if (!user?._id || !title.trim()) return;

    // optimistic insert
    const optimistic: Task = {
      _id: `tmp-${Date.now()}`,
      userId: user._id,
      title: title.trim(),
      notes: notes || '',
      dueDate: dueDate || undefined,
      priority,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [optimistic, ...prev]);

    // clear inputs immediately
    setTitle(''); setNotes(''); setDueDate(''); setPriority('medium');

    // real POST
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user._id,
        title: optimistic.title,
        notes: optimistic.notes || undefined,
        dueDate: optimistic.dueDate || undefined,
        priority: optimistic.priority,
      }),
    });
    const json = await res.json();

    if (!res.ok || !json?.success || !json?.data) {
      // rollback on fail
      setTasks(prev => prev.filter(t => t._id !== optimistic._id));
      return;
    }

    const created: Task = json.data;

    // swap temp with real doc
    setTasks(prev => {
      const withoutTmp = prev.filter(t => t._id !== optimistic._id);
      return [created, ...withoutTmp];
    });

    // stay in sync (same idea as Journal refreshKey)
    setRefreshKey(k => k + 1);
  }

  async function toggleComplete(id: string, completed: boolean) {
    // optimistic flip
    setTasks(prev => prev.map(t => (t._id === id ? { ...t, completed } : t)));

    const res = await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed }),
    });

    if (!res.ok) {
      // rollback on failure
      setTasks(prev => prev.map(t => (t._id === id ? { ...t, completed: !completed } : t)));
      return;
    }
    // re-sync from server
    setRefreshKey(k => k + 1);
  }

  async function updateTitle(id: string, newTitle: string) {
    const t = newTitle.trim();
    if (!t) return;

    // optimistic rename
    setTasks(prev => prev.map(task => (task._id === id ? { ...task, title: t } : task)));

    const res = await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: t }),
    });

    if (!res.ok) {
      // optional: reload on failure
      setRefreshKey(k => k + 1);
      return;
    }
    setRefreshKey(k => k + 1);
  }

  async function deleteTask(id: string) {
    const keep = tasks;
    // optimistic remove
    setTasks(prev => prev.filter(t => t._id !== id));

    const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      // rollback
      setTasks(keep);
      return;
    }
    setRefreshKey(k => k + 1);
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-muted-foreground">Loading tasks…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-lg sm:text-xl text-muted-foreground font-medium text-center">
  Please{' '}
  <Link 
    href="/" 
    className="text-primary font-semibold underline hover:text-primary/80 transition-colors"
  >
    log in
  </Link>{' '}
  to view your journal
</p>



      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Tasks</h1>
          <p className="text-muted-foreground">Plan your day and track progress.</p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={(v: any) => setFilter(v)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Add Task */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">Add a task</CardTitle>
          <CardDescription>Keep it short and actionable.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <div className="md:col-span-2">
            <Input
              placeholder="Task title (e.g., Write 3 journal lines)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') addTask(); }}
            />
          </div>
          <div className="md:col-span-2">
            <Textarea
              placeholder="Notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-full">
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
              <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Button onClick={addTask} disabled={!title.trim() || isPending}>
              <Plus className="mr-2 h-4 w-4" /> Add Task
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* List */}
      <div className="grid gap-3">
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No tasks yet — add your first one!
            </CardContent>
          </Card>
        ) : (
          filtered.map((t) => (
            <Card key={t._id} className="group">
              <CardContent className="py-4 flex items-start gap-3">
                <Checkbox
                  checked={t.completed}
                  onCheckedChange={(val) => toggleComplete(t._id, Boolean(val))}
                  className="mt-1"
                />
                <div className="flex-1">
                  <InlineEditableTitle
                    text={t.title}
                    onSave={(newText) => updateTitle(t._id, newText)}
                    completed={t.completed}
                  />
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    {t.priority && <span className="capitalize">Priority: {t.priority}</span>}
                    {t.dueDate && <span>Due: {new Date(t.dueDate).toLocaleDateString()}</span>}
                  </div>
                  {t.notes && <p className="mt-2 text-sm text-muted-foreground">{t.notes}</p>}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteTask(t._id)}
                  className="opacity-70 hover:opacity-100"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

/* --- tiny inline editor --- */
function InlineEditableTitle({
  text,
  onSave,
  completed,
}: {
  text: string;
  onSave: (t: string) => void;
  completed: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(text);
  useEffect(() => setValue(text), [text]);

  if (!editing) {
    return (
      <button
        className={`text-base sm:text-lg font-medium text-left ${
          completed ? 'line-through text-muted-foreground' : ''
        }`}
        onClick={() => setEditing(true)}
        title="Click to edit title"
      >
        {text}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        value={value}
        autoFocus
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            if (value.trim()) onSave(value.trim());
            setEditing(false);
          } else if (e.key === 'Escape') {
            setValue(text);
            setEditing(false);
          }
        }}
      />
      <Button
        variant="secondary"
        size="icon"
        onClick={() => {
          if (value.trim()) onSave(value.trim());
          setEditing(false);
        }}
        title="Save"
      >
        <Check className="h-4 w-4" />
      </Button>
    </div>
  );
}
