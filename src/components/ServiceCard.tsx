import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useState, type ComponentType } from "react";
import { SignInModal } from "./modals/SignInModal";
import { BasicCard } from "./BasicCard";

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

  const onClick = userId ? () => void router.push(url) : () => openModal(url);

  return (
    <>
      <SignInModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, redirectUrl: "" })}
        redirectUrl={modalState.redirectUrl}
      />
      {isLoaded && (
        <BasicCard
          url={url}
          title={title}
          description={description}
          Icon={Icon}
          onClick={onClick}
        />
      )}
    </>
  );
};

export default ServiceCard;
