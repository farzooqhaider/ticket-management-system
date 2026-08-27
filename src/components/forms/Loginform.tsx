"use client"
import { TextField,Button,Typography,Paper,Box,IconButton,InputAdornment,Snackbar,Alert} from "@mui/material";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schemas/loginSchema";
import { LoginFormData } from "@/types/auth";
import Visibility from "@mui/icons-material/Visibility";
import  VisibilityOff  from "@mui/icons-material/VisibilityOff";

export default function LoginForm(){
    const {
  register,
  handleSubmit,reset,
  formState: { errors, isSubmitting },
} = useForm<LoginFormData>({
  resolver: zodResolver(loginSchema),
});
const [showPassword, setShowPassword] = useState(false);
const [openSnackBar,setOpenSnackBar]=useState(false);
const [snackBarMessage,setSnackBarMessage]=useState("");
const [snackBarSeverity,setSnackBarSeverity]=useState<"success"|"error">("success");
const router = useRouter();

const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault(); 
};
const handleClickShowPassword = () => {
        setShowPassword((prev) => !prev);
};
const onSubmit = async (data: LoginFormData) => {
  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      setSnackBarSeverity("error");
      setSnackBarMessage(result.message || "Login failed");
      setOpenSnackBar(true);
      return;
    }

    setSnackBarSeverity("success");
    setSnackBarMessage("Login successful!");
    setOpenSnackBar(true);
    reset();

    router.push(result.user.role === "ADMIN" ? "/admin/dashboard" : "/tickets");
  } catch (error) {
    setSnackBarSeverity("error");
    setSnackBarMessage("Could not reach the server. Please try again.");
    setOpenSnackBar(true);
  }
};
    return(
        <Box sx={{minHeight:"90vh",display:"flex",justifyContent:"center",alignItems:"center",bgcolor:"background.default"}}>
            <Paper elevation={4} sx={{width:420,p:4,borderRadius:4}}>
                <Typography variant="h4" sx={{mb:3,textAlign:"center",fontWeight:"bold"}}>
                    Login
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField label="Email" fullWidth margin="normal" 
                    {...register("email")}
                    error={!!errors.email}
                    helperText={errors.email?.message}/>
                    <TextField label="Password" fullWidth margin="normal" 
                    {...register("password")}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    type={showPassword ? 'text' : 'password'}
                slotProps={{
                    input:{
                    endAdornment: (
                    <InputAdornment position="end">
                    <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end" // Pushes the icon slightly to the right to align better
                    >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                    </InputAdornment>
                    ),
                }
                    }}/>
                    <Button variant="contained" type="submit" fullWidth sx={{mt:3}} disabled={isSubmitting}>
                        {isSubmitting ? "Logging in..." : "Login"}
                    </Button>
                </form>
                <Typography sx={{ mt: 2, textAlign: "center" }}>
                    Don&apos;t have an account?{" "}
                    <Link href="/register" style={{ color: "#1976d2", fontWeight: 500 }}>
                        Register
                    </Link>
                </Typography>
            </Paper>
            <Snackbar
                open={openSnackBar}
                autoHideDuration={3000}
                onClose={()=>setOpenSnackBar(false)}>
                <Alert
                severity={snackBarSeverity}
                variant="filled"
                onClose={()=>{setOpenSnackBar(false)}}>
                {snackBarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}