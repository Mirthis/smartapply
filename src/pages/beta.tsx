import { type NextPage } from "next";
import Link from "next/link";
import Title from "~/components/Title";

const BetaPage: NextPage = () => {
  return (
    <>
      <Title title="About the Beta" />
      <p>
        The app is under current development and substantial changes may be
        introduced at any time. We will try our best to make sure that your
        profile data and generated content is going to be mantained as the app
        evovle.
      </p>
      <p className="mt-2">
        Some features as the test generation are in early stage and may not
        always produced the expected content.
      </p>
      <p className="mt-2">
        Althought we are doing our best to test the app, there may be bugs and
        errors that we are not aware of. If you find any, please{" "}
        <Link className="link-primary" href="/contact">
          {" "}
          contact us
        </Link>
        .
      </p>
      <Title title="Change Log" type="section" />
      <Title title="2023-06-21" type="subsection" />
      <p>New features and improvements:</p>
      <ul className="list-inside list-disc">
        <li>
          Interview questions are now streamed from the server allowing faster
          response time
        </li>
        <li>
          The main applicant from the user profile is auto-selected when
          creating a new application
        </li>
        <li>Remove duplicated options when starting a new interview</li>
        <li>Multiple applicants can be stored in the user profile</li>
      </ul>

      <Title title="2023-06-12" type="subsection" />
      <p>New features and improvements:</p>
      <ul className="list-inside list-disc">
        <li>
          Add &quot;Saved Applications&quot; section allowing to select a
          previously created applications
        </li>
        <li>
          Cover letters geenerated for each application are now stored and can
          be retrieved selecting the corresponding application
        </li>
        <li>Applicant details used can be saved in the user profile</li>
        <li>Multiple applicants can be stored in the user profile</li>
        <li>
          A stored applicant can be selected during the application creation
          process
        </li>
        <li>Minor UI improvemetns </li>
        <li>Add the beta page (this page)</li>
      </ul>
      <Title title="2023-05-20" type="subsection" />
      <p>New features and improvements:</p>
      <ul className="list-inside list-disc">
        <li>Social login via LinkedIn and Google</li>
        <li>Restric access to logged in users</li>
        <li>
          AI response for cover letters and test responses are now streamed, so
          generated output is shown in real time
        </li>
        <li>Add draft privacy and term and conditions page</li>
        <li>
          Minor tweaks to test generation to make questions more relevant (still
          work in progress)
        </li>
        <li>
          Leadership interview option has been removed, HR and technical
          interview are the current options
        </li>
      </ul>
      <Title title="2023-05-12" type="subsection" />
      <p>Inital release:</p>
      <ul className="list-inside list-disc">
        <li>Application creation by inserting job and appicant data</li>
        <li>Cover Letter generation and refinements</li>
        <li>Job Interview simulation (HR, Technical, Leadership)</li>
        <li>Knowledge test</li>
      </ul>
    </>
  );
};

export default BetaPage;
