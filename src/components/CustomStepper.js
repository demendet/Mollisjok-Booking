import React from 'react';
import { Stepper, Step, StepLabel } from '@mui/material';

const CustomStepper = ({ steps, activeStep }) => {
  return (
    <Stepper activeStep={activeStep} style={{ background: 'transparent', color: '#f0f0f0' }}>
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel style={{ color: '#f0f0f0' }}>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default CustomStepper;
