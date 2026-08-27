import {z} from "zod"
 export const registerSchema=z.object({
    userName:z.string().min(5,"User Name al least have 5 characters").max(30,"should not exceed 30 characters"),
    email:z.email("Invalid email address"),
    phone:z.string().min(1,"Number is required").regex(/^03\d{9}$/,"enter valid pakistani number"),
    country:z.string().min(1,"please select a country"),
    gender:z.string().min(1,"please select a gender"),
    password:z.string().min(8,"at least 8 characters").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,"Password must contain uppercase, lowercase and number"),
    confirmPassword:z.string().min(1,"Confirm password is required"),
    agreeToTerms: z.boolean().refine((value) => value, {message: "You must accept the terms and conditions",}),
    

 }).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });