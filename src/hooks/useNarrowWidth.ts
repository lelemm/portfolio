import { useState, useEffect } from 'react';

const useNarrowWidth = (threshold: number = 600) => {
  const [isNarrow, setIsNarrow] = useState(window.innerWidth <= threshold);

  useEffect(() => {
    const handleResize = () => {
      setIsNarrow(window.innerWidth <= threshold);
    };

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [threshold]);

  return isNarrow;
};

export default useNarrowWidth;
