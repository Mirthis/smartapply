import { type NextPage } from "next";
import Link from "next/link";

import { Layout, Title } from "~/components";

const TermsPage: NextPage = () => {
  return (
    <Layout title="Terms of Service">
      <Title title="Terms of Service" />
      <p className="font-semibold">
        <em>Last Updated: 13/05/2023</em>
      </p>
      <Title title="1. Acceptance of Terms" type="subsection" />
      <p>
        By accessing or using SmartApply.app, you affirm that you are at least
        18 years old and legally capable of entering into a binding agreement.
        If you are using SmartApply.app on behalf of an organization, you
        represent and warrant that you have the authority to bind that
        organization to these Terms.
      </p>
      <Title type="subsection" title="2. User Accounts" />
      <p>
        To use certain features or services of SmartApply.app, you may be
        required to create a user account. You are responsible for maintaining
        the confidentiality of your account information, including your username
        and password. You agree to notify us immediately of any unauthorized use
        of your account or any other breach of security.
      </p>
      <Title type="subsection" title="3. User Responsibilities" />
      <p>
        You agree to use SmartApply.app in compliance with all applicable laws
        and regulations. You are solely responsible for any content you submit
        or upload to SmartApply.app, and you affirm that you have all necessary
        rights, licenses, and permissions to do so. You must not use
        SmartApply.app to engage in any illegal, fraudulent, or unauthorized
        activities.
      </p>
      <Title type="subsection" title="4. Intellectual Property" />
      <p>
        All intellectual property rights in SmartApply.app, including but not
        limited to copyrights, trademarks, and trade secrets, are owned by or
        licensed to us. You are granted a limited, non-exclusive,
        non-transferable license to use SmartApply.app solely for its intended
        purposes. You may not modify, reproduce, distribute, or create
        derivative works based on SmartApply.app without our prior written
        consent.
      </p>
      <Title type="subsection" title="5. Privacy" />
      <p>
        Our{" "}
        <Link href="/privacy" className="link-hover link-primary link">
          {" "}
          Privacy Policy
        </Link>{" "}
        explains how we collect, use, and protect your personal information when
        you use SmartApply.app. By using SmartApply.app, you consent to the
        collection and use of your information as described in our Privacy
        Policy.
      </p>
      <Title type="subsection" title="6. Disclaimer of Warranties" />
      <p>
        SmartApply.app is provided on an &quot;as is&quot; and &quot;as
        available&quot; basis without any warranties of any kind, whether
        express or implied. We do not guarantee that SmartApply.app will be
        uninterrupted, error-free, or secure. Your use of SmartApply.app is at
        your own risk.
      </p>
      <Title type="subsection" title="7. Limitation of Liability" />
      <p>
        To the fullest extent permitted by law, we shall not be liable for any
        direct, indirect, incidental, consequential, or special damages arising
        out of or in any way connected with your use of SmartApply.app or the
        inability to use SmartApply.app.
      </p>
      <Title type="subsection" title="8. Modifications to the Terms" />
      <p>
        We reserve the right to modify or update these Terms at any time without
        prior notice. The most current version of the Terms will be posted on
        SmartApply.app. Your continued use of SmartApply.app after any
        modifications to the Terms constitutes your acceptance of the revised
        Terms.
      </p>
      <Title type="subsection" title="9. Termination" />
      <p>
        We may terminate or suspend your access to SmartApply.app at any time,
        with or without cause, and without prior notice or liability. Upon
        termination, these Terms will survive with respect to any obligations
        that by their nature should survive termination.
      </p>
      <Title type="subsection" title="10. Governing Law and Jurisdiction" />
      <p>
        These Terms shall be governed by and construed in accordance with the
        laws of the United Kingdom. Any disputes arising out of or in connection
        with these Terms shall be submitted to the exclusive jurisdiction of the
        courts of the United Kingdom.
      </p>

      <div className="divider" />

      <p>
        If you have any questions or concerns regarding these Terms, please
        contact us via the contact form you can find in the footer.
      </p>
    </Layout>
  );
};

export default TermsPage;
