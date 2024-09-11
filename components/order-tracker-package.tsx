import React from 'react';

export enum Status {
  Order = 'Order Placed',
  Processed = 'Processed',
  Picked = 'Picked',
  Shipped = 'Shipped',
  HubNear = 'Hub Near',
  Enroute = 'Enroute',
  Delivered = 'Delivered',
}

export class TextDto {
  constructor(public title: string, public date: string) {}
}

interface OrderTrackerProps {
  headingDateTextStyle?: React.CSSProperties;
  headingTitleStyle?: React.CSSProperties;
  subTitleTextStyle?: React.CSSProperties;
  subDateTextStyle?: React.CSSProperties;
  status: Status;
  activeColor: string;
  inActiveColor: string;
  orderTitleAndDateList?: TextDto[];
  shippedTitleAndDateList?: TextDto[];
  outOfDeliveryTitleAndDateList?: TextDto[];
  deliveredTitleAndDateList?: TextDto[];
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({
  headingDateTextStyle,
  headingTitleStyle,
  subTitleTextStyle,
  subDateTextStyle,
  status,
  activeColor,
  inActiveColor,
  orderTitleAndDateList = [],
  shippedTitleAndDateList = [],
  outOfDeliveryTitleAndDateList = [],
  deliveredTitleAndDateList = [],
}) => {
  const renderTrackingStep = (title: string, date: string, isActive: boolean, isCompleted: boolean) => (
    <div className={`flex items-center ${isActive ? 'opacity-100' : 'opacity-50'}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-gray-200'} flex items-center justify-center mr-4`}>
        {isCompleted && (
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </div>
      <div>
        <div className="text-sm font-medium" style={headingTitleStyle}>{title}</div>
        <div className="text-xs" style={headingDateTextStyle}>{date}</div>
      </div>
    </div>
  );

  const allSteps = [
    ...orderTitleAndDateList,
    ...shippedTitleAndDateList,
    ...outOfDeliveryTitleAndDateList,
    ...deliveredTitleAndDateList,
  ];

  const getStepStatus = (index: number) => {
    const statusIndex = Object.values(Status).indexOf(status);
    return {
      isActive: index <= statusIndex,
      isCompleted: index < statusIndex,
    };
  };

  return (
    <div className="space-y-8">
      {allSteps.map((step, index) => {
        const { isActive, isCompleted } = getStepStatus(index);
        return (
          <div key={index} className={index !== allSteps.length - 1 ? 'pb-8 border-l-2 border-gray-200 ml-4' : ''}>
            {renderTrackingStep(step.title, step.date, isActive, isCompleted)}
          </div>
        );
      })}
    </div>
  );
};