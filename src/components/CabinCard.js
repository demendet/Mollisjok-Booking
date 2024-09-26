import React from 'react';

import { Kitchen, SmokeFree, Person } from '@mui/icons-material';
import './CabinCard.css';

const CabinCard = ({ cabin, onSelect, isSelected, isUnavailable }) => {



  return (
    <div
      className={`cabin-card ${isSelected ? 'selected-cabin' : ''} ${
        isUnavailable ? 'unavailable' : ''
      }`}
      onClick={!isUnavailable ? onSelect : null}
    >
      {cabin.imageUrl && <img src={cabin.imageUrl} alt={cabin.name} />}
      <div className="cabin-details">
        <h3>{cabin.name}</h3>
        <div className="cabin-info">
          <div className="icon-background">
            <Person className="icon" />
            <span>{cabin.maxGuests}</span>
          </div>
          {cabin.refrigerator && (
            <div className="icon-background">
              <Kitchen className="icon" />
            </div>
          )}
          {cabin.nonSmoking && (
            <div className="icon-background">
              <SmokeFree className="icon" />
            </div>
          )}
        </div>
        <p>{cabin.description}</p>
        <p>Price per night per person: {cabin.basePrice} kr</p>
        {isUnavailable && (
          <p className="unavailable-text">Unavailable for selected dates</p>
        )}
      </div>
    </div>
  );
};

// Remove AvailabilityCalendar since it's not being used
// Remove unused imports for Accordion, AccordionSummary, AccordionDetails, and ExpandMoreIcon

export default CabinCard;
