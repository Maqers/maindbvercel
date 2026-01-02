  "use client";
  /*
  /*import { useState } from "react";

  export default function ApplyPage() {
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      setStatus("submitting");
      const form = e.target;
      const data = new FormData(form);
    
      const payload = {
        role: data.get("role"),
        business_name: data.get("business_name"),
        phone: data.get("phone"),
        email: data.get("email"),
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
    }*/
    import { useState } from "react";

    type Status = "idle" | "submitting" | "success" | "error" | "duplicate"; 
    type Role = "seller" | "buyer" | "";
    

    export default function ApplyPage() {
    const [status, setStatus] = useState<Status>("idle");
    const [role, setRole] = useState<Role>("");
    const [errorMsg, setErrorMsg] = useState("");
    const [submittedRole, setSubmittedRole] = useState<Role>("");

      
    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    const form = e.currentTarget;
    const data = new FormData(form);

    const submittedRole = String(data.get("role") ?? "").trim() as Role;
    const email = String(data.get("email") ?? "").trim().toLowerCase();

    let payload: Record<string, any>;

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

      // ✅ remember submitted role BEFORE reset
      setSubmittedRole(submittedRole);
      setStatus("success");

      form.reset();
      setRole(""); // safe now
    } catch (err) {
      console.error(err);
      setErrorMsg("Something went wrong. Please try again.");
      setStatus("error");
    }
  }
    return (
      <>
        {/* Brand top-left across whole page */}
        <div className="brandTopLeft"></div>

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

        {/* Seller fields */}
        {role === "seller" && (
          <div className="formRow">
            <label className="label">Business Name</label>
            <input className="input"type="text" name="business_name" placeholder="Enter business name" required />
          </div>
        )}

        {/* Buyer fields */}
        {role === "buyer" && (
          <div className="formRow">
            <label className="label">Name</label>
            <input className="input" type="text" name="name" placeholder="Enter your full name" required />
          </div>
        )}

        {/* Common fields */}
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
                  required
                  pattern="[0-9]{10}"
                  maxLength={10}
                  inputMode="numeric"
                  placeholder="10-digit phone number"
                />
            </div>

            <div className="formRow">
              <label className="label">Email</label>
              <input className="input" type="email" name="email" placeholder="Enter the email address" required />
            </div>
          </>
        )}

        <button className="button" type="submit" disabled={status === "submitting" || !role}>
          {status === "submitting" ? "Submitting..." : "Submit"}
        </button>
      
    

                {status === "success" && submittedRole === "buyer" && (
  <div className="successBox">
    Thank you for sharing your details! Kindly click on the link below to join the Maqers community.
    <div style={{ marginTop: 8 }}>
      <a href="https://maqers.in" target="_blank" rel="noreferrer">
        Join the Maqers community
      </a>
    </div>
  </div>
)}

{status === "success" && submittedRole === "seller" && (
  <div className="successBox">
    Thank you for submitting! We’ll reach out to you soon.
  </div>
)}
</form>
                {status==="duplicate" && errorMsg && (
                <div
                  className="successBox"
                  style={{
                    background: "rgba(255,0,0,0.06)",
                    borderColor: "rgba(255,0,0,0.25)",
                    color: "#a40000",
                  }}
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

        {/* Full-width footer across entire bottom */}
        <div className="footerBar">© {new Date().getFullYear()} Maqers.in</div>
      </>
    );
  }
