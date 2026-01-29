'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface MultiStepFormContextValue {
    currentStep: number;
    nextStep: () => void;
    prevStep: () => void;
}

const MultiStepFormContext = createContext<MultiStepFormContextValue | null>(
    null,
);

interface MultiStepFormProviderProps {
    children: ReactNode;
    totalSteps: number;
}

export function MultiStepFormProvider({
    children,
    totalSteps,
}: MultiStepFormProviderProps) {
    const [currentStep, setCurrentStep] = useState(0);

    const nextStep = () => {
        setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
    };

    const prevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    const value: MultiStepFormContextValue = {
        currentStep,
        nextStep,
        prevStep,
    };

    return (
        <MultiStepFormContext.Provider value={value}>
            {children}
        </MultiStepFormContext.Provider>
    );
}

export function useMultiStepForm() {
    const context = useContext(MultiStepFormContext);

    if (!context) {
        throw new Error(
            'useMultiStepForm must be used within MultiStepFormProvider',
        );
    }

    return context;
}

// --- Usage example ---
//
// const STEPS = [<StepOne />, <StepTwo />, <StepThree />];
//
// function FormContent() {
//     const { currentStep, nextStep, prevStep } = useMultiStepForm();
//     return (
//         <>
//             {STEPS[currentStep]}
//             <button onClick={prevStep} disabled={currentStep === 0}>Back</button>
//             <button onClick={nextStep} disabled={currentStep === STEPS.length - 1}>Next</button>
//         </>
//     );
// }
//
// export default function CheckoutPage() {
//     return (
//         <MultiStepFormProvider totalSteps={STEPS.length}>
//             <FormContent />
//         </MultiStepFormProvider>
//     );
// }
