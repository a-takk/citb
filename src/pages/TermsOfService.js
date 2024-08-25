import "../styles/termsofservice.css";

export default function TermsOfService() {
  return (
    <div className="termsbackground">
      <Helmet>
        <title>Terms of Service | CITB Certify</title>
        <meta
          name="description"
          content="Review the terms of service for CITB Certify. Understand the guidelines and legal obligations for using our website, making bookings, payment policies, intellectual property rights, and more."
        />
      </Helmet>
      <div className="termscontainer">
        <h1>Terms of Service</h1>
        <p>
          These terms of service ("Terms") apply to your access and use of our
          booking website (CITB Certify). By accessing or using our website, you
          agree to comply with and be bound by these Terms.
        </p>

        <h2>Use of our website</h2>
        <p>
          You may use our website for lawful purposes only. You agree not to use
          our website:
        </p>
        <ul>
          <li>
            In any way that violates any applicable local, national, or
            international law or regulation.
          </li>
          <li>
            To engage in any conduct that is unlawful, fraudulent, or harmful.
          </li>
          <li>
            To send, knowingly receive, upload, download, use, or re-use any
            material which does not comply with these Terms.
          </li>
          <li>
            To transmit, or procure the sending of, any unsolicited or
            unauthorized advertising or promotional material.
          </li>
        </ul>

        <h2>Booking Terms</h2>
        <p>
          When you make a booking through our website, you agree to provide
          accurate, current, and complete information. You are responsible for
          ensuring that all details provided during the booking process are
          correct.
        </p>
        <p>
          All bookings are subject to availability and confirmation. We reserve
          the right to refuse or cancel any booking at our discretion.
        </p>

        <h2>Payment</h2>
        <p>
          Payment for bookings must be made through the payment methods
          available on our website. By providing payment information, you
          represent and warrant that you have the legal right to use the payment
          method provided.
        </p>

        <h2>Cancellation and Refunds</h2>
        <p>
          Cancellation and refund policies vary depending on the specific
          booking and service. Please refer to the specific terms provided at
          the time of booking for details on cancellation and refund
          eligibility.
        </p>

        <h2>Intellectual Property</h2>
        <p>
          All content on our website, including text, graphics, logos, images,
          and software, is the property of our company or our licensors and is
          protected by copyright, trademark, and other intellectual property
          laws.
        </p>
        <p>
          You may not reproduce, distribute, modify, create derivative works of,
          publicly display, publicly perform, republish, download, store, or
          transmit any of the material on our website, except as permitted under
          these Terms.
        </p>

        <h2>Disclaimer of Warranties</h2>
        <p>
          CITB Certify and its content are provided on an "as is" basis without
          any warranties of any kind, either express or implied. We do not
          warrant that our website will be uninterrupted, error-free, or free of
          viruses or other harmful components.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, we shall not be liable for any
          indirect, incidental, special, consequential, or punitive damages, or
          any loss of profits or revenues, whether incurred directly or
          indirectly, or any loss of data, use, goodwill, or other intangible
          losses, resulting from your use of our website.
        </p>

        <h2>Changes to These Terms</h2>
        <p>
          We may revise these Terms from time to time in our sole discretion.
          The most current version will always be posted on CITB Certify. By
          continuing to access or use our website after revisions become
          effective, you agree to be bound by the revised terms.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have any questions about these terms, please contact us at:
        </p>
        <p>Email: support@example.com</p>
        <p>Phone: 123-456-7890</p>
        <p>Address: 123 Booking Street, Booking City, BC 12345</p>
      </div>
    </div>
  );
}
