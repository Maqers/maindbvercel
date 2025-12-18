"use client";

import { useState } from "react";

export default function ApplyPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    const form = e.currentTarget;

    const payload = {
      role: (form.elements.namedItem("role") as RadioNodeList).value,
      business_name: (form.elements.namedItem("business_name") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
    };

    const res = await fetch("/api/vendor-apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setStatus("success");
      form.reset();
    } else {
      setStatus("error");
    }
  }

  return (
    <>
      {/* Brand top-left across whole page */}
      <div className="brandTopLeft">Maqers.in</div>

      <div className="split">
        {/* Left purple panel */}
        <div className="leftPanel">
          <div className="leftContent">
            <div className="illustrationBox">
              {/* Put your downloaded image in /public as community.png */}
              <img className="heroImage" src="/community.png" alt="Maqers community" />
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="rightPanel">
          <div className="card">
            <h1 className="title">Registration</h1>
            <p className="subtitle">Please fill out the form below to get started.</p>

            <div className="formBox">
              <form onSubmit={onSubmit}>
                <div className="formRow">
                  <div className="label">Are you a:</div>
                  <div className="radioRow">
                    <label className="radioOption">
                      <input type="radio" name="role" value="seller" required />
                      Seller
                    </label>
                    <label className="radioOption">
                      <input type="radio" name="role" value="buyer" />
                      Buyer
                    </label>
                    <label className="radioOption">
                      <input type="radio" name="role" value="both" />
                      Both
                    </label>
                  </div>
                </div>

                <div className="formRow">
                  <label className="label">Name of the business</label>
                  <input className="input" type="text" name="business_name" />
                </div>

                <div className="formRow">
                  <label className="label">Phone number</label>
                  <input className="input" type="text" name="phone" />
                </div>

                <div className="formRow">
                  <label className="label">Email ID</label>
                  <input className="input" type="email" name="email" required />
                </div>

                <button className="button" type="submit" disabled={status === "submitting"}>
                  {status === "submitting" ? "Submitting..." : "SUBMIT"}
                </button>
              </form>

              {status === "success" && (
                <div className="successBox">
                  Thank you for sharing you details! Kindly click on the link given below to join the Maqers community.
                  <div style={{ marginTop: 8 }}>
                    <a href="https://maqers.in" target="_blank" rel="noreferrer">
                      Join the Maqers community
                    </a>
                  </div>
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

      {/* Full-width footer across entire bottom */}
      <div className="footerBar">© {new Date().getFullYear()} Maqers.in</div>
    </>
  );
}
