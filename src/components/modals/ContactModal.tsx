import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

import { env } from "~/env.mjs";

import { ContactForm } from "../forms";
import Modal from "./Modal";

const ContactModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Contact Us">
      <GoogleReCaptchaProvider
        reCaptchaKey={env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
      >
        <ContactForm />
      </GoogleReCaptchaProvider>
    </Modal>
  );
};

export default ContactModal;
