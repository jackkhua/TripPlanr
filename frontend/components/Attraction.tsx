import React from 'react';

type AttractionProps = {
  name: string;
  rating: number;
  img_url: string;
  tags: string[];
  labels: string[];
  url: string;
};

const Attraction: React.FC<AttractionProps> = ({ ...props }) => {
  return (
    <a href={props.url} rel="noreferrer noopener">
      <div className="my-7 grid w-full grid-cols-2 rounded-lg border border-slate-800">
        <div>
          {props.img_url === 'NaN' ? (
            <div className="h-[144px] w-[256px] rounded-lg bg-orange-200" />
          ) : (
            <img src={props.img_url} className="h-[144px] w-[256px] rounded-lg" />
          )}
        </div>
        <div>
          <h1 className="text-2xl">{props.name}</h1>
          <p className="text-xl">Rating: {props.rating}/5 &#11088;</p>
          <p className="text-l">Tags: {props.tags.join(', ')}</p>
          <p className="text-l">Labels: {props.labels.join(', ')}</p>
        </div>
      </div>
    </a>
  );
};

export default Attraction;
