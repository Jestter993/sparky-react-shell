import LandingNav from "@/components/Landing/LandingNav";
import LandingFooter from "@/components/Landing/LandingFooter";

const PrivacyTerms = () => {

  return (
    <div className="min-h-screen bg-[#F5F8FA]">
      <LandingNav />
      
      <main className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header Section */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 leading-tight tracking-tight bg-gradient-to-r from-[#5A5CFF] via-[#5A5CFF] to-[#00C9A7] bg-clip-text text-transparent">
              Terms & Privacy
            </h1>
            <p className="text-lg text-[#0F1117]/80 font-medium max-w-2xl mx-auto" style={{fontFamily: "Inter, sans-serif"}}>
              Your privacy and security are important to us. Read our policies below.
            </p>
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-lg shadow-lg animate-fade-in p-8 space-y-12">
              {/* Privacy Policy Section */}
              <section id="privacy-section" className="space-y-6">
                <div className="text-center pb-6 border-b border-[#E5E7EB]">
                  <h2 className="text-3xl font-bold text-[#0F1117] mb-2" style={{fontFamily: "Space Grotesk, sans-serif"}}>
                    📜 Privacy Policy
                  </h2>
                  <p className="text-[#0F1117]/60 font-semibold">Effective Date: 09/09/2025</p>
                </div>

                <div className="prose prose-lg max-w-none">
                  <p className="text-[#0F1117]/80 leading-relaxed" style={{fontFamily: "Inter, sans-serif"}}>
                    At Adaptrix, your privacy is important. This policy explains what data we collect, how we use it, and your rights as a user.
                  </p>

                  <h3 className="text-xl font-bold text-[#0F1117] mt-8 mb-4" style={{fontFamily: "Space Grotesk, sans-serif"}}>
                    1. Information We Collect
                  </h3>
                  <p className="text-[#0F1117]/80 leading-relaxed mb-4" style={{fontFamily: "Inter, sans-serif"}}>
                    When you use Adaptrix, we collect the following types of data:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-[#0F1117]/80" style={{fontFamily: "Inter, sans-serif"}}>
                    <li><strong>Account Information</strong>: Your email address (used to create and manage your account).</li>
                    <li><strong>Usage Data</strong>: Interactions with the platform, such as which features you use and which languages you localize content into.</li>
                    <li><strong>Device Information</strong>: General technical details about your browser and device.</li>
                    <li><strong>Feedback</strong>: If you submit feedback voluntarily, we may retain it to help improve the product.</li>
                  </ul>

                  <h3 className="text-xl font-bold text-[#0F1117] mt-8 mb-4" style={{fontFamily: "Space Grotesk, sans-serif"}}>
                    2. How We Use This Data
                  </h3>
                  <p className="text-[#0F1117]/80 leading-relaxed mb-4" style={{fontFamily: "Inter, sans-serif"}}>
                    We use your data to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-[#0F1117]/80" style={{fontFamily: "Inter, sans-serif"}}>
                    <li>Provide and improve our services.</li>
                    <li>Understand usage patterns to identify bugs and improve functionality.</li>
                    <li>Personalize your experience where applicable.</li>
                    <li>Respond to user support or feedback submissions.</li>
                  </ul>

                  <h3 className="text-xl font-bold text-[#0F1117] mt-8 mb-4" style={{fontFamily: "Space Grotesk, sans-serif"}}>
                    3. Frontend Platform Disclosure (Lovable)
                  </h3>
                  <p className="text-[#0F1117]/80 leading-relaxed" style={{fontFamily: "Inter, sans-serif"}}>
                    Our frontend was built using Lovable, an AI-based UI development platform. We do <strong>not actively share your data</strong> with Lovable. However, elements of the user interface are generated via their service, and we encourage users to review Lovable's own privacy practices.
                  </p>

                  <h3 className="text-xl font-bold text-[#0F1117] mt-8 mb-4" style={{fontFamily: "Space Grotesk, sans-serif"}}>
                    4. Data Control and Deletion
                  </h3>
                  <p className="text-[#0F1117]/80 leading-relaxed mb-4" style={{fontFamily: "Inter, sans-serif"}}>
                    You have full control over the content you create:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-[#0F1117]/80" style={{fontFamily: "Inter, sans-serif"}}>
                    <li>You can delete your localized videos at any time, which removes them from our servers.</li>
                    <li>If you'd like us to remove your account or associated data, contact us at the email listed below.</li>
                  </ul>

                  <h3 className="text-xl font-bold text-[#0F1117] mt-8 mb-4" style={{fontFamily: "Space Grotesk, sans-serif"}}>
                    5. Data Sharing and Security
                  </h3>
                  <p className="text-[#0F1117]/80 leading-relaxed mb-4" style={{fontFamily: "Inter, sans-serif"}}>
                    We do <strong>not</strong> share your personal data with any third parties or partners.
                  </p>
                  <p className="text-[#0F1117]/80 leading-relaxed" style={{fontFamily: "Inter, sans-serif"}}>
                    We take reasonable technical and organizational measures to secure your data from unauthorized access or disclosure.
                  </p>

                  <h3 className="text-xl font-bold text-[#0F1117] mt-8 mb-4" style={{fontFamily: "Space Grotesk, sans-serif"}}>
                    6. Policy Updates
                  </h3>
                  <p className="text-[#0F1117]/80 leading-relaxed" style={{fontFamily: "Inter, sans-serif"}}>
                    We may update this Privacy Policy as the product evolves. Changes will be posted here with a new "Effective Date." Material updates may be communicated via email or in-app notification.
                  </p>

                  <h3 className="text-xl font-bold text-[#0F1117] mt-8 mb-4" style={{fontFamily: "Space Grotesk, sans-serif"}}>
                    7. Contact
                  </h3>
                  <p className="text-[#0F1117]/80 leading-relaxed" style={{fontFamily: "Inter, sans-serif"}}>
                    If you have any questions about this Privacy Policy or your data, please contact us via the form on our <a href="/contact" className="text-[#5A5CFF] hover:text-[#00C9A7] font-semibold">Contact Page</a> or email us at <a href="mailto:adaptrixlocalization@outlook.com" className="text-[#5A5CFF] hover:text-[#00C9A7] font-semibold">adaptrixlocalization@outlook.com</a>.
                  </p>
                </div>
              </section>

              {/* Terms of Service Section */}
              <section id="terms-section" className="space-y-6 border-t border-[#E5E7EB] pt-12">
                <div className="text-center pb-6 border-b border-[#E5E7EB]">
                  <h2 className="text-3xl font-bold text-[#0F1117] mb-2" style={{fontFamily: "Space Grotesk, sans-serif"}}>
                    📄 Terms of Service
                  </h2>
                  <p className="text-[#0F1117]/60 font-semibold">Effective Date: 09/09/2025</p>
                </div>

                <div className="prose prose-lg max-w-none">
                  <p className="text-[#0F1117]/80 leading-relaxed" style={{fontFamily: "Inter, sans-serif"}}>
                    These Terms of Service ("Terms") govern your access to and use of Adaptrix (the "Service"), currently in its alpha release phase. By using Adaptrix, you agree to these Terms.
                  </p>

                  <h3 className="text-xl font-bold text-[#0F1117] mt-8 mb-4" style={{fontFamily: "Space Grotesk, sans-serif"}}>
                    1. Use of the Service
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-[#0F1117]/80" style={{fontFamily: "Inter, sans-serif"}}>
                    <li>Adaptrix is provided <strong>free of charge</strong> during the alpha testing period.</li>
                    <li>You may use the Service to localize advertising content and explore features as provided.</li>
                  </ul>

                  <h3 className="text-xl font-bold text-[#0F1117] mt-8 mb-4" style={{fontFamily: "Space Grotesk, sans-serif"}}>
                    2. User Responsibilities
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-[#0F1117]/80" style={{fontFamily: "Inter, sans-serif"}}>
                    <li>You are responsible for the content you upload, localize, or distribute through the Service.</li>
                    <li>You agree not to use the Service for any unlawful, abusive, or infringing purposes.</li>
                  </ul>

                  <h3 className="text-xl font-bold text-[#0F1117] mt-8 mb-4" style={{fontFamily: "Space Grotesk, sans-serif"}}>
                    3. Account Registration
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-[#0F1117]/80" style={{fontFamily: "Inter, sans-serif"}}>
                    <li>To use the Service, you must register with a valid email address.</li>
                    <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
                  </ul>

                  <h3 className="text-xl font-bold text-[#0F1117] mt-8 mb-4" style={{fontFamily: "Space Grotesk, sans-serif"}}>
                    4. Content Deletion and Data Control
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-[#0F1117]/80" style={{fontFamily: "Inter, sans-serif"}}>
                    <li>You may delete your localized videos at any time.</li>
                    <li>We may delete inactive or abusive accounts without prior notice.</li>
                  </ul>

                  <h3 className="text-xl font-bold text-[#0F1117] mt-8 mb-4" style={{fontFamily: "Space Grotesk, sans-serif"}}>
                    5. Service Availability
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-[#0F1117]/80" style={{fontFamily: "Inter, sans-serif"}}>
                    <li>The Service is provided "as is" with no guarantee of uptime or feature stability.</li>
                    <li>We may update, modify, suspend, or discontinue the Service at any time without liability.</li>
                  </ul>

                  <h3 className="text-xl font-bold text-[#0F1117] mt-8 mb-4" style={{fontFamily: "Space Grotesk, sans-serif"}}>
                    6. Intellectual Property
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-[#0F1117]/80" style={{fontFamily: "Inter, sans-serif"}}>
                    <li>All platform technology and branding are owned by Adaptrix.</li>
                    <li>You retain ownership of the content you upload or localize.</li>
                  </ul>

                  <h3 className="text-xl font-bold text-[#0F1117] mt-8 mb-4" style={{fontFamily: "Space Grotesk, sans-serif"}}>
                    7. Disclaimers and Limitation of Liability
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-[#0F1117]/80" style={{fontFamily: "Inter, sans-serif"}}>
                    <li>The Service is in early-stage development and offered <strong>without warranties</strong> of any kind.</li>
                    <li>Adaptrix is not liable for loss of content, downtime, or any indirect damages.</li>
                  </ul>

                  <h3 className="text-xl font-bold text-[#0F1117] mt-8 mb-4" style={{fontFamily: "Space Grotesk, sans-serif"}}>
                    8. Modifications to These Terms
                  </h3>
                  <p className="text-[#0F1117]/80 leading-relaxed" style={{fontFamily: "Inter, sans-serif"}}>
                    We may update these Terms occasionally. Updated versions will be posted with a revised "Effective Date." Continued use of the Service implies acceptance of any changes.
                  </p>

                  <h3 className="text-xl font-bold text-[#0F1117] mt-8 mb-4" style={{fontFamily: "Space Grotesk, sans-serif"}}>
                    9. Governing Law
                  </h3>
                  <p className="text-[#0F1117]/80 leading-relaxed" style={{fontFamily: "Inter, sans-serif"}}>
                    These Terms are governed by applicable laws in the jurisdiction where Adaptrix is operated. This will be specified once the business entity is established.
                  </p>

                  <h3 className="text-xl font-bold text-[#0F1117] mt-8 mb-4" style={{fontFamily: "Space Grotesk, sans-serif"}}>
                    10. Contact
                  </h3>
                  <p className="text-[#0F1117]/80 leading-relaxed" style={{fontFamily: "Inter, sans-serif"}}>
                    For questions or issues regarding these Terms, please contact us via our <a href="/contact" className="text-[#5A5CFF] hover:text-[#00C9A7] font-semibold">Contact Page</a> or email <a href="mailto:adaptrixlocalization@outlook.com" className="text-[#5A5CFF] hover:text-[#00C9A7] font-semibold">adaptrixlocalization@outlook.com</a>.
                  </p>
                </div>
              </section>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
};

export default PrivacyTerms;