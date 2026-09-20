import { useEffect, useState } from 'react';
import './App.css';

const emptyService = {
  name: '',
  description: '',
  serviceType: '',
  price: '',
  currency: '',
};

const emptyForm = {
  name: '',
  description: '',
  location: '',
  contactEmail: '',
  services: [{ ...emptyService }],
};

function App() {
const [suppliers, setSuppliers] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');
const [showForm, setShowForm] = useState(false);
const [form, setForm] = useState({ ...emptyForm });
const [submitting, setSubmitting] = useState(false);
const [formError, setFormError] = useState('');
const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    fetch('/api/suppliers')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load suppliers.');
        }

        return response.json();
      })
      .then((data) => {
        setSuppliers(data);
      })
      .catch(() => {
        setError('Unable to load suppliers. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  function openForm() {
    setForm({ ...emptyForm, services: [{ ...emptyService }] });
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
  }

  function handleSupplierChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  function handleServiceChange(index, event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      services: currentForm.services.map((service, serviceIndex) =>
        serviceIndex === index
          ? { ...service, [name]: value }
          : service,
      ),
    }));
  }

  function addService() {
    setForm((currentForm) => ({
      ...currentForm,
      services: [
        ...currentForm.services,
        { ...emptyService },
      ],
    }));
  }

  function removeService(index) {
    setForm((currentForm) => ({
      ...currentForm,
      services: currentForm.services.filter(
        (_, serviceIndex) => serviceIndex !== index,
      ),
    }));
  }
  function validateForm() {
  const errors = {};

  if (!form.name.trim()) {
    errors.name = 'Supplier name is required.';
  }

  if (!form.description.trim()) {
    errors.description = 'Description is required.';
  }

  if (!form.location.trim()) {
    errors.location = 'Location is required.';
  }

  if (!form.contactEmail.trim()) {
    errors.contactEmail = 'Contact email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail)) {
    errors.contactEmail = 'Enter a valid email address.';
  }

  if (form.services.length === 0) {
    errors.services = 'At least one service is required.';
  }

  form.services.forEach((service, index) => {
    const serviceErrors = {};

    if (!service.name.trim()) {
      serviceErrors.name = 'Service name is required.';
    }

    if (!service.description.trim()) {
      serviceErrors.description = 'Service description is required.';
    }

    if (!service.serviceType.trim()) {
      serviceErrors.serviceType = 'Service type is required.';
    }

    if (service.price === '') {
      serviceErrors.price = 'Price is required.';
    } else if (Number(service.price) < 0) {
      serviceErrors.price = 'Price cannot be negative.';
    }

    if (!service.currency.trim()) {
      serviceErrors.currency = 'Currency is required.';
    } else if (service.currency.trim().length !== 3) {
      serviceErrors.currency = 'Currency must be 3 characters.';
    }

    if (Object.keys(serviceErrors).length > 0) {
      errors[`service-${index}`] = serviceErrors;
    }
  });

  return errors;
  }

  async function handleSubmit(event) {
  event.preventDefault();

  const errors = validateForm();

  if (Object.keys(errors).length > 0) {
    setValidationErrors(errors);
    return;
  }

  setValidationErrors({});
  setSubmitting(true);
  setFormError('');

  const payload = {
    ...form,
    services: form.services.map((service) => ({
      ...service,
      price: Number(service.price),
    })),
  };

  try {
    const response = await fetch('/api/suppliers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Failed to create supplier.');
    }

    setShowForm(false);
    setForm({ ...emptyForm, services: [{ ...emptyService }] });

    const suppliersResponse = await fetch('/api/suppliers');

    if (!suppliersResponse.ok) {
      setError('Supplier was created, but the supplier list could not be refreshed.');
      return;
    }

    const data = await suppliersResponse.json();
    setSuppliers(data);
  } catch (error) {
    setFormError(error.message);
  } finally {
    setSubmitting(false);
  }
}

  return (
    <main className="app">
      {!showForm ? (
        <>
          <header className="header">
            <div>
              <p className="eyebrow">TRAVELOGIC</p>
              <h1>Supplier Management</h1>
              <p className="subtitle">
                Manage tourism suppliers and the services they provide.
              </p>
            </div>

            <button
              className="primary-button"
              type="button"
              onClick={openForm}
            >
              + Add Supplier
            </button>
          </header>

          <section className="supplier-section">
            <div className="section-heading">
              <div>
                <h2>Suppliers</h2>
                <p>
                  {suppliers.length} supplier
                  {suppliers.length === 1 ? '' : 's'} available
                </p>
              </div>
            </div>

            {loading && (
              <div className="state-message">
                <p>Loading suppliers...</p>
              </div>
            )}

            {error && (
              <div className="state-message error">
                <p>{error}</p>
              </div>
            )}

            {!loading && !error && suppliers.length === 0 && (
              <div className="state-message">
                <p>No suppliers have been added yet.</p>
              </div>
            )}

            {!loading && !error && suppliers.length > 0 && (
              <div className="supplier-grid">
                {suppliers.map((supplier) => (
                  <article className="supplier-card" key={supplier.id}>
                    <div className="supplier-card-header">
                      <div>
                        <h3>{supplier.name}</h3>
                        <p className="location">{supplier.location}</p>
                      </div>
                    </div>

                    <p className="description">{supplier.description}</p>

                    <p className="contact">
                      <strong>Contact:</strong> {supplier.contactEmail}
                    </p>

                    <div className="services">
                      <h4>Services</h4>

                      {supplier.services.length === 0 ? (
                        <p className="no-services">No services listed.</p>
                      ) : (
                        <div className="service-list">
                          {supplier.services.map((service) => (
                            <div className="service" key={service.id}>
                              <div>
                                <h5>{service.name}</h5>
                                <span className="service-type">
                                  {service.serviceType}
                                </span>
                              </div>

                              <span className="price">
                                {service.currency} {service.price.toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      ) : (
        <section className="form-section">
          <header className="form-header">
            <div>
              <p className="eyebrow">TRAVELOGIC</p>
              <h1>Add Supplier</h1>
              <p className="subtitle">
                Add a tourism supplier and the services they provide.
              </p>
            </div>
          </header>

          <form className="supplier-form" onSubmit={handleSubmit}>
          {formError && (
            <div className="state-message error">
               <p>{formError}</p>
            </div>
                        )}
            <div className="form-group">
              <label htmlFor="name">Supplier Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleSupplierChange}
              />
              {validationErrors.name && (
                <p className="field-error">{validationErrors.name}</p>
                )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={form.location}
                  onChange={handleSupplierChange}
                />
                {validationErrors.location && (
                <p className="field-error">{validationErrors.location}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="contactEmail">Contact Email</label>
                <input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  value={form.contactEmail}
                  onChange={handleSupplierChange}
                />
                {validationErrors.contactEmail && (
                <p className="field-error">{validationErrors.contactEmail}</p>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                rows="4"
                value={form.description}
                onChange={handleSupplierChange}
              />
              {validationErrors.description && (
                <p className="field-error">{validationErrors.description}</p>
                )}
            </div>

            <div className="services-form">
              <div className="services-form-header">
                <div>
                  <h2>Services</h2>
                  <p>Add one or more services for this supplier.</p>
                </div>

                <button
                  className="secondary-button"
                  type="button"
                  onClick={addService}
                >
                  + Add Service
                </button>
              </div>

              {form.services.map((service, index) => {
                const serviceErrors = validationErrors[`service-${index}`] || {};
                    return (
                <div className="service-form-card" key={index}>
                  <div className="service-form-header">
                    <h3>Service {index + 1}</h3>

                    {form.services.length > 1 && (
                      <button
                        className="remove-button"
                        type="button"
                        onClick={() => removeService(index)}
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor={`service-name-${index}`}>
                      Service Name
                    </label>
                    <input
                      id={`service-name-${index}`}
                      name="name"
                      type="text"
                      value={service.name}
                      onChange={(event) =>
                        handleServiceChange(index, event)
                      }
                    />
                    {serviceErrors.name && (
                      <p className="field-error">{serviceErrors.name}</p>
                            )}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor={`service-type-${index}`}>
                        Service Type
                      </label>
                      <input
                        id={`service-type-${index}`}
                        name="serviceType"
                        type="text"
                        value={service.serviceType}
                        onChange={(event) =>
                          handleServiceChange(index, event)
                        }
                      />
                      {serviceErrors.serviceType && (
                      <p className="field-error">{serviceErrors.serviceType}</p>
                            )}
                    </div>

                    <div className="form-group">
                      <label htmlFor={`service-price-${index}`}>
                        Price
                      </label>
                      <input
                        id={`service-price-${index}`}
                        name="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={service.price}
                        onChange={(event) =>
                          handleServiceChange(index, event)
                        }
                      />
                      {serviceErrors.price && (
                      <p className="field-error">{serviceErrors.price}</p>
                            )}
                    </div>

                    <div className="form-group">
                      <label htmlFor={`service-currency-${index}`}>
                        Currency
                      </label>
                      <input
                        id={`service-currency-${index}`}
                        name="currency"
                        type="text"
                        maxLength="3"
                        value={service.currency}
                        onChange={(event) =>
                          handleServiceChange(index, event)
                        }
                      />
                      {serviceErrors.currency && (
                      <p className="field-error">{serviceErrors.currency}</p>
                            )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor={`service-description-${index}`}>
                      Description
                    </label>
                    <textarea
                      id={`service-description-${index}`}
                      name="description"
                      rows="3"
                      value={service.description}
                      onChange={(event) =>
                        handleServiceChange(index, event)
                      }
                    />
                    {serviceErrors.description && (
                      <p className="field-error">{serviceErrors.description}</p>
                            )}
                  </div>
                </div>
                  );
              })}
            </div>

            <div className="form-actions">
              <button
                className="secondary-button"
                type="button"
                onClick={closeForm}
              >
                Cancel
              </button>

             <button
                className="primary-button"
                type="submit"
                disabled={submitting}
              >
                {submitting ? 'Creating...' : 'Create Supplier'}
            </button>
            </div>
          </form>
        </section>
      )}
    </main>
  );
}

export default App;