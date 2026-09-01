import React from 'react';
import { CitizenComplaintForm } from '../components/citizen/CitizenComplaintForm';

export const FileComplaintPage = ({ onComplaintCreated }) => {
  return (
    <div style={{ maxWidth: '880px', margin: '0 auto' }}>
      <CitizenComplaintForm onComplaintCreated={onComplaintCreated} />
    </div>
  );
};
