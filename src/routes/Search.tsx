/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { AnimatePresence, motion, useScroll } from 'framer-motion';
import { useQuery } from 'react-query';
import { useLocation, useMatch, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { getSearch } from 'utils/api';
import { GetMoviesProps, GetTvsProps } from 'utils/types';
import { makeImagePath } from 'utils/utils';

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Row = styled(motion.div)`
  display: 1 1 1 1 1 1;
  /* grid-template-columns: repeat(6, 1fr); */
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

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const Modal = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.lighter};
  border-radius: 15px;
  overflow: hidden;
`;

const ModalCover = styled.div`
  width: 100%;
  height: 400px;
  background-size: cover;
  background-position: center center;
`;

const ModalTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  font-size: 46px;
  position: relative;
  top: -80px;
  padding: 20px;
`;

const ModalOverview = styled.p`
  padding: 20px;
  position: relative;
  color: ${(props) => props.theme.white.lighter};
  top: -80px;
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
      delay: 0.5,
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

// const offset = 6;

const Search = () => {
  const history = useNavigate();
  const location = useLocation();
  const keyword = new URLSearchParams(location?.search).get('keyword');
  const { scrollY } = useScroll();

  const { data: movies, isLoading: isMoviesLoading } = useQuery<GetMoviesProps>(
    ['movies', 'search'],
    () => getSearch('movie', keyword)
  );
  const { data: tvs, isLoading: isTvsLoading } = useQuery<GetTvsProps>(
    ['tvs', 'search'],
    () => getSearch('tv', keyword)
  );

  const bigMovieMatch = useMatch('/movies/:movieId');
  const clickMovie =
    bigMovieMatch?.params.movieId &&
    movies.results.find(
      (movie) => String(movie.id) === bigMovieMatch?.params.movieId
    );
  const bigTvMatch = useMatch('/tv/:tvId');
  const clickTv =
    bigTvMatch?.params.tvId &&
    tvs.results.find((tv) => String(tv.id) === bigTvMatch?.params.tvId);

  const handleOverlayClick = () => history('/');

  const handleBoxClick = (type: string, tvId: number) => {
    history(`/${type}/${tvId}`);
  };

  return (
    <>
      {isMoviesLoading ? (
        <Loader>Loading...</Loader>
      ) : !movies.status ? (
        <Loader>{movies.status_message}</Loader>
      ) : (
        <>
          <h1>Movies</h1>
          <Row
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{
              type: 'tween',
              duration: 1,
            }}
          >
            {movies?.results?.map((movie) => (
              <Box
                layoutId={`movies-${String(movie.id)}`}
                variants={boxVariants}
                key={`movies-${movie.id}`}
                initial="normal"
                whileHover="hover"
                transition={{
                  type: 'tween',
                }}
                bgPhoto={makeImagePath(movie.backdrop_path)}
                onClick={() => handleBoxClick('movie', movie.id)}
              >
                <Info variants={infoVariants}>
                  <h4>{movie.title}</h4>
                </Info>
              </Box>
            ))}
          </Row>
          <AnimatePresence>
            {bigMovieMatch && (
              <>
                <Overlay
                  onClick={handleOverlayClick}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                />
                <Modal
                  layoutId={`movies-${bigMovieMatch.params.movieId}`}
                  style={{ top: scrollY.get() + 50 }}
                >
                  {clickMovie && (
                    <>
                      <ModalCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickMovie.backdrop_path,
                            'w500'
                          )})`,
                        }}
                      />
                      <ModalTitle>{clickMovie.title}</ModalTitle>
                      <ModalOverview>{clickMovie.overview}</ModalOverview>
                    </>
                  )}
                </Modal>
              </>
            )}
          </AnimatePresence>
        </>
      )}
      {isTvsLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <h1>Tv</h1>
          <Row
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{
              type: 'tween',
              duration: 1,
            }}
          >
            {tvs?.results?.map((tv) => (
              <Box
                layoutId={`tvs-${String(tv.id)}`}
                variants={boxVariants}
                key={`tvs-${tv.id}`}
                initial="normal"
                whileHover="hover"
                transition={{
                  type: 'tween',
                }}
                bgPhoto={makeImagePath(tv.backdrop_path)}
                onClick={() => handleBoxClick('tv', tv.id)}
              >
                <Info variants={infoVariants}>
                  <h4>{tv.name}</h4>
                </Info>
              </Box>
            ))}
          </Row>
          <AnimatePresence>
            {bigMovieMatch && (
              <>
                <Overlay
                  onClick={handleOverlayClick}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                />
                <Modal
                  layoutId={`tvs-${bigMovieMatch.params.movieId}`}
                  style={{ top: scrollY.get() + 50 }}
                >
                  {clickTv && (
                    <>
                      <ModalCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickTv.backdrop_path,
                            'w500'
                          )})`,
                        }}
                      />
                      <ModalTitle>{clickTv.name}</ModalTitle>
                      <ModalOverview>{clickTv.overview}</ModalOverview>
                    </>
                  )}
                </Modal>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </>
  );
};

export default Search;
