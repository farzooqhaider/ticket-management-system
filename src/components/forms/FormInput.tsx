import {FieldError,UseFormRegister} from "react-hook-form";
import { RegisterFormData } from "@/types/register";
import { TextField } from "@mui/material";

interface FormInputProps{

    name:keyof RegisterFormData;

    label:string;

    register:UseFormRegister<RegisterFormData>;

    error?:FieldError;

    type?:string;
    }
    
    export default function FormInput({
        name,
        label,
        register,
        error,
        type="text",

    }:FormInputProps){

    return(

        <TextField

            label={label}

            type={type}

            fullWidth

            margin="normal"

            {...register(name)}

            error={!!error}

            helperText={error?.message}

        />

    );

}