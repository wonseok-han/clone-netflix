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

import Tv from 'components/Tv';
import { getTvs } from 'utils/api';
import { GenresProps, GetTvsProps, TvProps } from 'utils/types';
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
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  padding: 20px;
  position: relative;
  color: ${(props) => props.theme.white.lighter};
  top: -80px;
`;

const Tvs = () => {
  const history = useNavigate();
  const { tvId } = useParams();
  const bigTvMatch = useMatch('/tv/:tvId');
  const { scrollY } = useScroll();
  const { data: latest, isLoading: isLatestLoading } = useQuery<TvProps>(
    ['movies', 'latest'],
    () => getTvs('latest')
  );
  const { data: airingToday, isLoading: isAiringTodayLoading } =
    useQuery<GetTvsProps>(['tv', 'airing_today'], () => getTvs('airing_today'));
  const { data: onTheAir, isLoading: isOnTheAirLoading } =
    useQuery<GetTvsProps>(['tv', 'on_the_air'], () => getTvs('on_the_air'));
  const { data: popular, isLoading: isPopularLoading } = useQuery<GetTvsProps>(
    ['tv', 'popular'],
    () => getTvs('popular')
  );
  const { data: topRated, isLoading: isTopRatedLoading } =
    useQuery<GetTvsProps>(['tv', 'top_rated'], () => getTvs('top_rated'));
  const {
    data: tv,
    isLoading: isTvLoading,
    refetch: tvRefetch,
  } = useQuery<TvProps>(['tv', tvId], () => getTvs(tvId), {
    enabled: false,
  });

  const handleOverlayClick = () => history('/tv');

  useEffect(() => {
    if (tvId) {
      void tvRefetch();
    }
  }, [tvId]);

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
            <Title>{latest?.name}</Title>
            <Overview>{latest?.overview}</Overview>
          </Banner>
          <Tv
            id="airing_today"
            title="Airing Today"
            data={airingToday}
            isLoading={isAiringTodayLoading}
          />
          <Tv
            id="on_the_air"
            title="On The Air"
            data={onTheAir}
            isLoading={isOnTheAirLoading}
            top={100}
          />
          <Tv
            id="popular"
            title="Popular"
            data={popular}
            isLoading={isPopularLoading}
            top={300}
          />
          <Tv
            id="top_rated"
            title="Top Rated"
            data={topRated}
            isLoading={isTopRatedLoading}
            top={500}
          />

          <AnimatePresence initial={false}>
            {tvId && bigTvMatch && isTvLoading ? (
              <Loader>Loading...</Loader>
            ) : tvId && tv ? (
              <>
                <Overlay
                  layoutId={`${tvId}`}
                  onClick={handleOverlayClick}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                />
                <Modal
                  layoutId={`${tvId}`}
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
                          tv?.backdrop_path,
                          'w500'
                        )})`,
                      }}
                    />
                    <ModalTitle>{tv?.name}</ModalTitle>
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
                          {tv?.overview}
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
                            {tv?.vote_average}
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
                              방영일자 :
                            </span>
                            {tv?.first_air_date}
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
                              {tv?.genres.map((genre: GenresProps) => (
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

export default Tvs;
