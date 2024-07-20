import { date, object, string } from "zod";
import validator from "validator";

export const signInSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password must be at most 32 characters"),
});

export const userSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .max(120, "Email must be at most 120 characters")
    .email("Invalid email"),
  name: string({ required_error: "Name is required" })
    .min(1, "Name is required")
    .max(120, "Name must be at most 120 characters"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password must be at most 32 characters"),
});

export const eventSchema = object({
  name: string({ required_error: "Name is required" })
    .min(1, "Name is required")
    .max(120, "Name must be at most 120 characters"),
  description: string().max(
    5000,
    "Description must be at most 5000 characters",
  ),
});

export const scheduleSchema = object({
  name: string({ required_error: "Name is required" })
    .min(1, "Name is required")
    .max(120, "Name must be at most 120 characters"),
});

export const sessionSchema = object({
  place: string().max(5000, "Location must be at most 5000 characters"),
  timeZone: string().max(120, "Time zone must be at most 5000 characters"),
  startDate: string().refine(
    (x) =>
      validator.isDate(x, {
        format: "DD/MM/YYYY",
      }),
    { message: "Invalid start date" },
  ),
  endDate: string().refine(
    (x) =>
      validator.isDate(x, {
        format: "DD/MM/YYYY",
      }),
    { message: "Invalid end date" },
  ),
  startTime: string().refine(validator.isTime, {
    message: "Invalid start time",
  }),
  endTime: string().refine(validator.isTime, { message: "Invalid end time" }),
  interval: string().refine(validator.isNumeric, {
    message: "Interval must be a number",
  }),
});
