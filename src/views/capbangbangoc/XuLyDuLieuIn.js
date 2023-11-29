import React from 'react';
import '../../index.css';
import { selectedPhoigocSelector } from 'store/selectors';
import config from 'config';
import { useSelector } from 'react-redux';
import Carousel from 'nuka-carousel';
import { IconChevronsLeft, IconChevronsRight } from '@tabler/icons';

const XuLyDuLieuIn = ({ studentDataList, positionConfig, componentRef }) => {
  const phoigoc = useSelector(selectedPhoigocSelector);
  console.log(phoigoc);
  const Image = config.urlFile + 'PhoiGoc/' + phoigoc.anhPhoi;
  const chieuNgang = phoigoc ? phoigoc.chieuNgang : 19;
  const chieuDoc = phoigoc ? phoigoc.chieuDoc : 13;

  return (
    <div>
      <Carousel
        renderCenterLeftControls={({ previousSlide }) => <IconChevronsLeft onClick={previousSlide} style={{ cursor: 'pointer' }} />}
        renderCenterRightControls={({ nextSlide }) => (
          <IconChevronsRight onClick={nextSlide} style={{ marginTop: '10px', cursor: 'pointer' }} />
        )}
        renderBottomCenterControls={({ currentSlide, slideCount }) => (
          <div className="custom-slide-counter">
            {currentSlide + 1} / {slideCount}
          </div>
        )}
        autoplayInterval={3000}
        autoplay={true}
        wrapAround={true}
      >
        {studentDataList.map((student, index) => (
          <div
            className="printpage"
            key={index}
            style={{
              border: '1px solid #333',
              backgroundImage: `url(${Image})`,
              // width: chieuNgang + 'cm',
              // height: chieuDoc + 'cm',
              width: chieuNgang + 'cm',
              height: chieuDoc + 'cm',
              position: 'relative',
              backgroundSize: 'cover',
              marginTop: '15px',
              marginLeft: '50px'
            }}
          >
            {Object.keys(positionConfig).map((field) => (
              <p
                key={field}
                style={{
                  position: 'absolute',
                  top: `${positionConfig[field].top}px`,
                  left: `${positionConfig[field].left}px`,
                  fontWeight: `${positionConfig[field].fontWeight}`,
                  fontSize: `${positionConfig[field].fontSize}px`,
                  fontFamily: `${positionConfig[field].fontFamily}`,
                  color: `${positionConfig[field].color}`
                }}
              >
                {student[field]}
              </p>
            ))}
          </div>
        ))}
      </Carousel>
      <div ref={componentRef} style={{ marginTop: '10px', marginLeft: '60px' }}>
        {studentDataList.map((student, index) => (
          <div
            className="printpage"
            key={index}
            style={{
              border: '1px solid #333',
              backgroundImage: `url(${Image})`,
              // width: '19cm',
              // height: '13cm',
              width: chieuNgang + 'cm',
              height: chieuDoc + 'cm',
              position: 'relative',
              backgroundSize: 'cover',
              marginBottom: '5px',
              display: 'none'
            }}
          >
            {Object.keys(positionConfig).map((field) => (
              <p
                key={field}
                style={{
                  position: 'absolute',
                  top: `${positionConfig[field].top}px`,
                  left: `${positionConfig[field].left}px`,
                  fontWeight: `${positionConfig[field].fontWeight}`,
                  fontSize: `${positionConfig[field].fontSize}px`,
                  fontFamily: `${positionConfig[field].fontFamily}`,
                  color: `${positionConfig[field].color}`
                }}
              >
                {student[field]}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default XuLyDuLieuIn;
