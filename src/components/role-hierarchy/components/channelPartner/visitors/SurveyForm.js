import React from 'react';

const SurveyForm = ({survayData}) => {
    if (!survayData || survayData.length === 0) {
      return (
        <div className="text-center p-4">
          Not Found !
        </div>
      );
    }
    const getSurvay = () => {
      return survayData.map((data) => {
        return (
          <div className="bg-white py-3 px-3 border mt-3 survey-card">
              <p className="fs-16 fw-600 mb-2">{data.title}</p>
              <p className="fs-12 mb-0">{data.answer}</p>
          </div>
        );
      });
    }
    return (
        <div>
          {getSurvay()}
        </div>
    )
}

export default SurveyForm;
