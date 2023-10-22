import React from 'react';
import '../../index.css';
import { selectedPhoigocSelector } from 'store/selectors';
import config from 'config';
import { useSelector } from 'react-redux';

const XuLyDuLieuInThu = ({ studentDataList, positionConfig, componentRef }) => {
  const phoigoc = useSelector(selectedPhoigocSelector);
  const Image = config.urlFile + 'PhoiGoc/' + phoigoc.anhPhoi;

  return (
    <div ref={componentRef} style={{ marginTop: '10px', marginLeft: '60px' }}>
      <div
        //className="printpage"
        style={{
          border: '1px solid #333',
          backgroundImage: `url(${Image})`,
          width: '19cm',
          height: '13cm',
          position: 'relative',
          backgroundSize: 'cover',
          marginBottom: '5px'
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
              fontSize: `${positionConfig[field].fontSize}`,
              fontFamily: `${positionConfig[field].fontFamily}`,
              color: `${positionConfig[field].color}`
            }}
          >
            {studentDataList[field]}
          </p>
        ))}
      </div>
    </div>
  );
};

export default XuLyDuLieuInThu;
