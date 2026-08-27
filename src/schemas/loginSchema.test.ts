import { loginSchema } from "./loginSchema"

test("passes with valid email and password", () => {
  const result = loginSchema.safeParse({
    email: "test@example.com",
    password: "12345678",
  })

  expect(result.success).toBe(true)
})

test("fails when password is too short", () => {
  const result = loginSchema.safeParse({
    email: "test@example.com",
    password: "123",
  })

  expect(result.success).toBe(false)
})

test("fails when email is invalid", () => {
  const result = loginSchema.safeParse({
    email: "not-an-email",
    password: "12345678",
  })

  expect(result.success).toBe(false)
})