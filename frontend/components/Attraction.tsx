import React from 'react';

type AttractionProps = {
  name: string;
  rating: number;
  img_url: string;
  tags: string[];
  labels: string[];
};

const Attraction: React.FC<AttractionProps> = ({ ...props }) => {
  return (
    <div className="border-grey w-80%">
      <img src={props.img_url} className="max-w-20 max-h-20" />
      <h1>{props.name}</h1>
      <p>{props.rating}</p>
      <p>Tags: {props.tags.join(' ,')}</p>
      <p>Labels: {props.labels.join(' ,')}</p>
    </div>
  );
};

export default Attraction;
