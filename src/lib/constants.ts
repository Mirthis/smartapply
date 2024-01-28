import { Code, NotebookTabs, UsersRound } from "lucide-react";

import { InterviewType } from "~/types/types";

export const featureCardsData = [
  {
    title: "Make Your Application Stand out: Personalized Cover Letters",
    description:
      "Say goodbye to writer&apos;s block and generic cover letters with our instant cover letter generation feature. Simply input your job application details and let our AI-powered tool create a personalized cover letter for you in seconds. But that&apos;s not all. You can also refine the letter by providing free text feedback to the AI to ensure that your cover letter is tailored to your specific qualifications and experiences. With this feature, you can save time and energy while still submitting a high-quality cover letter.",
    imgName: "feature-cover-letter.jpg",
  },
  {
    title: "Practice Makes Perfect: Interview Simulation",
    description:
      "Prepare for your interview with confidence with our chatbot interview simulation feature. Our chatbot can simulate three types of interviews, including HR, technical, and leadership, allowing you to practice and refine your interview skills beforethe big day. The chatbot will ask you questions, and you canrespond in a natural and conversational way, just like you wouldduring an actual interview. This feature will help you feel more comfortable and prepared during your actual interview.",
    imgName: "feature-interview.jpg",
  },
  {
    title: "Test Your Knowledge: Multiple Choice Questions",
    description:
      "Our multiple choice questions feature allows you to test your knowledge and get a feel for the types of questions you might encounter during an interview. Our AI generates questions based on the job you are applying for, and you can use these questions to identify areas where you may need to brush up on your knowledge or skills. This feature is a great way to improve your interview performance and boost your confidence.",
    imgName: "feature-test.jpg",
  },
];

export const interviewTypeCardData = [
  {
    title: "Standard Interview",
    description: "Standard interview based on the job spec.",
    icon: NotebookTabs,
    type: InterviewType.generic,
  },
  {
    title: "HR Interview",
    description:
      "Simulate an HR interview focuing on soft skills and high-level assessment of the applicant.",
    icon: UsersRound,
    type: InterviewType.hr,
  },
  {
    title: "Technical Interview",
    description:
      "Simulate a technical interview focuing on the applicant&apos;s technical skills.",
    icon: Code,
    type: InterviewType.tech,
  },
];
