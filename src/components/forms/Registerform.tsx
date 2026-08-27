"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Paper,Snackbar,Alert,Box,InputAdornment,IconButton,Typography,Button,TextField,Checkbox,FormControl,InputLabel,Select,MenuItem,Radio,RadioGroup,FormControlLabel,FormLabel, Grid } from "@mui/material";
import { Controller } from "react-hook-form";
import { useState,useEffect } from "react";
import { RegisterFormData } from "@/types/register";
import { registerSchema } from "@/schemas/registerSchema";
import Visibility from "@mui/icons-material/Visibility";
import  VisibilityOff  from "@mui/icons-material/VisibilityOff";
import FormInput from "./FormInput";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterForm() {

    const form = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        mode: "onChange",        
        reValidateMode: "onChange",

        defaultValues: {
            userName:"",
            email: "",
            phone: "",
            country: "",
            gender: "",
            password: "",
            confirmPassword: "",
            agreeToTerms: false,
        },
    });

    const {register,handleSubmit,control,watch,reset,trigger, formState,
    } = form;
    const password = watch("password");
    const confirmPassword = watch("confirmPassword");

    useEffect(() => {
    if (confirmPassword) {
        trigger("confirmPassword");
    }
    }, [password]);

    const {
        errors,
        isSubmitting,
    } = formState;
    const [openSnackBar,setOpenSnackBar]=useState(false);
    const [snackBarMessage,setSnackBarMessage]=useState("");
    const [snackBarSeverity,setSnackBarSeverity]=useState<"success"|"error">("success");
    const router =useRouter();

    const  onSubmit = async (data: RegisterFormData) => {
    try {
        const response = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            setSnackBarSeverity("error");
            setSnackBarMessage(result.message || "Registration failed");
            setOpenSnackBar(true);
            return;
        }

        setSnackBarSeverity("success");
        setSnackBarMessage("Account created successfully!");
        setOpenSnackBar(true);
        reset();
        // registration always creates a customer account
        router.push("/tickets");
        
    } catch (error) {
        // Network error, server unreachable, etc.
        setSnackBarSeverity("error");
        setSnackBarMessage("Could not reach the server. Please try again.");
        setOpenSnackBar(true);
    }
    };
    const countries = [
        "Select Country","Pakistan","USA","India","UK","Switzerland"
    ];
    
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword,setShowConfirmPassword]= useState(false);

    const handleClickShowPassword = () => {
        setShowPassword((prev) => !prev);
    };
    const handleClickShowConfirmPassword =()=>{
        setShowConfirmPassword((prev)=>!prev);
    };
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault(); 
    };
    return (
        <Paper elevation={3} sx={{maxWidth:500,mt:5,mx:"auto",p:4,borderRadius:3}}>
            <Typography variant="h4" sx={{mb:3,fontWeight:"bold",textAlign:"center"}}>
                Create Account
            </Typography>
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <FormInput 
                name="userName" 
                label="username*"
                register={register}
                error={errors.userName}/>
                <FormInput 
                name="email" 
                label="Email*"
                register={register}
                error={errors.email}/>
                
                <FormInput 
                name="phone" 
                label="Phone*"
                register={register}
                error={errors.phone}/>

                <Controller
                    name="country"
                    control={control}
                    render={({ field }) => (
                        <FormControl
                        fullWidth
                        margin="normal"
                        error={!!errors.country}
                        >
                        <InputLabel id="country-label">Country*</InputLabel>

                        <Select
                            {...field}
                            labelId="country-label"
                            id="country"
                            label="Country*"
                        >
                            {countries.map((country) => (
                            <MenuItem
                                key={country}
                                value={country}
                            >
                                {country}
                            </MenuItem>
                            ))}
                        </Select>

                        <Typography
                            color="error"
                            variant="caption"
                        >
                            {errors.country?.message}
                        </Typography>
                        </FormControl>
                    )}
                />

                <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                        <FormControl
                        margin="normal"
                        error={!!errors.gender}
                        >
                        <FormLabel>Gender*</FormLabel>

                        <RadioGroup
                            row
                            {...field}
                        >
                            <FormControlLabel
                            value="Male"
                            control={<Radio />}
                            label="Male"
                            />

                            <FormControlLabel
                            value="Female"
                            control={<Radio />}
                            label="Female"
                            />

                            <FormControlLabel
                            value="Other"
                            control={<Radio />}
                            label="Other"
                            />
                        </RadioGroup>

                        <Typography
                            variant="caption"
                            color="error"
                        >
                            {errors.gender?.message}
                        </Typography>
                        </FormControl>
                    )}
                />

                <TextField label="Password*" fullWidth margin="normal" variant="outlined"
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
                    }}

               
                />

                <TextField label="Confirm Password*" fullWidth margin="normal" variant="outlined"
                {...register("confirmPassword")}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                type={showConfirmPassword?'text':'password'}
                slotProps={{
                    input:{
                        endAdornment:(
                            <InputAdornment position="end">
                                <IconButton 
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowConfirmPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end" >
                                    {showConfirmPassword?<Visibility/>:<VisibilityOff/>}

                                </IconButton>
                            </InputAdornment>
                        )
                    }
                }}/>

                <Controller
                    name="agreeToTerms"
                    control={control}
                    render={({ field }) => (
                        <>
                        <FormControlLabel
                            control={
                            <Checkbox
                                checked={field.value}
                                onChange={(e) =>
                                field.onChange(e.target.checked)
                                }
                            />
                            }
                            label="I agree to the Terms & Conditions*"
                        />

                        <Typography
                            color="error"
                            variant="caption"
                        >
                            {errors.agreeToTerms?.message}
                        </Typography>
                        </>
                    )}
                    />

                
                

                <Button type="submit" variant="contained" fullWidth disabled={isSubmitting} sx={{ mt: 3 }}>
                    {isSubmitting ? "Creating Account..." : "Create Account"}
                </Button>
                <Typography sx={{ mt: 2, textAlign: "center" }}>
                    Already have an account?{" "}
                    <Link href="/login" style={{ color: "#1976d2", fontWeight: 500 }}>
                        Login
                    </Link>
                </Typography>
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

        </Paper>
    );
}