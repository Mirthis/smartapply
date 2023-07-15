import Modal from "./Modal";
import { SignIn } from "@clerk/nextjs";

const SignInModal = ({
  isOpen,
  onClose,
  redirectUrl,
}: {
  isOpen: boolean;
  onClose: () => void;
  redirectUrl: string;
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} type="signup">
      <SignIn
        // path="/sign-in"
        // routing="path"
        signUpUrl="/sign-in"
        redirectUrl={redirectUrl}
      />
    </Modal>
  );
};

export default SignInModal;
