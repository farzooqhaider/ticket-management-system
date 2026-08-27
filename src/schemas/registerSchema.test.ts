import { registerSchema } from "./registerSchema"

const validData = {
  userName:"ali",
  email: "ali@example.com",
  phone: "03001234567",
  country: "Pakistan",
  gender: "Male",
  password: "Password1",
  confirmPassword: "Password1",
  agreeToTerms: true,
}

test("passes with valid data", () => {
  const result = registerSchema.safeParse(validData)
  expect(result.success).toBe(true)
})

test("fails when phone number is invalid", () => {
  const result = registerSchema.safeParse({
    ...validData,
    phone: "12345",
  })
  expect(result.success).toBe(false)
})

test("fails when passwords don't match", () => {
  const result = registerSchema.safeParse({
    ...validData,
    confirmPassword: "Different1",
  })
  expect(result.success).toBe(false)
})

test("fails when agreeToTerms is false", () => {
  const result = registerSchema.safeParse({
    ...validData,
    agreeToTerms: false,
  })
  expect(result.success).toBe(false)
})