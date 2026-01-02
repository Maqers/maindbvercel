"use client";

import { useState } from "react";

export default function ApplyPage() {
  const [status, setStatus] = useState("idle"); 
  const [role, setRole] = useState("");
  const [submittedRole, setSubmittedRole] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setStatus("submitting");

    const form = e.currentTarget;
    const data = new FormData(form);

    const submittedRole = (data.get("role") || "").trim();
    const email = (data.get("email") || "").trim().toLowerCase();

    let payload;

    if (submittedRole === "seller") {
      payload = {
        role: submittedRole,
        business_name: data.get("business_name"),
        city: data.get("city"),
        phone: data.get("phone"),
        email,
      };
    } else {
      payload = {
        role: submittedRole,
        name: data.get("name"),
        city: data.get("city"),
        phone: data.get("phone"),
        email,
      };
    }

    try {
      const res = await fetch("/api/vendor-apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        setErrorMsg(result.error || "Email already exists");
        setStatus("duplicate");
        return;
      }

      setSubmittedRole(submittedRole);
      setStatus("success");

      form.reset();
      setRole("");
    } catch (err) {
      console.error(err);
      setErrorMsg("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div>
      <div className="brandTopLeft">Maqers.in</div>

      <div className="split">
        <div className="leftPanel">
          <div className="leftContent">
            <div className="illustrationBox">
              <img className="heroImage" src="/community.png" alt="Maqers community" />
            </div>
          </div>
        </div>

        <div className="rightPanel">
          <div className="card">
            <h1 className="title">Registration</h1>
            <p className="subtitle">Please fill out the form below to get started.</p>

            <div className="formBox">
              <form onSubmit={onSubmit}>
                {/* Role */}
                <div className="formRow">
                  <div className="label">Are you a:</div>
                  <div className="radioRow">
                    <label>
                      <input
                        type="radio"
                        name="role"
                        value="seller"
                        checked={role === "seller"}
                        onChange={() => setRole("seller")}
                        required
                      />
                      Seller
                    </label>

                    <label>
                      <input
                        type="radio"
                        name="role"
                        value="buyer"
                        checked={role === "buyer"}
                        onChange={() => setRole("buyer")}
                      />
                      Buyer
                    </label>
                  </div>
                </div>

                {role === "seller" && (
                  <div className="formRow">
                    <label className="label">Business Name</label>
                    <input
                      className="input"
                      type="text"
                      name="business_name"
                      required
                    />
                  </div>
                )}

                {role === "buyer" && (
                  <div className="formRow">
                    <label className="label">Name</label>
                    <input className="input" type="text" name="name" required />
                  </div>
                )}

                {role && (
                  <>
                    <div className="formRow">
                      <label className="label">City</label>
                      <select className="input" name="city" required>
                        <option value="">Select city</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Bengaluru">Bengaluru</option>
                        <option value="Chennai">Chennai</option>
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="Pune">Pune</option>
                        <option value="Kolkata">Kolkata</option>
                      </select>
                    </div>

                    <div className="formRow">
                      <label className="label">Phone Number</label>
                      <input
                        className="input"
                        type="tel"
                        name="phone"
                        pattern="[0-9]{10}"
                        maxLength="10"
                        required
                      />
                    </div>

                    <div className="formRow">
                      <label className="label">Email</label>
                      <input className="input" type="email" name="email" required />
                    </div>
                  </>
                )}

                <button className="button" type="submit" disabled={!role || status === "submitting"}>
                  {status === "submitting" ? "Submitting..." : "Submit"}
                </button>
              </form>

              {status === "success" && (
                <div className="successBox">
                  {submittedRole === "buyer" ? (
                    <>
                      Thank you for sharing your details! Kindly click the link below to join the Maqers community.
                      <div style={{ marginTop: 8 }}>
                        <a href="https://maqers.in" target="_blank" rel="noreferrer">
                          Join the Maqers community
                        </a>
                      </div>
                    </>
                  ) : (
                    "Thank you for submitting. We'll reach out soon."
                  )}
                </div>
              )}

              {status === "duplicate" && (
                <div
                  className="successBox"
                  style={{ background: "rgba(255,0,0,0.06)", borderColor: "rgba(255,0,0,0.25)", color: "#a40000" }}
                >
                  {errorMsg}
                </div>
              )}

              {status === "error" && (
                <div
                  className="successBox"
                  style={{ background: "rgba(255,0,0,0.06)", borderColor: "rgba(255,0,0,0.25)" }}
                >
                  Something went wrong. Please try again.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="footerBar">© {new Date().getFullYear()} Maqers.in</div>
    </div>
  );
}
