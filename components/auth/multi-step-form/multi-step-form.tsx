"use client";

import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { RegisterAccounnt } from "@/server/actions/register";
import { toast } from "sonner"
import Link from "next/link";
import StepOne from "./step-one";
import StepTwo from "./step-two";
import StepThree from "./step-three";
import { z } from "zod";
import { RegisterSchema } from "@/types/register-schema";



export default function MultiStepForm() {
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        firstName: "",
        location: "",
        lastName: "",
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleNextStep = (data: any) => {
        setFormData((prev) => ({ ...prev, ...data }));
        setCurrentStep(currentStep + 1);
    };

    const handlePreviousStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const progressValue = (currentStep / 3) * 100;


    const stepText = () => {
        switch (currentStep) {
            case 1:
                return "Step 1 - Create Account";
            case 2:
                return "Step Two - Skill Level";
            case 3:
                return "Step Three - Create Password";
            default:
                return "";
        }
    };

    const router = useRouter();

    const { execute } = useAction(RegisterAccounnt, {
        onSuccess(data) {
            if (data.data?.error) {
                toast.error(data.data.error)
            }
            if (data.data?.success) {
                toast.success(data.data.success)
                router.push("/login")
            }
        }
    });

    const finalSubmit = (
        values: z.infer<typeof RegisterSchema>
    ) => {
        execute(values);
    };


    return (
        <div className="w-2/3 p-8 flex flex-col">
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-2">
                    {stepText()}
                </h1>
                <Progress value={progressValue} className="h-2" />
            </div>

            <div className="flex-grow flex flex-col justify-center max-w-md mx-auto w-full">
                {currentStep === 1 && (
                    <StepOne onNext={handleNextStep} />
                )}
                {currentStep === 2 && (
                    <StepTwo
                        onNext={handleNextStep}
                        onBack={handlePreviousStep}
                    />
                )}
                {currentStep === 3 && (
                    <StepThree
                        onBack={handlePreviousStep}
                        handleSubmit={finalSubmit}
                        formData={formData}
                    />
                )}
            </div>

            <p className="text-center text-gray-600 text-sm mt-6">
                Already have an account?{" "}
                <Link
                    href="/login"
                    className="text-primary hover:underline"
                >
                    Log In
                </Link>
            </p>
        </div>
    )
}