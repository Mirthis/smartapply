// import { getAuth } from "@clerk/nextjs/server";
// import { z } from "zod";

// import { type NextRequest } from "next/server";

// const requestSchema = z.object({
//   resumeText: z.string(),
// });

// export default async function handler(request: NextRequest) {
//   // const requestData = requestSchema.parse(await request.());
//   const { userId } = getAuth(request);
//   if (!userId) {
//     return new Response("Unauthorized", { status: 401 });
//   }

//   const requestData = requestSchema.parse(await request.json());
//   const { resumeText } = requestData;

//   try {
//     const stream = await OpenAI("chat", {
//       model: "gpt-3.5-turbo",
//       messages: [
//         {
//           content: `I want you to extract the applicant details from the resume text provided.
//             Details needed are first name and last name, resume summmary, skills and professional experience (company name, job title, job description).
//             Result should be in JSON format: { firstName: string, lastName: string, summary: string, skills: string[], experience: { company: string, title: string, description: string }[] }`,
//           role: "system",
//         },
//         {
//           content: resumeText,
//           role: "user",
//         },
//       ],
//     });

//     return new Response(stream);
//   } catch (error) {
//     console.error(error);
//     return new Response("Internal Server Error", { status: 500 });
//   }
// }

// export const config = {
//   runtime: "edge",
// };
