import React from 'react';
import '../../index.css';
import { selectedPhoisaoSelector } from 'store/selectors';
import config from 'config';
import { useSelector } from 'react-redux';

const XuLyDuLieuInBanSao = ({ studentDataList, positionConfig, componentRef, chieuDai, chieuRong }) => {
  const phoisao = useSelector(selectedPhoisaoSelector);
  const Image = config.urlFile + 'PhoiBanSao/' + phoisao.anhPhoi;
  const chieuNgang = chieuRong ? chieuRong : phoisao ? phoisao.chieuNgang : 19;
  const chieuDoc = chieuDai ? chieuDai : phoisao ? phoisao.chieuDoc : 13;

  return (
    <div>
      <div ref={componentRef} style={{ margin: '10px 0px', overflow: 'auto' }}>
        {studentDataList.map((student, index) => (
          <div
            key={index}
            className="printpage"
            style={{
              border: '1px solid #333',
              backgroundImage: `url(${Image})`,
              // width: '19cm',
              // height: '13cm',
              width: chieuNgang + 'cm',
              height: chieuDoc + 'cm',
              position: 'relative',
              backgroundSize: 'cover',
              margin: '0 auto',
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
                  color: `${positionConfig[field].color}`,
                  fontWeight: `${positionConfig[field].fontWeight}`,
                  fontSize: `${positionConfig[field].fontSize}px`,
                  fontFamily: `${positionConfig[field].fontFamily}`,
                  display: `${positionConfig[field].display}`
                }}
              >
                {student[field]}
              </p>
            ))}
          </div>
        ))}
      </div>
      <div style={{ margin: '10px 0px', overflow: 'auto' }}>
        <div
          className="printpage"
          style={{
            border: '1px solid #333',
            backgroundImage: `url(${Image})`,
            width: chieuNgang + 'cm',
            height: chieuDoc + 'cm',
            position: 'relative',
            backgroundSize: 'cover',
            margin: '0 auto'
          }}
        >
          {Object.keys(positionConfig).map((field) => (
            <p
              key={field}
              style={{
                position: 'absolute',
                top: `${positionConfig[field].top}px`,
                left: `${positionConfig[field].left}px`,
                color: `${positionConfig[field].color}`,
                fontWeight: `${positionConfig[field].fontWeight}`,
                fontSize: `${positionConfig[field].fontSize}px`,
                fontFamily: `${positionConfig[field].fontFamily}`,
                display: `${positionConfig[field].display}`
              }}
            >
              {studentDataList[0][field]}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default XuLyDuLieuInBanSao;
