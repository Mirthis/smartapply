import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useState, type ComponentType } from "react";
import { SignInModal } from "./modals/SignInModal";

const ServiceCard = ({
  url,
  title,
  description,
  Icon,
}: {
  url: string;
  title: string;
  description: string;
  Icon: ComponentType<{ className?: string }>;
}) => {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();
  const [modalState, setModalState] = useState({
    isOpen: false,
    redirectUrl: "",
  });

  const openModal = (redirectUrl: string) => {
    setModalState({ isOpen: true, redirectUrl });
  };

  return (
    <>
      <SignInModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, redirectUrl: "" })}
        redirectUrl={modalState.redirectUrl}
      />
      {isLoaded && (
        <button
          onClick={userId ? () => void router.push(url) : () => openModal(url)}
        >
          <div className="card h-full w-full bg-base-200  hover:bg-base-300 lg:w-96">
            <div className="card-body items-center text-center">
              <Icon className="h-16 w-16" />
              <h2 className="card-title">{title}</h2>
              <p>{description}</p>
            </div>
          </div>
        </button>
      )}
    </>
  );
};

export default ServiceCard;
