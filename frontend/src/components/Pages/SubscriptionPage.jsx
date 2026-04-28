import React, { useEffect, useState } from "react";
import { CheckCircle, X, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchSubscriptionPlans } from "../../lib/api";

export function SubscriptionPage() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { ok, data } = await fetchSubscriptionPlans();
      if (!ok) {
        setError("Failed to load plans. Please try again.");
      } else {
        setPlans(Array.isArray(data) ? data : []);
      }
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="bg-light">
      {/* HEADER */}
      <div
        className="text-center text-white py-5"
        style={{ background: "linear-gradient(135deg, #0f0c29, #302b63)" }}
      >
        <div className="container">
          <span className="badge bg-warning text-dark mb-3">Pricing</span>
          <h1 className="fw-bold">Simple, Transparent Pricing</h1>
          <p className="text-light">Choose the best plan for you</p>
        </div>
      </div>

      <div className="container py-5">
        {/* LOADING */}
        {loading && (
          <div className="text-center py-5">
            <Loader2 size={36} className="text-primary animate-spin" />
            <p className="text-muted mt-3">Loading plans...</p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="alert alert-danger text-center">{error}</div>
        )}

        {/* PLANS */}
        {!loading && !error && (
          <div className="row g-4">
            {plans.length === 0 ? (
              <p className="text-center text-muted">No plans available.</p>
            ) : (
              plans.map((plan) => (
                <div key={plan.id} className="col-md-4">
                  <div
                    className={`card h-100 shadow-sm text-center ${
                      plan.popular ? "border-primary" : ""
                    }`}
                  >
                    {plan.popular && (
                      <div className="bg-primary text-white py-1 small">
                        Most Popular
                      </div>
                    )}

                    <div className="card-body d-flex flex-column">
                      <h5 className="fw-bold">{plan.name}</h5>

                      <h2 style={{ color: plan.color }}>
                        ${Number(plan.price || 0)}
                      </h2>
                      <p className="text-muted">/{plan.period}</p>

                      <ul className="list-unstyled mt-3 mb-4 text-start flex-grow-1">
                        {plan.features.map((f, i) => (
                          <li key={i} className="mb-2">
                            <CheckCircle size={16} className="text-success me-2" />
                            {f}
                          </li>
                        ))}
                        {plan.disabled.map((f, i) => (
                          <li key={i} className="mb-2 text-muted">
                            <X size={16} className="me-2" />
                            {f}
                          </li>
                        ))}
                      </ul>

                      <button
                        className={`btn w-100 mt-auto ${
                          plan.popular ? "btn-primary" : "btn-outline-primary"
                        }`}
                        type="button"
                        onClick={() => navigate("/auth")}
                      >
                        {plan.popular ? "Get Started" : "Choose Plan"}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* CONTACT */}
        <div
          className="text-center mt-5 p-4 text-white rounded"
          style={{ background: "#302b63" }}
        >
          <h5 className="fw-bold">Need a Custom Plan?</h5>
          <p>Contact us for enterprise solutions</p>
          <button
            className="btn btn-light"
            type="button"
            onClick={() => navigate("/contact")}
          >
            Contact Sales
          </button>
        </div>
      </div>
    </div>
  );
}