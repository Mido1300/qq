'use client';

import { useState } from 'react';
import { useTasks } from '@/context/TaskContext';
import { Filter, Sort } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import DateRangeModal from '../modals/DateRangeModal';
import AddTaskModal from '../modals/AddTaskModal';

export default function TaskFilters() {
  const {
    filters,
    setFilters,
    sort,
    setSort,
    view,
    setView,
    undo,
    redo,
    canUndo,
    canRedo
  } = useTasks();

  const [showDateRangeModal, setShowDateRangeModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = e.target;

    if (id === 'date-filter' && value === 'custom') {
      setShowDateRangeModal(true);
      return;
    }

    // Reset dateRange when selecting a non-custom date filter
    if (id === 'date-filter') {
      setFilters({
        ...filters,
        date: value,
        dateRange: value === 'custom' ? filters.dateRange : { start: null, end: null }
      });
      return;
    }

    setFilters({ ...filters, [id.replace('-filter', '')]: value });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort({ ...sort, by: e.target.value as Sort['by'] });
  };

  const toggleSortDirection = () => {
    setSort({ ...sort, direction: sort.direction === 'asc' ? 'desc' : 'asc' });
  };

  const toggleView = (newView: 'list' | 'graph') => {
    if (view !== newView) {
      setView(newView);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowAddTaskModal(true)}
            className="bg-primary text-white py-2 px-4 rounded-lg shadow hover:shadow-md flex items-center transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            <span>Add Task</span>
          </button>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => toggleView('list')}
            className={`py-2 px-3 rounded-l-lg shadow ${view === 'list' ? 'bg-primary text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
            aria-label="List view"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>
          </button>
          <button
            onClick={() => toggleView('graph')}
            className={`py-2 px-3 rounded-r-lg shadow border-l ${view === 'graph' ? 'bg-primary text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
            aria-label="Graph view"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="3" x2="21" y1="15" y2="15"/><line x1="9" x2="9" y1="9" y2="21"/><line x1="15" x2="15" y1="9" y2="21"/></svg>
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex-1">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </span>
              <input
                id="search-input"
                type="text"
                className="block w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary text-base"
                placeholder="Search tasks..."
                value={filters.search || ''}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              id="category-filter"
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-base"
              value={filters.category || ''}
              onChange={handleFilterChange}
            >
              <option value="">All Categories</option>
              <option value="Development">Development</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Research">Research</option>
            </select>

            <select
              id="priority-filter"
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-base"
              value={filters.priority || ''}
              onChange={handleFilterChange}
            >
              <option value="">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <select
              id="status-filter"
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-base"
              value={filters.status || ''}
              onChange={handleFilterChange}
            >
              <option value="">All Status</option>
              <option value="Completed">Completed</option>
              <option value="Active">Active</option>
            </select>

            <select
              id="date-filter"
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-base"
              value={filters.dateRange?.start ? 'custom' : filters.date || ''}
              onChange={handleFilterChange}
            >
              <option value="">All Dates</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={undo}
              disabled={!canUndo}
              className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${!canUndo ? 'opacity-50 cursor-not-allowed' : ''}`}
              title="Undo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${!canRedo ? 'opacity-50 cursor-not-allowed' : ''}`}
              title="Redo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"/></svg>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Sort Options */}
      <div className="flex items-center justify-end mb-4">
        <label className="mr-2 text-sm font-medium">Sort By:</label>
        <select
          id="sort-select"
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-base"
          value={sort.by}
          onChange={handleSortChange}
        >
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
          <option value="title">Title</option>
          <option value="created">Created Date</option>
        </select>
        <button
          onClick={toggleSortDirection}
          className="ml-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label={sort.direction === 'asc' ? 'Sort ascending' : 'Sort descending'}
        >
          {sort.direction === 'asc' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/><path d="M11 12h4"/><path d="M11 16h7"/><path d="M11 20h10"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="M11 4h4"/><path d="M11 8h7"/><path d="M11 12h10"/></svg>
          )}
        </button>
      </div>

      <AnimatePresence>
        {showDateRangeModal && (
          <DateRangeModal
            isOpen={showDateRangeModal}
            onClose={() => setShowDateRangeModal(false)}
            onApply={(start, end) => {
              setFilters({
                ...filters,
                date: 'custom',
                dateRange: { start, end }
              });
              setShowDateRangeModal(false);
            }}
            initialStartDate={filters.dateRange?.start || ''}
            initialEndDate={filters.dateRange?.end || ''}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddTaskModal && (
          <AddTaskModal
            isOpen={showAddTaskModal}
            onClose={() => setShowAddTaskModal(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}