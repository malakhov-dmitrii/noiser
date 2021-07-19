import React from 'react';

function iframe() {
  return {
    __html: '<iframe src="/privacy.html" style="width: 100%; height: 100vh;"></iframe>',
  };
}

const Privacy = () => {
  // eslint-disable-next-line react/no-danger
  return <div dangerouslySetInnerHTML={iframe()} />;
};

export default Privacy;
