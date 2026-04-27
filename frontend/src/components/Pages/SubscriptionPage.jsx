import React, { useEffect, useState } from "react";
import { CheckCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchSubscriptionPlans } from "../../lib/api";

export function SubscriptionPage() {
  const navigate = useNavigate();
  const [billing, setBilling] = useState("monthly");
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { ok, data } = await fetchSubscriptionPlans();
      if (!ok) return;
      setPlans(Array.isArray(data) ? data : []);
    };

    load();
  }, []);

  return (
    <div className="bg-light">
      <div className="text-center text-white py-5" style={{ background: "linear-gradient(135deg, #0f0c29, #302b63)" }}>
        <div className="container">
          <span className="badge bg-warning text-dark mb-3">Pricing</span>
          <h1 className="fw-bold">Simple, Transparent Pricing</h1>
          <p className="text-light">Choose the best plan for you</p>

          <div className="btn-group mt-3">
            <button
              className={`btn ${billing === "monthly" ? "btn-light" : "btn-outline-light"}`}
              onClick={() => setBilling("monthly")}
            >
              Monthly
            </button>

            <button
              className={`btn ${billing === "yearly" ? "btn-light" : "btn-outline-light"}`}
              onClick={() => setBilling("yearly")}
            >
              Yearly
            </button>
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="row g-4">
          {plans.map((plan) => (
            <div key={plan.id} className="col-md-4">
              <div className={`card h-100 shadow-sm text-center ${plan.popular ? "border-primary" : ""}`}>
                {plan.popular && (
                  <div className="bg-primary text-white py-1 small">
                    Most Popular
                  </div>
                )}

                <div className="card-body">
                  <h5 className="fw-bold">{plan.name}</h5>

                  <h2 style={{ color: plan.color }}>
                    $
                    {billing === "yearly"
                      ? Math.round(Number(plan.price || 0) * 0.75)
                      : Number(plan.price || 0)}
                  </h2>

                  <p className="text-muted">/{plan.period}</p>

                  <ul className="list-unstyled mt-3 mb-4 text-start">
                    {(plan.features || []).map((f, i) => (
                      <li key={i} className="mb-2">
                        <CheckCircle size={16} className="text-success me-2" />
                        {f}
                      </li>
                    ))}

                    {(plan.disabled || []).map((f, i) => (
                      <li key={i} className="mb-2 text-muted">
                        <X size={16} className="me-2" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`btn w-100 ${
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
          ))}
        </div>

        <div className="text-center mt-5 p-4 text-white rounded" style={{ background: "#302b63" }}>
          <h5 className="fw-bold">Need Custom Plan?</h5>
          <p>Contact us for enterprise solutions</p>
          <button className="btn btn-light" type="button" onClick={() => navigate("/contact")}>
            Contact Sales
          </button>
        </div>
      </div>
    </div>
  );
}
