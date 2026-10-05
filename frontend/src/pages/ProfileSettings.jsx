import React, { useEffect, useState } from "react";
import "../styles/profileSettings.css";
import {
  getProfile,
  updateProfile,
} from "../services/profileService";

const initialForm = {
  name: "",
  email: "",
  role: "",
  headline: "",
  bio: "",
  location: "",
  phone: "",
  targetRole: "",
  preferredWorkMode: "Flexible",
  careerInterests: "",
  linkedin: "",
  github: "",
  portfolio: "",
};

function ProfileSettings() {
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProfile();
        const user = data.user || {};

        setFormData({
          name: user.name || "",
          email: user.email || "",
          role: user.role || "user",
          headline: user.headline || "",
          bio: user.bio || "",
          location: user.location || "",
          phone: user.phone || "",
          targetRole: user.targetRole || "",
          preferredWorkMode:
            user.preferredWorkMode || "Flexible",
          careerInterests: Array.isArray(user.careerInterests)
            ? user.careerInterests.join(", ")
            : "",
          linkedin: user.links?.linkedin || "",
          github: user.links?.github || "",
          portfolio: user.links?.portfolio || "",
        });
      } catch (err) {
        console.error("Profile loading error:", err);
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        name: formData.name,
        headline: formData.headline,
        bio: formData.bio,
        location: formData.location,
        phone: formData.phone,
        targetRole: formData.targetRole,
        preferredWorkMode: formData.preferredWorkMode,
        careerInterests: formData.careerInterests
          .split(",")
          .map((interest) => interest.trim())
          .filter(Boolean),
        links: {
          linkedin: formData.linkedin,
          github: formData.github,
          portfolio: formData.portfolio,
        },
      };

      const data = await updateProfile(payload);

      const user = data.user || {};

      setFormData((previous) => ({
        ...previous,
        name: user.name || previous.name,
        headline: user.headline || "",
        bio: user.bio || "",
        location: user.location || "",
        phone: user.phone || "",
        targetRole: user.targetRole || "",
        preferredWorkMode:
          user.preferredWorkMode || "Flexible",
        careerInterests: Array.isArray(user.careerInterests)
          ? user.careerInterests.join(", ")
          : "",
        linkedin: user.links?.linkedin || "",
        github: user.links?.github || "",
        portfolio: user.links?.portfolio || "",
      }));

      setSuccess("Profile updated successfully.");
    } catch (err) {
      console.error("Profile update error:", err);
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-settings-page">
        <div className="profile-empty-state">
          <h2>Loading profile...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-settings-page">
      <div className="profile-settings-header">
        <div>
          <p className="profile-eyebrow">
            Account & Career
          </p>

          <h1>Profile & Settings</h1>

          <p className="profile-description">
            Keep your personal information and career
            preferences up to date.
          </p>
        </div>
      </div>

      {error && (
        <div className="profile-message profile-error">
          {error}
        </div>
      )}

      {success && (
        <div className="profile-message profile-success">
          {success}
        </div>
      )}

      <form
        className="profile-form"
        onSubmit={handleSubmit}
      >
        <section className="profile-section">
          <div className="profile-section-header">
            <h2>Basic Information</h2>
            <p>Your primary account and profile details.</p>
          </div>

          <div className="profile-grid">
            <div className="profile-group">
              <label htmlFor="name">Full Name</label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="profile-group">
              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                type="email"
                value={formData.email}
                disabled
              />

              <small>
                Email is managed through your account.
              </small>
            </div>

            <div className="profile-group">
              <label htmlFor="headline">
                Professional Headline
              </label>

              <input
                id="headline"
                name="headline"
                type="text"
                value={formData.headline}
                onChange={handleChange}
                placeholder="e.g. IT Student | AI/ML | Data Science"
              />
            </div>

            <div className="profile-group">
              <label htmlFor="location">
                Location
              </label>

              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Ahmedabad, Gujarat"
              />
            </div>

            <div className="profile-group">
              <label htmlFor="phone">
                Phone
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone number"
              />
            </div>

            <div className="profile-group">
              <label htmlFor="role">
                Account Role
              </label>

              <input
                id="role"
                type="text"
                value={formData.role}
                disabled
              />
            </div>

            <div className="profile-group full-width">
              <label htmlFor="bio">
                Bio
              </label>

              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself..."
                rows="5"
              />
            </div>
          </div>
        </section>

        <section className="profile-section">
          <div className="profile-section-header">
            <h2>Career Preferences</h2>
            <p>
              Customize your career direction and work preferences.
            </p>
          </div>

          <div className="profile-grid">
            <div className="profile-group">
              <label htmlFor="targetRole">
                Target Role
              </label>

              <input
                id="targetRole"
                name="targetRole"
                type="text"
                value={formData.targetRole}
                onChange={handleChange}
                placeholder="e.g. Data Engineer"
              />
            </div>

            <div className="profile-group">
              <label htmlFor="preferredWorkMode">
                Preferred Work Mode
              </label>

              <select
                id="preferredWorkMode"
                name="preferredWorkMode"
                value={formData.preferredWorkMode}
                onChange={handleChange}
              >
                <option value="Remote">
                  Remote
                </option>

                <option value="Hybrid">
                  Hybrid
                </option>

                <option value="On-site">
                  On-site
                </option>

                <option value="Flexible">
                  Flexible
                </option>
              </select>
            </div>

            <div className="profile-group full-width">
              <label htmlFor="careerInterests">
                Career Interests
              </label>

              <input
                id="careerInterests"
                name="careerInterests"
                type="text"
                value={formData.careerInterests}
                onChange={handleChange}
                placeholder="AI/ML, Data Science, Full Stack Development"
              />

              <small>
                Separate interests with commas.
              </small>
            </div>
          </div>
        </section>

        <section className="profile-section">
          <div className="profile-section-header">
            <h2>Professional Links</h2>
            <p>
              Add links that you want associated with your profile.
            </p>
          </div>

          <div className="profile-grid">
            <div className="profile-group full-width">
              <label htmlFor="linkedin">
                LinkedIn
              </label>

              <input
                id="linkedin"
                name="linkedin"
                type="url"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="https://www.linkedin.com/in/..."
              />
            </div>

            <div className="profile-group full-width">
              <label htmlFor="github">
                GitHub
              </label>

              <input
                id="github"
                name="github"
                type="url"
                value={formData.github}
                onChange={handleChange}
                placeholder="https://github.com/..."
              />
            </div>

            <div className="profile-group full-width">
              <label htmlFor="portfolio">
                Portfolio
              </label>

              <input
                id="portfolio"
                name="portfolio"
                type="url"
                value={formData.portfolio}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
          </div>
        </section>

        <div className="profile-form-actions">
          <button
            type="submit"
            className="primary-button"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProfileSettings;