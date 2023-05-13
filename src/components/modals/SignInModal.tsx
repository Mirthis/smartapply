import { SignIn } from "@clerk/nextjs";
import Modal from "./Modal";

export const SignInModal = ({
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
