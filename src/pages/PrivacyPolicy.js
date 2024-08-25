import "../styles/privacypolicy.css";

export default function PrivacyPolicy() {
  return (
    <div className="privacybackground">
      <Helmet>
        <title>Privacy Policy | CITB Certify</title>
        <meta
          name="description"
          content="Learn how CITB Certify collects, uses, shares, and protects your personal information when you visit our website or use our booking services. Read our privacy policy to understand your rights and our data practices."
        />
      </Helmet>

      <div className="privacycontainer">
        <h1>Privacy Policy</h1>
        <p>
          This privacy policy outlines how our booking website collects, uses,
          shares, and protects personal information in relation to visitors and
          users of our website.
        </p>

        <h2>Collection of Personal Information</h2>
        <p>
          We collect personal information from visitors and users of our website
          through various means, including:
        </p>
        <ul>
          <li>
            When you provide us with your personal details, such as your name,
            email address, phone number, or address during the booking process.
          </li>
          <li>When you engage in online surveys, contests, or promotions.</li>
          <li>When you participate in our customer support.</li>
          <li>
            Automatically through the use of cookies and similar technologies
            when you visit our website.
          </li>
        </ul>

        <h2>Use of Personal Information</h2>
        <p>
          We use the personal information collected for the following purposes:
        </p>
        <ul>
          <li>To facilitate and manage your bookings.</li>
          <li>
            To communicate with you regarding your bookings and our services.
          </li>
          <li>To improve our website and services based on user feedback.</li>
          <li>
            To send you promotional materials and updates, with your consent.
          </li>
          <li>To comply with legal obligations and resolve disputes.</li>
        </ul>

        <h2>Sharing of Personal Information</h2>
        <p>
          We do not share your personal information with third parties except in
          the following circumstances:
        </p>
        <ul>
          <li>
            With service providers who assist us in operating our website and
            services.
          </li>
          <li>
            To comply with legal obligations or in response to lawful requests.
          </li>
          <li>
            To protect our rights, privacy, safety, or property, and/or that of
            our users.
          </li>
        </ul>

        <h2>Protection of Personal Information</h2>
        <p>
          We implement appropriate technical and organizational measures to
          protect your personal information against unauthorized access,
          alteration, disclosure, or destruction. Our database is securely
          stored and access is restricted to authorized personnel only.
        </p>

        <h2>Your Rights</h2>
        <p>
          You have the following rights regarding your personal information:
        </p>
        <ul>
          <li>
            To access and receive a copy of the personal information we hold
            about you.
          </li>
          <li>
            To request the correction of any inaccurate or incomplete
            information.
          </li>
          <li>
            To request the deletion of your personal information under certain
            circumstances.
          </li>
          <li>
            To object to the processing of your personal information for direct
            marketing purposes.
          </li>
          <li>
            To withdraw your consent to the processing of your personal
            information at any time.
          </li>
        </ul>

        <h2>Changes to This Privacy Policy</h2>
        <p>
          We may update this privacy policy from time to time to reflect changes
          in our practices or legal requirements. We will notify you of any
          significant changes by posting the new policy on our website.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have any questions or concerns about this privacy policy or our
          handling of your personal information, please contact us at:
        </p>
        <p>Email: info@example.com</p>
        <p>Phone: 07584857465</p>
        <p>77 Bilhay St, West Bromwich, B70 9RD</p>
      </div>
    </div>
  );
}
