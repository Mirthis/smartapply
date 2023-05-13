import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import Title from "../Title";

const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  type = "standard",
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  type?: "standard" | "signup";
}) => {
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto ">
            <div className="flex min-h-full items-center justify-center p-2 text-center sm:p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className={`${
                    type === "standard"
                      ? "bg-base-100  p-2 sm:p-6"
                      : "bg-transparent p-0"
                  } w-full max-w-xl transform overflow-hidden rounded-2xl  text-left align-middle shadow-xl transition-all `}
                >
                  <div className="mb-8 flex items-center justify-between">
                    {title && (
                      <Dialog.Title as="h3">
                        <Title title={title} type="subsection" />`
                      </Dialog.Title>
                    )}
                    <button
                      className="btn-ghost btn-sm btn-circle btn text-center"
                      onClick={onClose}
                    >
                      <XMarkIcon className="h-6 w-6 " />
                    </button>
                  </div>
                  {children}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Modal;
