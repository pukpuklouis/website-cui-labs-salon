import React from "react";
import BookingPlaceholder from "./BookingPlaceholder";

interface BookingContainerProps {
  /** Future iframe URL for booking system */
  iframeUrl?: string;
  /** Future iframe title */
  iframeTitle?: string;
}

/**
 * Container for the booking component.
 * Currently renders a static placeholder.
 *
 * In the future, replace the placeholder with an iframe:
 *
 * {iframeUrl && (
 *   <iframe src={iframeUrl} title={iframeTitle} className="w-full h-[800px] border-0" />
 * )}
 */
const BookingContainer: React.FC<BookingContainerProps> = (_props) => {
  return (
    <div className="w-full" data-oid="xv6p:ub">
      <BookingPlaceholder data-oid="_8f1::g" />
    </div>
  );
};

export default BookingContainer;
