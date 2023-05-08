/* eslint-disable @typescript-eslint/no-misused-promises */
import { zodResolver } from "@hookform/resolvers/zod";
import { type NextPage } from "next";
import Head from "next/head";
import { useForm } from "react-hook-form";
import Title from "~/components/Title";
import Spinner from "~/components/utils/Spinner";
import { contactFormSchema } from "~/types/schemas";
import { type ContactFormData } from "~/types/types";
import { api } from "~/utils/api";
import { useRecaptcha } from "~/utils/hooks";

const ContactPage: NextPage = () => {
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
      <Head>
        <title>SmartApply - Contact Us</title>
        <meta
          property="og:title"
          content="SmartApply - Contact Us"
          key="title"
        />
      </Head>
      <Title title="Contact" />
      {isSubmitSuccessful && (
        <p>
          Your message has been sent!
          <br />
          Thanks for contacting us. We will get back to you soon.
        </p>
      )}
      {!isSubmitSuccessful && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-y-4">
            <div>
              <input
                type="text"
                className="input-bordered input w-full"
                placeholder="Your name"
                disabled={isSubmitting}
                {...register("name")}
              />
              {errors.name && (
                <p className="text-error">{errors.name.message}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                className="input-bordered input w-full"
                placeholder="Your e-mail"
                disabled={isSubmitting}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-error">{errors.email.message}</p>
              )}
            </div>

            <div>
              <input
                type="text"
                className="input-bordered input w-full"
                placeholder="Message Subject"
                disabled={isSubmitting}
                {...register("subject")}
              />
              {errors.subject && (
                <p className="text-error">{errors.subject.message}</p>
              )}
            </div>

            <div>
              <textarea
                className="textarea-bordered textarea w-full"
                placeholder="Message Body"
                disabled={isSubmitting}
                {...register("message")}
                rows={4}
              />
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

export default ContactPage;
