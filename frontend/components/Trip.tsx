import React from 'react';
import styled from 'styled-components';

type Activity = {
  name: string;
  imageSrc: string;
};

type TripProps = {
  startDate: string;
  endDate: string;
  travelLocation: string;
  activities: Activity[];
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const Trip: React.FC<TripProps> = ({ ...props }) => {
  const formatDate = (dateString: string) => {
    // Format yyyy-mm-dd
    const year = Number(dateString.slice(0, 4));
    const month = MONTHS[Number(dateString.slice(5, 7)) - 1];
    const day = Number(dateString.slice(8));
    return `${month} ${day}, ${year}`;
  };

  return (
    <CardWrapper>
      <CardSection>
        <b>Trip to {props.travelLocation}: </b>
        {formatDate(props.startDate)} - {formatDate(props.endDate)}
      </CardSection>
      <CardLine />
      <CardSection>
        <b>Activities</b>
        {/* TODO: add carousel for multiple activities */}
        <CardImg />
      </CardSection>
    </CardWrapper>
  );
};

export default Trip;

/* Styles */

const CardWrapper = styled.div`
  border-radius: 16px;
  color: white;
  background: linear-gradient(to right, #fc466b, #3f5efb);
  margin-top: 20px;
  width: 400px;
`;

const CardSection = styled.div`
  padding: 20px;
`;

const CardImg = styled.img`
  margin-top: 16px;
  background: #fff;
  border-radius: 8px;
  height: 160px;
  width: 100%;
`;

const CardLine = styled.div`
  border-bottom: 2px solid #fff;
`;
