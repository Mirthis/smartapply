import { Transition } from "@headlessui/react";

const OpacityTransition = ({
  show,
  appear = false,
  noFadeOut = false,
  children,
}: {
  show: boolean;
  appear?: boolean;
  noFadeOut?: boolean;
  children: React.ReactNode;
}) => {
  return (
    <Transition
      appear={appear}
      show={show}
      enter="transition-opacity duration-1000"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave={`transition-opacity  ${
        noFadeOut ? "duration-0" : "duration-1000"
      }`}
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      {children}
    </Transition>
  );
};

export default OpacityTransition;
