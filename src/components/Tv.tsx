/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { GetTvsProps } from 'utils/types';
import { makeImagePath } from 'utils/utils';

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Slider = styled.div`
  position: relative;
  top: -100px;
  margin: 20px;

  h1 {
    font-size: 36px;
    padding: 10px;
    margin-bottom: 10px;
    margin-top: 50px;
    font-weight: bold;
  }
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center, center;
  height: 200px;
  font-size: 66px;
  cursor: pointer;

  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;

  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const Arrow = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 100%;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.6);
  font-size: 36px;
  font-weight: bold;
  opacity: 1;
  cursor: pointer;
`;

const rowVariants = {
  hidden: (back: boolean) => ({
    x: back ? window.outerWidth + 5 : -window.outerWidth - 5,
  }),
  visible: {
    x: 0,
  },
  exit: (back: boolean) => ({
    x: !back ? window.outerWidth + 5 : -window.outerWidth - 5,
  }),
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    zIndex: 99,
    scale: 1.5,
    y: -50,
    transition: {
      type: 'tween',
      duration: 0.3,
      delay: 0.2,
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      type: 'tween',
      duration: 0.3,
      delay: 0.5,
    },
  },
};

const arrowVariants = {
  normal: {
    opacity: 0,
  },
  hover: {
    opacity: 1,
  },
};

const offset = 6;

interface TvsProps {
  id: string;
  title: string;
  data: GetTvsProps;
  isLoading: boolean;
  top?: number;
}

const Tv = ({ id, title, data, isLoading, top }: TvsProps) => {
  const history = useNavigate();
  const [index, setIndex] = useState(0);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isBack, setIsBack] = useState(false);

  const increaseIndex = () => {
    if (data) {
      if (isLeaving) return;
      setIsLeaving(true);
      const totalTvs = data?.results.length - 1;
      const maxIndex = Math.floor(totalTvs / offset);
      setIndex((previous) => (previous === maxIndex ? 0 : previous + 1));
      setIsBack(true);
    }
  };

  const decreaseIndex = () => {
    if (data) {
      if (isLeaving) return;
      setIsLeaving(true);
      const totalTvs = data?.results.length - 1;
      const maxIndex = Math.floor(totalTvs / offset);
      const minIndex = 0;
      setIndex((previous) => (previous === minIndex ? maxIndex : previous - 1));
      setIsBack(false);
    }
  };

  const toggleLeaving = () => setIsLeaving((previous) => !previous);

  const handleBoxClick = (tvId: number) => {
    history(`/tv/${tvId}`);
  };

  return (
    <>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Slider
            style={{
              top: `${top}px`,
            }}
          >
            <h1>{title}</h1>
            <AnimatePresence
              initial={false}
              onExitComplete={toggleLeaving}
              custom={isBack}
            >
              <Row
                key={`${id}-${index}`}
                custom={isBack}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{
                  type: 'tween',
                  duration: 1,
                }}
              >
                <Arrow
                  variants={arrowVariants}
                  initial="normal"
                  whileHover="hover"
                  onClick={decreaseIndex}
                >
                  &lt;
                </Arrow>
                {data?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((tv) => (
                    <Box
                      layoutId={`${id}-${String(tv.id)}`}
                      variants={boxVariants}
                      key={`${id}-${tv.id}`}
                      initial="normal"
                      whileHover="hover"
                      transition={{
                        type: 'tween',
                      }}
                      bgPhoto={makeImagePath(tv.backdrop_path)}
                      onClick={() => handleBoxClick(tv.id)}
                    >
                      <Info variants={infoVariants}>
                        <h4>{tv.name}</h4>
                      </Info>
                    </Box>
                  ))}
                <Arrow
                  variants={arrowVariants}
                  initial="normal"
                  whileHover="hover"
                  style={{
                    left: '100%',
                    transform: 'translate(-100%)',
                  }}
                  onClick={increaseIndex}
                >
                  &gt;
                </Arrow>
              </Row>
            </AnimatePresence>
          </Slider>
        </>
      )}
    </>
  );
};

export default Tv;
