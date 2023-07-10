import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";

import { api } from "~/utils/api";
import { useRecaptcha } from "~/utils/hooks";

import Spinner from "~/components/utils/Spinner";

import { contactFormSchema } from "~/types/schemas";
import { type ContactFormData } from "~/types/types";

const ContactForm = () => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: "onTouched",
  });

  const { handleReCaptchaVerify, captchaError } = useRecaptcha();

  const {
    mutate: sendMail,
    isLoading: isSubmitting,
    isSuccess: isSubmitSuccessful,
    isError: isSubmitError,
  } = api.contact.sendMail.useMutation({ onSuccess: () => reset() });

  const onSubmit = async (data: ContactFormData) => {
    const token = await handleReCaptchaVerify();
    if (token) {
      sendMail({ ...data, captchaToken: token });
    }
  };

  return (
    <>
      {isSubmitSuccessful && (
        <p>
          Your message has been sent!
          <br />
          Thanks for contacting us. We will get back to you soon.
        </p>
      )}
      {!isSubmitSuccessful && (
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-y-4">
            <div>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  className="peer input-bordered input-primary input block w-full focus:outline-offset-0"
                  placeholder=" "
                  disabled={isSubmitting}
                  {...register("name")}
                />
                <label
                  htmlFor="name"
                  className="absolute left-1 top-1 z-10 origin-[0] -translate-y-4 scale-75 transform bg-base-100 px-2 font-extralight duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-1 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:font-normal peer-focus:text-primary"
                >
                  Your Name
                </label>
              </div>
              {errors.name && (
                <p className="text-error">{errors.name.message}</p>
              )}
            </div>
            <div>
              <div className="relative">
                <input
                  type="text"
                  id="email"
                  className="peer input-bordered input-primary input block w-full focus:outline-offset-0"
                  placeholder=" "
                  disabled={isSubmitting}
                  {...register("email")}
                />
                <label
                  htmlFor="email"
                  className="absolute left-1 top-1 z-10 origin-[0] -translate-y-4 scale-75 transform bg-base-100 px-2 font-extralight duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-1 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:font-normal peer-focus:text-primary"
                >
                  Your e-mail
                </label>
              </div>
              {errors.email && (
                <p className="text-error">{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <input
                  type="text"
                  id="subject"
                  className="peer input-bordered input-primary input block w-full focus:outline-offset-0"
                  placeholder=" "
                  disabled={isSubmitting}
                  {...register("subject")}
                />
                <label
                  htmlFor="subject"
                  className="absolute left-1 top-1 z-10 origin-[0] -translate-y-4 scale-75 transform bg-base-100 px-2 font-extralight duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-1 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:font-normal peer-focus:text-primary"
                >
                  Subject
                </label>
              </div>
              {errors.subject && (
                <p className="text-error">{errors.subject.message}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <textarea
                  id="message"
                  className="peer textarea-bordered textarea-primary textarea w-full  focus:outline-offset-0"
                  placeholder=" "
                  disabled={isSubmitting}
                  {...register("message")}
                  rows={4}
                />
                <label
                  htmlFor="message"
                  className="absolute left-1 top-1 z-10 origin-[0] -translate-y-4 scale-75 transform bg-base-100 px-2 font-extralight duration-300 peer-placeholder-shown:top-6 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-1 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:font-normal peer-focus:text-primary"
                >
                  Message Body
                </label>
              </div>
              {errors.message && (
                <p className="text-error">{errors.message.message}</p>
              )}
            </div>
            <button
              className="btn-primary btn"
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? <Spinner text="Sending..." /> : <>Send Message</>}
            </button>
            {isSubmitError && (
              <p className="text-error">
                An error occurred while sending your message. Please try again
                later.
              </p>
            )}
            {captchaError && (
              <p className="text-error">
                An error occurred while verifying your humanity. Please try
                again later.
              </p>
            )}
          </div>
        </form>
      )}
    </>
  );
};

export default ContactForm;
