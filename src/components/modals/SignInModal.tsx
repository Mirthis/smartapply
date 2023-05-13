import { SignUp } from "@clerk/nextjs";
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
      <SignUp
        // path="/sign-in"
        // routing="path"
        signInUrl="/sign-in"
        redirectUrl={redirectUrl}
      />
    </Modal>
  );
};
