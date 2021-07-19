import React from 'react';

function iframe() {
  return {
    __html: '<iframe src="/terms.html" style="width: 100%; height: 100vh;"></iframe>',
  };
}

const Terms = () => {
  // eslint-disable-next-line react/no-danger
  return <div dangerouslySetInnerHTML={iframe()} />;
};

export default Terms;
