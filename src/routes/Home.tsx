/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { AnimatePresence, motion, useScroll } from 'framer-motion';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useMatch, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import Movies from 'components/Movies';
import { getMovies } from 'utils/api';
import { GenresProps, GetMoviesProps, MovieProps } from 'utils/types';
import { makeImagePath } from 'utils/utils';

const Wrapper = styled.div`
  background-color: black;
  padding-bottom: 200px;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
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
  height: 70vh;
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
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  padding: 20px;
  position: relative;
  color: ${(props) => props.theme.white.lighter};
  top: -80px;
`;

const Home = () => {
  const history = useNavigate();
  const { movieId } = useParams();
  const bigMovieMatch = useMatch('/movies/:movieId');
  const { scrollY } = useScroll();
  const { data: latest, isLoading: isLatestLoading } = useQuery<MovieProps>(
    ['movies', 'latest'],
    () => getMovies('latest')
  );
  const { data: nowPlaying, isLoading: isNowPlayingLoading } =
    useQuery<GetMoviesProps>(['movies', 'nowPlaying'], () =>
      getMovies('now_playing')
    );
  const { data: popular, isLoading: isPopularLoading } =
    useQuery<GetMoviesProps>(['movies', 'popular'], () => getMovies('popular'));
  const { data: topRated, isLoading: isTopRatedLoading } =
    useQuery<GetMoviesProps>(['movies', 'top_rated'], () =>
      getMovies('top_rated')
    );
  const { data: upcoming, isLoading: isUpcomingLoading } =
    useQuery<GetMoviesProps>(['movies', 'upcoming'], () =>
      getMovies('upcoming')
    );
  const {
    data: movie,
    isLoading: isMovieLoading,
    refetch: movieRefetch,
  } = useQuery<MovieProps>(['movie', movieId], () => getMovies(movieId), {
    enabled: false,
  });

  const handleOverlayClick = () => history('/');

  useEffect(() => {
    if (movieId) {
      void movieRefetch();
    }
  }, [movieId]);

  return (
    <Wrapper>
      {isLatestLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(
              latest?.backdrop_path || latest?.poster_path
            )}
          >
            <Title>{latest?.title}</Title>
            <Overview>{latest?.overview}</Overview>
          </Banner>
          <Movies
            id="now_playing"
            title="Now Playing"
            data={nowPlaying}
            isLoading={isNowPlayingLoading}
          />
          <Movies
            id="popular"
            title="Popular"
            data={popular}
            isLoading={isPopularLoading}
            top={100}
          />
          <Movies
            id="top_rated"
            title="Top Rated"
            data={topRated}
            isLoading={isTopRatedLoading}
            top={300}
          />
          <Movies
            id="upcoming"
            title="Upcoming"
            data={upcoming}
            isLoading={isUpcomingLoading}
            top={500}
          />

          <AnimatePresence initial={false}>
            {movieId && bigMovieMatch && isMovieLoading ? (
              <Loader>Loading...</Loader>
            ) : movieId && movie ? (
              <>
                <Overlay
                  layoutId={`${movieId}`}
                  onClick={handleOverlayClick}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                />
                <Modal
                  layoutId={`${movieId}`}
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  style={{ top: scrollY.get() + 50 }}
                >
                  <>
                    <ModalCover
                      style={{
                        backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                          movie?.backdrop_path,
                          'w500'
                        )})`,
                      }}
                    />
                    <ModalTitle>{movie?.title}</ModalTitle>

                    <ModalOverview>
                      <div
                        style={{
                          padding: '5px',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '18px',
                          }}
                        >
                          {movie?.overview}
                        </div>
                      </div>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr',
                          padding: '5px',
                        }}
                      >
                        <div>
                          <div
                            style={{
                              marginBottom: '10px',
                            }}
                          >
                            <span
                              style={{
                                marginRight: '5px',
                                color: 'darkgray',
                              }}
                            >
                              평점 :
                            </span>
                            {movie?.vote_average}
                          </div>
                          <div
                            style={{
                              marginBottom: '10px',
                            }}
                          >
                            <span
                              style={{
                                marginRight: '5px',
                                color: 'darkgray',
                              }}
                            >
                              개봉일자 :
                            </span>
                            {movie?.release_date}
                          </div>
                          <div
                            style={{
                              marginBottom: '5px',
                              display: 'flex',
                            }}
                          >
                            <span
                              style={{
                                marginRight: '5px',
                                color: 'darkgray',
                              }}
                            >
                              장르 :
                            </span>
                            <div>
                              {movie?.genres.map((genre: GenresProps) => (
                                <p
                                  key={genre.id}
                                  style={{
                                    marginBottom: '2px',
                                  }}
                                >
                                  {genre.name}
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </ModalOverview>
                  </>
                </Modal>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
};

export default Home;
