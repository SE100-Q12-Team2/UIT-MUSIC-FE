import React, { useState, useEffect } from 'react';
import { adminApi, AdminGenre } from '@/core/api/admin.api';
import Pagination from '@/shared/components/Pagination';
import '@/styles/pagination.css';
import '@/styles/loading.css';
import '@/styles/genre-form.css';

const GenresTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [genres, setGenres] = useState<AdminGenre[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ genreName: '', description: '' });
  const [formErrors, setFormErrors] = useState<{ genreName?: string; description?: string }>({});
  const limit = 12;

  useEffect(() => {
    fetchGenres();
  }, [currentPage, searchQuery]);

  const fetchGenres = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await adminApi.getGenres(currentPage, limit, searchQuery || undefined);
      setGenres(response.data);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError('Failed to fetch genres');
      console.error('Error fetching genres:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddGenreClick = () => {
    setShowAddForm(true);
    setFormData({ genreName: '', description: '' });
    setFormErrors({});
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setFormData({ genreName: '', description: '' });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors: { genreName?: string; description?: string } = {};

    if (!formData.genreName.trim()) {
      errors.genreName = 'Genre name is required';
    } else if (formData.genreName.length > 100) {
      errors.genreName = 'Genre name must be less than 100 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitGenre = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await adminApi.createGenre({
        genreName: formData.genreName.trim(),
        description: formData.description.trim() || null,
      });

      // Refresh genres list
      await fetchGenres();
      handleCloseForm();
    } catch (err: any) {
      console.error('Error creating genre:', err);
      setFormErrors({
        genreName: err.response?.data?.message || 'Failed to create genre',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  return (
    <div className="genres-tab">
      {/* Header */}
      <div className="genres-tab__header">
        <div className="genres-tab__search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search genres..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="genres-tab__search-input"
          />
        </div>
        <button className="genres-tab__add-btn" onClick={handleAddGenreClick}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Genre
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">Loading genres...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="genres-tab__error">
          <p>{error}</p>
        </div>
      )}

      {/* Genres Grid */}
      {!isLoading && !error && (
        <>
          <div className="genres-grid">
            {genres.map((genre) => (
              <div key={genre.id} className="genre-card">
                <div className="genre-card__icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18V5l12-2v13" />
                    <circle cx="6" cy="18" r="3" />
                    <circle cx="18" cy="16" r="3" />
                  </svg>
                </div>
                <div className="genre-card__content">
                  <div className="genre-card__header">
                    <h3 className="genre-card__name">{genre.genreName}</h3>
                    <span className={`genre-card__status genre-card__status--${genre.isActive ? 'active' : 'inactive'}`}>
                      {genre.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="genre-card__description">{genre.description || 'No description'}</p>
                </div>
              </div>
            ))}
          </div>

          {genres.length === 0 && (
            <div className="genres-tab__empty">
              <p>No genres found</p>
            </div>
          )}

          {/* Pagination */}
          {genres.length > 0 && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      {/* Add Genre Modal */}
      {showAddForm && (
        <div className="genre-modal-overlay" onClick={handleCloseForm}>
          <div className="genre-modal" onClick={(e) => e.stopPropagation()}>
            <div className="genre-modal__header">
              <h2 className="genre-modal__title">Add New Genre</h2>
              <button className="genre-modal__close" onClick={handleCloseForm}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmitGenre}>
              <div className="genre-form__group">
                <label className="genre-form__label genre-form__label--required">
                  Genre Name
                </label>
                <input
                  type="text"
                  name="genreName"
                  value={formData.genreName}
                  onChange={handleInputChange}
                  className="genre-form__input"
                  placeholder="Enter genre name"
                  maxLength={100}
                />
                {formErrors.genreName && (
                  <p className="genre-form__error">{formErrors.genreName}</p>
                )}
              </div>

              <div className="genre-form__group">
                <label className="genre-form__label">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="genre-form__textarea"
                  placeholder="Enter genre description (optional)"
                />
                {formErrors.description && (
                  <p className="genre-form__error">{formErrors.description}</p>
                )}
              </div>

              <div className="genre-form__actions">
                <button
                  type="button"
                  className="genre-form__btn genre-form__btn--cancel"
                  onClick={handleCloseForm}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="genre-form__btn genre-form__btn--submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create Genre'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenresTab;
