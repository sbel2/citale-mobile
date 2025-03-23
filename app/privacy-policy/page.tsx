// app/privacy-policy/page.tsx

export default function PrivacyPolicyPage() {
    return (
      <div className="p-6 max-w-3xl mx-auto text-base leading-relaxed">
        <h1 className="text-2xl font-semibold mb-4">Privacy Policy for Citale</h1>
        <p><strong>Effective Date:</strong> 02/14/2025</p>
  
        <p className="mt-4">
          Citale ("we", "our", or "us") provides a media-based social platform. This Privacy Policy outlines how we collect, use, and protect your data when you use our mobile application.
        </p>
  
        <h2 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
        <p><strong>a. Account Information:</strong> Email address, username, uploaded content</p>
        <p><strong>b. Usage Data:</strong> App actions, device type, OS version, anonymous identifiers</p>
        <p><strong>c. Analytics:</strong> We use PostHog to collect session data, device info, and IP address (not tied to identity)</p>
  
        <h2 className="text-xl font-semibold mt-6 mb-2">2. How We Use Your Data</h2>
        <p>We use your data to provide services, display content, improve the app, and troubleshoot bugs. We do not sell or share data with marketers.</p>
  
        <h2 className="text-xl font-semibold mt-6 mb-2">3. Third-Party Services</h2>
        <ul className="list-disc pl-6">
          <li><a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">Supabase</a> – Authentication, database, file storage</li>
          <li><a href="https://posthog.com/privacy" target="_blank" rel="noopener noreferrer">PostHog</a> – Analytics</li>
          <li><a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Vercel</a> – Hosting</li>
        </ul>
  
        <h2 className="text-xl font-semibold mt-6 mb-2">4. Data Retention & Deletion</h2>
        <p>You can contact us at <strong>citaleco@gmail.com</strong> to delete your account and data, or click the help button in our menu bar.</p>
  
        <h2 className="text-xl font-semibold mt-6 mb-2">5. Security</h2>
        <p>We use secure services like Supabase and Vercel to store your data safely.</p>
  
        <h2 className="text-xl font-semibold mt-6 mb-2">6. Children’s Privacy</h2>
        <p>This app is not intended for children under 13. We do not knowingly collect data from minors.</p>
  
        <h2 className="text-xl font-semibold mt-6 mb-2">7. Changes to This Policy</h2>
        <p>We may update this policy. Updates will be posted on this page.</p>
  
        <h2 className="text-xl font-semibold mt-6 mb-2">8. Contact</h2>
        <p>Email: <strong>citaleco@gmail.com</strong><br />Website: <a href="https://citaleco.com" target="_blank" rel="noopener noreferrer">https://citaleco.com</a></p>
      </div>
    );
  }
  